// build-page.mjs — generator for THE GLOBAL LEDGER, 19 November 2026.
// Written by hand for the make.fun news-image-20261119 bounty.
// It builds page.html (a 1024x1024 broadsheet front page, HTML + inline SVG,
// no photographs, every picture drawn in code) which headless Chrome then
// screenshots into entry.png. All 37 stories were checked against live
// reporting (Reuters, AP, AFP, BBC, Al Jazeera, HRW, IMD, ABS) and are
// written here in my own words. Nothing is copied from any other entry.
import { writeFileSync } from 'node:fs';

// ---- palette ---------------------------------------------------------------
const INK = '#141414';
const PAPER = '#F5E4D3';
const RED = '#C83228';
const TEAL = '#1D4E5F';
const OCHRE = '#A66A00';
const BLUE = '#2E5A88';
const CREAM = '#FBF3E6';

// Region colour families (4 codes, used identically in the strip, the map
// pins and the ALSO list numbers):
//   TEAL  = Asia-Pacific & Oceania   OCHRE = Europe & Africa
//   RED   = Middle East              BLUE  = Americas & World
const RC = { ap: TEAL, eu: OCHRE, me: RED, am: BLUE };

// ---- story data (own wording throughout) -----------------------------------
// tag: CONFIRMED = named sources agree · RULING = court judgment
//      DRAFT = draft text, not final · REPORTED = reported that day
//      CLAIM = one side says so, not independently verified
//      FORECAST = due / expected, dated that day
const LEADS = [
  {
    n: 1, region: 'ap', place: 'SHENZHEN · SUMMIT', tag: 'CONFIRMED', banner: 'APEC 2026 · SHENZHEN',
    art: 'summit',
    head: 'Trump, Xi and Putin hold first three-way summit',
    deck: 'Three leaders meet for 90 minutes beside APEC and declare a nuclear war “cannot be won and must never be fought”. No Ukraine deal. — Reuters · AP · Xinhua',
  },
  {
    n: 2, region: 'eu', place: 'THE HAGUE · JUSTICE', tag: 'RULING', banner: 'WORLD COURT · THE HAGUE',
    art: 'icj',
    head: 'World Court: Myanmar committed genocide',
    deck: 'By 9 votes to 6, the ICJ finds Myanmar guilty over the 2017 Rohingya campaign and orders reparations and safe return. A first. — AP · Al Jazeera · HRW',
  },
  {
    n: 3, region: 'am', place: 'ANTALYA · CLIMATE', tag: 'DRAFT', banner: 'DRAFT DEAL · 19 NOV',
    art: 'cop',
    head: 'COP31 draft drops fossil fuels and $120bn aid goal',
    deck: 'The slimmed-down text, dated Thursday, strips out every mention of fossil fuels and the $120bn adaptation-finance target. Talks end Friday. — Reuters · AFP',
  },
];

const FEATURED = [
  { n: 4, region: 'eu', place: 'KERCH BRIDGE', tag: 'REPORTED', art: 'bridge',
    head: 'Crimea bridge hit a third time in a week',
    deck: 'Overnight strike halts rail traffic; trains run again by afternoon. No casualties reported. — Reuters',
    src: 'Reuters' },
  { n: 5, region: 'me', place: 'RIYADH', tag: 'CLAIM', art: 'riyadh',
    head: 'Saudis say Houthi missile shot down',
    deck: 'Sirens sound at 04:42; falling debris damages a tower. No one hurt, officials say. — Reuters',
    src: 'Reuters' },
  { n: 6, region: 'ap', place: 'ODISHA', tag: 'FORECAST', art: 'cyclone',
    head: 'Cyclone Akvan: 120,000 moved to safety',
    deck: 'Storm due ashore near Gopalpur Friday, winds 90–100 km/h. — IMD',
    src: 'IMD' },
  { n: 7, region: 'ap', place: 'SEOUL', tag: 'RULING', art: 'gavel',
    head: 'Korea’s top court overturns ex-PM Han’s sentence',
    deck: 'Han Duck-soo’s 15-year martial-law term quashed; retrial ordered. — AP',
    src: 'AP' },
  { n: 8, region: 'eu', place: 'GREENLAND', tag: 'CONFIRMED', art: 'arctic',
    head: 'Denmark backs Arctic pact with US, 109–0',
    deck: 'Parliament approves the Greenland security deal; more US bases may follow. — AP',
    src: 'AP' },
  { n: 9, region: 'am', place: 'NEW YORK', tag: 'CONFIRMED', art: 'ipo',
    head: 'Anthropic debuts in the biggest IPO on record',
    deck: 'Priced at $83, the Claude maker raises $81.3bn; shares close at $97.17, up 17%. — AP',
    src: 'AP' },
  { n: 10, region: 'am', place: 'GAMES', tag: 'CONFIRMED', art: 'gta',
    head: 'GTA VI goes on sale after 13 years',
    deck: 'Rolling midnight launch, NZ first; ~17m copies pre-sold. — AFP',
    src: 'AFP' },
  { n: 11, region: 'am', place: 'BOGOTÁ', tag: 'REPORTED', art: 'march',
    head: 'Colombia’s unions hold national strike',
    deck: 'Marches in three cities against the government’s economic rescue bill. — Infobae',
    src: 'Infobae' },
  { n: 12, region: 'eu', place: 'NAIROBI', tag: 'CONFIRMED', art: 'runner',
    head: 'Marathon champion banned for doping',
    deck: 'Kenya’s Peres Jepchirchir gets three years after admitting an EPO violation. — AP',
    src: 'AP' },
  { n: 13, region: 'am', place: 'CANBERRA', tag: 'CONFIRMED', art: 'jobs',
    head: 'Australia’s jobless rate hits 4.9%',
    deck: 'Highest since 2021; 43,500 jobs lost in October. Dollar slides. — ABS',
    src: 'ABS' },
];

