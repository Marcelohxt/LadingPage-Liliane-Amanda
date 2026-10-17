(function () {
  var WHATSAPP = "5511910521536";

  // Menu mobile
  var toggle = document.querySelector(".menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  toggle.addEventListener("click", function () {
    var open = mobileNav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  mobileNav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      mobileNav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // Links dos cards preenchem o serviço no formulário
  var select = document.getElementById("servico");
  document.querySelectorAll("[data-servico]").forEach(function (link) {
    link.addEventListener("click", function () {
      select.value = link.getAttribute("data-servico");
    });
  });

  // Formulário -> WhatsApp
  var form = document.getElementById("contact-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nome = form.nome;
    if (!nome.value.trim()) {
      nome.classList.add("invalid");
      nome.focus();
      return;
    }
    nome.classList.remove("invalid");
    var linhas = [
      "Olá! Vim pelo site da TENOTEC.",
      "Nome: " + nome.value.trim(),
      form.empresa.value.trim() ? "Empresa: " + form.empresa.value.trim() : "",
      "Interesse: " + form.servico.value,
      form.mensagem.value.trim() ? "Mensagem: " + form.mensagem.value.trim() : ""
    ].filter(Boolean);
    var url = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(linhas.join("\n"));
    window.open(url, "_blank", "noopener");
  });

  // Ano no rodapé
  document.getElementById("ano").textContent = new Date().getFullYear();

  // Animação ao rolar
  var items = document.querySelectorAll(".pain, .service, .stat, .steps__list li, .about__text, .contact__form");
  if ("IntersectionObserver" in window) {
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
