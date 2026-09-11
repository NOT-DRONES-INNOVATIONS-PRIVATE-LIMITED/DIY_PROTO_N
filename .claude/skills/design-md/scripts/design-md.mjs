#!/usr/bin/env node
// design-md — pick, fetch and apply a DESIGN.md from VoltAgent/awesome-design-md.
// Zero dependencies. Node >= 18 (global fetch).
//
//   node design-md.mjs list [--json]             live entry names (flags NEW / REMOVED vs the local catalogue)
//   node design-md.mjs search <terms...>         grep the local catalogue (archetype hints + name/category/description)
//   node design-md.mjs show <name> [--full]      preview: description, key characteristics, font family, don'ts
//   node design-md.mjs get <name> [--dest <file>] [--force]
//                                               download DESIGN.md into the project (default ./DESIGN.md)
//   node design-md.mjs tokens [<DESIGN.md>] [--css|--json|--tailwind] [--components] [--out <file>]
//                                               turn the YAML frontmatter into CSS custom properties / JSON / Tailwind
//   node design-md.mjs refresh                   regenerate the generated part of references/catalog.md from the live repo

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = 'VoltAgent/awesome-design-md';
const BRANCH = 'main';
const RAW = `https://raw.githubusercontent.com/${REPO}/${BRANCH}`;
const API = `https://api.github.com/repos/${REPO}/contents/design-md?ref=${BRANCH}`;
const SITE = 'https://getdesign.md';

const here = path.dirname(fileURLToPath(import.meta.url));
const CATALOG = path.join(here, '..', 'references', 'catalog.md');
const START = '<!-- catalog:start -->';
const END = '<!-- catalog:end -->';
const BOOL_FLAGS = new Set(['force', 'full', 'css', 'json', 'tailwind', 'components']);

// ---------- helpers ----------
const die = (msg, code = 1) => { console.error(`design-md: ${msg}`); process.exit(code); };

function parseArgs(argv) {
  const out = { _: [], flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const next = argv[i + 1];
      if (!BOOL_FLAGS.has(k) && next !== undefined && !next.startsWith('--')) { out.flags[k] = next; i++; }
      else out.flags[k] = true;
    } else out._.push(a);
  }
  return out;
}

async function fetchText(url, { optional = false } = {}) {
  const headers = { 'User-Agent': 'design-md-skill' };
  if (process.env.GITHUB_TOKEN && url.startsWith('https://api.github.com')) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    if (optional) return null;
    die(`${res.status} ${res.statusText} fetching ${url}`);
  }
  return res.text();
}

async function liveNames() {
  const json = JSON.parse(await fetchText(API));
  return json.filter(e => e.type === 'dir').map(e => e.name).sort();
}

const entryUrl = name => `${RAW}/design-md/${encodeURIComponent(name)}/DESIGN.md`;
const entryPage = name => `${SITE}/${name}/design-md`;

async function fetchEntry(name) {
  const text = await fetchText(entryUrl(name), { optional: true });
  if (text === null) {
    const names = await liveNames();
    const needle = name.toLowerCase();
    const close = names.filter(n => n.includes(needle) || needle.includes(n.split('.')[0]));
    die(`no entry "${name}". ${close.length ? 'Did you mean: ' + close.join(', ') : 'Run `list` to see the live names.'}`);
  }
  return text;
}

