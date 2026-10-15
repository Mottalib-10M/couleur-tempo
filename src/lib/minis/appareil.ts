import { P } from '../engine/params';
import { T, eur, num, type L } from './_kit';
/** Consommation d'un appareil : kWh = puissance (kW) × heures, puis le coût selon l'option. */
export default (l: L) => ({
  title: T(l, 'La consommation de votre appareil sur un an', 'Your appliance’s use over a year'),
  cta: T(l, 'Comparer les options sur toute la maison', 'Compare the options for the whole house'),
  inputs: [
    { id: 'w', label: T(l, 'Puissance (plaque signalétique)', 'Power (rating plate)'), def: 2000, unit: 'W', max: 50000 },
    { id: 'h', label: T(l, 'Heures de marche par jour', 'Hours running a day'), def: 1, unit: 'h', max: 24, decimals: 1 },
    { id: 'j', label: T(l, 'Jours d’utilisation par an', 'Days used a year'), def: 365, unit: T(l, 'jours', 'days'), max: 366 },
  ],
  run: ({ w, h, j }: Record<string, number>) => {
    const k = (w / 1000) * h * j;
    return {
      head: [T(l, 'Consommation annuelle', 'Annual consumption'), `${num(k, l)} kWh`] as [string, string],
      rows: [
        [T(l, 'Coût en Base (6 kVA)', 'Cost on Base (6 kVA)'), eur(k * P.base.kwh['6'], l)],
        [T(l, 'En Heures creuses, le jour', 'On Off-peak, daytime'), eur(k * P.hc.hp, l)],
        [T(l, 'En Heures creuses, la nuit', 'On Off-peak, at night'), eur(k * P.hc.hc, l)],
        [T(l, 'En Tempo, jour bleu en journée', 'On Tempo, blue day daytime'), eur(k * P.tempo.kwh.B.hp, l)],
      ] as [string, string][],
      note: T(l, 'Puissance maximale de la plaque : un appareil à thermostat consomme souvent moins. Prix TTC au 1er août 2026.', 'Maximum rated power: a thermostat appliance often uses less. Prices incl. tax from 1 August 2026.'),
    };
  },
});
