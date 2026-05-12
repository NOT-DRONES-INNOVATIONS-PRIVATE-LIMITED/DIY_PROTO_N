(function () {
  if (typeof QRious === "undefined") {
    console.error("[qr] QRious library not loaded");
    return;
  }

  function isUnavailable(a) {
    var raw = a.getAttribute("href") || "";
    return /^REPLACE_ME/i.test(raw) || raw === "" || raw === "#";
  }

  function markUnavailable(card, reason) {
    if (!card) return;
    card.classList.add("card-unavailable");
    var overlay = document.createElement("div");
    overlay.className = "card-unavailable-overlay";
    overlay.innerHTML =
      '<span class="card-unavailable-title">Not available yet</span>' +
      '<span class="card-unavailable-msg">' + reason + "</span>";
    card.appendChild(overlay);
  }

  document.querySelectorAll("a.qr").forEach(function (a) {
    var card = a.closest(".card");

    if (isUnavailable(a)) {
      a.removeAttribute("href");
      a.setAttribute("aria-disabled", "true");
      a.addEventListener("click", function (e) { e.preventDefault(); });
      var siblingBtn = card && card.querySelector("a.btn");
      if (siblingBtn) {
        siblingBtn.removeAttribute("href");
        siblingBtn.setAttribute("aria-disabled", "true");
        siblingBtn.addEventListener("click", function (e) { e.preventDefault(); });
      }
      markUnavailable(card, "No file uploaded for this download yet.");
      return;
    }

    var canvas = document.createElement("canvas");
    a.appendChild(canvas);
    new QRious({
      element: canvas,
      value: a.href,
      size: 512,
      foreground: "#0a0a0a",
      background: "#ffffff",
      padding: 0,
      level: "M",
    });
  });
})();
