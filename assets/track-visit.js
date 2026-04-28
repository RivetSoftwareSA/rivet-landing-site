(function () {
  var sessionStart = Date.now();

  var TRACKING_PARAMS = ["origin", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  var BASE_URL = "https://api.rivetsoftware.dev/api/marketing";

  var search = window.location.search;
  var params = new URLSearchParams(search);

  var hasTracking = TRACKING_PARAMS.some(function (p) { return params.has(p); });
  if (!hasTracking) return;

  // Deduplicate visit within session
  var storageKey = "rivet:visit-tracked:" + window.location.pathname + search;
  var isNewVisit = false;
  try {
    if (!sessionStorage.getItem(storageKey)) {
      sessionStorage.setItem(storageKey, "1");
      isNewVisit = true;
    }
  } catch (_) {
    isNewVisit = true;
  }

  function getPayload(extras) {
    return JSON.stringify(Object.assign({
      origin:      params.get("origin")       || undefined,
      utmSource:   params.get("utm_source")   || undefined,
      utmMedium:   params.get("utm_medium")   || undefined,
      utmCampaign: params.get("utm_campaign") || undefined,
      utmContent:  params.get("utm_content")  || undefined,
      utmTerm:     params.get("utm_term")     || undefined,
      landingPath: window.location.pathname,
      queryString: search || null,
      referrer:    document.referrer || null,
      userAgent:   navigator.userAgent || null,
    }, extras || {}));
  }

  function post(endpoint, data) {
    try {
      fetch(BASE_URL + endpoint, {
        method:    "POST",
        headers:   { "Content-Type": "application/json" },
        keepalive: true,
        body:      data,
      }).catch(function () {});
    } catch (_) {}
  }

  // 1. Track landing visit
  if (isNewVisit) {
    post("/visits", getPayload());
  }

  // 2. Track session duration on leave
  var sessionFired = false;

  function sendSession() {
    if (sessionFired) return;
    sessionFired = true;
    post("/sessions", getPayload({ durationSeconds: Math.round((Date.now() - sessionStart) / 1000) }));
  }

  window.addEventListener("beforeunload", sendSession);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") sendSession();
  });

  // 3. Track CTA clicks
  document.addEventListener("click", function (e) {
    var target = e.target.closest("[data-track-event]");
    if (!target) return;
    post("/events", getPayload({ event: target.getAttribute("data-track-event") }));
  });

})();