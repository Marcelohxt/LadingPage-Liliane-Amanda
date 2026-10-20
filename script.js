(function () {
  var cfg = window.TENOTEC_CONFIG || {};
  var T = window.TENOTEC || { lead: function () {}, originText: function () { return ""; }, setConsent: function () {}, hasConsentChoice: function () { return true; } };
  var WHATSAPP = cfg.WHATSAPP || "5511910521536";
  var body = document.body;

  // Páginas por segmento ou cidade definem data-segmento / data-cidade no <body>
  var segmento = body.getAttribute("data-segmento") || "";
  var cidade = body.getAttribute("data-cidade") || "";

  // Pré-visualização dos itens pendentes: abra a página com ?preview=1
  if (/[?&]preview=1\b/.test(window.location.search)) {
    document.documentElement.classList.add("preview");
  }

  function waUrl(lines) {
    var origin = T.originText();
    if (origin) lines = lines.concat(["", origin]);
    return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(lines.join("\n"));
  }

  function baseLines() {
    var lines = [cfg.WHATSAPP_MSG || "Olá! Vim pelo site da TENOTEC e quero um orçamento de LTA."];
    if (segmento) lines.push("Estabelecimento: " + segmento);
    if (cidade) lines.push("Cidade: " + cidade);
    return lines;
  }

  // Links de WhatsApp: monta a mensagem na hora do clique e registra a conversão
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.addEventListener("click", function () {
      a.href = waUrl(baseLines());
      T.lead(a.getAttribute("data-cta"), "whatsapp");
    });
  });
  document.querySelectorAll("[data-tel]").forEach(function (a) {
    a.addEventListener("click", function () {
      T.lead("telefone-" + (a.getAttribute("data-cta") || ""), "telefone");
    });
  });

  // Menu mobile
  var toggle = document.querySelector(".menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Formulário -> WhatsApp
  var form = document.getElementById("lead-form");
  if (form) {
    var tipo = form.tipo;
    if (segmento) {
      Array.prototype.forEach.call(tipo.options, function (o) {
        if (o.text === segmento) tipo.value = o.value || o.text;
      });
    }
    if (cidade) form.cidade.value = cidade;

    var errorBox = document.getElementById("form-error");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var required = [form.nome, form.whatsapp, form.cidade, form.tipo];
      var firstBad = null;
      required.forEach(function (el) {
        var bad = !el.value.trim();
        el.classList.toggle("invalid", bad);
        el.setAttribute("aria-invalid", bad ? "true" : "false");
        if (bad && !firstBad) firstBad = el;
      });
      if (firstBad) {
        errorBox.hidden = false;
        firstBad.focus();
        return;
      }
      errorBox.hidden = true;

      var lines = [
        cfg.WHATSAPP_MSG || "Olá! Vim pelo site da TENOTEC e quero um orçamento de LTA.",
        "",
        "Nome: " + form.nome.value.trim(),
        "WhatsApp: " + form.whatsapp.value.trim(),
        "Cidade: " + form.cidade.value.trim(),
        "Estabelecimento: " + form.tipo.value
      ];
      if (form.area.value.trim()) lines.push("Área aproximada: " + form.area.value.trim() + " m²");
      if (form.mensagem.value.trim()) lines.push("Mensagem: " + form.mensagem.value.trim());

      T.lead("form", "formulario");
      window.open(waUrl(lines), "_blank", "noopener");
    });
  }

  // Banner de cookies
  var banner = document.getElementById("consent");
  if (banner) {
    if (!T.hasConsentChoice()) banner.hidden = false;
    banner.querySelectorAll("[data-consent]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        T.setConsent(btn.getAttribute("data-consent"));
        banner.hidden = true;
      });
    });
    document.querySelectorAll("[data-open-consent]").forEach(function (btn) {
      btn.addEventListener("click", function () { banner.hidden = false; });
    });
  }

  // Ano no rodapé
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  // Animação ao rolar
  var items = document.querySelectorAll(".segments li, .included li, .steps__list li, .person, .quote");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach(function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }
})();
