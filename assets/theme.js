(function () {
  var root = document.documentElement;
  var storageKey = 'rivet-theme';
  var theme = 'dark';

  try {
    var saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch (_) {}

  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  var style = document.createElement('style');
  style.id = 'rivet-theme-styles';
  style.textContent = `
    body,.nav,.card,.plugin,.usecase,.plan,.pill,.theme-toggle{transition:background-color .22s ease,color .22s ease,border-color .22s ease}
    .theme-toggle{width:42px;height:42px;flex:0 0 42px;display:grid;place-items:center;border-radius:999px;border:1px solid #5d4c2c;background:transparent;color:var(--ink);cursor:pointer;font:500 18px/1 system-ui,sans-serif;padding:0}
    .theme-toggle:hover{border-color:#a58e63;background:rgba(255,255,255,.04)}
    .theme-toggle:focus-visible{outline:2px solid var(--accent);outline-offset:3px}

    html[data-theme="light"]{--bg:#f4eddf;--bg2:#eadfc9;--ink:#302518;--muted:#6d5d46;--line:#cdb996;--card:#fffaf1}
    html[data-theme="light"] body{background:var(--bg);color:var(--ink)}
    html[data-theme="light"] .nav{background:rgba(244,237,223,.94);border-bottom-color:rgba(48,37,24,.14)}
    html[data-theme="light"] .navlinks{color:#6d5d46}
    html[data-theme="light"] .navlinks a:hover{color:#302518}
    html[data-theme="light"] .theme-toggle{border-color:#c5b18d;color:#302518;background:#f8f1e5}
    html[data-theme="light"] .theme-toggle:hover{border-color:#9d835b;background:#fffaf1}
    html[data-theme="light"] .pill{background:#f8f1e5;border-color:#c9b58f;color:#6d5a3e}
    html[data-theme="light"] .lede,
    html[data-theme="light"] .section:not(.dark) .subcopy,
    html[data-theme="light"] .section:not(.dark) .step p,
    html[data-theme="light"] .section:not(.dark) .card p,
    html[data-theme="light"] .section:not(.dark) .checks li,
    html[data-theme="light"] .section:not(.dark) .plugin p,
    html[data-theme="light"] .section:not(.dark) .usecase p,
    html[data-theme="light"] .section:not(.dark) .plan ul,
    html[data-theme="light"] .section:not(.dark) .faq p,
    html[data-theme="light"] .legal-body p,
    html[data-theme="light"] .legal-body li{color:#6d5d46}
    html[data-theme="light"] .trust{color:#786547}
    html[data-theme="light"] .connects{border-top-color:rgba(48,37,24,.16)}
    html[data-theme="light"] .connects small{color:#7f6a49}
    html[data-theme="light"] .connects span{color:#302518}
    html[data-theme="light"] .section{border-top-color:rgba(48,37,24,.14)}
    html[data-theme="light"] .steps{border-color:#cdb996}
    html[data-theme="light"] .step+.step{border-color:#cdb996}
    html[data-theme="light"] .card,
    html[data-theme="light"] .plugin,
    html[data-theme="light"] .usecase,
    html[data-theme="light"] .plan{background:#fffaf1;border-color:#d0bc97}
    html[data-theme="light"] .plan.pop{background:#efe3ce;border-color:#b85a3b}
    html[data-theme="light"] .btn:not(.primary){border-color:#aa936c;color:#302518}
    html[data-theme="light"] .caption{color:#766447}

    html[data-theme="light"] .section.dark,
    html[data-theme="light"] .final,
    html[data-theme="light"] .footer,
    html[data-theme="light"] .announcement,
    html[data-theme="light"] .phone,
    html[data-theme="light"] .mini-ui,
    html[data-theme="light"] .pipeline{color:#eee5d3}
    html[data-theme="light"] .section.dark .subcopy,
    html[data-theme="light"] .section.dark .checks li,
    html[data-theme="light"] .section.dark .card p{color:#c9b78e}
    html[data-theme="light"] .section.dark .card{background:#171b1e;border-color:#695635}
    html[data-theme="light"] .footer .brand,
    html[data-theme="light"] .footer .eyebrow{color:#eee5d3}
    html[data-theme="light"] .footer a{color:#c9b98f}
    html[data-theme="light"] .final .btn:not(.primary){color:#eee5d3;border-color:#776444}

    @media(max-width:640px){.theme-toggle{width:38px;height:38px;flex-basis:38px}.actions{gap:10px}}
  `;
  document.head.appendChild(style);

  function setMetaColour(next) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'light' ? '#f4eddf' : '#27200d');
  }

  function syncButtons() {
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    buttons.forEach(function (button) {
      var dark = root.dataset.theme === 'dark';
      button.textContent = dark ? '☾' : '☀';
      button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      button.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
      button.setAttribute('aria-pressed', dark ? 'false' : 'true');
    });
    setMetaColour(root.dataset.theme);
  }

  function toggleTheme() {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    root.style.colorScheme = next;
    try { localStorage.setItem(storageKey, next); } catch (_) {}
    syncButtons();
  }

  function mountToggle() {
    document.querySelectorAll('.actions').forEach(function (actions) {
      if (actions.querySelector('[data-theme-toggle]')) return;
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'theme-toggle';
      button.setAttribute('data-theme-toggle', '');
      button.addEventListener('click', toggleTheme);
      var login = actions.querySelector('.login');
      if (login) actions.insertBefore(button, login);
      else actions.insertBefore(button, actions.firstChild);
    });
    syncButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountToggle, { once: true });
  } else {
    mountToggle();
  }
})();
