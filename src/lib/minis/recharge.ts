import { P } from '../engine/params';
import { T, eur, num, type L } from './_kit';
/** Recharge d'une voiture électrique : coût annuel dans chaque option. Les jours rouges, la recharge
 *  se fait en heures creuses ; le reste se répartit au prorata des jours de chaque couleur. */
export function coutRecharge(km: number, conso: number, partNuit: number) {
  const kwh = km * conso / 100, n = Math.min(1, Math.max(0, partNuit)), R = P.tempo_regles, t = P.tempo.kwh;
  const jB = R.jours_bleus_annee_365 / 365, jW = R.jours_blancs / 365, jR = R.jours_rouges / 365;
  const tempo = kwh * (jB * (n * t.B.hc + (1 - n) * t.B.hp) + jW * (n * t.W.hc + (1 - n) * t.W.hp) + jR * t.R.hc);
  const hc = kwh * (n * P.hc.hc + (1 - n) * P.hc.hp), base = kwh * P.base.kwh['6'];
  return { kwh, tempo, hc, base };
}
export default (l: L) => ({
  title: T(l, 'Le coût annuel de la recharge selon l’option', 'Annual charging cost by option'),
  cta: T(l, 'Comparer les options sur toute la maison', 'Compare the options for the whole house'),
  inputs: [
    { id: 'km', label: T(l, 'Kilomètres par an', 'Kilometres a year'), def: 12000, unit: 'km', max: 100000 },
    { id: 'c', label: T(l, 'Consommation de la voiture', 'Car consumption'), def: 17, unit: 'kWh/100', max: 60 },
    { id: 'n', label: T(l, 'Part rechargée la nuit (22 h - 6 h)', 'Share charged at night (22:00-06:00)'), def: 90, unit: '%', max: 100 },
  ],
  run: ({ km, c, n }: Record<string, number>) => {
    const r = coutRecharge(km, c, n / 100);
    return {
      head: [T(l, 'Recharge sur un an en Tempo', 'A year of charging on Tempo'), eur(r.tempo, l)] as [string, string],
      rows: [
        [T(l, 'Énergie rechargée', 'Energy charged'), `${num(r.kwh, l)} kWh`],
        [T(l, 'En option Heures creuses', 'On the Off-peak option'), eur(r.hc, l)],
        [T(l, 'En Base (6 kVA)', 'On Base (6 kVA)'), eur(r.base, l)],
      ] as [string, string][],
      note: T(l, 'Jours rouges rechargés uniquement la nuit. Prix TTC au 1er août 2026, hors abonnement et pertes de charge.', 'Red days charged at night only. Prices incl. tax from 1 August 2026, excluding standing charge and charging losses.'),
    };
  },
});
