function isOverlapping(element1, element2) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  return !(rect1.top > rect2.bottom || rect1.bottom < rect2.top);
}

window.addEventListener("scroll", () => {
  const news_header = document.getElementById("news-header");
  const sport_header = document.getElementById("sport-header");
  const news_date = document.getElementById("news-date");
  const sport_date = document.getElementById("sport-date");

  if (isOverlapping(news_header, sport_header)) {
    news_date.classList.add("hidden");
    sport_date.classList.remove("hidden");
  } else {
    sport_date.classList.add("hidden");
    news_date.classList.remove("hidden");
  }
});
