/* Tiny progressive enhancement. The page works with JS off. */
(function () {
  var nav = document.querySelector(".site-nav");
  var cb = document.getElementById("nav-cb");
  if (!nav || !cb) return;

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      cb.checked = false;
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") cb.checked = false;
  });
})();
