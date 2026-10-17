/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://tempodemain.fr";
export const SITE_NAMES: Record<string, string> = {"fr": "Tempo Demain", "en": "Tempo Demain"};
export const LANG_TAGS: Record<string, string> = {"fr": "fr-FR", "en": "en-FR"};
export const OG_LOCALES: Record<string, string> = {"fr": "fr_FR", "en": "en_GB"};
export const LOCALE_TAG = 'fr-FR';
/** Une locale par langue (RECETTE §4) : les nombres anglais s'écrivent « €1,234 », jamais « 1 234 € ». */
export const LOCALE_BY_LANG: Record<string, string> = { fr: 'fr-FR', en: 'en-GB' };
export const CURRENCY = 'EUR';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-16';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"fr": "Éditeur de calculateurs d'électricité domestique · option Tempo, heures creuses, tarif réglementé", "en": "Publisher of household electricity calculators · Tempo option, off-peak hours, regulated tariff"};
export const AUTHOR_DESC: Record<string, string> = {"fr": "Radif Partners relève chaque jour la couleur Tempo publiée par RTE et code les grilles du tarif réglementé proposées par la CRE, pour que chaque foyer compare Base, Heures creuses et Tempo sur sa propre consommation, sans qu'on lui demande un numéro de téléphone.", "en": "Radif Partners records the Tempo colour published by RTE every day and codes the regulated tariff grids proposed by the CRE, so that every household can compare Base, Off-peak and Tempo on its own consumption without being asked for a phone number."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"fr": ["Option Tempo du tarif bleu", "Heures creuses et heures pleines", "Tarifs réglementés de vente d'électricité", "Puissance souscrite du compteur", "Calendrier Tempo de RTE"], "en": ["Tempo option of the regulated blue tariff", "Off-peak and peak hours", "French regulated electricity tariffs", "Subscribed meter power", "RTE Tempo calendar"]};
export const CONTACT_EMAIL = "contact@tempodemain.fr";
export const THEME_COLOR = '#24479B';
export const LOGO_SYMBOL = 'kWh';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau, aucun cookie, Clarity chargé en mode sans cookie (consentv2 denied).
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = 'yz4bi54x5n';
export const INDEXNOW_KEY = '7c41e9a2d5b84f06a3e1c9d27b5f8a40';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',            // raison sociale ou nom commercial exploité
  legalForm: '',  // vide : publication à titre personnel, pas de société
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "TVA",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
