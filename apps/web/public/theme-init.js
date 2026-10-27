// Runs before the render-blocking token stylesheet and React's module entry.
// Keep this preference list aligned with ThemeProvider; it contains no session data.
(function () {
  var theme = "light";
  try {
    var saved = localStorage.getItem("kms.theme");
    if (saved === "light" || saved === "dark" || saved === "glass") theme = saved;
  } catch {
    // Storage may be disabled; the application still starts in Light.
  }
  document.documentElement.dataset.theme = theme;
})();
