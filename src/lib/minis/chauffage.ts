import { PROFIL_CHAUFFAGE } from '../engine/compare';
import { P } from '../engine/params';
import { T, eur, num, pct, type L } from './_kit';
/** Chauffage électrique : ce que coûtent les jours rouges, avec ou sans baisse du chauffage. */
export function chauffageRouge(kwhAn: number, baisse: number, partNuit = 0.3) {
  const kr = kwhAn * PROFIL_CHAUFFAGE.R * (1 - Math.min(1, Math.max(0, baisse))), t = P.tempo.kwh.R;
  const rouge = kr * (partNuit * t.hc + (1 - partNuit) * t.hp);
  const hcOpt = kr * (partNuit * P.hc.hc + (1 - partNuit) * P.hc.hp);
  return { kr, rouge, hcOpt };
}
export default (l: L) => ({
  title: T(l, 'Votre chauffage pendant les jours rouges', 'Your heating on red days'),
  cta: T(l, 'Comparer les trois options', 'Compare the three options'),
  inputs: [
    { id: 'k', label: T(l, 'Consommation annuelle de chauffage', 'Annual heating consumption'), def: 6000, unit: 'kWh', max: 60000 },
    { id: 'b', label: T(l, 'Baisse du chauffage les jours rouges', 'Heating cut on red days'), def: 20, unit: '%', max: 100 },
  ],
  run: ({ k, b }: Record<string, number>) => {
    const sans = chauffageRouge(k, 0), avec = chauffageRouge(k, b / 100);
    return {
      head: [T(l, 'Chauffage des jours rouges, avec votre baisse', 'Red-day heating, with your cut'), eur(avec.rouge, l)] as [string, string],
      rows: [
        [T(l, 'Part du chauffage tombant un jour rouge', 'Heating share falling on red days'), pct(PROFIL_CHAUFFAGE.R, l)],
        [T(l, 'kWh chauffés les jours rouges', 'kWh heated on red days'), `${num(avec.kr, l)} kWh`],
        [T(l, 'Sans aucune baisse', 'With no cut at all'), eur(sans.rouge, l)],
        [T(l, 'Les mêmes kWh en option Heures creuses', 'The same kWh on the Off-peak option'), eur(avec.hcOpt, l)],
      ] as [string, string][],
      note: T(l, 'Profil de chauffage : consommation nationale mesurée par RTE, 30 % la nuit, prix TTC au 1er août 2026.', 'Heating profile: national demand measured by RTE, 30% at night, prices incl. tax from 1 August 2026.'),
    };
  },
});
