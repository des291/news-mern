import numpy
from openai import OpenAI
import tiktoken
from time import sleep
import trafilatura
from bs4 import BeautifulSoup
import requests
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
from pymongo import MongoClient
import datetime
import os

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/116.0'}


# get OpenAI and MongoDB details from .env
load_dotenv()

openai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

class ReadRss:
    """This class is used to create an object that contains the data from a RSS webpage."""
    def __init__(self, rss_url, headers):
        """
        Parameters:
        rss_url: str
            url for RSS feed
        headers: dict
            dict containing 'User-Agent' value so scrape does not get blocked
        """
        self.url = rss_url
        self.headers = headers
        try:
            self.r = requests.get(rss_url, headers=self.headers)
            self.status_code = self.r.status_code
        except Exception as e:
            print('Error fetching the URL: ', rss_url)
            print(e)
        try:
            self.soup = BeautifulSoup(self.r.text, 'html.parser')
        except Exception as e:
            print('Could not parse the xml: ', self.url)
            print(e)

        self.articles = self.soup.find_all('item')
        self.articles_dicts = [{'title': a.find('title').text, 'link': a.link.next_sibling.replace('\n', '').replace(
            '\t', '').replace('\r', ''), 'description': a.find('description').text} for a in self.articles]
        self.urls = [d['link'] for d in self.articles_dicts if 'link' in d]
        self.titles = [d['title'] for d in self.articles_dicts if 'title' in d]


bbc = ReadRss('https://feeds.bbci.co.uk/news/rss.xml?edition=uk', headers)
guardian = ReadRss('https://www.theguardian.com/uk/rss', headers)
bbc_sport = ReadRss('https://feeds.bbci.co.uk/sport/rss.xml', headers)

def get_articles(articles_dicts):
    """Extracts the text from each of the links in articles_dicts and returns a list of dicts containig title, link and text values."""
    articles = []
    for article in articles_dicts:
        article_data = {}
        article_data['title'] = article['title']
        article_data['link'] = article['link']
        downloaded = trafilatura.fetch_response(article_data['link'].strip())
        result = trafilatura.extract(downloaded, include_comments=False,
                     include_tables=False, include_links=False)
        article_data['text'] = result
        articles.append(article_data)
    return articles

def num_tokens_from_string(string: str) -> int:
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")
    num_tokens = len(encoding.encode(string))
    return num_tokens


def summarise_article(article_text):
    """Takes the article text and asks ChatGPT to provide a summary. Returns the summary."""
    response = openai_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful summarisation tool that provides seven sentence summaries of text."},
            {"role": "user", "content": "Please provide a seven sentence summary of the following: " + article_text}
        ]
    )
    return response.choices[0].message.content

def get_similar_link(article, dicts):
    """Compares the article to each article in the dict and returns the link to the article with the highest cosine similarity."""
    vectorizer = TfidfVectorizer()
    articles = [comp_article['text'] for comp_article in dicts]
    articles.insert(0, article)
    vectors = vectorizer.fit_transform(articles)
    similarity = cosine_similarity(vectors[0:1], vectors)
    similarity = numpy.delete(similarity[0],0)
    max_index = similarity.argmax()
    return dicts[max_index]['link']

def get_datestamp():
    """Returns the current datetime int he format as per following example: 31/10 PM."""
    now = datetime.datetime.now()
    month = now.month
    day = now.day
    if now.hour >= 12:
        time = 'PM'
    else:
        time = 'AM'
    return f"{day}/{month} {time}"

bbc_articles = get_articles(bbc.articles_dicts[:7])
bbc_sport_articles = get_articles(bbc_sport.articles_dicts[:5])
guardian_articles = get_articles(guardian.articles_dicts)
datestamp = get_datestamp()

num_tokens = 0

for article in bbc_articles:
    num_tokens += num_tokens_from_string(article['text'])
    print(num_tokens)
    if num_tokens > 50000:
        sleep(60)
        num_tokens = 0
    article['summary'] = summarise_article(article['text'])
    article['guardian_link'] = get_similar_link(article['text'], guardian_articles)
    article['datestamp'] = datestamp

for article in bbc_sport_articles:
    num_tokens += num_tokens_from_string(article['text'])
    print(num_tokens)
    if num_tokens > 50000:
        sleep(60)
        num_tokens = 0
    article['summary'] = summarise_article(article['text'])
    article['guardian_link'] = ""
    article['datestamp'] = datestamp

# Set up MongoDB. Remove existing articles then add the new ones.
client = MongoClient(os.environ.get("ATLAS_URI"))
db = client["articles"]
db.drop_collection("news")
collection = db["news"]
collection.insert_many(bbc_articles)
db.drop_collection("sport")
collection = db["sport"]
collection.insert_many(bbc_sport_articles)