// ---------- catalogue ----------
function readCatalog() {
  if (!fs.existsSync(CATALOG)) return { text: '', curated: '', rows: [] };
  const text = fs.readFileSync(CATALOG, 'utf8');
  const curated = text.split(START)[0];
  const rows = [];
  for (const line of text.split('\n')) {
    const m = line.match(/^\|\s*`([^`]+)`\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*(.*?)\s*\|\s*$/);
    if (m) rows.push({ folder: m[1], name: m[2], category: m[3], description: m[4] });
  }
  return { text, curated, rows };
}

// ---------- frontmatter (restricted YAML: maps only, <= 3 levels, no arrays) ----------
function splitFrontmatter(md) {
  const lines = md.split(/\r?\n/);
  if (lines[0].trim() !== '---') return { fm: null, body: md };
  const end = lines.findIndex((l, i) => i > 0 && l.trim() === '---');
  if (end < 0) return { fm: null, body: md };
  return { fm: lines.slice(1, end), body: lines.slice(end + 1).join('\n') };
}

function unquote(v) {
  v = v.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1);
  return v;
}

function parseYamlish(lines) {
  const root = {};
  const stack = [{ indent: -1, obj: root }];
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const indent = raw.match(/^ */)[0].length;
    const m = raw.match(/^\s*([A-Za-z0-9_.-]+):\s*(.*)$/);
    if (!m) continue;
    const [, key, rest] = m;
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
    const parent = stack[stack.length - 1].obj;
    if (rest === '') {
      // map opener (or empty value): nested if the next non-blank line is deeper
      const next = lines.slice(i + 1).find(l => l.trim());
      const nextIndent = next ? next.match(/^ */)[0].length : 0;
      if (next && nextIndent > indent) { const o = {}; parent[key] = o; stack.push({ indent, obj: o }); }
      else parent[key] = '';
    } else if (/^[|>][-+]?$/.test(rest)) {
      // block scalar: collect the deeper-indented lines
      const buf = [];
      let j = i + 1;
      for (; j < lines.length; j++) {
        const l = lines[j];
        if (l.trim() === '') { buf.push(''); continue; }
        if (l.match(/^ */)[0].length <= indent) break;
        buf.push(l.trim());
      }
      parent[key] = buf.join(rest.startsWith('|') ? '\n' : ' ').trim();
      i = j - 1;
    } else parent[key] = unquote(rest);
  }
  return root;
}

function parseDesign(md) {
  const { fm, body } = splitFrontmatter(md);
  return { tokens: fm ? parseYamlish(fm) : null, body, hasFrontmatter: !!fm };
}

// ---------- token emitters ----------
const kebab = s => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const cssName = (group, key) => {
  const prefix = { colors: 'color', rounded: 'radius', spacing: 'space', typography: 'font' }[group] || group;
  return `--${prefix}-${key}`;
};
// "{colors.primary}" -> var(--color-primary); "{rounded.pill}" -> var(--radius-pill)
const resolveRef = v => String(v).replace(/\{([a-z]+)\.([A-Za-z0-9_-]+)\}/g, (_, g, k) => `var(${cssName(g, k)})`);

function toCss(t, { components = false } = {}) {
  const out = [];
  out.push(`/* Design tokens generated by design-md from: ${t.name || 'DESIGN.md'} */`);
  if (t.description) out.push(`/* ${String(t.description).replace(/\*\//g, '* /').split('\n')[0].slice(0, 300)} */`);
  out.push(':root {');
  for (const [k, v] of Object.entries(t.colors || {})) out.push(`  ${cssName('colors', k)}: ${v};`);
  if (t.rounded) { out.push(''); for (const [k, v] of Object.entries(t.rounded)) out.push(`  ${cssName('rounded', k)}: ${v};`); }
  if (t.spacing) { out.push(''); for (const [k, v] of Object.entries(t.spacing)) out.push(`  ${cssName('spacing', k)}: ${v};`); }
  if (t.typography) {
    out.push('');
    for (const [k, p] of Object.entries(t.typography)) {
      if (typeof p !== 'object') continue;
      const fam = p.fontFamily, size = p.fontSize, w = p.fontWeight, lh = p.lineHeight, ls = p.letterSpacing;
      if (fam) out.push(`  --font-${k}-family: ${fam};`);
      if (size) out.push(`  --font-${k}-size: ${size};`);
      if (w) out.push(`  --font-${k}-weight: ${w};`);
      if (lh) out.push(`  --font-${k}-leading: ${lh};`);
      if (ls !== undefined && ls !== '') out.push(`  --font-${k}-tracking: ${ls};`);
      if (p.fontFeature) out.push(`  --font-${k}-features: "${p.fontFeature}";`);
      if (p.textTransform) out.push(`  --font-${k}-transform: ${p.textTransform};`);
      if (fam && size) out.push(`  --font-${k}: ${w || 400} ${size}${lh ? '/' + lh : ''} ${fam};  /* font: var(--font-${k}) */`);
    }
  }
  out.push('}');
  if (components && t.components) {
    out.push('', '/* Component starters: one class per component in the DESIGN.md frontmatter. Rename to taste. */');
    const map = { backgroundColor: 'background-color', textColor: 'color', rounded: 'border-radius', padding: 'padding', height: 'height', width: 'width', border: 'border', borderColor: 'border-color', shadow: 'box-shadow', size: 'font-size', cellPadding: 'padding', headerBackground: 'background-color', rowBorder: 'border-bottom' };
    for (const [name, props] of Object.entries(t.components)) {
      if (typeof props !== 'object') continue;
      const decls = [];
      for (const [pk, pv] of Object.entries(props)) {
        if (pk === 'description') { decls.unshift(`  /* ${pv} */`); continue; }
        if (pk === 'typography' || pk.endsWith('Typography')) {
          const ref = String(pv).match(/\{typography\.([A-Za-z0-9_-]+)\}/);
          if (ref) decls.push(`  font: var(--font-${ref[1]});`, `  letter-spacing: var(--font-${ref[1]}-tracking, 0);`);
          else decls.push(`  /* ${pk}: ${pv} */`);
          continue;
        }
        decls.push(`  ${map[pk] || kebab(pk)}: ${resolveRef(pv)};`);
      }
      out.push(`.dm-${name} {`, ...decls, '}');
    }
  }
  return out.join('\n') + '\n';
}

function toTailwind(t) {
  const colors = {}, borderRadius = {}, spacing = {}, fontFamily = {}, fontSize = {};
  for (const [k, v] of Object.entries(t.colors || {})) colors[k] = v;
  for (const [k, v] of Object.entries(t.rounded || {})) borderRadius[k] = v;
  for (const [k, v] of Object.entries(t.spacing || {})) spacing[k] = v;
  for (const [k, p] of Object.entries(t.typography || {})) {
    if (typeof p !== 'object') continue;
    if (p.fontFamily) fontFamily[k] = p.fontFamily.split(',').map(s => unquote(s));
    const extra = {};
    if (p.lineHeight) extra.lineHeight = String(p.lineHeight);
    if (p.letterSpacing !== undefined && p.letterSpacing !== '') extra.letterSpacing = String(p.letterSpacing);
    if (p.fontWeight) extra.fontWeight = String(p.fontWeight);
    if (p.fontSize) fontSize[k] = [p.fontSize, extra];
  }
  const cfg = { theme: { extend: { colors, borderRadius, spacing, fontFamily, fontSize } } };
  return `// tailwind.config — theme.extend generated by design-md from: ${t.name || 'DESIGN.md'}\nmodule.exports = ${JSON.stringify(cfg, null, 2)};\n`;
}

// ---------- prose extraction (works for both formats) ----------
function section(body, heading, level = '##') {
  const re = new RegExp(`^${level} [^\\n]*${heading}[^\\n]*\\n([\\s\\S]*?)(?=^#{1,${level.length}} |(?![\\s\\S]))`, 'mi');
  const m = body.match(re);
  return m ? m[1].trim() : '';
}
function bulletsAfter(body, label) {
  const i = body.search(new RegExp(`\\*\\*${label}[^\\n]*\\*\\*|^#+ [^\\n]*${label}`, 'mi'));
  if (i < 0) return '';
  const rest = body.slice(i).split('\n').slice(1);
  const out = [];
  for (const l of rest) { if (/^\s*[-*] /.test(l)) out.push(l.trim()); else if (out.length) break; }
  return out.join('\n');
}
function describe(md) {
  const { tokens, body, hasFrontmatter } = parseDesign(md);
  const desc = hasFrontmatter ? (tokens.description || '') : (body.split('\n').find(l => l.trim() && !l.startsWith('#')) || '');
  return { desc: String(desc).replace(/\s+/g, ' ').trim(), body, hasFrontmatter, tokens };
}

// ---------- commands ----------
async function cmdList(flags) {
  const names = await liveNames();
  const cat = readCatalog();
  const known = new Map(cat.rows.map(r => [r.folder, r]));
  if (flags.json) { console.log(JSON.stringify(names)); return; }
  for (const n of names) {
    const r = known.get(n);
    console.log(r ? `${n.padEnd(16)} ${r.category.padEnd(30)} ${r.description}` : `${n.padEnd(16)} NEW: not in the local catalogue (run: refresh, then: show ${n})`);
  }
  const removed = [...known.keys()].filter(k => !names.includes(k));
  if (removed.length) console.log(`\nREMOVED upstream (still in catalogue): ${removed.join(', ')}`);
  console.log(`\n${names.length} entries live. Source: https://github.com/${REPO}/tree/${BRANCH}/design-md`);
}

function cmdSearch(terms) {
  if (!terms.length) die('search needs at least one term');
  const { curated, rows } = readCatalog();
  if (!rows.length) die('catalogue is empty: run `refresh`');
  const t = terms.map(s => s.toLowerCase());
  const hints = curated.split('\n').filter(l => /^\| /.test(l) && !/^\|\s*-+/.test(l) && !/^\| (Project archetype|Constraint)/i.test(l) && t.some(x => l.toLowerCase().includes(x)));
  if (hints.length) { console.log('Archetype hints (references/catalog.md):'); for (const h of hints) console.log('  ' + h); console.log(); }
  const scored = rows.map(r => {
    const hay = `${r.folder} ${r.name} ${r.category} ${r.description}`.toLowerCase();
    return { r, score: t.filter(x => hay.includes(x)).length };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);
  if (!scored.length) { console.log('No catalogue rows match. Try broader terms, or `list` to see everything.'); return; }
  for (const { r, score } of scored) console.log(`${r.folder.padEnd(16)} [${score}] ${r.category} — ${r.description}`);
}

async function cmdShow(name, flags) {
  if (!name) die('show needs an entry name');
  const md = await fetchEntry(name);
  if (flags.full) { console.log(md); return; }
  const { desc, body, hasFrontmatter, tokens } = describe(md);
  console.log(`# ${name}  (${entryPage(name)})`);
  console.log(hasFrontmatter
    ? `format: stitch frontmatter (${Object.keys(tokens.colors || {}).length} colours, ${Object.keys(tokens.typography || {}).length} type roles, ${Object.keys(tokens.components || {}).length} components)`
    : 'format: older numbered sections, no token frontmatter (tokens must be hand-copied from the prose)');
  console.log(`\n${desc}\n`);
  const kc = bulletsAfter(body, 'Key Characteristics');
  if (kc) console.log(`Key characteristics:\n${kc}\n`);
  const font = section(body, 'Font Famil', '###');
  if (font) console.log(`Font family:\n${font.split('\n').slice(0, 6).join('\n')}\n`);
  const dont = section(body, "Don't", '###');
  if (dont) console.log(`Don'ts:\n${dont.split('\n').slice(0, 8).join('\n')}\n`);
  console.log(`${md.length} bytes. Full text: show ${name} --full`);
}

async function cmdGet(name, flags) {
  if (!name) die('get needs an entry name');
  const dest = path.resolve(typeof flags.dest === 'string' ? flags.dest : 'DESIGN.md');
  if (fs.existsSync(dest) && !flags.force) die(`${dest} already exists. Read it first: if it is hand-authored, use it as is; pass --force only to replace an earlier design-md fetch.`);
  const md = await fetchEntry(name);
  const date = new Date().toISOString().slice(0, 10);
  const stamp = [
    '<!-- design-md provenance',
    `  source: https://github.com/${REPO}/blob/${BRANCH}/design-md/${name}/DESIGN.md  (MIT; an "inspired interpretation" of ${name})`,
    `  preview: ${entryPage(name)}`,
    `  fetched: ${date}`,
    '  This file is the project design system. Adapt it to the project (name, brand colours, loadable fonts,',
    '  drop signature components that make no sense here) and log every deviation under "## Project adaptations". -->',
  ].join('\n');
  const lines = md.split(/\r?\n/);
  let out;
  if (lines[0].trim() === '---') {
    const end = lines.findIndex((l, i) => i > 0 && l.trim() === '---');
    out = [...lines.slice(0, end + 1), '', stamp, ...lines.slice(end + 1)].join('\n');
  } else out = [lines[0], '', stamp, ...lines.slice(1)].join('\n');
  if (!/^## Project adaptations/m.test(out)) {
    out = out.trimEnd() + `\n\n## Project adaptations\n\n> Deviations from the source DESIGN.md, newest first. Keep this current: it is how the next session knows what is intentional.\n\n- ${date}: fetched from awesome-design-md/${name}; no adaptations yet.\n`;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, out, 'utf8');
  const { hasFrontmatter } = parseDesign(md);
  console.log(`wrote ${dest} (${out.length} bytes) from ${name}`);
  console.log(hasFrontmatter
    ? `next: node "${fileURLToPath(import.meta.url)}" tokens "${dest}" --css --out <path/to/tokens.css>`
    : 'note: older format without token frontmatter. Copy the colours / type scale / spacing from the prose into the project token file by hand.');
}

function cmdTokens(file, flags) {
  const src = path.resolve(file || 'DESIGN.md');
  if (!fs.existsSync(src)) die(`${src} not found`);
  const { tokens, hasFrontmatter } = parseDesign(fs.readFileSync(src, 'utf8'));
  if (!hasFrontmatter) die('no token frontmatter in this DESIGN.md (older numbered format). Hand-copy the Colors / Typography / Spacing sections into the project token file.', 2);
  let text;
  if (flags.json) text = JSON.stringify(tokens, null, 2) + '\n';
  else if (flags.tailwind) text = toTailwind(tokens);
  else text = toCss(tokens, { components: !!flags.components });
  if (typeof flags.out === 'string') {
    fs.mkdirSync(path.dirname(path.resolve(flags.out)), { recursive: true });
    fs.writeFileSync(flags.out, text, 'utf8');
    console.log(`wrote ${path.resolve(flags.out)}`);
  } else process.stdout.write(text);
}

async function cmdRefresh() {
  const [readme, names] = await Promise.all([fetchText(`${RAW}/README.md`), liveNames()]);
  // "### Category" headings, then "- [**Name**](https://getdesign.md/<folder>/design-md) - description"
  const rows = [];
  let category = '';
  for (const line of readme.split('\n')) {
    const h = line.match(/^### (.+?)\s*$/);
    if (h) { category = h[1].replace(/\s*·.*$/, '').trim(); continue; }
    const m = line.match(/^- \[\*\*(.+?)\*\*\]\(https?:\/\/getdesign\.md\/([^/)]+)\/design-md\)\s*-\s*(.+?)\s*$/);
    if (m && names.includes(m[2])) rows.push({ folder: m[2], name: m[1], category, description: m[3].replace(/\|/g, '/') });
  }
  const listed = new Set(rows.map(r => r.folder));
  const missing = names.filter(n => !listed.has(n));
  for (const n of missing) {
    const md = await fetchText(entryUrl(n), { optional: true });
    const d = md ? describe(md).desc : '';
    const short = d.replace(/^An? (inspired )?interpretation of [^—-]+[—-]\s*/i, '').split(/(?<=\.)\s/)[0].slice(0, 170).replace(/\|/g, '/');
    rows.push({ folder: n, name: n, category: 'Uncategorised (not in README)', description: short || '(no description)' });
  }
  const table = [
    `Generated ${new Date().toISOString().slice(0, 10)} from https://github.com/${REPO} (${rows.length} entries). Regenerate with \`node scripts/design-md.mjs refresh\`.`,
    '',
    '| folder | Name | Category | Style in one line |',
    '|---|---|---|---|',
    ...rows.map(r => `| \`${r.folder}\` | ${r.name} | ${r.category} | ${r.description} |`),
  ].join('\n');
  let text = fs.existsSync(CATALOG) ? fs.readFileSync(CATALOG, 'utf8') : `# DESIGN.md catalogue\n\n${START}\n${END}\n`;
  if (!text.includes(START) || !text.includes(END)) text += `\n${START}\n${END}\n`;
  const before = text.slice(0, text.indexOf(START) + START.length);
  const after = text.slice(text.indexOf(END));
  fs.writeFileSync(CATALOG, `${before}\n${table}\n${after}`, 'utf8');
  console.log(`catalogue refreshed: ${rows.length} entries (${missing.length} not in README: ${missing.join(', ') || 'none'}) -> ${CATALOG}`);
}

// ---------- main ----------
const { _: [cmd, ...rest], flags } = parseArgs(process.argv.slice(2));
try {
  switch (cmd) {
    case 'list': await cmdList(flags); break;
    case 'search': cmdSearch(rest); break;
    case 'show': await cmdShow(rest[0], flags); break;
    case 'get': await cmdGet(rest[0], flags); break;
    case 'tokens': cmdTokens(rest[0], flags); break;
    case 'refresh': await cmdRefresh(); break;
    default:
      console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 13).map(l => l.replace(/^\/\/ ?/, '')).join('\n'));
      process.exit(cmd ? 1 : 0);
  }
} catch (e) { die(e.message); }
