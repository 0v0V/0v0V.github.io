(function () {
  var menuToggle = document.getElementById("menu-toggle");
  var nav = document.getElementById("site-nav");
  var themeToggle = document.getElementById("theme-toggle");
  var root = document.documentElement;
  var header = document.querySelector(".site-header");

  if (header) {
    var SCROLL_THRESHOLD = 36;
    var scrolledClassApplied = false;
    var ticking = false;

    function updateHeaderState() {
      var shouldBeScrolled = window.scrollY > SCROLL_THRESHOLD;
      if (shouldBeScrolled !== scrolledClassApplied) {
        header.classList.toggle("scrolled", shouldBeScrolled);
        scrolledClassApplied = shouldBeScrolled;
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderState);
        ticking = true;
      }
    }

    updateHeaderState();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function getEffectiveTheme() {
    var explicit = root.getAttribute("data-theme");
    if (explicit === "light" || explicit === "dark") {
      return explicit;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function updateThemeToggleLabel() {
    if (!themeToggle) return;
    var current = getEffectiveTheme();
    themeToggle.setAttribute(
      "aria-label",
      current === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
  }

  if (themeToggle) {
    updateThemeToggleLabel();

    themeToggle.addEventListener("click", function () {
      var nextTheme = getEffectiveTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", nextTheme);
      localStorage.setItem("theme", nextTheme);
      updateThemeToggleLabel();
    });

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function () {
        if (!root.getAttribute("data-theme")) {
          updateThemeToggleLabel();
        }
      });
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      menuToggle.classList.toggle("active");
    });

    nav.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        menuToggle.classList.remove("active");
      });
    });
  }

  var emailIcons = document.querySelectorAll(".social-icon--email");
  if (emailIcons.length) {
    var copyToast;
    var copyToastTimer;

    function ensureToast() {
      if (!copyToast) {
        copyToast = document.createElement("div");
        copyToast.className = "copy-toast";
        copyToast.setAttribute("role", "status");
        copyToast.setAttribute("aria-live", "polite");
        document.body.appendChild(copyToast);
      }
      return copyToast;
    }

    function showCopyToast(message, x, y) {
      var el = ensureToast();
      el.textContent = message;

      // Keep the bubble on-screen: clamp horizontally, flip below the
      // cursor when there isn't room above it (e.g. icons near the top).
      var half = el.offsetWidth / 2;
      var clampedX = Math.max(half + 6, Math.min(x, window.innerWidth - half - 6));
      var below = y < 72;
      el.style.left = clampedX + "px";
      el.style.top = y + "px";
      el.classList.toggle("copy-toast--below", below);

      // Restart the fade even on rapid repeat clicks.
      el.classList.remove("copy-toast--show");
      void el.offsetWidth;
      el.classList.add("copy-toast--show");

      window.clearTimeout(copyToastTimer);
      copyToastTimer = window.setTimeout(function () {
        el.classList.remove("copy-toast--show");
      }, 2200);
    }

    function legacyCopy(text) {
      return new Promise(function (resolve, reject) {
        try {
          var ta = document.createElement("textarea");
          ta.value = text;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.top = "-9999px";
          document.body.appendChild(ta);
          ta.select();
          ta.setSelectionRange(0, text.length);
          var ok = document.execCommand("copy");
          document.body.removeChild(ta);
          ok ? resolve() : reject(new Error("copy command rejected"));
        } catch (e) {
          reject(e);
        }
      });
    }

    function copyEmail(text) {
      // Prefer the async Clipboard API; fall back to execCommand when it is
      // unavailable or rejected (older browsers, blocked permissions, etc.).
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).catch(function () {
          return legacyCopy(text);
        });
      }
      return legacyCopy(text);
    }

    emailIcons.forEach(function (icon) {
      icon.addEventListener("click", function (event) {
        var email = icon.getAttribute("data-email");
        if (!email) return;

        var x = event.clientX;
        var y = event.clientY;
        // Keyboard activation (Enter) reports 0,0 — anchor to the icon instead.
        if (!x && !y) {
          var rect = icon.getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top;
        }

        copyEmail(email)
          .then(function () {
            showCopyToast("Email copied to clipboard", x, y);
          })
          .catch(function () {
            // Clipboard blocked — the mailto: fallback below still fires.
          });
        // No preventDefault: the mailto: link still opens the default mail
        // app when one is configured, so both behaviours happen together.
      });
    });
  }
})();
