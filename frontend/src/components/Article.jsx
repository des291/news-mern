import React from "react";

const Article = ({ article }) => {
  return (
    <div className="container">
      <details>
        <summary className="list-none">
          <h2 className="inline headline text-xl font-semibold hover:cursor-pointer">
            {article.title}
          </h2>
        </summary>
        <p className="summary font-extralight">{article.summary}</p>
        <span className="font-extralight">Read more:</span>
        <a className="link m-2 font-light" href={article.link} target="_blank">
          <img src="frontend/public/images/bbc-news.png" alt="BBC News Logo" />
          BBC
        </a>
        <a
          className="guardian_link font-light"
          href={article.guardian_link}
          target="_blank"
        >
          Guardian
        </a>
      </details>
    </div>
  );
};

export default Article;
