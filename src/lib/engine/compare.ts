/**
 * Base, Heures creuses ou Tempo : coût annuel de chaque option sur la consommation du foyer.
 *
 * Modèle (publié sur la page méthode) :
 *   - la consommation annuelle se partage entre un socle réparti à plat sur les 365 jours et un
 *     chauffage électrique qui suit la consommation thermosensible nationale (éCO2mix) ;
 *   - la part du chauffage qui tombe un jour bleu, blanc ou rouge est la moyenne des saisons closes
 *     (data/profil-conso.json) ; le socle tombe au prorata des jours (300, 43, 22) ;
 *   - la même part de consommation est en heures creuses en option HC (8 h fixées par Enedis) et en
 *     option Tempo (22 h - 6 h) ;
 *   - un effort les jours rouges déplace une part des heures pleines vers les heures creuses du même jour.
 */
import { P } from './params';
import profil from '../../data/profil-conso.json';
import { aboAnnuel, disponible, enExtinction, prixBase, type Option } from './tarifs';
import type { Couleur } from './tempo';

export const COULEURS: Couleur[] = ['B', 'W', 'R'];
export const PROFIL_CHAUFFAGE: Record<Couleur, number> = profil.moyenne.chauffage as Record<Couleur, number>;
export const PROFIL_SAISONS = profil.moyenne.saisons;

export interface Entree {
  /** Consommation annuelle en kWh (relevé de la facture). */
  kwh: number;
  /** Puissance souscrite en kVA. */
  kva: number;
  /** Part de la consommation qui sert au chauffage (0 à 1). */
  chauffage: number;
  /** Part de la consommation en heures creuses (0 à 1). */
  partHC: number;
  /** Part des heures pleines des jours rouges reportée en heures creuses (0 à 1). */
  effortRouge?: number;
}

/** Part de la consommation annuelle qui tombe les jours de chaque couleur. */
export function partsCouleur(chauffage: number): Record<Couleur, number> {
  const R = P.tempo_regles, j = { B: R.jours_bleus_annee_365, W: R.jours_blancs, R: R.jours_rouges }, n = 365;
  const h = Math.min(1, Math.max(0, chauffage));
  return { B: (1 - h) * j.B / n + h * PROFIL_CHAUFFAGE.B, W: (1 - h) * j.W / n + h * PROFIL_CHAUFFAGE.W, R: (1 - h) * j.R / n + h * PROFIL_CHAUFFAGE.R };
}

export interface LigneTempo { c: Couleur; kwh: number; kwhHP: number; kwhHC: number; cout: number }
export interface Resultat { o: Option; dispo: boolean; extinction: boolean; abo: number; conso: number; total: number; mensuel: number; prixMoyen: number; tempo?: LigneTempo[] }

export function coutOption(o: Option, e: Entree): Resultat {
  const dispo = disponible(o, e.kva);
  const n = Math.min(1, Math.max(0, e.partHC)), kwh = Math.max(0, e.kwh);
  if (!dispo) return { o, dispo, extinction: false, abo: NaN, conso: NaN, total: NaN, mensuel: NaN, prixMoyen: NaN };
  const abo = aboAnnuel(o, e.kva);
  let conso = 0, tempo: LigneTempo[] | undefined;
  if (o === 'base') conso = kwh * prixBase(e.kva);
  else if (o === 'hc') conso = kwh * (n * P.hc.hc + (1 - n) * P.hc.hp);
  else {
    const parts = partsCouleur(e.chauffage), eff = Math.min(1, Math.max(0, e.effortRouge ?? 0));
    tempo = COULEURS.map((c) => {
      const q = kwh * parts[c];
      const hpShare = c === 'R' ? (1 - n) * (1 - eff) : 1 - n;
      const kwhHP = q * hpShare, kwhHC = q - kwhHP, p = P.tempo.kwh[c];
      return { c, kwh: q, kwhHP, kwhHC, cout: kwhHP * p.hp + kwhHC * p.hc };
    });
    conso = tempo.reduce((a, l) => a + l.cout, 0);
  }
  const total = abo + conso;
  return { o, dispo, extinction: enExtinction(o, e.kva), abo, conso, total, mensuel: total / 12, prixMoyen: kwh > 0 ? total / kwh : 0, tempo };
}

export interface Comparaison { lignes: Resultat[]; meilleure: Resultat; pire: Resultat; ecart: number }
/** Les trois options classées ; seules les options ouvertes à cette puissance sont comparées. */
export function comparer(e: Entree): Comparaison {
  const lignes = (['base', 'hc', 'tempo'] as Option[]).map((o) => coutOption(o, e));
  const ok = lignes.filter((l) => l.dispo).sort((a, b) => a.total - b.total);
  return { lignes, meilleure: ok[0], pire: ok[ok.length - 1], ecart: ok[ok.length - 1].total - ok[0].total };
}

/** Part du chauffage déduite de deux relevés : consommation annuelle et consommation d'un mois d'été
 *  (sans chauffage). Le socle annuel vaut douze fois le mois d'été. */
export function partChauffage(kwhAn: number, kwhMoisEte: number) {
  if (kwhAn <= 0) return 0;
  return Math.min(1, Math.max(0, 1 - (12 * kwhMoisEte) / kwhAn));
}

/** Coût d'une journée Tempo d'une couleur donnée pour une consommation journalière. */
export function coutJour(c: Couleur, kwhJour: number, partHC: number) {
  const p = P.tempo.kwh[c], n = Math.min(1, Math.max(0, partHC));
  return kwhJour * (n * p.hc + (1 - n) * p.hp);
}

/** Puissance minimale à souscrire pour une pointe d'appel donnée (kW ≈ kVA en usage domestique). */
export function puissanceConseillee(kwPointe: number) {
  return P.puissances.find((p: number) => p >= kwPointe) ?? P.puissances[P.puissances.length - 1];
}