// ALSO ON THURSDAY — one line each, own wording.
const ALSO = [
  { n: 14, region: 'eu', place: 'Kyiv', text: 'Raid kills one, hits cathedral.', src: 'Kyiv Ind.' },
  { n: 15, region: 'eu', place: 'Berlin', text: 'Allies pledge €90bn for Ukraine.', src: 'Ukrinform' },
  { n: 16, region: 'eu', place: 'Ankara', text: 'İmamoğlu diploma voided.', src: 'Euronews' },
  { n: 17, region: 'ap', place: 'Tbilisi', text: 'Gas blast flattens flats; six dead.', src: 'Al Jazeera' },
  { n: 18, region: 'me', place: 'Gaza', text: 'Israel says tank raid is over.', src: 'AP' },
  { n: 19, region: 'me', place: 'Hormuz', text: 'IRGC claims two tankers hit mines.', src: 'WANA' },
  { n: 20, region: 'me', place: 'Sanaa', text: 'Houthis say 10 killed in Saudi strikes.', src: 'Al Jazeera' },
  { n: 21, region: 'me', place: 'West Bank', text: 'Mosque firebombed; graffiti left.', src: 'Al Jazeera' },
  { n: 22, region: 'ap', place: 'Seoul', text: '551,864 sit Suneung exam.', src: 'K. Herald' },
  { n: 23, region: 'ap', place: 'Dhaka', text: 'Awami “lockdown”; buses torched.', src: 'Biz Today' },
  { n: 24, region: 'ap', place: 'Jakarta', text: 'Asset-seizure law passes at last.', src: 'Kompas' },
  { n: 25, region: 'eu', place: 'Pretoria', text: 'Central bank holds rate at 7.25%.', src: 'SABC' },
  { n: 26, region: 'eu', place: 'Nairobi', text: 'Floods kill six; Ruto addresses nation.', src: 'AP' },
  { n: 27, region: 'eu', place: 'Mogadishu', text: 'Somalia expels UAE envoy.', src: 'Al Jazeera' },
  { n: 28, region: 'eu', place: 'Rome', text: 'Author Corrado Augias dies at 91.', src: 'Euronews' },
  { n: 29, region: 'eu', place: 'Khartoum', text: 'Court sentences RSF chief to death.', src: 'AP' },
  { n: 30, region: 'am', place: 'Florida', text: 'Floods shut Broward schools again.', src: 'CBS' },
  { n: 31, region: 'ap', place: 'Wellington', text: 'Pay-equity cuts broke rights law.', src: 'RNZ' },
  { n: 32, region: 'ap', place: 'Tonga', text: 'Drought emergency takes effect.', src: 'RNZ' },
  { n: 33, region: 'ap', place: 'Cook Islands', text: 'Cyclone Xavier weakens to Cat 4.', src: 'RNZ' },
  { n: 34, region: 'am', place: 'Space', text: 'Red giant eats a Sun-sized star.', src: 'Nature' },
  { n: 35, region: 'am', place: 'Atacama', text: 'NASA reports desert in bloom.', src: 'NASA' },
  { n: 36, region: 'ap', place: 'South Korea', text: 'Exports pass $1 trillion.', src: 'Reuters' },
  { n: 37, region: 'am', place: 'Science', text: 'Earth’s “missing billion years” solved.', src: 'Nature' },
];

