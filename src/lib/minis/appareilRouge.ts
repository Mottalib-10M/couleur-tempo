import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
/** Jour rouge : un appareil lancé en heures pleines, ou décalé après 22 h. */
export default (l: L) => ({
  title: T(l, 'Cet appareil un jour rouge, avant ou après 22 h', 'This appliance on a red day, before or after 22:00'),
  cta: T(l, 'Voir le tarif Tempo complet', 'See the full Tempo prices'),
  inputs: [
    { id: 'p', label: T(l, 'Puissance de l’appareil', 'Appliance power'), def: 2, unit: 'kW', max: 30, decimals: 1 },
    { id: 'h', label: T(l, 'Durée d’utilisation', 'Running time'), def: 2, unit: 'h', max: 24, decimals: 1 },
  ],
  run: ({ p, h }: Record<string, number>) => {
    const k = p * h, R = P.tempo.kwh.R, B = P.tempo.kwh.B;
    return {
      head: [T(l, 'Lancé un jour rouge entre 6 h et 22 h', 'Run on a red day between 06:00 and 22:00'), eur(k * R.hp, l)] as [string, string],
      rows: [
        [T(l, 'Le même soir, après 22 h', 'The same evening, after 22:00'), eur(k * R.hc, l)],
        [T(l, 'Un jour bleu, la nuit', 'On a blue day, at night'), eur(k * B.hc, l)],
        [T(l, 'Économie en décalant après 22 h', 'Saving by shifting after 22:00'), eur(k * (R.hp - R.hc), l)],
      ] as [string, string][],
      note: T(l, 'Prix TTC du kWh Tempo au 1er août 2026.', 'Tempo kWh prices incl. tax from 1 August 2026.'),
    };
  },
});
