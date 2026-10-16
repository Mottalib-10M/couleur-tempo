/**
 * « Base, Heures creuses ou Tempo : quelle option me coûte le moins ? » Moteur : lib/engine/compare.ts.
 * Premier rendu = valeurs par défaut ; un lien partagé n'est lu qu'après hydratation (RECETTE §17.5).
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import StackedBar from '../ui/StackedBar';
import { P, comparer, partChauffage, majorationHT, PUISSANCES, type Option, type Compteur } from '../../lib/engine/index';
import { readParams, num, str, updateURL } from '../../lib/url-state';
import { Shell, Row2, Head, Rows, Note, MethodLink, eur, type L } from '../calc/kit';
import { formatNumber, formatPercent } from '../../lib/format';
import { FOND, NOM } from './ui';

const T_ = P.taxes; const fr2 = (x: number) => x.toFixed(2).replace('.', ',');
const TX = {
  fr: { kwh: 'Consommation annuelle', kwhHelp: 'Sur votre facture ou votre espace client, en kWh', kva: 'Puissance du compteur', chauf: 'Chauffage électrique', non: 'Non', oui: 'Oui', ete: 'Consommation d’un mois d’été', eteHelp: 'Sert à isoler la part du chauffage', hc: 'Part consommée en heures creuses', hcHelp: 'Facture Heures creuses : index HC ÷ total', cpt: 'Compteur', cptOpt: { linky: 'Linky, relevé à distance', sansLinky: `Sans Linky (+${fr2(T_.majoration_sans_linky_an_ht)} € HT/an)`, sansIndex: `Aucun index transmis depuis 12 mois (+${fr2(T_.majoration_sans_index_an_ht)} € HT/an)`, autoprod: `Autoproducteur avec injection (+${fr2(T_.majoration_autoproducteur_an_ht)} € HT/an)` }, maj: (x: string) => `Majoration de l’abonnement incluse : ${x} TTC par an, la même pour les trois options.`, eff: 'Les jours rouges, vous reportez', effOpt: ['Rien', 'Un quart des heures pleines', 'La moitié', 'Les trois quarts'], best: 'Option la moins chère', perYear: 'par an, abonnement compris', vs: 'Économie face à l’option la plus chère', base: 'Base', hcName: 'Heures creuses', tempo: 'Tempo', na3: 'non proposée en 3 kVA', ext: 'Base fermée aux nouveaux contrats au-delà de 6 kVA', split: 'Votre consommation Tempo par couleur', redCost: 'Dont jours rouges', hyp: (h: string) => `Hypothèses : part du chauffage ${h}, répartie comme la consommation de chauffage nationale des saisons Tempo passées (RTE) ; tarif réglementé du 1er août 2026.`, kva_: 'kVA' },
  en: { kwh: 'Annual consumption', kwhHelp: 'On your bill or customer account, in kWh', kva: 'Meter power', chauf: 'Electric heating', non: 'No', oui: 'Yes', ete: 'Consumption in one summer month', eteHelp: 'Used to isolate the heating share', hc: 'Share used in off-peak hours', hcHelp: 'Off-peak bill: off-peak reading ÷ total', cpt: 'Meter', cptOpt: { linky: 'Linky, read remotely', sansLinky: `No Linky (+€${T_.majoration_sans_linky_an_ht.toFixed(2)} excl. VAT a year)`, sansIndex: `No reading sent for 12 months (+€${T_.majoration_sans_index_an_ht.toFixed(2)} excl. VAT a year)`, autoprod: `Self-producer feeding the grid (+€${T_.majoration_autoproducteur_an_ht.toFixed(2)} excl. VAT a year)` }, maj: (x: string) => `Standing charge surcharge included: ${x} incl. VAT a year, the same for all three options.`, eff: 'On red days you shift', effOpt: ['Nothing', 'A quarter of peak use', 'Half', 'Three quarters'], best: 'Cheapest option', perYear: 'a year, standing charge included', vs: 'Saving against the dearest option', base: 'Base', hcName: 'Off-peak (HP/HC)', tempo: 'Tempo', na3: 'not offered at 3 kVA', ext: 'Base closed to new contracts above 6 kVA', split: 'Your Tempo consumption by colour', redCost: 'Of which red days', hyp: (h: string) => `Assumptions: heating share ${h}, spread like national heating demand over past Tempo seasons (RTE); regulated tariff of 1 August 2026.`, kva_: 'kVA' },
};

export default function CompareCalc({ lang = 'fr', methodHref, id = 'comparateur' }: { lang?: L; methodHref?: string; id?: string }) {
  const t = TX[lang]; const $ = (x: number) => eur(x, lang); const sep = lang === 'fr' ? '\u00a0: ' : ': ';
  const [kwh, setKwh] = useState(8000); const [kva, setKva] = useState('9'); const [ch, setCh] = useState('1');
  const [ete, setEte] = useState(350); const [hc, setHc] = useState(35); const [eff, setEff] = useState('0'); const [cpt, setCpt] = useState<Compteur>('linky');
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return;
    setKwh(num(u, 'kwh', 8000)); setKva(str(u, 'kva', '9')); setCh(str(u, 'ch', '1')); setEte(num(u, 'ete', 350)); setHc(num(u, 'hc', 35)); setEff(str(u, 'eff', '0')); const c = str(u, 'cpt', 'linky'); if (['linky', 'sansLinky', 'sansIndex', 'autoprod'].includes(c)) setCpt(c as Compteur); }, []);
  useEffect(() => { updateURL({ kwh, kva, ch, ete, hc, eff, ...(cpt !== 'linky' ? { cpt } : {}) }); }, [kwh, kva, ch, ete, hc, eff, cpt]);
  const chauffage = ch === '1' ? partChauffage(kwh, ete) : 0;
  const maj = majorationHT(cpt);
  const r = useMemo(() => comparer({ kwh, kva: Number(kva), chauffage, partHC: hc / 100, effortRouge: Number(eff) / 4, majorationHT: maj }), [kwh, kva, chauffage, hc, eff, maj]);
  const name: Record<Option, string> = { base: t.base, hc: t.hcName, tempo: t.tempo };
  const tempo = r.lignes.find((l) => l.o === 'tempo')!;
  const red = tempo.tempo?.find((x) => x.c === 'R');
  const rows: Array<[string, string, boolean]> = r.lignes.map((l) => [
    `${name[l.o]}${l.extinction ? ' *' : ''}`,
    l.dispo ? $(l.total) : t.na3,
    l.dispo && l.o === r.meilleure.o,
  ]);
  return (
    <Shell id={id} form={<>
      <Row2>
        <NumberField id={`${id}-kwh`} label={t.kwh} value={kwh} onChange={setKwh} unit="kWh" max={100000} help={t.kwhHelp} lang={lang} />
        <SelectField id={`${id}-kva`} label={t.kva} value={kva} onChange={setKva} options={PUISSANCES.map((p) => ({ value: String(p), label: `${p} ${t.kva_}` }))} />
      </Row2>
      <Row2>
        <Toggle id={`${id}-ch`} label={t.chauf} value={ch} onChange={setCh} options={[{ value: '0', label: t.non }, { value: '1', label: t.oui }]} />
        {ch === '1'
          ? <NumberField id={`${id}-ete`} label={t.ete} value={ete} onChange={setEte} unit="kWh" max={20000} help={t.eteHelp} lang={lang} />
          : <div />}
      </Row2>
      <Row2>
        <NumberField id={`${id}-hc`} label={t.hc} value={hc} onChange={setHc} unit="%" max={100} help={t.hcHelp} lang={lang} />
        <SelectField id={`${id}-eff`} label={t.eff} value={eff} onChange={setEff} options={t.effOpt.map((x, i) => ({ value: String(i), label: x }))} />
      </Row2>
      <SelectField id={`${id}-cpt`} label={t.cpt} value={cpt} onChange={(v) => setCpt(v as Compteur)} options={(Object.keys(t.cptOpt) as Compteur[]).map((k) => ({ value: k, label: t.cptOpt[k] }))} />
    </>} result={<>
      <Head label={`${t.best}${sep}${name[r.meilleure.o]}`} value={$(r.meilleure.total)} sub={`${t.perYear} · ${t.vs}${sep}${$(r.ecart)}`} />
      <Rows rows={rows} />
      {r.lignes.some((l) => l.extinction) && <p className="mt-1 text-xs text-navy-600">* {t.ext}</p>}
      {tempo.tempo && <div className="mt-4">
        <p className="mb-2 text-sm font-medium text-navy-700">{t.split}</p>
        <StackedBar ariaPrefix={t.split} total={kwh} segments={tempo.tempo.map((x) => ({ label: `${NOM[lang][x.c]} ${formatNumber(x.kwh, 0, lang)} kWh`, value: x.kwh, color: x.c === 'W' ? '#cbd5e1' : FOND[x.c] }))} />
        {red && <p className="mt-2 text-sm text-navy-700">{t.redCost}{sep}{$(red.cout)} ({formatNumber(red.kwh, 0, lang)} kWh)</p>}
      </div>}
      {maj > 0 && <p className="mt-2 text-sm text-navy-700">{t.maj(eur(maj * 1.2, lang, 2))}</p>}
      <Note>{t.hyp(formatPercent(chauffage, 0, lang))}</Note>
      <MethodLink href={methodHref} lang={lang} />
    </>} />
  );
}