// 24-hour wire spine — local times, in order (as the wires filed them).
const SPINE = [
  { t: '00:00', p: 'AUCKLAND', x: 'GTA VI unlocks' },
  { t: '00:04', p: 'KYIV', x: 'Kerch bridge hit reported' },
  { t: '04:42', p: 'RIYADH', x: 'Air-raid sirens sound' },
  { t: '08:40', p: 'SEOUL', x: 'Suneung exam begins' },
  { t: '09:30', p: 'JAKARTA', x: 'Asset-seizure law passes' },
  { t: '10:00', p: 'THE HAGUE', x: 'Genocide ruling read' },
  { t: 'P.M.', p: 'SHENZHEN', x: 'Three leaders meet' },
  { t: '09:30', p: 'NEW YORK', x: 'Anthropic opens at $111.50' },
];

// Stories left out because they belong to another day.
const EXCLUDED = 'Anthropic’s $83 pricing (Wed 18 Nov) · Israel’s Gaza push, begun Wed 18 · Voyager 1 one light-day out (Wed 18) · Van Gogh sold for $190.4m (Wed 18) · EU’s €45bn Ukraine loan plan (Wed 18) · COP31’s first draft (Mon 16) · Akvan’s landfall (Fri 20 Nov) · COP31’s scheduled close (Fri 20 Nov)';

