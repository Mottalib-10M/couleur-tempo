import { defineGuide, type Helpers } from '../../lib/guide-types';

/** Exemple chiffré : appareils typiques, kWh par cycle indicatifs saisis par le lecteur dans le mini ; ici seul l'écart de prix sert. */
const gain = (h: Helpers, kwhJour: number) => kwhJour * 365 * h.M.ecartHpHc();

export default defineGuide({
  id: 'horaires-heures-creuses',
  group: 'hc',
  order: 2,
  mini: 'decalageHc',
  related: ['heures-creuses', 'comparateur', 'recharge-voiture-tempo', 'consommation-appareils', 'prix-kwh'],
  sources: ['enedisHc', 'creHc2025', 'creTempo2014', 'grilleEdf'],
  fr: {
    slug: 'horaires-heures-creuses',
    nav: 'Horaires de vos heures creuses',
    card: 'Où lire vos plages, pourquoi elles diffèrent d’une adresse à l’autre, quoi reprogrammer.',
    title: 'Horaires heures creuses 2026 : trouver et lire vos plages',
    description: 'Horaires heures creuses 2026 : où lire vos plages sur la facture, l’espace client ou le Linky, pourquoi elles varient selon l’adresse et quoi reprogrammer.',
    h1: 'Horaires des heures creuses : comment connaître les vôtres',
    intro: 'Vos heures creuses ne sont pas forcément celles de votre voisin, ni celles d’un article lu en ligne. Voici où les lire, et quoi faire quand elles changent.',
    resume: (h) => `Il n’existe pas d’horaire national des heures creuses pour l’option Heures creuses : chaque compteur reçoit ses propres plages, fixées par Enedis selon la charge du réseau local, pour un total de ${h.num(h.P.heures_creuses.heures_par_jour)} heures par jour. Deux logements d’une même rue peuvent donc avoir des créneaux différents, par exemple 22 h - 6 h pour l’un et 0 h - 7 h plus 13 h - 14 h pour l’autre. Vos horaires exacts figurent sur votre facture, dans l’espace client de votre fournisseur et, pour les compteurs Linky, dans les informations que fait défiler l’écran du compteur. Ils comptent parce que l’écart entre un kWh en heures pleines et un kWh en heures creuses atteint ${h.kwh(h.M.ecartHpHc())} au tarif réglementé du 1er août 2026 : trois kWh par jour lancés au mauvais moment coûtent ${h.eur(gain(h, 3))} par an. L’option Tempo fait exception, avec des heures creuses fixées par le tarif de 22 h à 6 h pour tout le monde.`,
    faqs: (h) => [
      { q: 'Où trouver mes horaires d’heures creuses sur ma facture ?', a: 'Ils sont indiqués dans la partie qui décrit votre contrat ou votre point de livraison, souvent sous l’intitulé « plages heures creuses » ou « horaires heures creuses », avec les créneaux exacts. La facture détaille aussi les deux index relevés, heures pleines et heures creuses. Si la mention manque, l’espace client du fournisseur affiche les mêmes plages dans la fiche du contrat.' },
      { q: 'Le compteur Linky affiche-t-il les heures creuses ?', a: 'Oui. En appuyant sur les touches de défilement du Linky, l’écran fait apparaître successivement la date, l’heure, la puissance appelée et les index de consommation par période tarifaire. L’index en cours d’avancement vous dit si vous êtes en heures pleines ou creuses à l’instant même. Noter l’heure à laquelle l’index actif change, le soir, donne le début de votre plage de nuit.' },
      { q: 'Pourquoi mes heures creuses ne sont-elles pas de 22 h à 6 h ?', a: 'Parce que ce créneau n’est garanti que pour l’option Tempo, dont le tarif fixe les heures creuses de 22 h à 6 h partout en France. Pour l’option Heures creuses, Enedis place les huit heures selon les contraintes du réseau à votre adresse : elles peuvent commencer à 23 h, à 0 h ou se partager entre la nuit et le début d’après-midi. Le prix du kWh reste le même quelle que soit la plage.' },
      { q: 'Mon ballon d’eau chaude suivra-t-il seul mes nouveaux horaires ?', a: 'Oui s’il est raccordé au contact heures creuses du compteur : le Linky ouvre et ferme ce contact aux heures de votre contrat, et le ballon se met en chauffe au bon moment sans réglage. Non s’il est commandé par une horloge ou un programmateur réglé à la main : il faudra alors le reprogrammer quand votre fournisseur vous annoncera les nouvelles plages.' },
      { q: 'Puis-je choisir mes heures creuses ?', a: 'Non, pas sur l’option Heures creuses du tarif réglementé : Enedis les attribue compteur par compteur et elles ne se négocient pas. Certaines offres de marché proposent des créneaux de leur propre choix, comme des heures « super creuses » la nuit ou le week-end. Si un horaire fixe vous importe, l’option Tempo garantit 22 h - 6 h, au prix de jours rouges l’hiver.' },
      { q: 'Combien rapporte un lave-linge lancé en heures creuses ?', a: `Tout dépend des kWh déplacés. Chaque kWh qui passe des heures pleines aux heures creuses économise ${h.kwh(h.M.ecartHpHc())} au tarif réglementé d’août 2026. Pour un cycle de 1 kWh, valeur à vérifier sur l’étiquette énergie de votre machine, lancé chaque jour la nuit plutôt que le soir, le gain atteint ${h.eur(gain(h, 1))} par an. Le mini-simulateur de la page fait le calcul avec vos propres chiffres.` },
    ],
    body: (h) => `
<h2>Trois endroits où lire vos plages</h2>
<p>Le plus simple reste la <strong>facture</strong>. Elle reprend les caractéristiques de votre point de livraison : puissance souscrite, option tarifaire et, pour l’option Heures creuses, les créneaux exacts attribués par Enedis. Les mêmes informations se trouvent dans l’<strong>espace client</strong> de votre fournisseur, dans la fiche du contrat ; c’est souvent là qu’elles apparaissent en premier quand elles changent.</p>
<p>Troisième source, directement chez vous : le <strong>compteur Linky</strong>. Ses touches de défilement font apparaître plusieurs écrans, dont les index de consommation par période. L’index qui avance est celui de la période en cours. En regardant le compteur juste avant et juste après le début supposé de votre plage, vous confirmez l’horaire réel, ce que ni un article ni un voisin ne peuvent faire à votre place.</p>
<p>Enfin, l’espace en ligne d’Enedis donne accès à votre courbe de consommation, mais ${h.src('enedisHc', 'Enedis renvoie lui-même')} vers le fournisseur et la facture pour connaître les horaires. En cas de doute entre deux sources, c’est le contrat qui fait foi.</p>

<h2>Pourquoi vos horaires ne sont pas ceux du voisin</h2>
<p>Les heures creuses n’ont jamais été un horaire national. Dès leur création, elles ont été placées par le gestionnaire du réseau là où, localement, la demande était la plus faible. Le poste qui alimente votre quartier n’a pas la même charge que celui de la commune voisine : une zone d’activité très chargée à midi, un village tout électrique le soir, une ville où l’éclairage public et les chauffe-eau démarrent en même temps. Enedis répartit donc les plages pour éviter que tous les ballons d’un secteur ne se mettent en chauffe à la même minute.</p>
<p>La ${h.src('creHc2025', 'CRE')} chiffre cette diversité : avant la réforme, sur 14,5 millions de foyers en option Heures creuses, 5,7 millions avaient leurs heures creuses partagées entre la nuit et la journée, et 8,8 millions uniquement la nuit. Les créneaux de jour étaient souvent mal placés, en début de matinée ou en début de soirée, d’où leur déplacement progressif vers l’après-midi.</p>

<h2>Le cas à part de Tempo</h2>
<p>Avec Tempo, la question ne se pose pas. Le ${h.src('creTempo2014', 'texte qui encadre l’option')} fixe huit heures creuses de 22 h à 6 h, partout, toute l’année. Ce qui varie, c’est la couleur du jour et donc le prix de ces heures. Un foyer en Tempo n’a pas d’horaire à vérifier, mais une couleur à surveiller : voir ${h.a('couleur-tempo-demain', 'la couleur Tempo de demain')}.</p>

<h2>Calculez ce que vaut un usage bien placé</h2>
<p>Un kWh consommé en heures creuses coûte ${h.kwh(h.P.hc.hc)} TTC au tarif réglementé, contre ${h.kwh(h.P.hc.hp)} en heures pleines. L’écart semble faible ; répété chaque jour, il ne l’est plus. Entrez ce que vous pouvez déplacer :</p>
<!--mini:decalageHc-->

<h2>Quels appareils programmer, et comment</h2>
<h3>Le ballon d’eau chaude</h3>
<p>C’est le plus gros usage programmable d’un logement sans chauffage électrique. La plupart des ballons sont reliés à un contacteur jour/nuit commandé par le compteur : en position automatique, ils chauffent pendant vos heures creuses, quelles qu’elles soient. Vérifiez la position du contacteur dans le tableau électrique : sur « marche forcée », le ballon chauffe en permanence et perd tout l’intérêt de l’option.</p>
<h3>Lave-linge, lave-vaisselle, sèche-linge</h3>
<p>Ils se programment avec leur départ différé. Réglez le départ pour que le cycle entier tienne dans la plage : un programme de deux heures lancé à la dernière heure creuse de la nuit finit en heures pleines. Si une partie de vos heures creuses tombe l’après-midi, c’est le meilleur moment pour un lave-linge, en présence de quelqu’un pour l’étendre.</p>
<h3>La recharge d’une voiture</h3>
<p>La voiture, la borne ou l’application du constructeur acceptent un horaire de charge. Réglez-le sur votre plage de nuit, en gardant une marge d’un quart d’heure au début et à la fin : l’horloge de la voiture et celle du compteur ne sont pas toujours synchronisées à la minute. Le guide ${h.a('recharge-voiture-tempo', 'recharger une voiture électrique')} compare le coût d’une charge selon l’option.</p>
<h3>Les prises et les radiateurs programmables</h3>
<p>Les prises minuteurs et les radiateurs à programmation ne connaissent que l’heure qu’on leur donne. Ce sont eux qu’il faut reprendre un par un quand vos plages changent. Notez-les quelque part : le jour où la lettre du fournisseur arrive, la liste est prête.</p>

<h2>Lire vos deux index pour mesurer votre part d’heures creuses</h2>
<p>Connaître ses plages ne suffit pas : encore faut-il savoir combien vous consommez dedans. La facture d’une option Heures creuses porte deux compteurs distincts, l’un pour les heures pleines, l’autre pour les heures creuses. Prenons une facture annuelle avec ${h.num(2600)} kWh en heures pleines et ${h.num(1400)} kWh en heures creuses : la part creuse vaut ${h.pct(1400 / 4000, 0)}. C’est ce chiffre, et non un pourcentage trouvé dans un article, qu’il faut entrer dans le comparateur.</p>
${h.table(['Index relevé', 'kWh sur un an', 'Prix TTC du kWh', 'Coût'], [
  ['Heures pleines', h.num(2600), h.kwh(h.P.hc.hp), h.eur(2600 * h.P.hc.hp)],
  ['Heures creuses', h.num(1400), h.kwh(h.P.hc.hc), h.eur(1400 * h.P.hc.hc)],
  ['Total consommation', h.num(4000), '', h.eur(2600 * h.P.hc.hp + 1400 * h.P.hc.hc)],
], 'Exemple de lecture, option Heures creuses au tarif du 1er août 2026, abonnement non compris.', ['l', 'r', 'r', 'r'])}
<p>Faites le même calcul sur deux factures, l’une d’hiver, l’autre d’été : si la part creuse chute l’été, c’est souvent qu’un appareil programmé à la main ne tombe plus dans vos plages. Sans facture annuelle, l’historique de consommation de votre espace client donne les mêmes deux totaux mois par mois.</p>

<h2>Les erreurs qui reviennent</h2>
<ul>
<li>Croire que les heures creuses commencent à 22 h pour tout le monde : c’est vrai en Tempo, rarement en option Heures creuses.</li>
<li>Oublier l’heure d’été et l’heure d’hiver sur une minuterie mécanique : le compteur, lui, change d’heure tout seul, la minuterie non, et l’écart d’une heure fait sortir un cycle de la plage.</li>
<li>Laisser le contacteur du ballon sur « marche forcée » après une intervention : le ballon chauffe alors aussi en heures pleines.</li>
<li>Programmer une machine pour qu’elle commence au début de la plage mais oublier sa durée : un séchage de trois heures déborde.</li>
<li>Se fier aux plages d’un ancien logement après un déménagement : elles appartiennent au compteur, pas à vous.</li>
</ul>

<h2>Quand vos horaires changent</h2>
<p>Dans le cadre de la réforme en cours, votre fournisseur doit vous prévenir au moins un mois à l’avance, et le changement se fait à distance par le compteur. Les appareils raccordés au contact du compteur suivent seuls ; ceux qui fonctionnent sur une horloge, non. Un appareil oublié continue de démarrer à l’ancienne heure, désormais pleine, et la différence se voit sur la facture suivante. Les règles, le calendrier et le coût d’une minuterie oubliée sont détaillés sur la page ${h.a('heures-creuses', 'nouvelles heures creuses')}.</p>

<h2>Vos heures creuses justifient-elles l’option ?</h2>
<p>L’option Heures creuses a le même abonnement que la Base au tarif réglementé depuis le 1er août 2026, mais son kWh en heures pleines est plus cher que celui de la Base. Elle ne gagne donc que si une part suffisante de votre consommation tombe réellement dans vos plages. Le ${h.a('comparateur', 'comparateur Base, Heures creuses ou Tempo')} fait le calcul avec votre part de consommation creuse, et le guide ${h.a('consommation-appareils', 'consommation des appareils')} aide à estimer ce que chaque appareil pèse.</p>`,
  },
  en: {
    slug: 'off-peak-hours-times',
    nav: 'Your off-peak hours times',
    card: 'Where to read your slots, why they differ from one address to the next, what to reprogram.',
    title: 'Off-Peak Hours Times 2026: Find and Read Your Own Slots',
    description: 'Off-peak hours times in France 2026: where to read your slots on the bill, the online account or the Linky meter, why they vary by address, what to reprogram.',
    h1: 'Off-peak hours times: how to find yours',
    intro: 'Your off-peak hours are not necessarily your neighbour’s, nor those quoted in an article online. Here is where to read them and what to do when they change.',
    resume: (h) => `There is no national timetable for off-peak hours (heures creuses) on the standard Off-peak option: each meter gets its own slots, set by Enedis, the distribution network operator, according to the load on the local grid, for a total of ${h.num(h.P.heures_creuses.heures_par_jour)} hours a day. Two homes on the same street can therefore have different windows, such as 22:00 to 06:00 for one and midnight to 07:00 plus 13:00 to 14:00 for the other. Your exact hours appear on your bill, in your supplier’s online account and, with a Linky smart meter, among the screens the meter scrolls through. They matter because the gap between a peak and an off-peak kWh reaches ${h.kwh(h.M.ecartHpHc())} on the regulated tariff of 1 August 2026: three kWh a day run at the wrong time cost ${h.eur(gain(h, 3))} a year. The Tempo option is the exception, with off-peak hours fixed by the tariff from 22:00 to 06:00 for everyone.`,
    faqs: (h) => [
      { q: 'Where are my off-peak hours shown on my bill?', a: 'In the section describing your contract or supply point, often under a heading such as « plages heures creuses » or « horaires heures creuses », with the exact time windows. The bill also lists the two meter readings, peak and off-peak. If the line is missing, your supplier’s online account shows the same slots in the contract details.' },
      { q: 'Does the Linky meter show my off-peak hours?', a: 'Yes. Pressing the Linky scroll buttons brings up the date, the time, the power being drawn and the consumption readings for each tariff period in turn. The reading that is moving tells you whether you are in peak or off-peak hours right now. Noting when the active reading switches in the evening gives you the start of your night slot.' },
      { q: 'Why aren’t my off-peak hours 22:00 to 06:00?', a: 'Because that window is only guaranteed on the Tempo option, whose tariff fixes off-peak hours at 22:00 to 06:00 throughout France. For the Off-peak option, Enedis places the eight hours according to network constraints at your address: they may start at 23:00 or midnight, or be split between the night and early afternoon. The price per kWh is the same whichever slot you have.' },
      { q: 'Will my water heater follow my new hours on its own?', a: 'Yes if it is wired to the meter’s off-peak contact: the Linky opens and closes that contact at your contract hours, and the heater switches on at the right time with no setting. No if it runs on a clock or a manually set timer: you will need to reprogram it when your supplier announces the new slots.' },
      { q: 'Can I choose my own off-peak hours?', a: 'Not on the Off-peak option of the regulated tariff: Enedis assigns them meter by meter and they cannot be negotiated. Some market offers have slots of their own, such as “super off-peak” hours at night or weekend rates. If a fixed timetable matters to you, the Tempo option guarantees 22:00 to 06:00, at the cost of red days in winter.' },
      { q: 'How much does running the washing machine off-peak save?', a: `It depends on the kWh you move. Each kWh shifted from peak to off-peak saves ${h.kwh(h.M.ecartHpHc())} on the August 2026 regulated tariff. For a 1 kWh cycle, a figure to check on your machine’s energy label, run every day at night rather than in the evening, the saving reaches ${h.eur(gain(h, 1))} a year. The mini calculator on this page runs the sum with your own figures.` },
    ],
    body: (h) => `
<h2>Three places to read your slots</h2>
<p>The simplest is your <strong>bill</strong>. It repeats the details of your supply point: subscribed power, tariff option and, for the Off-peak option, the exact windows assigned by Enedis. The same information sits in your supplier’s <strong>online account</strong>, in the contract details; that is often where it shows up first when it changes.</p>
<p>The third source is in your home: the <strong>Linky meter</strong>. Its scroll buttons bring up several screens, including the consumption readings for each period. The reading that is moving belongs to the current period. Checking the meter just before and just after the time you think your slot starts confirms the real timing, something no article or neighbour can do for you.</p>
<p>Enedis’s own online area gives access to your consumption curve, but ${h.src('enedisHc', 'Enedis itself points you')} to your supplier and your bill for the times. If two sources disagree, the contract is what counts.</p>

<h2>Why your hours differ from your neighbour’s</h2>
<p>Off-peak hours have never been a national timetable. From the start the network operator placed them where local demand was lowest. The substation feeding your district does not carry the same load as the next town’s: a business park busy at noon, an all-electric village in the evening, a town where street lighting and water heaters come on together. Enedis therefore spreads the slots so that every water heater in an area does not switch on in the same minute.</p>
<p>The ${h.src('creHc2025', 'regulator')} puts figures on this variety: before the reform, of 14.5 million homes on the Off-peak option, 5.7 million had their off-peak hours split between night and day, and 8.8 million had them at night only. Daytime windows were often badly placed, early in the morning or early in the evening, which is why they are gradually moving to the afternoon.</p>

<h2>Tempo, a case apart</h2>
<p>On Tempo the question does not arise. The ${h.src('creTempo2014', 'text that frames the option')} sets eight off-peak hours from 22:00 to 06:00, everywhere, all year. What varies is the colour of the day and so the price of those hours. A Tempo household has no timetable to check, only a colour to watch: see ${h.a('couleur-tempo-demain', 'tomorrow’s Tempo colour')}.</p>

<h2>Work out what a well-timed load is worth</h2>
<p>A kWh used off-peak costs ${h.kwh(h.P.hc.hc)} including tax on the regulated tariff, against ${h.kwh(h.P.hc.hp)} at peak. The gap looks small; repeated every day, it is not. Enter what you could move:</p>
<!--mini:decalageHc-->

<h2>Which appliances to schedule, and how</h2>
<h3>The water heater</h3>
<p>It is the largest programmable use in a home without electric heating. Most water heaters (ballons d’eau chaude) are connected to a day/night switch driven by the meter: set to automatic, they heat during your off-peak hours, whatever those are. Check the switch position in the fuse box: on “marche forcée”, forced on, the heater runs all the time and the option loses its point.</p>
<h3>Washing machine, dishwasher, tumble dryer</h3>
<p>Use their delayed start. Set it so the whole cycle fits inside the slot: a two-hour programme started in the last off-peak hour of the night finishes at peak. If part of your off-peak hours falls in the afternoon, that is the best time for a wash, with someone around to hang it out.</p>
<h3>Charging a car</h3>
<p>The car, the wall box or the manufacturer’s app all accept a charging schedule. Set it to your night slot with a quarter of an hour’s margin at each end: the car’s clock and the meter’s are not always in step to the minute. The guide ${h.a('recharge-voiture-tempo', 'charging an electric car')} compares the cost of a charge by option.</p>
<h3>Timer plugs and programmable radiators</h3>
<p>Timer plugs and programmable radiators only know the time they are given. They are the ones to go through one by one when your slots change. Keep a list: the day your supplier’s letter arrives, it is ready.</p>

<h2>Read your two meter readings to measure your off-peak share</h2>
<p>Knowing your slots is not enough: you also need to know how much you use inside them. An Off-peak option bill carries two separate registers, one for peak hours, one for off-peak hours. Take an annual bill with ${h.num(2600)} kWh at peak and ${h.num(1400)} kWh off-peak: the off-peak share is ${h.pct(1400 / 4000, 0)}. That figure, rather than a percentage read in an article, is the one to enter in the comparison tool.</p>
${h.table(['Reading', 'kWh over a year', 'Price per kWh incl. tax', 'Cost'], [
  ['Peak hours', h.num(2600), h.kwh(h.P.hc.hp), h.eur(2600 * h.P.hc.hp)],
  ['Off-peak hours', h.num(1400), h.kwh(h.P.hc.hc), h.eur(1400 * h.P.hc.hc)],
  ['Total consumption', h.num(4000), '', h.eur(2600 * h.P.hc.hp + 1400 * h.P.hc.hc)],
], 'Reading example, Off-peak option on the 1 August 2026 tariff, standing charge not included.', ['l', 'r', 'r', 'r'])}
<p>Do the same sum on two bills, one from winter and one from summer: if the off-peak share drops in summer, a manually timed appliance has often slipped out of your slots. Without an annual bill, the consumption history in your online account gives the same two totals month by month.</p>

<h2>Mistakes that keep coming up</h2>
<ul>
<li>Assuming off-peak hours start at 22:00 for everyone: true on Tempo, rarely on the Off-peak option.</li>
<li>Forgetting the clock change on a mechanical timer: the meter switches between summer and winter time by itself, the timer does not, and an hour’s drift pushes a cycle out of the slot.</li>
<li>Leaving the water heater switch on “marche forcée” after a repair: the heater then also runs at peak.</li>
<li>Setting an appliance to start at the beginning of the slot but forgetting how long it runs: a three-hour drying cycle overruns.</li>
<li>Relying on the slots of a previous home after moving: they belong to the meter, not to you.</li>
</ul>

<h2>If you have just moved to France</h2>
<p>Newcomers often bring habits from another country where night rates start at a fixed time for everyone. In France the timetable belongs to the meter (compteur) at your address, and the contract that goes with it is in the name of whoever holds the electricity account, often you as tenant. When you open the account, ask the supplier for the off-peak slots of the supply point, or read them on the first bill. If the water heater sits in a shared cupboard or a basement, check that it is wired to your own meter’s contact and not on a separate timer left by the previous occupant.</p>

<h2>When your hours change</h2>
<p>Under the reform now under way, your supplier must warn you at least a month ahead, and the change is made remotely through the meter. Appliances wired to the meter contact follow by themselves; those running on a clock do not. A forgotten appliance keeps starting at the old time, now a peak hour, and the difference shows on the next bill. The rules, the timetable and the cost of a forgotten timer are on the ${h.a('heures-creuses', 'new off-peak hours')} page.</p>

<h2>Do your off-peak hours justify the option?</h2>
<p>The Off-peak option has carried the same standing charge as Base on the regulated tariff since 1 August 2026, but its peak kWh is dearer than the Base kWh. It only wins if enough of your use really falls inside your slots. The ${h.a('comparateur', 'Base, Off-peak or Tempo comparison')} works it out with your off-peak share, and the guide ${h.a('consommation-appareils', 'appliance consumption')} helps estimate what each appliance weighs.</p>`,
  },
});
