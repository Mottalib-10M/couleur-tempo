import { coutJour } from '../engine/compare';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
/** Jour blanc : coût d'une journée et des 43 jours blancs de la saison. */
export default (l: L) => ({
  title: T(l, 'Ce que vous coûte un jour blanc', 'What a white day costs you'),
  cta: T(l, 'Voir le tarif Tempo complet', 'See the full Tempo prices'),
  inputs: [
    { id: 'k', label: T(l, 'Consommation d’une journée', 'Use over one day'), def: 25, unit: 'kWh', max: 500 },
    { id: 'n', label: T(l, 'Part la nuit (22 h - 6 h)', 'Share at night (22:00-06:00)'), def: 30, unit: '%', max: 100 },
  ],
  run: ({ k, n }: Record<string, number>) => {
    const w = coutJour('W', k, n / 100), b = coutJour('B', k, n / 100), base = k * P.base.kwh['6'];
    const nb = P.tempo_regles.jours_blancs;
    return {
      head: [T(l, 'Une journée blanche', 'One white day'), eur(w, l)] as [string, string],
      rows: [
        [T(l, 'La même journée bleue', 'The same day as blue'), eur(b, l)],
        [T(l, 'La même journée en Base (6 kVA)', 'The same day on Base (6 kVA)'), eur(base, l)],
        [T(l, `Les ${nb} jours blancs de la saison`, `The season’s ${nb} white days`), eur(w * nb, l)],
        [T(l, 'Surcoût des blancs face à des bleus', 'Extra cost of white over blue days'), eur((w - b) * nb, l)],
      ] as [string, string][],
      note: T(l, 'Prix TTC du kWh au 1er août 2026, hors abonnement.', 'kWh prices incl. tax from 1 August 2026, standing charge excluded.'),
    };
  },
});
