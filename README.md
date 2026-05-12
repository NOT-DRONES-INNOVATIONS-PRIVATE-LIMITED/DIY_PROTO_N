# notdrones-pages

Static GitHub Pages site for NOT Drones internal distribution.
Lists download links (OneDrive + in-repo firmware binaries) as clickable QR codes,
plus a tutorials page.

## What's in here

```
notdrones-pages/
├── index.html            Downloads (simulator, binaries folder, drone fw, remote fw)
├── tutorials.html        Instructions/tutorials (placeholder sections)
├── css/style.css         Dark HUD theme — recolor via CSS variables at top
├── js/qr.js              Generates QR codes for every <a class="qr">
├── assets/
│   └── logo.svg          Placeholder wordmark — REPLACE with real logo
├── firmware/
│   └── README.md         Drop the two .bin files here before deploying
├── .nojekyll             Tells GitHub Pages not to run Jekyll
└── .gitignore
```

## Outstanding manual steps before going live

You must do these — I cannot from this session (no GitHub auth, no OneDrive, no shell):

### 1. Paste real OneDrive URLs

Open `index.html` and replace these two placeholders (search for `REPLACE_ME`):

| Placeholder                                       | What goes there                                    |
| ------------------------------------------------- | -------------------------------------------------- |
| `REPLACE_ME_SIMULATOR_ONEDRIVE_URL`               | OneDrive share link for the latest simulator file. |
| `REPLACE_ME_BINARIES_FOLDER_ONEDRIVE_URL`         | OneDrive share link for the binaries folder.       |

Both occur twice each (once on the QR `<a>`, once on the button `<a>`) — replace all four.

### 2. Drop the firmware binaries into `firmware/`

```
firmware/notdrones-drone-firmware.bin
firmware/notdrones-remote-firmware.bin
```

How to get them (one example — use whichever clone tool you have):

```powershell
# Drone firmware
git clone --depth 1 https://github.com/NOT-DRONES-INNOVATIONS-PRIVATE-LIMITED/Claude-Betaflight-reference-esp32 _drone_fw
Copy-Item _drone_fw\.pio\build\*\firmware.bin firmware\notdrones-drone-firmware.bin
Remove-Item -Recurse -Force _drone_fw

# Remote firmware
git clone --depth 1 https://github.com/NOT-DRONES-INNOVATIONS-PRIVATE-LIMITED/ESP32-RC-Controller _remote_fw
Copy-Item _remote_fw\.pio\build\*\firmware.bin firmware\notdrones-remote-firmware.bin
Remove-Item -Recurse -Force _remote_fw
```

Adjust the build env name (`.pio/build/<env>/firmware.bin`) — there may be multiple.

### 3. Replace the placeholder logo

Drop the real NOT Drones logo at `assets/logo.svg` (or use `.png` and update the
`<img src=...>` in `index.html` and `tutorials.html`). Keep it ~34px tall.

### 4. Write the tutorial content

`tutorials.html` has 9 placeholder sections marked `TODO:` — fill them in.

### 5. Create the repo and push

```powershell
# from the notdrones-pages/ folder
git init -b main
git add .
git commit -m "Initial site"
gh repo create NOT_DRONES_INNOVATION_PVT_LTD/notdrones-pages --public --source=. --push
```

> **Note on visibility:** GitHub Pages is **free only on public repos**. To use a
> private repo you need a paid GitHub plan (Pro/Team/Enterprise) on the org.
> The site is internal-distribution content but contains no secrets, so public is fine
> — just don't push the actual firmware `.bin` if it's sensitive.

### 6. Enable Pages

In the new repo: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)` → Save**.

After ~30 s the site is live at:
`https://not-drones-innovation-pvt-ltd.github.io/notdrones-pages/`

## Local preview

```powershell
# from notdrones-pages/
python -m http.server 8000
```

Open <http://localhost:8000/>. QR codes will encode `http://localhost:8000/...` URLs
locally and the real `https://...github.io/...` URLs once deployed — no code changes
needed, because they're generated from each link's resolved `href` at page load.

## How the QR codes work

Every `<a class="qr" href="...">` in the HTML gets a QR canvas injected by `js/qr.js`,
encoding `a.href` (the browser resolves relative paths to absolute, so they work
both locally and on Pages). The whole anchor is clickable — tap to open the same
link the QR encodes.

To recolor / resize, edit `js/qr.js` (`foreground`, `background`, `size`) and
the CSS variables at the top of `css/style.css`.

## What I still need from you (deferred items you mentioned)

- Arduino IDE test source code + binaries → go into the OneDrive binaries folder.
- Tutorial copy → into `tutorials.html`.
