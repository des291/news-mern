import React from "react";

const Article = ({ article }) => {
  return (
    <div className="container">
      <details>
        <summary className="list-none leading-relaxed">
          <h2 className="inline headline text-xl font-semibold hover:cursor-pointer">
            {article.title}
          </h2>
        </summary>
        <p className="summary font-extralight">{article.summary}</p>
        <span className="font-extralight">Read more:</span>
        <a className="link ml-1 font-light" href={article.link} target="_blank">
          <img
            className="inline m-1"
            src="./images/bbc-news.png"
            alt="BBC News Logo"
          />
          BBC
        </a>
        <a
          className="guardian_link ml-1 font-light"
          href={article.guardian_link}
          target="_blank"
        >
          <img
            className="inline m-1"
            src="./images/guardian.png"
            alt="Guardian Logo"
          />
          Guardian
        </a>
      </details>
    </div>
  );
};

export default Article;
