import type { Locale } from './routes';
const fr = {
  updatedOn: 'Mis à jour le', editorialPolicy: 'Charte éditoriale', contactLabel: 'Contact', reviewedBy: 'Vérifié par',
  skipToContent: 'Aller au contenu', mainNav: 'Navigation principale', breadcrumbLabel: 'Fil d’Ariane', breadcrumbHome: 'Accueil', menuOpen: 'Ouvrir le menu',
  faqTitle: 'Questions fréquentes', relatedCalculators: 'Pages et calculs associés', sourcesTitle: 'Sources', writtenBy: 'Rédigé par',
  asOf: 'Tarif réglementé', lastUpdated: 'vérifié le', footerValidated: 'Sources : RTE, CRE, Enedis, grille EDF du Tarif Bleu', footerBrowser: '100 % dans votre navigateur · aucun numéro demandé · aucun rappel · gratuit',
  footerDisclaimer: 'Site indépendant édité par Radif Partners, sans lien avec EDF, RTE, Enedis, la CRE ni aucun fournisseur. La couleur Tempo affichée est celle que publie RTE ; les coûts sont des estimations calculées au tarif réglementé en vigueur à partir de vos saisies. Votre facture fait foi. Aucune donnée collectée, aucune mise en relation commerciale.', footerPopular: '', notFound: 'Cette page n’existe pas.',
  readMore: 'Lire la suite',
};
const en: typeof fr = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Checked by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Frequently asked questions', relatedCalculators: 'Related pages and calculations', sourcesTitle: 'Sources', writtenBy: 'Written by',
  asOf: 'Regulated tariff', lastUpdated: 'checked on', footerValidated: 'Sources: RTE, CRE, Enedis, EDF Tarif Bleu grid', footerBrowser: '100% in your browser · no phone number asked · no call-back · free',
  footerDisclaimer: 'Independent site published by Radif Partners, with no link to EDF, RTE, Enedis, the CRE or any supplier. The Tempo colour shown is the one RTE publishes; costs are estimates only, worked out on the regulated tariff in force from your inputs, and do not replace your bill, which is what counts. No data collected, no sales referrals.', footerPopular: '', notFound: 'This page does not exist.',
  readMore: 'Read more',
};
export function t(lang: Locale) { return lang === 'en' ? en : fr; }
