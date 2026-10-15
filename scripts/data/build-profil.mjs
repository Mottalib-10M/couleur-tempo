#!/usr/bin/env node
/**
 * Part de la consommation qui tombe un jour bleu, blanc ou rouge (actif de données du site).
 *
 * Source : consommation nationale définitive par demi-heure (éCO2mix de RTE, jeu
 * « eco2mix-national-cons-def » publié sur l'open data des réseaux énergies, ODRÉ, Licence Ouverte),
 * croisée avec les couleurs Tempo de src/data/tempo.json.
 *
 * Méthode, saison par saison (1er septembre - 31 août) :
 *   - C(j) = consommation moyenne du jour civil j (MW) ;
 *   - socle = médiane de C(j) de mai à septembre (consommation sans chauffage) ;
 *   - part thermosensible H(j) = max(0, C(j) - socle) : c'est le profil d'un chauffage électrique ;
 *   - part de H tombant les jours de chaque couleur, et part des jours (usages répartis à plat).
 * Le jour civil (0 h - 24 h) approche le jour Tempo (6 h - 6 h) : décalage de six heures assumé.
 *
 * Écrit src/data/profil-conso.json. À relancer une fois par an, après la clôture d'une saison.
 * Usage : node scripts/data/build-profil.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '../../src/data/profil-conso.json');
const tempo = JSON.parse(readFileSync(join(here, '../../src/data/tempo.json'), 'utf8'));
const API = 'https://odre.opendatasoft.com/api/explore/v2.1/catalog/datasets/eco2mix-national-cons-def/exports/json';
const q = new URLSearchParams({ select: 'date,avg(consommation) as c', group_by: 'date', where: "consommation is not null and date_heure >= '2014-08-31T00:00:00'", order_by: 'date' });
const r = await fetch(`${API}?${q}`, { signal: AbortSignal.timeout(180000) });
if (!r.ok) { console.error(`ODRÉ ${r.status}`); process.exit(1); }
const rows = await r.json();
const C = Object.fromEntries(rows.map((x) => [x.date, x.c]));
const addDays = (s, n) => { const d = new Date(`${s}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const median = (a) => { const s = [...a].sort((x, y) => x - y); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const round = (x, d = 4) => Math.round(x * 10 ** d) / 10 ** d;

const seasons = {};
for (const [key, s] of Object.entries(tempo.seasons)) {
  if (s.length < 365) continue; // saison en cours : pas encore close
  const y = Number(key.slice(0, 4));
  const days = [...s].map((c, i) => ({ d: addDays(`${y}-09-01`, i), c })).filter((x) => C[x.d] != null);
  if (days.length < 360) continue;
  const socle = median(days.filter((x) => [5, 6, 7, 8, 9].includes(Number(x.d.slice(5, 7)))).map((x) => C[x.d]));
  const H = days.map((x) => ({ ...x, h: Math.max(0, C[x.d] - socle) }));
  const tot = H.reduce((a, x) => a + x.h, 0);
  const part = (col) => H.filter((x) => x.c === col).reduce((a, x) => a + x.h, 0) / tot;
  const jours = (col) => days.filter((x) => x.c === col).length;
  const moy = (col) => days.filter((x) => x.c === col).reduce((a, x) => a + C[x.d], 0) / jours(col);
  seasons[key] = {
    jours: { B: jours('B'), W: jours('W'), R: jours('R') },
    chauffage: { B: round(part('B')), W: round(part('W')), R: round(part('R')) },
    conso_moyenne_mw: { B: Math.round(moy('B')), W: Math.round(moy('W')), R: Math.round(moy('R')) },
    socle_mw: Math.round(socle),
  };
}
const keys = Object.keys(seasons);
const avg = (f) => round(keys.reduce((a, k) => a + f(seasons[k]), 0) / keys.length);
const out = {
  _lisezmoi: 'Part de la consommation thermosensible (chauffage) tombant les jours bleus, blancs et rouges, saison par saison. Calculé par scripts/data/build-profil.mjs depuis éCO2mix (RTE, ODRÉ, consommation nationale définitive) et les couleurs Tempo de RTE. Ne pas modifier à la main.',
  source: 'https://odre.opendatasoft.com/explore/dataset/eco2mix-national-cons-def/',
  built_at: new Date().toISOString().slice(0, 10),
  saisons: seasons,
  moyenne: { chauffage: { B: avg((s) => s.chauffage.B), W: avg((s) => s.chauffage.W), R: avg((s) => s.chauffage.R) }, saisons: keys.length, de: keys[0], a: keys[keys.length - 1] },
};
writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
console.log(`profil-conso.json : ${keys.length} saisons (${keys[0]} à ${keys.at(-1)}), chauffage les jours rouges ${round(out.moyenne.chauffage.R * 100, 1)} %, blancs ${round(out.moyenne.chauffage.W * 100, 1)} %`);
