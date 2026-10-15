/**
 * Tarif bleu résidentiel au 1er août 2026 (data/params-2026.json, grille EDF qui reprend la CRE) :
 * abonnement et prix du kWh de chaque option, TTC. Fonctions pures.
 */
import { P } from './params';
import type { Couleur } from './tempo';

export type Option = 'base' | 'hc' | 'tempo';
export const OPTIONS: Option[] = ['base', 'hc', 'tempo'];
export const PUISSANCES: number[] = P.puissances;
const k = (kva: number) => String(kva) as keyof typeof P.base.abo;

/** L'option existe-t-elle à cette puissance ? Tempo commence à 6 kVA ; la Base n'est plus ouverte
 *  aux nouveaux contrats à partir de 9 kVA (« en extinction »), mais reste facturée aux anciens. */
export function disponible(o: Option, kva: number): boolean {
  if (!PUISSANCES.includes(kva)) return false;
  if (o === 'tempo') return kva >= P.tempo.kva_min;
  return true;
}
export const enExtinction = (o: Option, kva: number) => o === 'base' && kva >= P.base.extinction_des_kva;

/** Abonnement mensuel TTC (€). */
export function aboMensuel(o: Option, kva: number): number {
  if (!disponible(o, kva)) return NaN;
  if (o === 'tempo') return P.tempo.abo[k(kva) as keyof typeof P.tempo.abo];
  return (o === 'base' ? P.base.abo : P.hc.abo)[k(kva)];
}
export const aboAnnuel = (o: Option, kva: number) => aboMensuel(o, kva) * 12;
/** Prix du kWh en option Base (20,01 c€ en 3 et 6 kVA, 19,85 c€ au-delà). */
export const prixBase = (kva: number) => P.base.kwh[k(kva)];
export const prixHC = () => ({ hp: P.hc.hp, hc: P.hc.hc });
export const prixTempo = (c: Couleur) => P.tempo.kwh[c];
/** Écart de prix d'un kWh entre heures pleines et heures creuses en option HC. */
export const ecartHpHc = () => P.hc.hp - P.hc.hc;
