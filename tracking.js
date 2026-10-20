// Medição: Consent Mode v2, gtag (GA4 + Google Ads), UTM/gclid e evento de lead.
// Carregado no <head>, antes de qualquer outro script.
(function () {
  var cfg = window.TENOTEC_CONFIG || {};
  var CONSENT_KEY = "tenotec_consent";
  var ATTR_KEY = "tenotec_origem";

  function store(kind) {
    try { return window[kind]; } catch (e) { return null; }
  }
  function getItem(kind, key) {
    var s = store(kind);
    try { return s ? s.getItem(key) : null; } catch (e) { return null; }
  }
  function setItem(kind, key, value) {
    var s = store(kind);
    try { if (s) s.setItem(key, value); } catch (e) {}
  }

  // 1. Consent Mode v2: tudo negado até o visitante escolher
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  var saved = getItem("localStorage", CONSENT_KEY);
  var granted = saved === "granted";
  gtag("consent", "default", {
    ad_storage: granted ? "granted" : "denied",
    ad_user_data: granted ? "granted" : "denied",
    ad_personalization: granted ? "granted" : "denied",
    analytics_storage: granted ? "granted" : "denied",
    wait_for_update: 500
  });
  gtag("set", "ads_data_redaction", true);
  gtag("set", "url_passthrough", true);

  // 2. Carrega o gtag.js só se houver ID configurado
  var mainId = cfg.GA4_ID || cfg.ADS_ID;
  if (mainId) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(mainId);
    document.head.appendChild(s);
    gtag("js", new Date());
    if (cfg.GA4_ID) gtag("config", cfg.GA4_ID);
    if (cfg.ADS_ID) gtag("config", cfg.ADS_ID);
  }

  // 3. UTM e gclid: guarda a primeira origem da sessão
  var params = new URLSearchParams(window.location.search);
  var keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"];
  var found = {};
  var any = false;
  keys.forEach(function (k) {
    var v = params.get(k);
    if (v) { found[k] = v.slice(0, 200); any = true; }
  });
  if (any && !getItem("sessionStorage", ATTR_KEY)) {
    setItem("sessionStorage", ATTR_KEY, JSON.stringify(found));
  }

  window.TENOTEC = {
    setConsent: function (value) {
      setItem("localStorage", CONSENT_KEY, value);
      var v = value === "granted" ? "granted" : "denied";
      gtag("consent", "update", {
        ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v
      });
    },
    hasConsentChoice: function () {
      return getItem("localStorage", CONSENT_KEY) !== null;
    },

    // Texto de origem para o fim da mensagem do WhatsApp
    originText: function () {
      var raw = getItem("sessionStorage", ATTR_KEY);
      var o = {};
      try { o = raw ? JSON.parse(raw) : {}; } catch (e) {}
      if (!o.utm_source && !o.gclid) return "";
      var parts = [];
      var source = o.utm_source || (o.gclid ? "google" : "");
      var line = "Origem: " + source;
      if (o.utm_medium) line += " / " + o.utm_medium;
      if (o.utm_campaign) line += " / " + o.utm_campaign;
      parts.push(line);
      if (o.utm_term) parts.push("Termo: " + o.utm_term);
      if (o.gclid) parts.push("gclid: " + o.gclid);
      return parts.join("\n");
    },

    // Evento de conversão: generate_lead (GA4) + conversão do Google Ads
    lead: function (cta, method) {
      var data = { cta: cta || "desconhecido", method: method || "whatsapp", transport_type: "beacon" };
      gtag("event", "generate_lead", data);
      if (cfg.ADS_ID && cfg.ADS_LEAD_LABEL) {
        gtag("event", "conversion", {
          send_to: cfg.ADS_ID + "/" + cfg.ADS_LEAD_LABEL,
          transport_type: "beacon"
        });
      }
    }
  };
})();
