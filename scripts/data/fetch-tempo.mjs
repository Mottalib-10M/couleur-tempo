#!/usr/bin/env node
/**
 * Relève la couleur Tempo publiée par RTE (RECETTE §4, données qui changent chaque jour).
 *
 * Source : les données ouvertes de la page « Calendrier des offres de fourniture de type Tempo » de
 * RTE (services-rte.com), sans clé d'API :
 *   - https://www.services-rte.com/cms/open_data/v1/tempo?season=AAAA-AAAA  (saison complète)
 *   - https://www.services-rte.com/cms/open_data/v1/tempoLight              (aujourd'hui et demain)
 * RTE précise que la couleur qui fait foi est celle publiée la veille à 10 h 30 sur cette page.
 *
 * Écrit src/data/tempo.json : une chaîne par saison (1 caractère par jour depuis le 1er septembre :
 * B bleu, W blanc, R rouge, ? pas encore publié), les jours publiés « en secours » (fallback RTE),
 * la date et l'heure du relevé. Si RTE ne répond pas, le fichier existant est gardé tel quel et le
 * script le dit (le build ne casse pas, la page affiche la date du dernier relevé).
 *
 * Usage : node scripts/data/fetch-tempo.mjs [--all]   (--all : relit aussi les saisons closes)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '../../src/data/tempo.json');
const BASE = 'https://www.services-rte.com/cms/open_data/v1';
const FIRST = 2014; // première saison Tempo choisie par RTE (délibération CRE du 30 octobre 2014)
const CODE = { BLUE: 'B', WHITE: 'W', RED: 'R' };
const all = process.argv.includes('--all');

const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : { seasons: {}, fallback: [] };

async function get(url, tries = 4) {
  for (let i = 1; i <= tries; i++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (tempodemain.fr; releve quotidien)', accept: 'application/json' }, signal: AbortSignal.timeout(30000) });
      if (r.ok) return await r.json();
      console.warn(`RTE ${r.status} sur ${url} (essai ${i})`);
    } catch (e) { console.warn(`RTE injoignable sur ${url} (essai ${i}) : ${e.message}`); }
    await new Promise((res) => setTimeout(res, 2000 * i));
  }
  return null;
}

const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (s, n) => { const d = new Date(`${s}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
/** Date du jour à Paris : la saison et « aujourd'hui » se comptent à l'heure française. */
const parisToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date());
const seasonOf = (day) => { const [y, m] = day.split('-').map(Number); return m >= 9 ? y : y - 1; };

function encode(y, values) {
  const start = `${y}-09-01`, end = `${y + 1}-08-31`;
  let s = '', d = start;
  const fb = [];
  while (d <= end) {
    const v = values[d];
    s += CODE[v] ?? '?';
    if (values[`${d}-fallback`] === 'true') fb.push(d);
    d = addDays(d, 1);
  }
  return { s: s.replace(/\?+$/, ''), fb };
}

const today = parisToday();
const current = seasonOf(today);
const seasons = { ...prev.seasons };
let fallback = new Set(prev.fallback ?? []);
let ok = true;
for (let y = FIRST; y <= current; y++) {
  const key = `${y}-${y + 1}`;
  const closed = y < current && seasons[key] && seasons[key].length >= 365;
  if (closed && !all) continue;
  const j = await get(`${BASE}/tempo?season=${key}`);
  if (!j?.values) { ok = false; continue; }
  const { s, fb } = encode(y, j.values);
  if (s.length < (seasons[key]?.length ?? 0)) { console.warn(`${key} : RTE renvoie moins de jours que le relevé précédent, relevé gardé`); continue; }
  seasons[key] = s;
  fb.forEach((d) => fallback.add(d));
}
// Couleur de demain : tempoLight la publie dès 10 h 30, parfois avant la saison complète.
const light = await get(`${BASE}/tempoLight`);
if (light?.values) {
  for (const [d, v] of Object.entries(light.values)) {
    if (d.endsWith('fallback') || !CODE[v]) continue;
    const y = seasonOf(d), key = `${y}-${y + 1}`;
    const idx = Math.round((Date.parse(`${d}T12:00:00Z`) - Date.parse(`${y}-09-01T12:00:00Z`)) / 864e5);
    const cur = (seasons[key] ?? '').padEnd(idx + 1, '?').split('');
    cur[idx] = CODE[v];
    seasons[key] = cur.join('').replace(/\?+$/, '');
    if (light.values[`${d}-fallback`] === 'true') fallback.add(d);
  }
} else ok = false;

// Contrôles : quotas et règles de placement (délibération CRE du 30 octobre 2014). Une saison qui
// les viole n'est pas publiée : on garde le relevé précédent et le job échoue pour qu'on regarde.
const errors = [];
for (const [key, s] of Object.entries(seasons)) {
  const y = Number(key.slice(0, 4));
  const n = { B: 0, W: 0, R: 0 };
  [...s].forEach((c, i) => {
    if (!(c in n)) return;
    n[c]++;
    const d = addDays(`${y}-09-01`, i), wd = new Date(`${d}T12:00:00Z`).getUTCDay(), m = Number(d.slice(5, 7));
    if (c === 'R' && (wd === 0 || wd === 6 || (m > 3 && m < 11))) errors.push(`${d} rouge hors règle`);
    if (c === 'W' && wd === 0) errors.push(`${d} blanc un dimanche`);
  });
  // 2019-2020 : 4 jours rouges remplacés par des blancs à partir du 19 mars 2020 (décision CRE, confinement).
  const maxR = 22, maxW = key === '2019-2020' ? 47 : 43;
  if (n.R > maxR || n.W > maxW) errors.push(`${key} : ${n.R} rouges, ${n.W} blancs, au-delà des quotas`);
}
if (errors.length) { console.error('Données RTE incohérentes :\n- ' + errors.join('\n- ')); process.exit(1); }

const out = {
  _lisezmoi: 'Couleurs Tempo publiées par RTE (services-rte.com, données ouvertes de la page Calendrier Tempo). Une chaîne par saison, 1 caractère par jour depuis le 1er septembre : B bleu, W blanc, R rouge, ? non publié. Fichier réécrit par scripts/data/fetch-tempo.mjs ; ne pas modifier à la main.',
  source: 'https://www.services-rte.com/fr/visualisez-les-donnees-publiees-par-rte/calendrier-des-offres-de-fourniture-de-type-tempo.html',
  api: `${BASE}/tempo?season=${current}-${current + 1}`,
  fetched_at: ok ? new Date().toISOString() : prev.fetched_at,
  fetched_ok: ok,
  seasons: Object.fromEntries(Object.entries(seasons).sort()),
  fallback: [...fallback].sort(),
};
writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
const cs = out.seasons[`${current}-${current + 1}`] ?? '';
console.log(`tempo.json : ${Object.keys(out.seasons).length} saisons, saison en cours ${cs.length} jours publiés, relevé ${ok ? 'complet' : 'partiel (RTE injoignable, données précédentes gardées)'}`);
