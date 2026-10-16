# Étude FR-ELEC : couleur Tempo, heures creuses, Base / HC / Tempo (2026-10-15)

Idée n° 1 de `reports/etude-niches-2026-10-15-B.md`, validée par l'éditeur (« lance les 10 »).
Volume : ≈ 930 000 recherches/mois (Keyword Planner, compte Objet Tech, 2026-10-15 : « tempo edf » et
« heures creuses » à 100 k – 1 M, neuf requêtes à 10 k – 100 k ; `reports/fr-elec-volumes-2026-10-15.txt`,
`check-volumes.py` : 917 061, GO). Enchère haute 1 à 3 €.

## SERP « couleur tempo demain » (WebSearch géolocalisé aux États-Unis, pages lues le 2026-10-15)

| # | Site | Classe | Ce que fait la page | Défaut constaté (lu sur la page) |
|---|---|---|---|---|
| 1-2 | fournisseurs-electricite.com (`/edf/tarifs/tempo`, `/couleur-du-jour-demain`) | DÉFENDU (partenaire Selectra) | Couleur, compteurs, simulateur Tempo / Base / HC | **Leads** : « 09 73 72 25 00 » dans l'en-tête et dans plusieurs blocs, bouton « Être rappelé gratuitement », fenêtre « Un conseiller vous rappelle ». **Périmé affiché** : « Mis à jour le 28 août 2026 » sur une page qui donne la couleur du 15 octobre. |
| 3-4 | selectra.info (`/edf/tempo`, `/tempo/demain`) | DÉFENDU | Couleur, compteurs, calendrier, exemple figé | **Leads** : « 09 73 72 73 00 », boutons « Appeler » et « Être rappelé » en tête. **Contradiction** : compteur 45 bleus écoulés, légende du calendrier « 46 jours bleus ». « L'option Tempo n'est pas proposée en 6 kVA » puis un abonnement 6 kVA listé. Pas de calcul intégré, seulement un lien et un exemple figé (≈ 3 095 kWh, 736 €). « Mis à jour le 29 septembre 2026 ». |
| 5 | jechange.fr (`/tempo/couleur-aujourdhui-demain`) | DÉFENDU | Couleur, compteurs, calendrier | **Leads** : 01 86 26 53 94, « Rappel gratuit », formulaire partenaire Voltalis (01 84 88 32 28). **Texte sans simulateur** : aucun calcul sur sa consommation. Dit la couleur « publiée vers 6 h 30 » alors que RTE fait foi à 10 h 30. |
| 6 | forum.hacf.fr | PRENABLE (forum domotique) | Fil technique sur l'API RTE | Pas une réponse grand public. |
| 7 | prix-elec.com | DÉFENDU | Page tarif Tempo | 403 au robot, non lue. |
| 8 | neozone.org (widget) | PRENABLE | Widget statique | Pas de calcul, pas de contexte. |
| hors top « demain » | kelwatt.fr (`/edf/tempo`) | DÉFENDU | Simulateur Tempo seul | **Leads** : 09 75 18 41 65, « Je me fais rappeler gratuitement ». **Périmé** : compteurs rattachés à la saison « 1er sept. 2025 - 31 août 2026 » sur une page du 15 octobre 2026 ; probabilités de jour rouge les 19-21 octobre, hors de la fenêtre des rouges. Pas de comparaison Base / HC sur sa consommation. |
| hors top « demain » | hellowatt.fr (`/calendrier-tempo-edf-couleur-jour/`) | DÉFENDU | Grille, historique | **Leads** : 09 75 18 60 60, « Un expert vous appelle gratuitement », alertes contre numéro de téléphone. **Faux** : « 256 jours bleus restants » le 15 octobre (254 après publication du 16). Dates contradictoires (prix « au 1er août », grille « mise à jour le 1er octobre »). Aucun calcul. |
| — | edf.fr | BLOQUÉ (fournisseur historique) | Page Tempo | Marque, imprenable sur la requête de marque. |

**Verdict SERP** : pas imprenable. Un seul indépendant (forum) et des widgets ; le top est tenu par des
comparateurs à leads (DÉFENDU), mais la requête est **quotidienne** (on revient chaque jour) et
le défaut est net et commun à tous : numéro de téléphone et rappel à côté de la couleur, compteurs
qui se contredisent ou datent de la saison passée, pas de calcul sur sa consommation hors
fournisseurs-electricite.com. Volume > 300 000 : GO (§2.1), à condition de battre chaque page.

## En quoi on fait mieux, concurrent par concurrent

