import React, { useEffect, useState } from "react";
import axios from "axios";
import Article from "../components/Article";

const Index = () => {
  const [news, setNews] = useState([]);
  const [sport, setSport] = useState([]);
  const [datestamp, setDatestamp] = useState();
  useEffect(() => {
    axios
      .get("https://api.fast-news.xyz/")
      // .get("http://localhost:5555/")
      .then((response) => {
        console.log(response.data.sport);
        setNews(response.data.news);
        setSport(response.data.sport);
        setDatestamp(response.data.news[0]["datestamp"]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/js/intersection.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="container mx-auto" id="news">
      <div className="columns-2 sticky top-0 bg-stone-900">
        <h1 className="text-5xl italic text-orange-400" id="news-header">
          NEWS
        </h1>
        <h1
          className="text-right text-4xl italic text-orange-400 font-thin"
          id="news-date"
        >
          {datestamp}
        </h1>
      </div>

      <div>
        {news.map((article, _index) => (
          <Article id={_index} key={_index} article={article} />
        ))}
      </div>

      <div className="sticky top-0 mx-auto" id="sport">
        <div className="columns-2 bg-stone-900 sticky top-0">
          <h1 className="text-5xl italic text-blue-400" id="sport-header">
            SPORT
          </h1>
          <h1
            className="text-right text-4xl italic text-blue-400 font-thin hidden"
            id="sport-date"
          >
            {datestamp}
          </h1>
        </div>
        <div>
          {sport.map((article, _index) => (
            <Article id={_index} key={_index} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
