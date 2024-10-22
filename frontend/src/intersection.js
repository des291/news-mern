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

// const sticky = sport_date.offsetTop;
// function sticky_selector() {
//   if (window.scrollY >= sticky) {
//     news_date.classList.remove("sticky");
//     sport_date.classList.add("sticky");
//   } else {
//     news_date.classList.add("sticky");
//     sport_date.classList.remove("sticky");
//   }
// }

// document.body.addEventListener("scroll", sticky_selector());
// console.log(news_date);
// const observer = new IntersectionObserver((entries) => {
//   console.log(entries);
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       sport_date.classList.add("hidden");
//     } else {
//       sport_date.classList.remove("hidden");
//     }
//   });
// });
// observer.observe(news_date);
// // observer.observe(sport_date);