- **selectra.info** : pas de numéro ni de rappel ; un vrai comparateur sur la consommation du visiteur
  (au lieu d'un exemple figé) ; des comptes qui se tiennent par construction (publiés + restants =
  quota, contrôlés à chaque build, mise à jour bloquée en cas d'écart) ; disponibilité de Tempo par
  puissance tirée de la grille (Tempo dès 6 kVA, pas en 3 kVA).
- **fournisseurs-electricite.com** : même calcul Base / HC / Tempo, mais avec la **part du chauffage
  répartie sur les couleurs d'après la consommation nationale mesurée par RTE** (19 % du chauffage
  tombe les 22 jours rouges, moyenne de 12 saisons éCO2mix) au lieu d'une répartition au prorata ;
  aucune date de mise à jour trompeuse : la date du relevé RTE est affichée.
- **jechange.fr** : un calcul sur chaque page ; l'heure de publication officielle (10 h 30, RTE) et le
  pré-signal, au lieu de « 6 h 30 ».
- **kelwatt.fr** : saison en cours calculée à la date du jour (heure de Paris), jamais la saison passée ;
  aucune probabilité de rouge hors fenêtre ; comparaison des trois options.
- **hellowatt.fr** : jours restants justes, un seul jeu de dates sourcées, simulateurs partout.
- **Tous** : version anglaise complète (expatriés), aucun numéro de téléphone commercial, historique
  complet des saisons depuis 2014 recalculé depuis RTE, et la réforme des heures creuses avec un
  calcul de ce qu'elle coûte si l'on ne reprogramme rien.

## Actif de données

- Couleurs Tempo de RTE, 13 saisons (2014-2015 à aujourd'hui), relevé quotidien par GitHub Action
  (`scripts/data/fetch-tempo.mjs`, contrôles des quotas et des règles CRE).
- Consommation nationale éCO2mix 2014-2026 croisée avec les couleurs : part du chauffage par couleur et
  par saison (`scripts/data/build-profil.mjs` → `src/data/profil-conso.json`).
- Grille TRV du 1er août 2026 (Base, HC, Tempo × 9 puissances), règles d'heures creuses CRE 2026-33,
  calendrier Enedis (`src/data/params-2026.json`).

## Licence des données

RTE : données ouvertes du calendrier Tempo (page services-rte.com, la couleur publiée à 10 h 30 « fait
foi ») et éCO2mix sur ODRÉ (Licence Ouverte). Le portail data.rte-france.com (API « Tempo Like Supply
Contract ») demande un compte et une clé OAuth : non utilisé, le relevé public suffit. Si RTE fermait
l'accès public, le script est l'endroit unique à adapter (clé en secret GitHub).

## Passe qualité du 2026-10-16 (brief BRIEF-QUALITE-2026-10-16)

- Relu à la source : grille EDF Tarif Bleu du 1er août 2026 (PDF, toutes les cases concordent), délibération CRE 2026-147 (+3,12 % HT résidentiels, accise 30,62 €/MWh, Tempo 24 kVA distinct), délibération CRE du 16 juillet 2014 (22 rouges, 43 blancs, pas de rouge le week-end ni férié, 5 d'affilée, pas de blanc le dimanche, 22 h - 6 h), fiche RTE indice 2, page calendrier RTE (10 h 30, pré-signal 8 h - 10 h 30), CRE 2026-33 tableau 4, focus CRE 2025 (14,5 M, 11 M, 1,4 M), page Enedis (1,7 M puis 9,3 M). Une fourchette sans source retirée (ballon d'eau chaude « 25 à 35 % »).
- **Grille du 1er février 2027** : non publiée au 16 octobre 2026 (proposition CRE attendue en janvier) ; la page méthode signale la baisse d'accise annoncée pour février 2027 (art. 71 LF 2026, cité par la CRE).
- **Limite levée : jour Tempo 6 h - 6 h** au lieu du jour civil pour le profil de chauffage (relevés éCO2mix au quart d'heure, heure de Paris) : part des jours rouges 19,2 % → 19,4 % (12 saisons).
- **Limite levée : majorations d'abonnement** (sans Linky 40,08 € HT, index non transmis 25,62 €, autoproducteur 9,84 €) choisies dans le comparateur, TVA 20 % comprise ; testées.
- Premier écran : premier champ 467 → 427 px (message d'attente de la couleur de demain sur une ligne). Charte éditoriale réécrite (phrase reprise de calculdivorce.fr). Titres alignés sur « tempo edf » et « calendrier tempo » (check-requetes : 27 → 1 suggestion non couverte, hors sujet).
