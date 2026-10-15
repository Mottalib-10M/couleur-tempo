import { ecartHpHc } from '../engine/tarifs';
import { P } from '../engine/params';
import { T, eur, num, type L } from './_kit';
/** Horaires des heures creuses : ce que rapporte le déplacement de kWh des heures pleines vers les creuses. */
export default (l: L) => ({
  title: T(l, 'Ce que rapporte un usage remis en heures creuses', 'What moving a load into off-peak hours saves'),
  cta: T(l, 'Voir les nouvelles heures creuses', 'See the new off-peak hours'),
  inputs: [
    { id: 'k', label: T(l, 'kWh déplacés par jour', 'kWh moved per day'), def: 3, unit: 'kWh', max: 200, decimals: 1 },
    { id: 'j', label: T(l, 'Jours par an', 'Days a year'), def: 365, unit: T(l, 'j', 'd'), max: 366 },
  ],
  run: ({ k, j }: Record<string, number>) => {
    const ecart = ecartHpHc(), an = k * j * ecart;
    return {
      head: [T(l, 'Économie par an', 'Saving per year'), eur(an, l)] as [string, string],
      rows: [
        [T(l, 'Par mois', 'Per month'), eur(an / 12, l)],
        [T(l, 'Écart par kWh, heures pleines contre creuses', 'Gap per kWh, peak against off-peak'), eur(ecart, l, 4)],
        [T(l, 'kWh déplacés sur l’année', 'kWh moved over the year'), num(k * j, l)],
        [T(l, 'Prix d’un kWh en heures creuses', 'Price of an off-peak kWh'), eur(P.hc.hc, l, 4)],
      ] as [string, string][],
      note: T(l, 'Option Heures creuses du tarif réglementé, prix TTC au 1er août 2026.', 'Off-peak option of the regulated tariff, prices incl. tax from 1 August 2026.'),
    };
  },
});