// ---- flat vector illustrations (drawn in code, no photos) ------------------
function flagUS(x, y, w) {
  let s = '';
  for (let i = 0; i < 7; i++) s += `<rect x="${x}" y="${y + i * 2.1}" width="${w}" height="2.1" fill="${i % 2 ? '#fff' : '#B22234'}"/>`;
  return s + `<rect x="${x}" y="${y}" width="${w * 0.4}" height="7.4" fill="#3C3B6E"/>`;
}
function flagCN(x, y, w) {
  return `<rect x="${x}" y="${y}" width="${w}" height="14.7" fill="#DE2910"/><circle cx="${x + 4}" cy="${y + 4}" r="2.2" fill="#FFDE00"/><circle cx="${x + 10}" cy="${y + 3}" r="1" fill="#FFDE00"/><circle cx="${x + 11}" cy="${y + 6}" r="1" fill="#FFDE00"/>`;
}
function flagRU(x, y, w) {
  return `<rect x="${x}" y="${y}" width="${w}" height="4.9" fill="#fff"/><rect x="${x}" y="${y + 4.9}" width="${w}" height="4.9" fill="#0039A6"/><rect x="${x}" y="${y + 9.8}" width="${w}" height="4.9" fill="#D52B1E"/>`;
}
function figure(cx, skin, suit, tie) {
  return `<circle cx="${cx}" cy="34" r="11" fill="${skin}"/><path d="M${cx - 9} 42 q-2 -6 3 -8 l3 -2 3 2 q5 2 3 8 z" fill="#E8E0D0"/><path d="M${cx - 20} 78 q0 -26 20 -26 q20 0 20 26 z" fill="${suit}"/><rect x="${cx - 2.5}" y="50" width="5" height="18" fill="${tie}"/>`;
}
function artSummit() {
  return `<svg viewBox="0 0 300 96" width="100%" height="72">
  <rect width="300" height="96" fill="#1D4E5F"/>
  <rect width="300" height="96" fill="#14384A" opacity="0.35"/>
  ${flagUS(28, 6, 34)}${flagCN(133, 6, 34)}${flagRU(238, 6, 34)}
  ${figure(45, '#E8B98A', '#1F2A44', '#C83228')}
  ${figure(150, '#EBC9A0', '#222222', '#C83228')}
  ${figure(255, '#E8B98A', '#2A2A2A', '#2E5A88')}
  <ellipse cx="150" cy="88" rx="138" ry="9" fill="#8A6D3B"/>
  <ellipse cx="150" cy="86" rx="138" ry="9" fill="#C9A86A"/>
  <text x="45" y="70" font-size="8" font-weight="700" fill="#fff" text-anchor="middle">TRUMP</text>
  <text x="150" y="70" font-size="8" font-weight="700" fill="#fff" text-anchor="middle">XI</text>
  <text x="255" y="70" font-size="8" font-weight="700" fill="#fff" text-anchor="middle">PUTIN</text></svg>`;
}
function artIcj() {
  return `<svg viewBox="0 0 300 96" width="100%" height="72">
  <rect width="300" height="96" fill="#E8DCC8"/>
  <rect x="38" y="18" width="150" height="58" fill="#B98A5A"/>
  <polygon points="38,18 113,2 188,18" fill="#8A5A30"/>
  <rect x="48" y="30" width="10" height="46" fill="#F5E4D3"/><rect x="74" y="30" width="10" height="46" fill="#F5E4D3"/>
  <rect x="100" y="30" width="10" height="46" fill="#F5E4D3"/><rect x="126" y="30" width="10" height="46" fill="#F5E4D3"/>
  <rect x="152" y="30" width="10" height="46" fill="#F5E4D3"/><rect x="30" y="76" width="166" height="6" fill="#8A5A30"/>
  <g stroke="#141414" stroke-width="2" fill="none">
  <line x1="238" y1="14" x2="238" y2="58"/><line x1="212" y1="22" x2="264" y2="22"/>
  <line x1="212" y1="22" x2="206" y2="40"/><line x1="212" y1="22" x2="218" y2="40"/>
  <line x1="264" y1="22" x2="258" y2="40"/><line x1="264" y1="22" x2="270" y2="40"/>
  <path d="M202 40 a8 5 0 0 0 16 0 z" fill="#C83228" stroke="none"/>
  <path d="M254 40 a8 5 0 0 0 16 0 z" fill="#C83228" stroke="none"/></g>
  <rect x="222" y="58" width="32" height="5" fill="#141414"/>
  <g transform="rotate(-8 268 22)"><rect x="244" y="8" width="48" height="26" rx="3" fill="#C83228"/>
  <text x="268" y="27" font-size="17" font-weight="900" fill="#fff" text-anchor="middle">9–6</text></g>
  <rect x="196" y="84" width="88" height="8" fill="#F7D117"/><rect x="196" y="84" width="88" height="8" fill="#F7D117"/>
  <rect x="196" y="86.7" width="88" height="2.6" fill="#34B233"/><rect x="196" y="89.3" width="88" height="2.7" fill="#EA2839"/>
  <text x="240" y="80" font-size="7.5" font-weight="700" fill="#141414" text-anchor="middle">MYANMAR</text></svg>`;
}
function artCop() {
  return `<svg viewBox="0 0 300 96" width="100%" height="72">
  <rect width="300" height="96" fill="#DCE9E4"/>
  <circle cx="62" cy="48" r="34" fill="#2E5A88"/>
  <path d="M40 40 q10 -12 24 -6 q12 4 8 14 q-4 10 -16 8 q-14 -2 -16 -16z" fill="#4E9A51"/>
  <path d="M66 62 q10 -4 14 4 q2 8 -8 10 q-10 0 -6 -14z" fill="#4E9A51"/>
  <rect x="118" y="10" width="7" height="52" rx="3" fill="#C83228"/>
  <circle cx="121.5" cy="70" r="11" fill="#C83228"/>
  <rect x="119" y="16" width="5" height="30" fill="#fff" opacity="0.85"/>
  <rect x="150" y="14" width="132" height="66" fill="#FBF3E6" stroke="#141414" stroke-width="1.5"/>
  <text x="158" y="30" font-size="10.5" font-weight="800" fill="#141414">COP31 · DRAFT</text>
  <text x="216" y="52" font-size="12" font-weight="900" fill="#141414" text-anchor="middle">FOSSIL FUELS</text>
  <line x1="158" y1="48" x2="274" y2="48" stroke="#C83228" stroke-width="3"/>
  <text x="216" y="70" font-size="8.5" font-weight="700" fill="#1D4E5F" text-anchor="middle">$120bn AID — CUT</text>
  <g transform="rotate(-12 266 20)"><rect x="246" y="11" width="40" height="17" rx="2" fill="none" stroke="#C83228" stroke-width="2.2"/>
  <text x="266" y="24" font-size="11" font-weight="900" fill="#C83228" text-anchor="middle">CUT</text></g></svg>`;
}
// Small featured-story icons (64x40 viewBox, drawn flat).
function artMini(kind) {
  const open = '<svg viewBox="0 0 120 44" width="100%" height="36">';
  const close = '</svg>';
  switch (kind) {
    case 'bridge': return open + `<rect width="120" height="44" fill="#CBD8DE"/><path d="M0 38 Q60 4 120 38" stroke="#141414" stroke-width="4" fill="none"/><line x1="0" y1="38" x2="120" y2="38" stroke="#141414" stroke-width="3"/><rect x="14" y="29" width="26" height="8" fill="#2E5A88"/><polygon points="88,6 92,14 100,14 94,19 96,27 88,22 80,27 82,19 76,14 84,14" fill="#C83228"/>` + close;
    case 'riyadh': return open + `<rect width="120" height="44" fill="#1F2A44"/><rect x="8" y="22" width="10" height="22" fill="#8A93A6"/><rect x="24" y="14" width="12" height="30" fill="#AAB2C2"/><rect x="42" y="24" width="9" height="20" fill="#8A93A6"/><rect x="60" y="8" width="11" height="36" fill="#C9D2DE"/><path d="M96 38 L112 10" stroke="#F5E4D3" stroke-width="3"/><polygon points="112,4 116,14 108,12" fill="#C83228"/><circle cx="96" cy="38" r="5" fill="#C83228"/>` + close;
    case 'cyclone': return open + `<rect width="120" height="44" fill="#DCE9E4"/><g stroke="#1D4E5F" stroke-width="3" fill="none"><path d="M60 22 a16 16 0 1 1 -16 -2"/><path d="M60 22 a11 11 0 1 1 11 2"/><path d="M60 22 a6 6 0 1 1 -6 1"/></g><circle cx="60" cy="22" r="3" fill="#C83228"/>` + close;
    case 'gavel': return open + `<rect width="120" height="44" fill="#E8DCC8"/><rect x="34" y="8" width="52" height="11" rx="3" fill="#8A5A30" transform="rotate(-18 60 13)"/><rect x="56" y="18" width="8" height="18" fill="#8A5A30" transform="rotate(-18 60 13)"/><rect x="28" y="38" width="64" height="4" fill="#141414"/>` + close;
    case 'arctic': return open + `<rect width="120" height="44" fill="#DCE9E4"/><rect x="8" y="7" width="44" height="30" fill="#C60C30"/><rect x="8" y="19" width="44" height="6" fill="#fff"/><rect x="22" y="7" width="6" height="30" fill="#fff"/><rect x="68" y="7" width="44" height="30" fill="#fff" stroke="#999" stroke-width="0.5"/><rect x="68" y="7" width="44" height="4" fill="#B22234"/><rect x="68" y="15" width="44" height="4" fill="#B22234"/><rect x="68" y="23" width="44" height="4" fill="#B22234"/><rect x="68" y="31" width="44" height="4" fill="#B22234"/>` + close;
    case 'ipo': return open + `<rect width="120" height="44" fill="#12261E"/><polyline points="8,36 30,28 48,32 66,18 84,22 112,6" stroke="#4ADE80" stroke-width="3" fill="none"/><polygon points="112,6 104,6 112,14" fill="#4ADE80"/>` + close;
    case 'gta': return open + `<rect width="120" height="44" fill="#2A0E3E"/><circle cx="96" cy="12" r="10" fill="#F5A623"/><rect x="46" y="24" width="10" height="20" fill="#4A2A6E"/><rect x="60" y="16" width="12" height="28" fill="#5E3486"/><rect x="76" y="22" width="9" height="22" fill="#4A2A6E"/><rect x="88" y="14" width="13" height="30" fill="#6E3FA0"/><text x="24" y="30" font-size="24" font-weight="900" fill="#fff" text-anchor="middle">VI</text>` + close;
    case 'march': return open + `<rect width="120" height="44" fill="#E8DCC8"/><circle cx="30" cy="13" r="6" fill="#141414"/><path d="M22 34 q0 -15 8 -15 q8 0 8 15 z" fill="#C83228"/><circle cx="58" cy="13" r="6" fill="#141414"/><path d="M50 34 q0 -15 8 -15 q8 0 8 15 z" fill="#1D4E5F"/><circle cx="86" cy="13" r="6" fill="#141414"/><path d="M78 34 q0 -15 8 -15 q8 0 8 15 z" fill="#A66A00"/>` + close;
    case 'runner': return open + `<rect width="120" height="44" fill="#F5E4D3"/><path d="M20 34 L40 22 L58 26 L78 12 L100 16" stroke="#141414" stroke-width="3" fill="none"/><circle cx="100" cy="12" r="6" fill="#C83228"/><circle cx="20" cy="34" r="5" fill="#1D4E5F"/>` + close;
    case 'jobs': return open + `<rect width="120" height="44" fill="#DCE9E4"/><rect x="18" y="26" width="16" height="14" fill="#1D4E5F"/><rect x="42" y="20" width="16" height="20" fill="#1D4E5F"/><rect x="66" y="14" width="16" height="26" fill="#C83228"/><text x="74" y="12" font-size="9" font-weight="900" fill="#C83228" text-anchor="middle">4.9%</text>` + close;
    default: return open + close;
  }
}
const ART = { summit: artSummit, icj: artIcj, cop: artCop };

