(function () {
  if (typeof QRious === "undefined") {
    console.error("[qr] QRious library not loaded");
    return;
  }

  document.querySelectorAll("a.qr").forEach(function (a) {
    var url = a.href;
    var canvas = document.createElement("canvas");
    a.appendChild(canvas);
    new QRious({
      element: canvas,
      value: url,
      size: 512,
      foreground: "#0a0a0a",
      background: "#ffffff",
      padding: 0,
      level: "M",
    });
  });
})();
