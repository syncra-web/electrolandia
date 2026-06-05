/* ============================================================
   ELECTROLANDIA · Icon sprite
   Line icons · 24x24 viewBox · 1.75 stroke · inherit currentColor
   Injects a hidden <svg> sprite into the document.
   Usage:  <svg class="icon"><use href="#i-bolt"></use></svg>
   ============================================================ */
(function () {
  var ICONS = {
    // --- Energy / EV ---
    "bolt": '<path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z"/>',
    "battery": '<rect x="2" y="7" width="16" height="10" rx="2.5"/><path d="M21 10v4"/><path d="M6 10v4M9.5 10v4M13 10v4"/>',
    "battery-charging": '<path d="M11 7H4.5A2.5 2.5 0 0 0 2 9.5v5A2.5 2.5 0 0 0 4.5 17H8"/><path d="M14 7h1.5A2.5 2.5 0 0 1 18 9.5v5a2.5 2.5 0 0 1-2.5 2.5H14"/><path d="M21 10v4"/><path d="M11.5 6 8.5 12H12l-3 6"/>',
    "plug": '<path d="M9 2v5M15 2v5"/><path d="M6 7h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V7Z"/><path d="M12 16v6"/>',
    "ev-connector": '<rect x="5" y="3" width="14" height="13" rx="6.5"/><circle cx="9.5" cy="8" r="1.4"/><circle cx="14.5" cy="8" r="1.4"/><circle cx="12" cy="12" r="1.4"/><path d="M9 19h6M12 16v6"/>',
    "station": '<path d="M5 21V6a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v15"/><path d="M3 21h14"/><path d="M9 9h4"/><path d="M15 11h2.5a2 2 0 0 1 2 2v3.5a1.8 1.8 0 0 0 3.5 0V9l-2.5-2.5"/>',
    "gauge": '<path d="M12 14 16 9"/><circle cx="12" cy="13" r="0.8" fill="currentColor"/><path d="M4 18a8 8 0 1 1 16 0"/><path d="M4 18h16"/>',
    "leaf": '<path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 9-4 16-9 16Z"/><path d="M11 20c0-5 2-8 7-11"/>',
    "route": '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 19H14a3.5 3.5 0 0 0 0-7H10a3.5 3.5 0 0 1 0-7h5.5"/>',
    "sparkle": '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="m6.5 6.5 2 2M15.5 15.5l2 2M17.5 6.5l-2 2M8.5 15.5l-2 2"/>',

    // --- Place / time ---
    "pin": '<path d="M12 22s7-6.2 7-12A7 7 0 0 0 5 10c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.6"/>',
    "calendar": '<rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
    "calendar-check": '<rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/>',
    "clock": '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    "car": '<path d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11"/><path d="M4 11h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1v1.5a1.5 1.5 0 0 1-3 0V17H8v1.5a1.5 1.5 0 0 1-3 0V17H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Z"/><path d="M7 14h.01M17 14h.01"/>',

    // --- Status / feedback ---
    "check": '<path d="m5 12.5 4.5 4.5L19 7"/>',
    "check-circle": '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-4.5"/>',
    "x": '<path d="M6 6l12 12M18 6 6 18"/>',
    "x-circle": '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
    "alert": '<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9.5v5M12 17.5h.01"/>',
    "info": '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5h.01"/>',
    "ban": '<circle cx="12" cy="12" r="9"/><path d="m6 6 12 12"/>',

    // --- Nav / UI ---
    "home": '<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9.5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V10"/><path d="M10 20.5V14h4v6.5"/>',
    "search": '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    "user": '<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    "settings": '<circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 0 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9 2 2 0 0 1 0-4 1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 2.9-1.2 2 2 0 0 1 4 0 1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9Z"/>',
    "menu": '<path d="M4 7h16M4 12h16M4 17h16"/>',
    "list": '<path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
    "grid": '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    "filter": '<path d="M3.5 5.5h17l-6.5 8v5l-4 2v-7l-6.5-8Z"/>',
    "chevron-left": '<path d="m15 5-7 7 7 7"/>',
    "chevron-right": '<path d="m9 5 7 7-7 7"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    "arrow-right": '<path d="M4 12h16M14 6l6 6-6 6"/>',
    "external": '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>',
    "plus": '<path d="M12 5v14M5 12h14"/>',
    "more-vertical": '<circle cx="12" cy="5" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none"/>',
    "edit": '<path d="M4 20h4L18.5 9.5a2 2 0 0 0-2.8-2.8L5 17.2 4 20Z"/><path d="m14 8 2.8 2.8"/>',
    "trash": '<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/>',

    // --- Contact ---
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
    "phone": '<path d="M6 3h3l1.5 5-2 1.5a12 12 0 0 0 5 5l1.5-2 5 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z"/>',
    "whatsapp": '<path d="M3.5 20.5 5 16.5a8 8 0 1 1 3 3l-4.5 1Z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5.7 0 1.2-.7 1-1.3l-.4-1a.8.8 0 0 0-1-.4l-.8.3a4 4 0 0 1-2-2l.3-.8a.8.8 0 0 0-.4-1l-1-.4c-.6-.2-1.3.3-1.3 1Z"/>',
    "tag": '<path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9Z"/><circle cx="8" cy="8" r="1.4"/>',
    "credit": '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19M6 15h4"/>',
    "shield": '<path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>'
  };

  function build() {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("style", "position:absolute;width:0;height:0;overflow:hidden");
    var defs = "";
    for (var name in ICONS) {
      defs += '<symbol id="i-' + name + '" viewBox="0 0 24 24" fill="none" ' +
              'stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
              ICONS[name] + '</symbol>';
    }
    svg.innerHTML = defs;
    document.body.insertBefore(svg, document.body.firstChild);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }

  window.ELECTRO_ICONS = Object.keys(ICONS);
})();