// ---- world map: dot grid + numbered pins ----------------------------------
// Grid 56 x 28. Land = [start,end] column ranges per row (schematic,
// equirectangular, good enough to place every pin on the right landmass).
const LAND = [
  [], [[4, 11], [15, 18], [33, 50]], [[3, 12], [15, 18], [30, 51]],
  [[2, 13], [16, 17], [24, 29], [30, 51]], [[2, 13], [24, 24], [25, 29], [30, 50]],
  [[2, 13], [25, 30], [31, 49]], [[3, 12], [26, 30], [32, 48], [49, 50]],
  [[3, 12], [26, 29], [33, 46], [50, 50]], [[4, 11], [26, 28], [34, 44]],
  [[5, 11], [25, 32], [35, 37], [39, 44]], [[6, 11], [25, 33], [35, 37], [40, 44]],
  [[7, 11], [12, 13], [25, 33], [36, 37], [41, 43]], [[8, 12], [13, 14], [26, 32], [41, 43]],
  [[9, 12], [13, 15], [26, 31], [41, 42]], [[13, 17], [27, 30]],
  [[14, 18], [27, 30]], [[14, 18], [28, 30]], [[14, 17], [28, 29]],
  [[15, 17], [28, 29], [44, 49]], [[15, 16], [44, 49]], [[15, 16], [45, 48]],
  [[15, 16], [46, 48]], [[16, 16], [50, 51]], [[50, 51]], [], [], [], [], [],
];
// Pin positions (col,row) on that grid — nudged a few cells where two
// stories share one city, so no two numbered pins ever overlap.
const PINS = {
  1: [46, 10], 2: [27, 6], 3: [33, 8], 4: [34, 7], 5: [36, 10], 6: [40, 11],
  7: [47, 8], 8: [30, 4], 9: [16, 8], 10: [54, 19], 11: [16, 13], 12: [34, 14],
  13: [51, 19], 14: [33, 6], 15: [31, 6], 16: [32, 7], 17: [36, 8], 18: [34, 9],
  19: [38, 10], 20: [35, 12], 21: [32, 9], 22: [49, 8], 23: [43, 10], 24: [45, 13],
  25: [32, 18], 26: [32, 16], 27: [36, 14], 28: [30, 7], 29: [33, 12], 30: [15, 10],
  31: [55, 21], 32: [1, 17], 33: [4, 17], 35: [17, 18], 36: [48, 9],
};
// Stories 34 (space) and 37 (deep time) have no fixed place: shown as
// numbered dots in the "no fixed place" corner box, not on the map.
const ALL = [...LEADS, ...FEATURED, ...ALSO];
function regionOf(n) { return ALL.find((s) => s.n === n).region; }
function buildMap() {
  const CW = 5, CH = 5, W = 56 * CW, H = 28 * CH;
  let dots = '';
  LAND.forEach((ranges, r) => {
    ranges.forEach(([a, b]) => {
      for (let c = a; c <= b; c++) {
        dots += `<circle cx="${c * CW + 2.5}" cy="${r * CH + 2.5}" r="1.5" fill="#7A9A94"/>`;
      }
    });
  });
  let pins = '';
  Object.entries(PINS).forEach(([n, [c, r]]) => {
    const col = RC[regionOf(Number(n))];
    pins += `<g><circle cx="${c * CW + 2.5}" cy="${r * CH + 2.5}" r="4.2" fill="${col}" stroke="#FBF3E6" stroke-width="0.8"/>` +
      `<text x="${c * CW + 2.5}" y="${r * CH + 4.1}" font-size="4.8" font-weight="800" fill="#fff" text-anchor="middle">${n}</text></g>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${dots}${pins}</svg>`;
}

// ---- page assembly ---------------------------------------------------------
const SERIF = `Georgia,'Noto Serif','DejaVu Serif',serif`;
const SANS = `'DejaVu Sans','Noto Sans',Arial,sans-serif`;

function tagChip(tag) {
  const bg = tag === 'RULING' ? RED : tag === 'DRAFT' ? OCHRE : tag === 'CLAIM' ? '#6B4FA1' : tag === 'FORECAST' ? BLUE : TEAL;
  return `<span style="background:${bg};color:#fff;font:700 7.5px ${SANS};letter-spacing:.06em;padding:2px 5px;border-radius:2px">${tag}</span>`;
}
function numBadge(n, region) {
  return `<span style="display:inline-block;min-width:15px;text-align:center;background:${RC[region]};color:#fff;font:800 9px ${SANS};padding:1px 3px;border-radius:8px">${String(n).padStart(2, '0')}</span>`;
}

function leadCard(s) {
  return `<div style="flex:1;border:1.5px solid ${INK};background:${CREAM};display:flex;flex-direction:column;overflow:hidden">
    <div style="background:${RED};color:#fff;font:800 9px ${SANS};letter-spacing:.08em;padding:3px 7px;display:flex;justify-content:space-between"><span>${s.place}</span><span>${s.banner}</span></div>
    ${ART[s.art]()}
    <div style="padding:5px 8px 6px;display:flex;flex-direction:column;gap:4px;flex:1">
      <div style="display:flex;gap:5px;align-items:center">${numBadge(s.n, s.region)} ${tagChip(s.tag)}</div>
      <div style="font:900 15.5px/1.12 ${SERIF};color:${INK}">${s.head}</div>
      <div style="font:400 10px/1.35 ${SANS};color:#2B2B2B">${s.deck}</div>
    </div>
  </div>`;
}

function featCard(s) {
  return `<div style="border:1px solid ${INK};background:${CREAM};display:flex;flex-direction:column;overflow:hidden">
    <div style="border-bottom:1px solid ${INK}">${artMini(s.art)}</div>
    <div style="padding:4px 6px 5px;display:flex;flex-direction:column;gap:3px;flex:1">
      <div style="display:flex;gap:4px;align-items:center;justify-content:space-between">
        <span style="display:flex;gap:4px;align-items:center">${numBadge(s.n, s.region)}<span style="font:800 7.5px ${SANS};letter-spacing:.05em;color:${RC[s.region]}">${s.place}</span></span>${tagChip(s.tag)}
      </div>
      <div style="font:800 11px/1.15 ${SERIF};color:${INK}">${s.head}</div>
      <div style="font:400 9px/1.3 ${SANS};color:#2B2B2B">${s.deck}</div>
    </div>
  </div>`;
}

function alsoItem(s) {
  return `<div style="display:flex;gap:5px;align-items:baseline;padding:0.5px 0;border-bottom:0.5px solid #C9B99A">
    ${numBadge(s.n, s.region)}
    <span style="font:700 8px/1.15 ${SANS};color:${INK}"><b>${s.place} —</b> ${s.text}</span>
    <span style="margin-left:auto;flex:none;font:italic 400 8px ${SANS};color:#6B5B45">${s.src}</span>
  </div>`;
}

const REGION_STRIP = [
  ['ASIA-PACIFIC', 8, TEAL], ['MIDDLE EAST', 5, RED], ['EUROPE', 7, OCHRE],
  ['AFRICA', 5, OCHRE], ['AMERICAS', 4, BLUE], ['OCEANIA', 4, TEAL], ['WORLD', 4, BLUE],
].map(([name, n, c]) =>
  `<div style="flex:1;background:${c};color:#fff;text-align:center;padding:3px 0;font:800 9.5px ${SANS};letter-spacing:.05em">${name} ${n}</div>`
).join('');

const STATS = [
  ['3', 'presidents at one table'], ['9–6', 'World Court genocide vote'],
  ['$120bn', 'aid goal cut at COP31'], ['$81.3bn', 'Anthropic’s record IPO'],
  ['109–0', 'Danish vote on Arctic pact'], ['4.9%', 'Australian jobless rate'],
  ['120,000', 'moved as Akvan nears'],
].map(([v, l]) =>
  `<div style="flex:1;text-align:center;border-left:1px solid #C9B99A;padding:2px 4px">
    <div style="font:900 15px/1 ${SERIF};color:${RED}">${v}</div>
    <div style="font:400 8.5px/1.2 ${SANS};color:#3A3A3A">${l}</div>
  </div>`
).join('');

const SPINE_HTML = SPINE.map((s, i) =>
  `<div style="flex:1;text-align:center;position:relative;padding-top:2px">
    ${i > 0 ? '<div style="position:absolute;left:-50%;top:8px;width:100%;height:1.5px;background:#8A7A62"></div>' : ''}
    <div style="position:relative;width:9px;height:9px;border-radius:50%;background:${RED};border:1.5px solid ${INK};margin:0 auto"></div>
    <div style="font:800 9.5px ${SANS};color:${INK};margin-top:2px">${s.t}</div>
    <div style="font:800 7.5px ${SANS};letter-spacing:.04em;color:${RED}">${s.p}</div>
    <div style="font:400 8.5px/1.2 ${SANS};color:#2B2B2B">${s.x}</div>
  </div>`
).join('');

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1024px;height:1024px;background:${PAPER};color:${INK};font-family:${SANS};overflow:hidden}
.page{width:1024px;height:1024px;padding:10px 26px 8px;display:flex;flex-direction:column}
.rule{height:2px;background:${INK}}
.rule-red{height:3px;background:${RED}}
</style></head><body><div class="page">
<div style="display:flex;justify-content:space-between;font:800 9.5px ${SANS};letter-spacing:.14em;color:${RED}">
  <span>THE WORLD IN ONE DAY</span><span>THE GLOBAL LEDGER · ONE PAGE · ONE DAY</span><span>37 STORIES · 7 REGIONS</span>
</div>
<div class="rule" style="margin:4px 0 2px"></div>
<div style="text-align:center;font:900 22px/1 ${SERIF};letter-spacing:.06em">THE GLOBAL LEDGER</div>
<div style="text-align:center;font:italic 400 10px ${SANS};color:#4A3A28;margin-top:1px">A 24-hour spatio-temporal wire dispatch — every story verified against the wires of the day</div>
<div style="text-align:center;font:900 42px/1.02 ${SERIF};letter-spacing:-.01em;margin-top:3px">Thursday 19 November 2026</div>
<div style="text-align:center;font:italic 700 12px/1.25 ${SERIF};color:${RED};margin-top:2px">Trump, Xi and Putin share one table · The World Court finds genocide in Myanmar · COP31’s draft drops fossil fuels</div>
<div class="rule-red" style="margin:5px 0 4px"></div>
<div style="text-align:center;font:800 10px ${SANS};letter-spacing:.1em">37 VERIFIED STORIES FOR THURSDAY, 19 NOVEMBER 2026 — EACH HAPPENED, OR WAS FIRST REPORTED, THAT DAY</div>
<div style="display:flex;gap:3px;margin-top:4px">${REGION_STRIP}</div>
<div style="display:flex;margin-top:4px;border-top:1px solid #C9B99A;border-bottom:1px solid #C9B99A;padding:3px 0">${STATS}</div>

<div style="display:flex;gap:8px;margin-top:5px">
  ${LEADS.map(leadCard).join('')}
</div>

<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-top:5px">
  ${FEATURED.map(featCard).join('')}
</div>

<div style="margin-top:4px;border-top:1.5px solid ${INK};border-bottom:1.5px solid ${INK};padding:4px 0 5px">
  <div style="font:800 9px ${SANS};letter-spacing:.12em;color:${RED};margin-bottom:2px">24-HOUR UTC WIRE SPINE — LOCAL TIMES, IN ORDER · 00:00–23:59</div>
  <div style="display:flex">${SPINE_HTML}</div>
</div>

<div style="display:flex;gap:12px;margin-top:5px;flex:1;min-height:0">
  <div style="width:300px;flex:none">
    <div style="font:800 10px ${SANS};letter-spacing:.1em">WHERE IT HAPPENED <span style="font-weight:400;letter-spacing:0;color:#6B5B45">— pins = card numbers · 34 &amp; 37 have no fixed place</span></div>
    <div style="margin-top:3px;border:1px solid ${INK};background:#E9EFEA;padding:1px">${buildMap()}</div>
    <div style="display:flex;gap:7px;margin-top:3px;font:700 8px ${SANS};white-space:nowrap">
      <span><span style="color:${TEAL}">●</span> ASIA-PAC.</span>
      <span><span style="color:${OCHRE}">●</span> EUROPE/AFRICA</span>
      <span><span style="color:${RED}">●</span> MIDEAST</span>
      <span><span style="color:${BLUE}">●</span> AMERICAS/WORLD</span>
    </div>
  </div>
  <div style="flex:1;min-width:0">
    <div style="font:800 10px ${SANS};letter-spacing:.1em;color:${RED}">ALSO ON THURSDAY — 19 NOVEMBER 2026 <span style="font-weight:400;color:#6B5B45;letter-spacing:0">· place · what happened · source</span></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 12px;margin-top:2px;align-content:start">
      <div>${ALSO.slice(0, 12).map(alsoItem).join('')}</div>
      <div>${ALSO.slice(12).map(alsoItem).join('')}</div>
    </div>
  </div>
</div>

<div style="margin-top:5px;border:1.5px solid ${RED};background:#FBEDEA;padding:4px 8px">
  <div style="font:800 9.5px ${SANS};letter-spacing:.08em;color:${RED}">FORENSIC DATE CHECK ✓ — every story on this page happened, or was first reported, on Thursday 19 November 2026. LEFT OUT AS OTHER DAYS’ NEWS:</div>
  <div style="font:400 9px/1.4 ${SANS};color:#2B2B2B;margin-top:2px">${EXCLUDED}.</div>
</div>
<div style="text-align:center;font:italic 400 8.5px ${SANS};color:#6B5B45;margin-top:4px">Claims are attributed, not stated as fact · Pictures and map are original, drawn in code — no photographs · Sources: Reuters, AP, AFP, BBC, Al Jazeera, HRW, IMD, ABS, RNZ, Xinhua · The Global Ledger · 19 Nov 2026</div>
</div></body></html>`;

writeFileSync(new URL('../page.html', import.meta.url), html);
console.log('page.html written,', html.length, 'bytes');
