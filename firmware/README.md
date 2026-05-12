# firmware/

Drop the two compiled binaries in this folder before deploying:

- `notdrones-drone-firmware.bin` — from
  `NOT-DRONES-INNOVATIONS-PRIVATE-LIMITED/Claude-Betaflight-reference-esp32`,
  `main` branch, `.pio/build/<env>/firmware.bin` (rename on copy).

- `notdrones-remote-firmware.bin` — from
  `NOT-DRONES-INNOVATIONS-PRIVATE-LIMITED/ESP32-RC-Controller`,
  `main` branch, `.pio/build/<env>/firmware.bin` (rename on copy).

The site links to these exact filenames from `index.html`.
If you change the names, update the four `firmware/…` URLs in `index.html`
and the QR codes will regenerate automatically.
