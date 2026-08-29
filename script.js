/* Harper landing. Film scrubber, glass header, promo, magnetic CTA. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var fineHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  var header = document.getElementById("site-header");
  var track = document.getElementById("stage-track");
  var scenes = track ? Array.prototype.slice.call(track.querySelectorAll(".stage-scene")) : [];
  var stageNum = document.querySelector("[data-stage-num]");
  var navCb = document.getElementById("nav-cb");
  var video = document.getElementById("promo");
  var watchBtn = document.querySelector("[data-watch-btn]");
  var watchSection = document.getElementById("watch");
  var heroMark = document.querySelector(".hero-mark");
  var userPaused = false;
  var ticking = false;
  var n = scenes.length;
  var supportsViewTimeline = CSS && CSS.supports && CSS.supports("animation-timeline: view()");

  function filmOn() {
    return !reduce.matches && n > 0;
  }

  function setFilmClass() {
    document.documentElement.classList.toggle("is-film", filmOn());
  }

  function clamp(v, a, b) {
    return Math.min(b, Math.max(a, v));
  }

  function pad(i) {
    return (i + 1 < 10 ? "0" : "") + (i + 1);
  }

  function closeNav() {
    if (navCb) navCb.checked = false;
  }

  function stageProgress() {
    if (!track) return 0;
    var rect = track.getBoundingClientRect();
    var range = rect.height - window.innerHeight;
    if (range <= 0) return 0;
    return clamp(-rect.top / range, 0, 1);
  }

  function maskFor(vis) {
    if (vis >= 0.98) return "none";
    var m = vis * 100;
    return "linear-gradient(180deg, #000 " + m.toFixed(1) + "%, transparent " + Math.min(100, m + 20).toFixed(1) + "%)";
  }

  function paintScene(el, vis) {
    if (vis <= 0.001) {
      el.style.opacity = "0";
      el.style.visibility = "hidden";
      el.style.filter = "blur(10px)";
      el.style.transform = "scale(0.97)";
      el.style.pointerEvents = "none";
      el.style.webkitMaskImage = "none";
      el.style.maskImage = "none";
      return;
    }
    el.style.opacity = String(vis);
    el.style.visibility = "visible";
    el.style.filter = "blur(" + ((1 - vis) * 8).toFixed(2) + "px)";
    el.style.transform = "scale(" + (0.975 + vis * 0.025).toFixed(4) + ")";
    el.style.pointerEvents = vis > 0.6 ? "auto" : "none";
    var mask = maskFor(vis);
    el.style.webkitMaskImage = mask;
    el.style.maskImage = mask;
  }

  function applyStage(p) {
    if (!filmOn()) return;
    track.style.setProperty("--p", p.toFixed(4));
    var t = p * n;
    var i = Math.min(n - 1, Math.floor(t));
    var f = t - i;
    var hold = 0.78;
    var fade = 1 - hold;
    var currentVis = f < hold ? 1 : 1 - (f - hold) / fade;
    var nextVis = f < hold ? 0 : (f - hold) / fade;
    if (i === n - 1) {
      currentVis = 1;
      nextVis = 0;
    }
    for (var s = 0; s < n; s++) {
      var vis = 0;
      if (s === i) vis = currentVis;
      else if (s === i + 1) vis = nextVis;
      paintScene(scenes[s], vis);
    }
    if (stageNum) stageNum.textContent = pad(nextVis > currentVis ? i + 1 : i);
  }

  function applyHeader() {
    if (!header) return;
    var y = window.scrollY || 0;
    header.classList.toggle("is-on", y > 12);
    var recessed = false;
    if (filmOn() && track) {
      var r = track.getBoundingClientRect();
      recessed = r.top < 8 && r.bottom > window.innerHeight * 0.65;
    }
    header.classList.toggle("is-recessed", recessed);
  }

  function applyParallax() {
    if (!heroMark || supportsViewTimeline || !filmOn()) return;
    var y = window.scrollY || 0;
    var h = window.innerHeight || 1;
    var p = clamp(y / h, 0, 1);
    heroMark.style.transform = "translate(-50%, calc(-50% - " + (p * 8).toFixed(2) + "vh)) scale(" + (1 + p * 0.04).toFixed(3) + ")";
    heroMark.style.opacity = String(0.045 * (1 - p));
  }

  function frame() {
    ticking = false;
    applyHeader();
    if (filmOn()) applyStage(stageProgress());
    applyParallax();
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(frame);
  }

  function resetScenes() {
    for (var s = 0; s < n; s++) {
      scenes[s].style.opacity = "";
      scenes[s].style.visibility = "";
      scenes[s].style.filter = "";
      scenes[s].style.transform = "";
      scenes[s].style.pointerEvents = "";
      scenes[s].style.webkitMaskImage = "";
      scenes[s].style.maskImage = "";
    }
    if (track) track.style.removeProperty("--p");
    if (heroMark) {
      heroMark.style.transform = "";
      heroMark.style.opacity = "";
    }
  }

  function syncMode() {
    setFilmClass();
    if (!filmOn()) resetScenes();
    frame();
  }

  /* Magnetic CTA. Soft follow, snaps back. */
  function magnetize(btn) {
    if (!fineHover.matches || reduce.matches) return;
    var strength = 0.22;
    btn.addEventListener("mousemove", function (e) {
      var r = btn.getBoundingClientRect();
      var x = e.clientX - (r.left + r.width / 2);
      var y = e.clientY - (r.top + r.height / 2);
      btn.style.transform = "translate(" + (x * strength).toFixed(1) + "px, " + (y * strength).toFixed(1) + "px)";
    });
    btn.addEventListener("mouseleave", function () {
      btn.style.transform = "";
    });
  }

  /* Promo film. */
  function setWatchUi(playing) {
    if (!watchBtn) return;
    watchBtn.classList.toggle("is-paused", !playing);
    watchBtn.setAttribute("aria-label", playing ? "Pause film" : "Play film");
  }

  function tryPlay() {
    if (!video || userPaused) return;
    var play = video.play();
    if (play && play.catch) play.catch(function () {});
  }

  function bindVideo() {
    if (!video || !watchSection) return;
    video.controls = false;
    video.muted = true;
    video.loop = true;
    video.setAttribute("playsinline", "");
    video.addEventListener("play", function () { setWatchUi(true); });
    video.addEventListener("pause", function () { setWatchUi(!video.ended && video.paused); });
    if (watchBtn) {
      watchBtn.addEventListener("click", function () {
        if (video.paused) {
          userPaused = false;
          tryPlay();
        } else {
          userPaused = true;
          video.pause();
        }
      });
    }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) tryPlay();
          else video.pause();
        });
      }, { threshold: 0.35 });
      io.observe(watchSection);
    }
  }

  /* Nav */
  document.querySelectorAll(".site-nav a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  document.querySelectorAll(".btn-magnetic").forEach(magnetize);

  if (reduce.addEventListener) reduce.addEventListener("change", syncMode);
  else if (reduce.addListener) reduce.addListener(syncMode);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  setFilmClass();
  bindVideo();
  frame();
})();
