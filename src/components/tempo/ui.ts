/** Couleurs et libellés Tempo partagés par les composants. Contraste AA vérifié : blanc sur #1d4ed8
 *  (6,7:1) et sur #b91c1c (6,5:1) ; le jour blanc garde un texte ardoise sur fond blanc cerné. */
import type { Couleur, Jour } from '../../lib/engine/tempo';
import { displayDate } from '../../lib/format';
export type L = 'fr' | 'en';
export const NOM: Record<L, Record<Couleur, string>> = { fr: { B: 'Bleu', W: 'Blanc', R: 'Rouge' }, en: { B: 'Blue', W: 'White', R: 'Red' } };
export const NOM_JOUR: Record<L, Record<Couleur, string>> = { fr: { B: 'Jour bleu', W: 'Jour blanc', R: 'Jour rouge' }, en: { B: 'Blue day', W: 'White day', R: 'Red day' } };
export const FOND: Record<Couleur, string> = { B: '#1d4ed8', W: '#ffffff', R: '#b91c1c' };
export const TEXTE: Record<Couleur, string> = { B: '#ffffff', W: '#0f172a', R: '#ffffff' };
export const BORD: Record<Couleur, string> = { B: '#1d4ed8', W: '#94a3b8', R: '#b91c1c' };
export const cardStyle = (c: Jour) => (c ? { backgroundColor: FOND[c], color: TEXTE[c], borderColor: BORD[c] } : { backgroundColor: '#f8fafc', color: '#334155', borderColor: '#cbd5e1' });
export const tag = (l: L) => (l === 'en' ? 'en-GB' : 'fr-FR');
export const jourLong = (d: string, l: L) => {
  const s = new Date(`${d}T12:00:00Z`).toLocaleDateString(tag(l), { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
  const t = l === 'fr' ? s.replace(/ 1 /, ' 1er ') : s;
  return t.charAt(0).toUpperCase() + t.slice(1);
};
export const dateLongue = (d: string, l: L) => displayDate(d, tag(l));
