import { coutOption } from '../engine/compare';
import { P } from '../engine/params';
import { T, eur, pct, type L } from './_kit';
/** Seuil de rentabilité : part de chauffage maximale pour laquelle Tempo, sans effort, bat Base et HC. */
export function seuilTempo(kwh: number, kva: number, partHC: number) {
  const e = (ch: number) => ({ kwh, kva, chauffage: ch, partHC });
  const autre = (ch: number) => Math.min(coutOption('base', e(ch)).total, coutOption('hc', e(ch)).total);
  let seuil = -1;
  for (let i = 0; i <= 100; i++) { const ch = i / 100; if (coutOption('tempo', e(ch)).total < autre(ch)) seuil = ch; else break; }
  return { seuil, tempo0: coutOption('tempo', e(0)).total, hc0: coutOption('hc', e(0)).total };
}
export default (l: L) => ({
  title: T(l, 'Jusqu’où Tempo reste rentable sans effort', 'How far Tempo pays with no effort'),
  cta: T(l, 'Affiner avec le comparateur', 'Refine with the comparison tool'),
  inputs: [
    { id: 'k', label: T(l, 'Consommation annuelle', 'Annual consumption'), def: 8000, unit: 'kWh', max: 100000 },
    { id: 'p', label: T(l, 'Puissance', 'Meter power'), def: 9, options: P.puissances.filter((x: number) => x >= P.tempo.kva_min).map((x: number) => ({ value: String(x), label: `${x} kVA` })) },
    { id: 'n', label: T(l, 'Part en heures creuses', 'Off-peak share'), def: 35, unit: '%', max: 100 },
  ],
  run: ({ k, p, n }: Record<string, number>) => {
    const s = seuilTempo(k, p, n / 100);
    return {
      head: [T(l, 'Tempo gagne tant que le chauffage reste sous', 'Tempo wins while heating stays below'), s.seuil < 0 ? T(l, 'jamais', 'never') : pct(s.seuil, l, 0)] as [string, string],
      rows: [
        [T(l, 'Tempo, sans chauffage', 'Tempo, no heating'), eur(s.tempo0, l)],
        [T(l, 'Heures creuses, même consommation', 'Off-peak, same use'), eur(s.hc0, l)],
        [T(l, 'Avance de Tempo sans chauffage', 'Tempo’s lead with no heating'), eur(s.hc0 - s.tempo0, l)],
      ] as [string, string][],
      note: T(l, 'Part du chauffage dans la consommation, sans rien reporter les jours rouges. Tarif du 1er août 2026.', 'Heating share of consumption, nothing shifted on red days. Tariff of 1 August 2026.'),
    };
  },
});
