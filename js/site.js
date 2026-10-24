// Полный Порядок 73: появление при прокрутке, фото работ крупно, форма заявки.
(function () {
  var root = document.documentElement;
  root.classList.add("js");

  // разбивка заголовка уже в разметке; здесь только появление блоков при прокрутке
  var items = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (list) {
      list.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("on"); });
  }

  // фото работ: нажатие открывает снимок крупно; без <dialog> — просто в новой вкладке
  var box = document.querySelector("[data-zoom-box]");
  var boxImg = document.querySelector("[data-zoom-img]");
  document.querySelectorAll("[data-zoom]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var src = btn.getAttribute("data-zoom");
      if (!box || typeof box.showModal !== "function") { window.open(src, "_blank"); return; }
      boxImg.src = src;
      boxImg.alt = btn.querySelector("img").alt;
      box.showModal();
    });
  });
  if (box) {
    box.querySelector("[data-zoom-close]").addEventListener("click", function () { box.close(); });
    box.addEventListener("click", function (ev) { if (ev.target === box) box.close(); });
  }

  // форма: без галочки согласия отправка заперта; телефон обязателен
  var form = document.querySelector("[data-form]");
  if (form) {
    var consent = form.querySelector("[data-consent]");
    var submit = form.querySelector("[data-submit]");
    var phone = form.querySelector("#f-phone");
    var need = form.querySelector("[data-need]");
    var tech = form.querySelector("#f-tech");
    var usl = form.querySelectorAll("[data-usluga]");

    // химчистка — спрашиваем про диван, аренда — какую технику
    var showFor = function () {
      var cur = form.querySelector("[data-usluga]:checked").value;
      form.querySelectorAll("[data-for]").forEach(function (el) { el.hidden = el.getAttribute("data-for") !== cur; });
    };
    usl.forEach(function (r) { r.addEventListener("change", showFor); });
    showFor();

    // «Взять в аренду» у карточки проката сразу выбирает эту технику в форме
    document.querySelectorAll("[data-pick]").forEach(function (a) {
      a.addEventListener("click", function () {
        usl.forEach(function (r) { r.checked = r.value === "Аренда техники"; });
        tech.value = a.getAttribute("data-pick");
        showFor();
      });
    });

    consent.addEventListener("change", function () { submit.disabled = !consent.checked; });
    phone.addEventListener("input", function () { need.classList.remove("bad"); });
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (!consent.checked) return;
      if (phone.value.replace(/\D/g, "").length < 10) { need.classList.add("bad"); phone.focus(); return; }
      // TODO: куда уходит заявка (Telegram-бот или почта) — решит заказчица
      form.querySelector("[data-done]").hidden = false;
    });
  }
})();
