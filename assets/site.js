/* ==========================================================================
   Naoki Masuda — site behaviour.  Plain JavaScript, no libraries.

   THE MENU FOR THE WHOLE SITE IS DEFINED IN THIS FILE, ONCE, JUST BELOW.
   Edit MENU.en / MENU.ja here and every page picks up the change.
   Each page only needs:   <header class="site-header" data-lang="en"></header>
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------- MENU --
     Each entry is:  ["label", "link", [ ...optional submenu entries... ] ]
     A submenu entry is simply ["label", "link"].
     "brand" is the name shown at the top left.
     ----------------------------------------------------------------------- */
  var MENU = {
    en: {
      brand: "Naoki Masuda（増田直紀）",
      tagline: "Network Science · Mathematical Biology",
      home: "index.html",
      items: [
        ["Home", "index.html"],
        ["Research", "research.html", [
          ["Affiliation etc.", "research.html#affiliation"],
          ["Network science", "research.html#network-science"],
          ["Mathematical biology", "research.html#mathematical-biology"],
          ["En español", "research.html#en-espanol"]
        ]],
        ["Publications", "publications.html", [
          ["Preprints", "publications.html#preprints"],
          ["Journal papers", "publications.html#journal"],
          ["Books", "publications.html#book"],
          ["Book chapters", "publications.html#book_chapter"],
          ["Refereed conference papers", "publications.html#international_conf"],
          ["Editorials, commentaries, etc.", "publications.html#institutional"],
          ["Referee activities", "publications.html#referee"]
        ]],
        ["Group members", "members.html", [
          ["University of Michigan", "members.html#michigan"],
          ["Alumni — Michigan", "members.html#alumni-michigan"],
          ["SUNY Buffalo", "members.html#buffalo"],
          ["Alumni — SUNY Buffalo", "members.html#alumni-buffalo"],
          ["Alumni — Bristol", "members.html#alumni-bristol"],
          ["Alumni — Tokyo", "members.html#alumni-tokyo"]
        ]],
        ["Join my group", "prospective.html"],
        ["CV", "cv-masuda.pdf"],
        ["Access", "access.html"],
        ["日本語", "index_j.html", null, "lang"]
      ]
    },

    ja: {
      brand: "増田直紀（Naoki Masuda）",
      tagline: "ネットワーク科学 · 数理生物学",
      home: "index_j.html",
      items: [
        ["ホーム", "index_j.html"],
        ["研究紹介", "intro_j.html", [
          ["研究方針", "intro_j.html#network"],
          ["関連書籍", "intro_j.html#related_books"],
          ["文献の探し方", "intro_j.html#literaturesearch"],
          ["卒論・修論の執筆要領", "intro_j.html#thesishow"],
          ["データ等へのリンク", "intro_j.html#data"],
          ["公開セミナー（東大）の記録", "intro_j.html#seminar"]
        ]],
        ["論文リスト", "publications_j.html", [
          ["英語論文等リスト", "publications_j.html"],
          ["日本語論文", "publ_j.html#journal_j"],
          ["日本語書籍", "publ_j.html#book_j"],
          ["日本語総説，辞典記事など", "publ_j.html#review_j"],
          ["日本語の口頭発表", "publ_j.html#oral_j"],
          ["日本語のポスター発表", "publ_j.html#poster_j"]
        ]],
        ["メンバー", "members_j.html"],
        ["増田研に来たい人へ", "teammasuda.html"],
        ["授業・経歴", "teaching_j.html", [
          ["日本の授業・修論・卒論", "teaching_j.html"],
          ["経歴", "cv_j.html"],
          ["研究関係情報", "tips_j.html"],
          ["メディア・イベント", "media.html"],
          ["ブログ", "http://naokimasuda.blogspot.com/"]
        ]],
        ["Access", "access_j.html"],
        ["English", "index.html", null, "lang"]
      ]
    }
  };

  /* ------------------------------------------------------------- build it -- */
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function buildHeader(host) {
    var lang = host.getAttribute("data-lang") === "ja" ? "ja" : "en";
    var m = MENU[lang];
    var html = '<div class="bar">' +
      '<a class="brand" href="' + m.home + '">' + esc(m.brand) +
      '<span class="tag">' + esc(m.tagline) + '</span></a>' +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">' +
      (lang === "ja" ? "&#9776;&nbsp;メニュー" : "&#9776;&nbsp;Menu") + '</button>' +
      '<nav class="site-nav" id="site-nav"><ul class="menu">';

    m.items.forEach(function (item) {
      var label = item[0], href = item[1], subs = item[2], cls = item[3] || "";
      if (subs && subs.length) {
        html += '<li class="has-sub ' + cls + '"><a href="' + href + '">' + esc(label) + '</a>' +
          '<button class="sub-toggle" type="button" aria-expanded="false" aria-label="' +
          esc(label) + '">+</button><ul class="submenu">';
        subs.forEach(function (s) {
          html += '<li><a href="' + s[1] + '">' + esc(s[0]) + '</a></li>';
        });
        html += '</ul></li>';
      } else {
        html += '<li class="' + cls + '"><a href="' + href + '">' + esc(label) + '</a></li>';
      }
    });

    html += '</ul></nav></div>';
    host.innerHTML = html;
  }

  var header = document.querySelector(".site-header");
  if (header && !header.querySelector(".bar")) buildHeader(header);

  /* --------------------------------------------------------- interactions -- */
  var toggle = header && header.querySelector(".nav-toggle");
  var mobile = function () { return window.matchMedia("(max-width: 900px)").matches; };

  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll(".has-sub"), function (li) {
    var btn = li.querySelector(".sub-toggle");
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var open = li.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  document.addEventListener("click", function (e) {
    if (!header) return;
    var inHeader = header.contains(e.target);
    if (inHeader && e.target.closest && e.target.closest("a") && mobile()) {
      header.classList.remove("nav-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    } else if (!inHeader) {
      header.classList.remove("nav-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
      Array.prototype.forEach.call(document.querySelectorAll(".has-sub.open"), function (li) {
        li.classList.remove("open");
        var b = li.querySelector(".sub-toggle");
        if (b) b.setAttribute("aria-expanded", "false");
      });
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && header) {
      header.classList.remove("nav-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
  });

  /* mark the current page in the menu */
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  Array.prototype.forEach.call(document.querySelectorAll(".menu > li > a"), function (a) {
    var href = (a.getAttribute("href") || "").split("#")[0].split("/").pop().toLowerCase();
    if (href && href === here) a.setAttribute("aria-current", "page");
  });

  /* ------------------------------------------------------------- includes --
     <div data-include="publications.html" data-include-select=".publist"></div>
     pulls a piece of another page in, so the same list can appear on the
     English and the Japanese page while living in ONE file. */
  Array.prototype.forEach.call(document.querySelectorAll("[data-include]"), function (host) {
    var url = host.getAttribute("data-include");
    var sel = host.getAttribute("data-include-select");
    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      })
      .then(function (text) {
        var doc = new DOMParser().parseFromString(text, "text/html");
        var part = sel ? doc.querySelector(sel) : doc.body;
        if (!part) throw new Error("not found: " + sel);
        host.innerHTML = part.innerHTML;
        host.className = (host.className + " " + (part.className || "")).trim();
        if (location.hash) {
          var t = document.getElementById(location.hash.slice(1));
          if (t) t.scrollIntoView();
        }
      })
      .catch(function () {
        host.innerHTML = '<p class="card">This list is shared with ' +
          '<a href="' + url + '">' + url + '</a>. It could not be loaded here ' +
          '(this happens when the page is opened straight from disk instead of ' +
          'through a web server) &mdash; please open that page instead.<br>' +
          'このリストは <a href="' + url + '">' + url + '</a> と共通です。' +
          '読み込めなかった場合は、そちらのページをご覧ください。</p>';
      });
  });

  /* ---------------------------------------------------------- back to top -- */
  var top = document.querySelector(".to-top");
  if (top) {
    top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    window.addEventListener("scroll", function () {
      top.classList.toggle("show", window.pageYOffset > 500);
    }, { passive: true });
  }
})();
