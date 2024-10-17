const news_date = document.getElementById("news-date");
const sport_date = document.getElementById("sport-date");

const sticky = sport_date.offsetTop;
function sticky_selector() {
  if (window.scrollY >= sticky) {
    news_date.classList.remove("sticky");
    sport_date.classList.add("sticky");
  } else {
    news_date.classList.add("sticky");
    sport_date.classList.remove("sticky");
  }
}

document.body.addEventListener("scroll", sticky_selector());
console.log(news_date);
const observer = new IntersectionObserver((entries) => {
  console.log(entries);
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      sport_date.classList.add("hidden");
    } else {
      sport_date.classList.remove("hidden");
    }
  });
});
observer.observe(news_date);
// observer.observe(sport_date);
