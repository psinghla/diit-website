/* DIIT — site scripts: hero carousel, mobile nav, WhatsApp enquiry, year */
(function () {
  "use strict";

  var WA_NUMBER = "919817738058"; // WhatsApp / phone

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
      var open = links.classList.contains("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") links.classList.remove("open");
    });
  }

  /* ---------- nav dropdown (Student Section) ---------- */
  var drops = Array.prototype.slice.call(document.querySelectorAll(".has-drop"));
  drops.forEach(function (d) {
    var t = d.querySelector(".drop-toggle");
    if (!t) return;
    t.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var willOpen = !d.classList.contains("open");
      drops.forEach(function (o) { o.classList.remove("open"); });
      d.classList.toggle("open", willOpen);
      t.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest || !e.target.closest(".has-drop")) {
      drops.forEach(function (o) {
        o.classList.remove("open");
        var tt = o.querySelector(".drop-toggle");
        if (tt) tt.setAttribute("aria-expanded", "false");
      });
    }
  });

  /* ---------- hero carousel ---------- */
  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dotsWrap = document.querySelector(".hero-dots");
  if (slides.length > 1) {
    var idx = 0, timer = null;
    var dots = [];
    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", "Show slide " + (i + 1));
        if (i === 0) b.classList.add("is-active");
        b.addEventListener("click", function () { go(i); reset(); });
        dotsWrap.appendChild(b);
        dots.push(b);
      });
    }
    function go(n) {
      slides[idx].classList.remove("is-active");
      if (dots[idx]) dots[idx].classList.remove("is-active");
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add("is-active");
      if (dots[idx]) dots[idx].classList.add("is-active");
    }
    function next() { go(idx + 1); }
    function reset() { clearInterval(timer); timer = setInterval(next, 5000); }
    reset();
  }

  /* ---------- WhatsApp enquiry form ---------- */
  var form = document.getElementById("enquiry-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.elements["name"] && form.elements["name"].value || "").trim();
      var phone = (form.elements["phone"] && form.elements["phone"].value || "").trim();
      var course = (form.elements["course"] && form.elements["course"].value || "").trim();
      var msg = (form.elements["message"] && form.elements["message"].value || "").trim();
      var text =
        "Hello DIIT, I'd like to enquire.\n" +
        "Name: " + (name || "-") + "\n" +
        "Phone: " + (phone || "-") + "\n" +
        "Interested in: " + (course || "-") +
        (msg ? "\nMessage: " + msg : "");
      window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text), "_blank");
    });
  }

  /* ---------- course search / filter ---------- */
  var csearch = document.getElementById("course-search-input");
  if (csearch) {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".card")).filter(function (c) {
      return c.querySelector(".course-card");
    });
    var bands = Array.prototype.slice.call(document.querySelectorAll(".cat-band"));
    var noRes = document.querySelector(".course-noresult");
    csearch.addEventListener("input", function () {
      var q = csearch.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (c) {
        var match = c.textContent.toLowerCase().indexOf(q) !== -1;
        c.classList.toggle("is-hidden", !match);
        if (match) shown++;
      });
      // hide a category band if every course card in the grid(s) after it (until next band) is hidden
      bands.forEach(function (band) {
        var el = band.nextElementSibling, anyVisible = false;
        while (el && !el.classList.contains("cat-band")) {
          var inner = el.querySelectorAll ? el.querySelectorAll(".card") : [];
          for (var i = 0; i < inner.length; i++) {
            if (inner[i].querySelector(".course-card") && !inner[i].classList.contains("is-hidden")) anyVisible = true;
          }
          el = el.nextElementSibling;
        }
        band.classList.toggle("is-hidden", q !== "" && !anyVisible);
      });
      if (noRes) noRes.style.display = shown === 0 ? "block" : "none";
    });
  }

  /* ---------- footer year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
