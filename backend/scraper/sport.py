import requests
from bs4 import BeautifulSoup
import scraper

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/116.0'}



bbc_sport = scraper.ReadRss('https://feeds.bbci.co.uk/sport/rss.xml', headers)

bbc_sport_articles = scraper.get_articles(bbc_sport.articles_dicts[:7])

for article in bbc_sport_articles:
    article['summary'] = scraper.summarise_article(article['text'])
    # article['guardian_link'] = get_similar_link(article['text'], guardian_articles)
    article['datestamp'] = scraper.datestamp

print(bbc_sport_articles[0])
