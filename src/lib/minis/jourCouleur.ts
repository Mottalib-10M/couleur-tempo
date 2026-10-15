import { coutJour } from '../engine/compare';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
/** Accueil : une journée de votre consommation, au prix de chaque couleur. */
export default (l: L) => ({
  title: T(l, 'Votre journée au prix de chaque couleur', 'Your day at the price of each colour'),
  cta: T(l, 'Comparer les trois options sur l’année', 'Compare the three options over a year'),
  inputs: [
    { id: 'k', label: T(l, 'Consommation d’une journée', 'Use over one day'), def: 40, unit: 'kWh', max: 500 },
    { id: 'n', label: T(l, 'Part la nuit (22 h - 6 h)', 'Share at night (22:00-06:00)'), def: 30, unit: '%', max: 100 },
  ],
  run: ({ k, n }: Record<string, number>) => {
    const r = coutJour('R', k, n / 100), b = coutJour('B', k, n / 100), w = coutJour('W', k, n / 100);
    const base = k * P.base.kwh['6'];
    return {
      head: [T(l, 'Un jour rouge vous coûte', 'A red day costs you'), eur(r, l)] as [string, string],
      rows: [
        [T(l, 'Un jour blanc', 'A white day'), eur(w, l)],
        [T(l, 'Un jour bleu', 'A blue day'), eur(b, l)],
        [T(l, 'La même journée en Base (6 kVA)', 'The same day on Base (6 kVA)'), eur(base, l)],
      ] as [string, string][],
      note: T(l, 'Prix TTC du kWh au 1er août 2026, hors abonnement.', 'kWh prices incl. tax from 1 August 2026, standing charge excluded.'),
    };
  },
});
