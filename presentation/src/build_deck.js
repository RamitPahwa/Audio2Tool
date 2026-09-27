/*
 * Builds the Interspeech 2026 oral-presentation deck for
 * "Audio2Tool: Speak, Call, Act - A Dataset for Benchmarking Speech Tool Use".
 *
 * Usage:  node build_deck.js [output.pptx]
 * Needs:  pptxgenjs, sharp, react, react-dom, react-icons  (npm install in this folder or set NODE_PATH)
 *
 * All numbers on the slides come from the paper (arXiv:2604.22821v1), Table 3 / Figure 2 / Table 2.
 */
const path = require('path');
const pptxgen = require('pptxgenjs');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const sharp = require('sharp');
const fa = require('react-icons/fa');

const ASSETS = path.join(__dirname, 'assets');
const OUT = process.argv[2] || path.join(__dirname, '..', 'Audio2Tool_Interspeech2026_Oral.pptx');

// ---------- palette (Speak = teal, Call = amber, Act = coral) ----------
const C = {
  ink: '0F1B2D', ink2: '1B2A41', paper: 'FFFFFF', tint: 'F1F5F9', tint2: 'E3EAF2', line: 'D5DCE5',
  muted: '5B6B7F', muted2: '8A97A8', white: 'FFFFFF',
  speak: '0FA3B1', speakDark: '0B7F8A', speakTint: 'DDF3F5',
  call: 'F2A93B', callDark: 'C9821A', callTint: 'FCEFD8',
  act: 'E4572E', actDark: 'B83F1D', actTint: 'FBE1D9',
  car: '2E75B6', home: 'ED7D31', wear: '3CA24A',
};
const FONT = 'Calibri';
const MONO = 'Courier New';

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5 in
pres.author = 'Ramit Pahwa';
pres.title = 'Audio2Tool: Speak, Call, Act - Interspeech 2026 oral';
const W = 13.333;

// ---------- helpers ----------
const sh = () => ({ type: 'outer', color: '000000', blur: 5, offset: 1.5, angle: 90, opacity: 0.12 });

async function icon(Comp, hex, size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: '#' + hex, size }));
  const buf = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  return 'image/png;base64,' + buf.toString('base64');
}

function text(s, str, o) {
  s.addText(str, Object.assign({ fontFace: FONT, color: C.ink, margin: 0, isTextBox: true, valign: 'top' }, o));
}
function runs(s, arr, o) {
  s.addText(arr, Object.assign({ fontFace: FONT, color: C.ink, margin: 0, isTextBox: true, valign: 'top' }, o));
}
function rect(s, x, y, w, h, fill, o = {}) {
  s.addShape(pres.shapes.RECTANGLE, Object.assign({ x, y, w, h, fill: { color: fill }, line: { color: o.line || fill, width: o.lineW || 0 } }, o.extra || {}));
}
function card(s, x, y, w, h, fill, o = {}) {
  const opts = { x, y, w, h, fill: { color: fill }, line: { color: o.line || fill, width: o.line ? 0.75 : 0 }, rectRadius: o.r == null ? 0.12 : o.r };
  if (o.shadow) opts.shadow = sh();
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, opts);
}
function circle(s, x, y, d, fill) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill, width: 0 } });
}
function arrow(s, x, y, w, color) {
  s.addShape(pres.shapes.RIGHT_ARROW, { x, y, w, h: 0.32, fill: { color }, line: { color, width: 0 } });
}
// waveform glyph: the deck's visual motif
function wave(s, x, y, w, h, color, pattern, transparency) {
  pattern = pattern || [0.35, 0.7, 1, 0.6, 0.85, 0.45, 0.25];
  const n = pattern.length;
  const gap = w / (n * 1.9);
  const bw = (w - gap * (n - 1)) / n;
  pattern.forEach((p, i) => {
    const bh = Math.max(h * p, bw);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + i * (bw + gap), y: y + (h - bh) / 2, w: bw, h: bh,
      fill: { color, transparency: transparency || 0 }, line: { color, width: 0, transparency: transparency || 0 }, rectRadius: bw / 2,
    });
  });
}
function iconCircle(s, x, y, d, fill, data, pad = 0.22) {
  circle(s, x, y, d, fill);
  s.addImage({ data, x: x + d * pad, y: y + d * pad, w: d * (1 - 2 * pad), h: d * (1 - 2 * pad) });
}

let slideNo = 0;
function content({ tag, title, notes, tagColor }) {
  slideNo++;
  const s = pres.addSlide();
  s.background = { color: C.paper };
  if (tag) text(s, tag.toUpperCase(), { x: 0.6, y: 0.34, w: 8, h: 0.3, fontSize: 12, bold: true, color: tagColor || C.speakDark, charSpacing: 3 });
  text(s, title, { x: 0.6, y: 0.6, w: 11.3, h: 1.0, fontSize: 28, bold: true, color: C.ink });
  wave(s, 12.05, 0.45, 0.7, 0.42, C.speak);
  text(s, 'Audio2Tool  ·  Interspeech 2026  ·  Sydney', { x: 0.6, y: 7.08, w: 7, h: 0.28, fontSize: 10, color: C.muted2 });
  text(s, String(slideNo), { x: 12.15, y: 7.08, w: 0.58, h: 0.28, fontSize: 10, color: C.muted2, align: 'right' });
  if (notes) s.addNotes(notes);
  return s;
}
function dark({ notes }) {
  slideNo++;
  const s = pres.addSlide();
  s.background = { color: C.ink };
  if (notes) s.addNotes(notes);
  return s;
}

// ---------- data from the paper (Table 3) ----------
const TIERS = ['T1 Direct', 'T2 Parametric', 'T3 Multi-intent', 'T4 Implicit', 'T5 Needle', 'T6 Correction', 'T7 Conversation', 'T8 Intent blend'];
const ACC = {
  'Qwen3-Omni-30B (end-to-end)': [92.4, 84.6, 74.7, 33.4, 90.6, 81.5, 54.6, 41.7],
  'Whisper-v3 + Gemma-3-27B (cascade)': [87.9, 78.9, 62.8, 26.3, 82.7, 77.1, 56.2, 50.5],
  'Kimi-Audio-7B (end-to-end)': [75.4, 75.6, 46.5, 20.5, 70.6, 65.3, 45.7, 37.8],
  'Step-Audio-2-7B (end-to-end)': [77.9, 76.5, 41.4, 15.1, 64.4, 58.2, 40.8, 34.2],
};
const F1_E2E = [21.7, 35.0, 23.4, 41.6, 32.4, 26.8, 19.9];   // Qwen3-Omni-30B, T2..T8
const F1_CAS = [19.5, 44.1, 18.2, 49.6, 52.3, 36.2, 25.6];   // Whisper + Gemma-27B, T2..T8
const T2 = { // Tier 2: tool accuracy vs exact match
  labels: ['Qwen3-Omni-30B', 'Qwen2.5-Omni-7B', 'Step-Audio-2-7B', 'Kimi-Audio-7B', 'Whisper + Gemma-27B', 'Oracle text + Gemma-12B'],
  acc: [84.6, 80.6, 76.5, 75.6, 78.9, 78.3],
  em: [15.6, 14.7, 14.1, 12.4, 10.2, 12.3],
};
const ORACLE = { // Tool accuracy T1..T7, oracle transcript vs Whisper transcript
  q8o: [85.6, 77.1, 61.3, 26.8, 80.5, 75.2, 55.4], q8w: [78.1, 67.4, 48.1, 17.6, 66.9, 61.8, 42.7],
  g12o: [84.1, 78.3, 59.2, 27.4, 80.8, 73.6, 55.7], g12w: [80.3, 75.2, 50.4, 18.9, 69.1, 64.2, 44.9],
};

const chartBase = {
  chartColors: [C.speak, C.act, C.call, C.muted],
  catAxisLabelFontSize: 11, valAxisLabelFontSize: 11, catAxisLabelColor: C.muted, valAxisLabelColor: C.muted,
  catAxisLabelFontFace: FONT, valAxisLabelFontFace: FONT, legendFontFace: FONT, dataLabelFontFace: FONT,
  valGridLine: { color: 'E5E9F0', size: 0.5 }, catGridLine: { style: 'none' },
  valAxisLineShow: false, showTitle: false, legendFontSize: 11, legendColor: C.ink,
};

(async () => {
  // ---------- pre-render icons ----------
  const I = {};
  const want = {
    mic: [fa.FaMicrophoneAlt, C.white], car: [fa.FaCar, C.white], home: [fa.FaHome, C.white], watch: [fa.FaHeartbeat, C.white],
    noise: [fa.FaVolumeUp, C.white], users: [fa.FaUsers, C.white], repair: [fa.FaRedoAlt, C.white], chat: [fa.FaComments, C.white],
    search: [fa.FaSearch, C.white], layers: [fa.FaLayerGroup, C.white], check: [fa.FaCheckCircle, C.white], warn: [fa.FaExclamationTriangle, C.white],
    robot: [fa.FaRobot, C.white], db: [fa.FaDatabase, C.white], chart: [fa.FaChartLine, C.white], tools: [fa.FaTools, C.white],
    scale: [fa.FaBalanceScale, C.white], github: [fa.FaGithub, C.white], file: [fa.FaFileAlt, C.white], bullhorn: [fa.FaBullhorn, C.white],
    sitemap: [fa.FaSitemap, C.white], clipboard: [fa.FaClipboardCheck, C.white], lang: [fa.FaLanguage, C.white], code: [fa.FaCode, C.white],
    bolt: [fa.FaBolt, C.white], filter: [fa.FaFilter, C.white], globe: [fa.FaGlobeAmericas, C.white], flask: [fa.FaFlask, C.white],
    wave: [fa.FaWaveSquare, C.white], road: [fa.FaRoad, C.white], target: [fa.FaBullseye, C.white], list: [fa.FaListOl, C.white],
    envelope: [fa.FaEnvelope, C.white], link: [fa.FaLink, C.white], cogs: [fa.FaCogs, C.white], arrowsalt: [fa.FaRandom, C.white],
    micInk: [fa.FaMicrophoneAlt, C.ink], codeInk: [fa.FaCode, C.ink], boltInk: [fa.FaBolt, C.ink],
  };
  for (const k of Object.keys(want)) I[k] = await icon(want[k][0], want[k][1]);

  // =====================================================================
  // 1. TITLE
  // =====================================================================
  {
    const s = dark({
      notes: '[0:00] Good afternoon. I am Ramit Pahwa from Rivian and Volkswagen Group Technologies. ' +
        'Today I will present Audio2Tool: a benchmark for a capability that is quickly becoming the centre of voice assistants: going straight from speech to an executable tool call. ' +
        'The title says it all: the user speaks, the model calls a tool, the device acts.',
    });
    // large waveform motif
    const pat = [0.2, 0.35, 0.55, 0.8, 1, 0.7, 0.45, 0.9, 0.6, 0.3, 0.5, 0.85, 0.65, 0.4, 0.25, 0.55, 0.95, 0.7, 0.35, 0.6, 0.8, 0.45, 0.3, 0.5, 0.7, 0.4, 0.2];
    wave(s, 0.8, 0.75, 11.7, 1.55, C.speak, pat);
    text(s, 'Audio2Tool', { x: 0.8, y: 2.45, w: 11.7, h: 1.0, fontSize: 56, bold: true, color: C.white });
    runs(s, [
      { text: 'Speak', options: { color: C.speak, bold: true } }, { text: ', ', options: { color: C.white } },
      { text: 'Call', options: { color: C.call, bold: true } }, { text: ', ', options: { color: C.white } },
      { text: 'Act', options: { color: C.act, bold: true } },
      { text: '  —  A Dataset for Benchmarking Speech Tool Use', options: { color: C.white } },
    ], { x: 0.8, y: 3.5, w: 11.7, h: 0.55, fontSize: 24 });
    runs(s, [
      { text: 'Ramit Pahwa', options: { bold: true } }, { text: '*, ' },
      { text: 'Apoorva Beedu', options: { bold: true } }, { text: '*, Parivesh Priye, Rutu Gandhi†, Saloni Takawale†, Aruna Baijal, Zengli Yang' },
    ], { x: 0.8, y: 4.35, w: 11.7, h: 0.8, fontSize: 17, color: 'DCE4EE', lineSpacingMultiple: 1.15 });
    text(s, 'Rivian and Volkswagen Group Technologies      * equal contribution · † equal contribution', { x: 0.8, y: 5.25, w: 11.7, h: 0.35, fontSize: 14, color: C.muted2 });
    // bottom strip
    text(s, 'Interspeech 2026  ·  Sydney  ·  Oral session', { x: 0.8, y: 6.55, w: 6.5, h: 0.35, fontSize: 14, color: 'DCE4EE' });
    text(s, 'arXiv:2604.22821   ·   audio2tool.github.io', { x: 6.5, y: 6.55, w: 6.0, h: 0.35, fontSize: 14, color: C.speak, align: 'right' });
  }

  // =====================================================================
  // 2. THE TALK IN ONE SLIDE  (pattern borrowed from strong Interspeech orals: answer first)
  // =====================================================================
  {
    const s = content({
      tag: 'Overview', title: 'This talk in one slide',
      notes: '[0:30] Here is the entire talk on one slide, so you know where we are going. ' +
        'The question: can today\'s speech language models turn a spoken request into a correct, executable tool call under realistic acoustic conditions? ' +
        'We built Audio2Tool to answer it: thirty thousand spoken queries over 152 tools, eight complexity tiers, 330 cloned voices and real noise. ' +
        'And the answers, in one breath: picking the right tool is nearly solved for direct commands; getting the arguments right is not, and that is not an ASR problem; ' +
        'composition, implicit intent and competing speakers are still open; and end-to-end models do not yet beat a strong cascade. The rest of the talk is the evidence.',
    });
    card(s, 0.6, 1.75, 5.6, 2.3, C.ink);
    text(s, 'QUESTION', { x: 0.85, y: 1.9, w: 5.1, h: 0.3, fontSize: 12, bold: true, color: C.speak, charSpacing: 3 });
    text(s, 'Can today\'s SpeechLMs turn a spoken request into a correct, executable tool call under realistic acoustic conditions?', { x: 0.85, y: 2.25, w: 5.1, h: 1.7, fontSize: 18, bold: true, color: C.white, lineSpacingMultiple: 1.1 });
    card(s, 0.6, 4.2, 5.6, 2.5, C.tint);
    text(s, 'WHAT WE BUILT', { x: 0.85, y: 4.35, w: 5.1, h: 0.3, fontSize: 12, bold: true, color: C.speakDark, charSpacing: 3 });
    runs(s, [
      { text: 'Audio2Tool. ', options: { bold: true } },
      { text: '~30K spoken queries with gold tool calls · 152 tools in 3 domains · 8 complexity tiers · 330 cloned voices · real in-car and indoor noise · open-weight baselines: end-to-end SpeechLMs vs. Whisper cascades.', options: { color: C.ink2 } },
    ], { x: 0.85, y: 4.7, w: 5.1, h: 1.9, fontSize: 15, lineSpacingMultiple: 1.15 });
    text(s, 'WHAT WE FOUND', { x: 6.55, y: 1.75, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.actDark, charSpacing: 3 });
    const found = [
      [I.check, C.speak, 'Tool selection nearly solved for direct commands', '92% tool accuracy for the best model on Tier 1'],
      [I.warn, C.act, 'Argument grounding is the bottleneck (not ASR)', 'exact match ≤ 16%, even with gold transcripts'],
      [I.layers, C.call, 'Composition, implicit intent, competing speakers', 'still open: 33–75% tool accuracy on Tiers 3–4 and 7–8'],
      [I.scale, C.ink2, 'End-to-end does not yet beat a strong cascade', 'SpeechLMs pick tools better; text LLMs fill arguments better'],
    ];
    found.forEach(([ic, col, h, b], i) => {
      const y = 2.12 + i * 1.15;
      card(s, 6.55, y, 6.18, 1.03, C.tint);
      iconCircle(s, 6.78, y + 0.2, 0.63, col, ic);
      text(s, h, { x: 7.6, y: y + 0.1, w: 5.05, h: 0.4, fontSize: 14, bold: true });
      text(s, b, { x: 7.6, y: y + 0.5, w: 5.05, h: 0.45, fontSize: 12.5, color: C.ink2 });
    });
    text(s, 'The rest of the talk is the evidence.', { x: 6.55, y: 6.65, w: 6.18, h: 0.35, fontSize: 13, italic: true, color: C.muted });
  }

  // =====================================================================
  // 3. MOTIVATION: from intents to actions
  // =====================================================================
  {
    const s = content({
      tag: 'Motivation', title: 'Voice assistants are becoming agents: the output is now an action',
      notes: '[1:00] For a decade, spoken language understanding meant classification. ASR produced text, an NLU module produced an intent and a few slots, and hand-written logic did the rest. ' +
        'Speech language models change the contract. The model now emits the action itself: an API call with typed arguments. ' +
        'That raises the bar for correctness. The call must be schema-valid, every argument must be right, and for multi-step requests the order matters. ' +
        'A near-miss is not partially right. It is a wrong action, in a car, at highway speed.',
    });
    // Row A: then
    text(s, 'THEN  ·  classify the intent', { x: 0.6, y: 1.75, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.muted, charSpacing: 2 });
    const yA = 2.08, hB = 0.85;
    const boxes = [['Speech', I.micInk], ['ASR', null], ['NLU\nintent + slots', null], ['Rules / dialog\nmanager', null]];
    let x = 0.6;
    boxes.forEach(([t, ic], i) => {
      const w = i === 0 ? 1.6 : 1.75;
      card(s, x, yA, w, hB, C.tint);
      if (ic) { s.addImage({ data: ic, x: x + 0.22, y: yA + 0.25, w: 0.36, h: 0.36 }); text(s, t, { x: x + 0.65, y: yA, w: w - 0.7, h: hB, fontSize: 15, bold: true, valign: 'middle' }); }
      else text(s, t, { x: x + 0.1, y: yA, w: w - 0.2, h: hB, fontSize: 15, bold: true, align: 'center', valign: 'middle' });
      x += w;
      if (i < boxes.length - 1) { arrow(s, x + 0.08, yA + hB / 2 - 0.16, 0.34, C.muted2); x += 0.5; }
    });
    card(s, 9.25, yA, 3.48, hB, C.tint2);
    text(s, 'intent = set_temperature\nslot: value = 72', { x: 9.45, y: yA, w: 3.2, h: hB, fontFace: MONO, fontSize: 13, color: C.muted, valign: 'middle' });
    text(s, 'a label the app has to interpret', { x: 9.25, y: yA + hB + 0.05, w: 3.48, h: 0.3, fontSize: 11, italic: true, color: C.muted, align: 'center' });

    // Row B: now
    text(s, 'NOW  ·  emit the executable call', { x: 0.6, y: 3.65, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.speakDark, charSpacing: 2 });
    const yB = 4.0;
    card(s, 0.6, yB, 1.6, hB, C.speakTint);
    s.addImage({ data: I.micInk, x: 0.82, y: yB + 0.25, w: 0.36, h: 0.36 }); text(s, 'Speech', { x: 1.25, y: yB, w: 0.9, h: hB, fontSize: 15, bold: true, valign: 'middle' });
    arrow(s, 2.28, yB + hB / 2 - 0.16, 0.34, C.speak);
    card(s, 2.7, yB, 3.35, hB, C.speakTint);
    text(s, 'SpeechLM\naudio-native, single model', { x: 2.8, y: yB, w: 3.15, h: hB, fontSize: 15, bold: true, align: 'center', valign: 'middle' });
    arrow(s, 6.13, yB + hB / 2 - 0.16, 0.34, C.speak);
    card(s, 6.55, yB, 6.18, hB, C.ink);
    text(s, 'setZoneTemperature(zone="Driver",\n                   temperature=72)', { x: 6.75, y: yB, w: 5.9, h: hB, fontFace: MONO, fontSize: 14, color: C.speak, valign: 'middle' });
    text(s, 'an action the device executes', { x: 6.55, y: yB + hB + 0.05, w: 6.18, h: 0.3, fontSize: 11, italic: true, color: C.muted, align: 'center' });

    // takeaway
    card(s, 0.6, 5.55, 12.13, 1.2, C.tint, { line: C.line });
    runs(s, [
      { text: 'Stricter correctness than SLU. ', options: { bold: true } },
      { text: 'A tool call must be schema-valid, fully specified, and correctly ordered. A semantically plausible output with one wrong argument is not "almost right"; it is the wrong action.' },
    ], { x: 0.9, y: 5.55, w: 11.5, h: 1.2, fontSize: 17, valign: 'middle' });
  }

  // =====================================================================
  // 3. WHY SPEECH MAKES IT HARD
  // =====================================================================
  {
    const s = content({
      tag: 'Motivation', title: 'Speech adds failure modes that text benchmarks never see',
      notes: '[2:00] And speech adds failure modes that text never sees. "Fifteen" and "fifty" are one phoneme apart, but one is a comfortable cabin and the other is not. ' +
        'Real cabins have engine, wind and HVAC noise. People repair themselves mid-utterance: "set an alarm for seven... wait, make it eight". ' +
        'And there are other voices in the room: a podcast, a passenger, a radio ad, carrying perfectly valid commands that the system must not execute. ' +
        'In every one of these cases the error does not produce a wrong label. It produces a wrong action.',
    });
    const items = [
      [I.lang, C.speak, 'Phonetic ambiguity', '"Fifteen" vs. "fifty", "seventy-two" vs. "seventy". Arguments are where sound-alikes bite.', '"Set the fan to fifteen"  →  setCabinFanLevel(50)?'],
      [I.noise, C.call, 'In-the-wild acoustics', 'Engine, road, wind, HVAC, rain, turn signals, babble. Signal-to-noise can go negative.', '−5 dB SNR on the highway'],
      [I.repair, C.act, 'Self-repair', 'People change their mind mid-sentence. The final state, not the first mention, is the intent.', '"Set an alarm for 7… wait, make it 8."'],
      [I.bullhorn, C.ink2, 'Competing speakers', 'Background speech carries valid commands. Only the primary speaker should be obeyed.', 'Driver: "Navigate home."\nRadio: "Set temperature to 72."'],
    ];
    const cw = 2.9, gap = 0.18, y = 1.75, ch = 4.0;
    items.forEach(([ic, col, h, body, ex], i) => {
      const x = 0.6 + i * (cw + gap);
      card(s, x, y, cw, ch, C.tint);
      iconCircle(s, x + 0.3, y + 0.3, 0.8, col, ic);
      text(s, h, { x: x + 0.3, y: y + 1.25, w: cw - 0.5, h: 0.85, fontSize: 17, bold: true, valign: 'bottom' });
      text(s, body, { x: x + 0.3, y: y + 2.18, w: cw - 0.55, h: 1.05, fontSize: 13, color: C.ink2, lineSpacingMultiple: 1.08 });
      text(s, ex, { x: x + 0.3, y: y + 3.25, w: cw - 0.55, h: 0.7, fontSize: 12, italic: true, color: col === C.ink2 ? C.muted : col === C.call ? C.callDark : col });
    });
    runs(s, [
      { text: 'Errors here do not produce a wrong label. ', options: { bold: true } },
      { text: 'They produce a wrong action: the wrong temperature, the wrong door, the wrong destination.' },
    ], { x: 0.6, y: 5.95, w: 12.1, h: 0.8, fontSize: 17, valign: 'middle' });
  }

  // =====================================================================
  // 4. THE GAP
  // =====================================================================
  {
    const s = content({
      tag: 'Motivation', title: 'Existing benchmarks each cover part of the problem',
      notes: '[3:00] Existing resources cover pieces of this. Text function-calling benchmarks such as BFCL define the executable formalism, but have no audio. ' +
        'Classic SLU corpora, SLURP, STOP, MAC-SLU, are spoken, but they label intents and slots rather than executable calls. ' +
        'Recent audio tool-use sets, BFCL-Audio, VoiceAgentBench, MFCL, bring speech and executable calls together, but they are narrow in domain and acoustic conditions, and they do not tell you why a model fails. ' +
        'We wanted all five columns at once, and we wanted the benchmark to be diagnostic: to isolate failure modes rather than report one aggregate number.',
    });
    const Y = (t) => ({ text: t, options: { color: C.speakDark, bold: true, fill: { color: C.speakTint } } });
    const L = (t) => ({ text: t, options: { color: C.callDark, bold: true, fill: { color: C.callTint } } });
    const N = (t) => ({ text: t, options: { color: C.muted, fill: { color: C.tint } } });
    const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.ink }, fontSize: 13 } });
    const rowLabel = (a, b) => ({ text: [{ text: a, options: { bold: true, breakLine: true, fontSize: 14 } }, { text: b, options: { fontSize: 11.5, color: C.muted } }], options: { align: 'left', fill: { color: C.paper } } });
    const rows = [
      [hdr(''), hdr('Speech input'), hdr('Executable tool calls'), hdr('Multi-intent & multi-turn'), hdr('Accent & noise diversity'), hdr('Diagnostic complexity tiers')],
      [rowLabel('Text function calling', 'BFCL [3], ComplexFuncBench [2]'), N('No'), Y('Yes'), Y('Yes'), N('No'), L('Limited')],
      [rowLabel('Spoken language understanding', 'SLURP [7], STOP [8], MAC-SLU [9]'), Y('Yes'), N('No  (intents + slots)'), L('Limited'), L('Limited'), N('No')],
      [rowLabel('Audio tool use', 'BFCL-Audio [10], VoiceAgentBench [5], MFCL [11]'), Y('Yes'), Y('Yes'), L('Limited'), L('Limited'), N('No')],
      [{ text: [{ text: 'Audio2Tool', options: { bold: true, breakLine: true, fontSize: 15, color: C.speakDark } }, { text: 'this work', options: { fontSize: 11.5, color: C.muted } }], options: { align: 'left', fill: { color: C.paper } } },
        Y('Yes'), Y('Yes'), Y('Yes  (8 tiers)'), Y('Yes  (330 voices, noise)'), Y('Yes')],
    ];
    s.addTable(rows, {
      x: 0.6, y: 1.78, w: 12.13, colW: [3.65, 1.5, 1.85, 1.85, 1.64, 1.64], rowH: [0.55, 0.78, 0.78, 0.78, 0.78],
      fontFace: FONT, fontSize: 13, color: C.ink, align: 'center', valign: 'middle',
      border: { type: 'solid', pt: 0.75, color: C.line }, margin: [0.05, 0.1, 0.05, 0.1],
    });
    runs(s, [
      { text: 'Complementary, not competing. ', options: { bold: true } },
      { text: 'Audio2Tool keeps the executable-call formalism of BFCL [3], but makes the input spoken, acoustically diverse, and organised so each tier isolates a distinct failure mode.' },
    ], { x: 0.6, y: 5.85, w: 12.1, h: 0.9, fontSize: 16, color: C.ink2, valign: 'middle' });
  }

  // =====================================================================
  // 5. AT A GLANCE
  // =====================================================================
  {
    const s = content({
      tag: 'Benchmark', title: 'Audio2Tool at a glance',
      notes: '[4:00] So here is Audio2Tool in numbers. Roughly thirty thousand queries, each with a gold tool call, over 152 tools in 23 categories across three domains: smart car, smart home and wearables. ' +
        'Eight complexity tiers. 330 cloned voices produced by two zero-shot TTS engines, mixed with real in-car and indoor noise. ' +
        'To our knowledge this is the first speech-to-tool benchmark with this combination of domain breadth, acoustic diversity and tiered complexity. Samples are at audio2tool.github.io.',
    });
    const stats = [
      ['~30K', 'spoken queries, each with a gold tool call', C.speak],
      ['152', 'verified tools grounded in real APIs', C.speak],
      ['23', 'functional categories', C.speak],
      ['3', 'domains: smart car · smart home · wearables', C.speak],
      ['8', 'complexity tiers, one failure mode each', C.call],
      ['330', 'cloned voices from 4 corpora, 4 regions', C.act],
      ['2', 'zero-shot voice-cloning TTS engines', C.act],
      ['8+', 'noise sources: engine, road, wind, HVAC, rain…', C.act],
    ];
    const cw = 2.9, chh = 2.0, gap = 0.18;
    stats.forEach(([n, l, col], i) => {
      const r = Math.floor(i / 4), c = i % 4;
      const x = 0.6 + c * (cw + gap), y = 1.75 + r * (chh + gap);
      card(s, x, y, cw, chh, C.tint);
      text(s, n, { x: x + 0.3, y: y + 0.25, w: cw - 0.5, h: 0.95, fontSize: 48, bold: true, color: col });
      text(s, l, { x: x + 0.3, y: y + 1.25, w: cw - 0.55, h: 0.7, fontSize: 13.5, color: C.ink2, lineSpacingMultiple: 1.05 });
    });
    text(s, 'Dataset, benchmark code and audio samples:  audio2tool.github.io', { x: 0.6, y: 6.3, w: 12.1, h: 0.4, fontSize: 15, color: C.speakDark, bold: true });
  }

  // =====================================================================
  // 6. TAXONOMY
  // =====================================================================
  {
    const s = content({
      tag: 'Benchmark', title: 'Taxonomy grounded in real APIs: 3 domains, 23 categories, 152 tools',
      notes: '[4:45] The taxonomy is grounded in real, public APIs: Android Automotive functionality, smart-home device standards, wearable SDKs. ' +
        'Smart Car is the largest domain with 14 categories, from climate and driving dynamics to charging and maintenance, because hands-free in-cabin use is where mistakes are most costly. ' +
        'Two design rules. First, operational intent: we separate state-altering commands like "set temperature" from passive monitoring like "check battery". ' +
        'Second, domain specificity: device-specific categories such as driving dynamics or activity tracking are kept, not flattened. ' +
        'The treemap on the right shows how queries distribute over categories; climate and environment dominate, as they do in real usage.',
    });
    const doms = [
      [I.car, C.car, 'Smart Car', '14 categories · climate, driving dynamics, charging, body control, navigation, maintenance…', 'setZoneTemperature(zone, temp)\nopenFrontTrunk()'],
      [I.home, C.home, 'Smart Home', 'lighting, appliances, automation sensors, security, media…', 'setLightState(device, state)\narmSecuritySystem(mode)'],
      [I.watch, C.wear, 'Wearables', 'health & activity tracking, device state and connectivity', 'startWorkout(activity)\nsetDoNotDisturb(enabled, mode)'],
    ];
    const y0 = 1.75, hh = 1.38, gap = 0.14, wL = 6.3;
    doms.forEach(([ic, col, name, cats, ex], i) => {
      const y = y0 + i * (hh + gap);
      card(s, 0.6, y, wL, hh, C.tint);
      iconCircle(s, 0.85, y + 0.29, 0.8, col, ic);
      text(s, name, { x: 1.85, y: y + 0.12, w: 2.6, h: 0.4, fontSize: 18, bold: true });
      text(s, cats, { x: 1.85, y: y + 0.52, w: 2.6, h: 0.82, fontSize: 12, color: C.ink2, lineSpacingMultiple: 1.05 });
      text(s, ex, { x: 4.5, y: y + 0.15, w: 2.35, h: 1.1, fontFace: MONO, fontSize: 9, color: C.muted, valign: 'middle' });
    });
    // right: treemap
    s.addImage({ path: path.join(ASSETS, 'fig2c_treemap.png'), x: 7.2, y: 1.75, w: 5.5, h: 3.62 });
    text(s, 'Query share by category (paper Fig. 2c)', { x: 7.2, y: 5.4, w: 5.5, h: 0.3, fontSize: 11, italic: true, color: C.muted, align: 'center' });
    // principles
    card(s, 0.6, 6.35, 5.95, 0.55, C.speakTint);
    runs(s, [{ text: 'Operational intent  ', options: { bold: true, color: C.speakDark } }, { text: 'state-altering ("set temperature") vs. monitoring ("check battery")', options: { color: C.ink2 } }], { x: 0.8, y: 6.35, w: 5.7, h: 0.55, fontSize: 12.5, valign: 'middle' });
    card(s, 6.78, 6.35, 5.95, 0.55, C.speakTint);
    runs(s, [{ text: 'Domain specificity  ', options: { bold: true, color: C.speakDark } }, { text: 'device-specific categories kept (driving dynamics, activity tracking)', options: { color: C.ink2 } }], { x: 6.98, y: 6.35, w: 5.7, h: 0.55, fontSize: 12.5, valign: 'middle' });
  }

  // =====================================================================
  // 7. EIGHT TIERS
  // =====================================================================
  {
    const s = content({
      tag: 'Benchmark', title: 'Eight tiers, eight failure modes',
      notes: '[5:45] Queries are organised into eight tiers, and each tier isolates a failure mode. ' +
        'Tiers 1 and 2 test the basics: pick the right tool, extract explicit parameters. ' +
        'Tiers 3 and 4 test composition and pragmatic inference; "I am freezing" contains no tool name at all. ' +
        'Tiers 5 to 8 test realism: an intent buried in 25 to 60 words of rambling, mid-utterance corrections, multi-turn USER/AGENT dialogue with persistent state, ' +
        'and, unique to audio, intent blending, where a background speaker issues a valid but unwanted command. Tier 8 is fundamentally a speaker-attribution problem, and it cannot be posed in text.',
    });
    const tiers = [
      ['1', 'Direct', 'Short command, no parameters (2–6 words)', '"Open the trunk."', C.speak],
      ['2', 'Parametric', 'Explicit slot values to extract (3–12 words)', '"Set the temperature to 72."', C.speak],
      ['3', 'Multi-intent', '2–3 tool calls in one utterance, in order', '"Defrost the windshield and find a charger."', C.call],
      ['4', 'Implicit', 'State or complaint; the tool is only implied', '"I\'m freezing."', C.call],
      ['5', 'Needle in a haystack', 'Intent buried in 25–60 words of tangent', '"…anyway, long day, could you… oh, lock the doors."', C.act],
      ['6', 'Correction', 'Mid-utterance repair; the final state wins', '"Set an alarm for 7… wait, make it 8."', C.act],
      ['7', 'Conversation', 'Multi-turn USER/AGENT dialogue, 20–200 words, persistent state', '"…and the same for the passenger seat."', C.act],
      ['8', 'Intent blending', 'Background speaker carries a second, valid command', 'Driver: "Navigate home."\nRadio: "Set temperature to 72."', C.act],
    ];
    const cw = 2.9, gap = 0.18, ch = 2.25;
    tiers.forEach(([n, name, desc, ex, col], i) => {
      const r = Math.floor(i / 4), c = i % 4;
      const x = 0.6 + c * (cw + gap), y = 1.72 + r * (ch + 0.16);
      card(s, x, y, cw, ch, C.tint);
      circle(s, x + 0.25, y + 0.25, 0.55, col);
      text(s, n, { x: x + 0.25, y: y + 0.25, w: 0.55, h: 0.55, fontSize: 20, bold: true, color: C.white, align: 'center', valign: 'middle' });
      text(s, name, { x: x + 0.95, y: y + 0.22, w: cw - 1.1, h: 0.62, fontSize: 16, bold: true, valign: 'middle' });
      text(s, desc, { x: x + 0.25, y: y + 0.98, w: cw - 0.45, h: 0.62, fontSize: 12.5, color: C.ink2, lineSpacingMultiple: 1.05 });
      text(s, ex, { x: x + 0.25, y: y + 1.62, w: cw - 0.45, h: 0.6, fontSize: 12, italic: true, color: col === C.call ? C.callDark : col });
    });
    runs(s, [
      { text: '●  ', options: { color: C.speak } }, { text: 'Basics (T1–T2)      ' },
      { text: '●  ', options: { color: C.call } }, { text: 'Composition & inference (T3–T4)      ' },
      { text: '●  ', options: { color: C.act } }, { text: 'Realism: long context, repair, dialogue, competing speakers (T5–T8)' },
    ], { x: 0.6, y: 6.55, w: 12.1, h: 0.4, fontSize: 13, color: C.ink2 });
  }

  // =====================================================================
  // 8. QUERY GENERATION + DISTRIBUTION
  // =====================================================================
  {
    const s = content({
      tag: 'Benchmark', title: 'From taxonomy to ~30K verified queries',
      notes: '[7:00] How were the queries built? Tier-specific prompts over the 152-tool taxonomy, using three frontier LLMs: GPT-5.2, Gemini 2.5 Pro and Claude Opus. ' +
        'A disjoint set of judge models, GPT-5.1 and Gemini 2.5 Pro, scored every query for correctness, difficulty and variability, and every query a judge flagged was manually checked, including its ground-truth tool call. ' +
        'On the right you see the distribution. Tiers 3 to 7 have 4,560 queries each. Tier 2 is the largest, 5,800, because parameter coverage needs volume. Tier 8 has 1,000. ' +
        'Within Tier 3, 62% of queries need two calls, 36% need three, and a small tail needs four or five.',
    });
    const steps = [
      [I.sitemap, 'Tier-specific prompting', 'GPT-5.2 · Gemini 2.5 Pro · Claude Opus generate queries over the 152-tool taxonomy, with gold tool call(s) and arguments'],
      [I.scale, 'LLM-as-judge (disjoint models)', 'GPT-5.1 · Gemini 2.5 Pro score correctness, difficulty and variability; never the same models that generated'],
      [I.clipboard, 'Manual verification', 'Every query a judge failed was checked by hand, together with its ground-truth tools'],
      [I.db, 'Gold labels per tier', 'tool call(s) + arguments, plus correction type (T6), reasoning (T4/T5/T7), primary-speaker calls (T8)'],
    ];
    const y0 = 1.75, hh = 1.12, gap = 0.12;
    steps.forEach(([ic, h, b], i) => {
      const y = y0 + i * (hh + gap);
      card(s, 0.6, y, 6.2, hh, C.tint);
      iconCircle(s, 0.82, y + 0.24, 0.64, C.speak, ic);
      text(s, `${i + 1}.  ${h}`, { x: 1.65, y: y + 0.13, w: 5.05, h: 0.4, fontSize: 15, bold: true });
      text(s, b, { x: 1.65, y: y + 0.52, w: 5.05, h: 0.58, fontSize: 12, color: C.ink2, lineSpacingMultiple: 1.05 });
    });
    // chart: queries per tier
    text(s, 'Queries per tier', { x: 7.1, y: 1.72, w: 5.6, h: 0.35, fontSize: 14, bold: true });
    s.addChart(pres.charts.BAR, [{ name: 'Queries', labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'], values: [1080, 5800, 4560, 4560, 4560, 4560, 4560, 1000] }],
      Object.assign({}, chartBase, {
        x: 7.0, y: 2.05, w: 5.75, h: 3.45, barDir: 'col', barGapWidthPct: 45, chartColors: [C.speak],
        showLegend: false, showValue: true, dataLabelPosition: 'outEnd', dataLabelFontSize: 11, dataLabelColor: C.ink, dataLabelFormatCode: '#,##0',
        valAxisMinVal: 0, valAxisMaxVal: 7000, valAxisMajorUnit: 2000, valAxisLabelFormatCode: '#,##0', catAxisLabelFontSize: 12,
      }));
    card(s, 7.0, 5.6, 5.75, 1.05, C.speakTint);
    runs(s, [
      { text: 'Tier 3 composition:  ', options: { bold: true, color: C.speakDark } },
      { text: '2 calls 61.8%  ·  3 calls 36.2%  ·  4–5 calls 1.9%', options: { color: C.ink2, breakLine: true } },
      { text: 'Smart Car is the majority domain in every tier (paper Fig. 2a).', options: { color: C.muted, fontSize: 12 } },
    ], { x: 7.2, y: 5.6, w: 5.4, h: 1.05, fontSize: 13, valign: 'middle' });
  }

  // =====================================================================
  // 9. AUDIO GENERATION
  // =====================================================================
  {
    const s = content({
      tag: 'Benchmark', title: 'Making it sound real: 330 cloned voices, real noise',
      notes: '[7:30] For the audio, we clone 330 voices selected from a pool of almost 60,000 speakers across four public corpora covering the US, Europe, Asia and Latin America. ' +
        'Selection is stratified by region, then farthest-point sampling on speaker embeddings, so we keep maximal accent diversity while controlling benchmark size. ' +
        'Two zero-shot voice-cloning TTS engines, Qwen3-TTS and CosyVoice-3, render each query in several voices, and we mix in automotive and indoor noise: engine, road, wind, HVAC, rain, turn signals, cabin and room sounds. ' +
        'Synthetic speech is a limitation we state openly, and real recordings are the next step; but this is, to our knowledge, the broadest accent and acoustic coverage in a speech tool-calling benchmark.',
    });
    // left flow (vertical)
    const steps = [
      [I.users, C.speak, 'Speaker pool: ~60K voices, 4 corpora', 'SPGISpeech 2.0 [15] · Emilia-YODAS [16] · 3D-Speaker [17] · VoxPopuli [18]'],
      [I.filter, C.speak, 'Stratified + farthest-point sampling', 'on speaker embeddings → 330 speakers, US · Europe · Asia · Latin America'],
      [I.wave, C.call, 'Zero-shot voice-cloning TTS', 'Qwen3-TTS [19] and CosyVoice-3 [20] render every query in m sampled voices'],
      [I.noise, C.act, 'Noise mixing', 'engine · road · wind · HVAC · rain · turn signal · cabin · room'],
    ];
    const y0 = 1.75, hh = 1.05, gap = 0.16;
    steps.forEach(([ic, col, h, b], i) => {
      const y = y0 + i * (hh + gap);
      card(s, 0.6, y, 6.3, hh, C.tint);
      iconCircle(s, 0.82, y + 0.2, 0.64, col, ic);
      text(s, h, { x: 1.65, y: y + 0.12, w: 5.1, h: 0.38, fontSize: 15, bold: true });
      text(s, b, { x: 1.65, y: y + 0.5, w: 5.1, h: 0.5, fontSize: 12, color: C.ink2 });
      if (i < steps.length - 1) s.addShape(pres.shapes.DOWN_ARROW, { x: 1.0, y: y + hh - 0.02, w: 0.28, h: 0.2, fill: { color: C.muted2 }, line: { color: C.muted2, width: 0 } });
    });
    // right: Table 2
    text(s, 'Speaker corpora (paper Table 2)', { x: 7.25, y: 1.72, w: 5.5, h: 0.35, fontSize: 14, bold: true });
    const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.ink } } });
    const rows = [
      [hdr('Corpus'), hdr('Speakers'), hdr('Regions'), hdr('Selected')],
      ['SPGISpeech 2.0 [15]', '41,593', 'US, Asia, LatAm', '100'],
      ['Emilia-YODAS [16]', '7,092', 'US, China', '100'],
      ['3D-Speaker [17]', '10,000', 'China', '30'],
      ['VoxPopuli [18]', '1,180', 'US, Europe', '100'],
      [{ text: 'Total', options: { bold: true } }, { text: '59,865', options: { bold: true } }, { text: '4 regions', options: { bold: true } }, { text: '330', options: { bold: true, color: C.speakDark } }],
    ];
    s.addTable(rows, { x: 7.25, y: 2.1, w: 5.48, colW: [1.85, 1.0, 1.68, 0.95], rowH: 0.42, fontFace: FONT, fontSize: 12.5, color: C.ink, align: 'left', valign: 'middle', border: { type: 'solid', pt: 0.75, color: C.line }, margin: [0.03, 0.08, 0.03, 0.08] });
    card(s, 7.25, 4.85, 5.48, 1.85, C.tint, { line: C.line });
    text(s, 'Algorithm 1, in one line', { x: 7.45, y: 4.95, w: 5.1, h: 0.35, fontSize: 13, bold: true, color: C.muted });
    text(s, 'S ← FPS({f(s)}, K)\nfor q in Q:  for s in sample(S, m):\n    ã ← Mix(TTS(q, s), n),  n ~ N', { x: 7.45, y: 5.3, w: 5.1, h: 0.9, fontFace: MONO, fontSize: 12, color: C.ink2 });
    text(s, 'Every query is heard in several voices and acoustic conditions.', { x: 7.45, y: 6.25, w: 5.1, h: 0.4, fontSize: 12, italic: true, color: C.muted });
  }

  // =====================================================================
  // 10. EVALUATION PROTOCOL
  // =====================================================================
  {
    const s = content({
      tag: 'Experiments', title: 'Evaluation protocol: two system families, three metrics',
      notes: '[8:00] We evaluate two families, zero-shot, open weights only. End-to-end SpeechLMs from 7 to 30 billion parameters: Qwen3-Omni, Qwen2.5-Omni, Kimi-Audio, Step-Audio-2 and Audio Flamingo 3. ' +
        'And cascades: Whisper-v3 transcripts fed with the tool definitions to Qwen3 or Gemma-3 text models. Plus an oracle that feeds the gold transcript to the same text models, which isolates the damage done by ASR. ' +
        'Three metrics. Tool accuracy: did you pick the right tool, in the right order? Exact match: is the entire call, tools and every argument, exactly right after normalisation? ' +
        'And parameter F1 over arguments. In the worked example, one of two arguments is right, so tool accuracy is 1, exact match is 0, and parameter F1 is 0.5.',
    });
    // left: systems
    card(s, 0.6, 1.75, 6.1, 2.35, C.tint);
    iconCircle(s, 0.85, 2.0, 0.6, C.speak, I.robot);
    text(s, 'End-to-end SpeechLMs  ·  audio → tool call', { x: 1.6, y: 2.02, w: 5.05, h: 0.5, fontSize: 15, bold: true, valign: 'middle' });
    text(s, 'Qwen3-Omni-30B [24]  ·  Qwen2.5-Omni-7B [24]  ·  Kimi-Audio-7B [23]\nStep-Audio-2-7B [21]  ·  Audio-Flamingo-3-8B [22]', { x: 0.9, y: 2.65, w: 5.6, h: 0.75, fontSize: 13.5, color: C.ink2, lineSpacingMultiple: 1.15 });
    text(s, 'Open weights only · 7B to 30B · zero-shot with tool definitions in the prompt', { x: 0.9, y: 3.45, w: 5.6, h: 0.5, fontSize: 12, italic: true, color: C.muted });

    card(s, 0.6, 4.25, 6.1, 2.45, C.tint);
    iconCircle(s, 0.85, 4.5, 0.6, C.act, I.cogs);
    text(s, 'Cascaded  ·  audio → Whisper-v3 [25] → text LLM', { x: 1.6, y: 4.52, w: 5.05, h: 0.5, fontSize: 15, bold: true, valign: 'middle' });
    text(s, 'Qwen3 1.7B / 4B / 8B [26]  ·  Gemma-3 12B / 27B [27]', { x: 0.9, y: 5.12, w: 5.6, h: 0.4, fontSize: 13.5, color: C.ink2 });
    runs(s, [{ text: '+ Oracle transcript: ', options: { bold: true, color: C.actDark } }, { text: 'gold text → same LLMs. Upper bound that isolates ASR damage.', options: { color: C.ink2 } }], { x: 0.9, y: 5.55, w: 5.6, h: 0.5, fontSize: 13.5 });
    text(s, 'Tier 8 (intent blending) is audio-only and is not scored for text/oracle systems.', { x: 0.9, y: 6.15, w: 5.6, h: 0.5, fontSize: 12, italic: true, color: C.muted });

    // right: metrics with worked example
    card(s, 6.95, 1.75, 5.78, 4.95, C.paper, { line: C.line, shadow: true });
    text(s, 'Three metrics, one worked example', { x: 7.2, y: 1.9, w: 5.3, h: 0.4, fontSize: 16, bold: true });
    rect(s, 7.2, 2.4, 5.28, 1.2, C.ink);
    runs(s, [
      { text: 'gold  ', options: { color: C.muted2 } }, { text: 'setZoneTemperature(zone="Driver", temperature=72)', options: { color: C.speak, breakLine: true } },
      { text: 'pred  ', options: { color: C.muted2 } }, { text: 'setZoneTemperature(zone="Driver", temperature=', options: { color: C.white } }, { text: '27', options: { color: C.act, bold: true } }, { text: ')', options: { color: C.white } },
    ], { x: 7.32, y: 2.4, w: 5.1, h: 1.2, fontFace: MONO, fontSize: 10.5, valign: 'middle', lineSpacingMultiple: 1.5 });
    const metrics = [
      ['Tool Accuracy', 'Right tool name(s), in the right order', '1', C.speak],
      ['Exact Match', 'Whole call identical after normalisation', '0', C.act],
      ['Parameter F1', 'Micro-averaged over arguments (1 of 2 correct)', '0.5', C.call],
    ];
    metrics.forEach(([n, d, v, col], i) => {
      const y = 3.8 + i * 0.93;
      card(s, 7.2, y, 5.28, 0.82, C.tint);
      circle(s, 7.35, y + 0.13, 0.56, col);
      text(s, v, { x: 7.35, y: y + 0.13, w: 0.56, h: 0.56, fontSize: 15, bold: true, color: C.white, align: 'center', valign: 'middle' });
      text(s, n, { x: 8.05, y: y + 0.08, w: 4.3, h: 0.35, fontSize: 14.5, bold: true });
      text(s, d, { x: 8.05, y: y + 0.42, w: 4.3, h: 0.35, fontSize: 12, color: C.ink2 });
    });
  }

  // =====================================================================
  // 11. FINDING 1
  // =====================================================================
  {
    const s = content({
      tag: 'Results · Finding 1', tagColor: C.actDark, title: 'Tool accuracy collapses when the query needs composition or inference',
      notes: '[9:00] Finding one. On direct commands the best model, Qwen3-Omni-30B, picks the right tool 92% of the time. ' +
        'Add composition, two or three calls in one utterance, and it drops to 75%. Implicit intent, "I am freezing", drops it to 33%. ' +
        'Notice Tier 5: a long rambling input alone is fine, 91%. So length is not the problem; reasoning is. ' +
        'Conversation and intent blending land at 55 and 42%. The same shape holds for every model, with smaller 7B models 15 to 20 points lower across the board.',
    });
    const data = Object.keys(ACC).map(k => ({ name: k, labels: TIERS, values: ACC[k] }));
    s.addChart(pres.charts.LINE, data, Object.assign({}, chartBase, {
      x: 0.5, y: 1.7, w: 8.3, h: 5.05, chartColors: [C.speak, C.act, C.call, C.muted2],
      lineSize: 2.5, lineDataSymbol: 'circle', lineDataSymbolSize: 8, lineSmooth: false,
      showLegend: true, legendPos: 'b', valAxisMinVal: 0, valAxisMaxVal: 100, valAxisMajorUnit: 20,
      showValAxisTitle: true, valAxisTitle: 'Tool accuracy (%)', valAxisTitleFontSize: 11, valAxisTitleColor: C.muted, valAxisTitleFontFace: FONT,
      catAxisLabelFontSize: 10.5,
    }));
    const notes = [
      ['92% → 33%', 'best model, direct command (T1) → implicit intent (T4)', C.act],
      ['T5 ≈ 91%', 'long, rambling input alone is not the problem', C.speak],
      ['≤ 56%', 'everyone, on conversation (T7) and intent blending (T8)', C.act],
    ];
    notes.forEach(([n, d, col], i) => {
      const y = 1.85 + i * 1.5;
      card(s, 9.05, y, 3.68, 1.35, C.tint);
      text(s, n, { x: 9.25, y: y + 0.12, w: 3.3, h: 0.6, fontSize: 26, bold: true, color: col });
      text(s, d, { x: 9.25, y: y + 0.72, w: 3.3, h: 0.6, fontSize: 12.5, color: C.ink2 });
    });
    text(s, 'Length is cheap; reasoning is expensive.', { x: 9.05, y: 6.45, w: 3.68, h: 0.35, fontSize: 13, italic: true, color: C.muted });
  }

  // =====================================================================
  // 12. FINDING 2
  // =====================================================================
  {
    const s = content({
      tag: 'Results · Finding 2', tagColor: C.actDark, title: 'Right tool, wrong arguments: exact match ≤ 16% even on plain parametric commands',
      notes: '[10:00] Finding two, and the one I would underline. Look at Tier 2, plain parametric commands like "set the temperature to 72". ' +
        'Tool accuracy is around 80% for everyone. Exact match is 10 to 16%. Models know what to call; they get the arguments wrong. ' +
        'And crucially, look at the last pair: Gemma with a perfect, oracle transcript is at 12%. So this is not an ASR problem. It is argument grounding and normalisation: units, ranges, enumerations, defaults. ' +
        'If you build voice agents, this is where the work is.',
    });
    s.addChart(pres.charts.BAR, [
      { name: 'Tool accuracy', labels: T2.labels, values: T2.acc },
      { name: 'Exact match (tool + all arguments)', labels: T2.labels, values: T2.em },
    ], Object.assign({}, chartBase, {
      x: 0.5, y: 1.72, w: 8.3, h: 5.0, barDir: 'col', barGrouping: 'clustered', barGapWidthPct: 55, chartColors: [C.speak, C.act],
      showLegend: true, legendPos: 'b', showValue: true, dataLabelPosition: 'outEnd', dataLabelFontSize: 10.5, dataLabelColor: C.ink, dataLabelFormatCode: '0.0',
      valAxisMinVal: 0, valAxisMaxVal: 100, valAxisMajorUnit: 20, catAxisLabelFontSize: 10.5,
      showValAxisTitle: true, valAxisTitle: 'Tier 2 · Parametric (%)', valAxisTitleFontSize: 11, valAxisTitleColor: C.muted, valAxisTitleFontFace: FONT,
    }));
    card(s, 9.05, 1.85, 3.68, 2.15, C.tint);
    text(s, '~80%', { x: 9.25, y: 1.95, w: 3.3, h: 0.6, fontSize: 30, bold: true, color: C.speak });
    text(s, 'pick the right tool', { x: 9.25, y: 2.55, w: 3.3, h: 0.35, fontSize: 13, color: C.ink2 });
    text(s, '10–16%', { x: 9.25, y: 2.95, w: 3.3, h: 0.6, fontSize: 30, bold: true, color: C.act });
    text(s, 'get every argument right', { x: 9.25, y: 3.55, w: 3.3, h: 0.35, fontSize: 13, color: C.ink2 });
    card(s, 9.05, 4.2, 3.68, 2.5, C.actTint);
    runs(s, [
      { text: 'Not an ASR problem. ', options: { bold: true, color: C.actDark } },
      { text: 'With a perfect transcript (oracle), Gemma-3-12B still reaches only 12.3% exact match. ', options: { color: C.ink2, breakLine: true } },
      { text: 'The bottleneck is argument grounding: units, ranges, enumerations, defaults.', options: { color: C.ink2 } },
    ], { x: 9.25, y: 4.3, w: 3.3, h: 2.3, fontSize: 13.5, lineSpacingMultiple: 1.1 });
  }

  // =====================================================================
  // 13. FINDING 3
  // =====================================================================
  {
    const s = content({
      tag: 'Results · Finding 3', tagColor: C.actDark, title: 'End-to-end SpeechLMs do not yet beat a strong cascade',
      notes: '[11:00] Finding three: end-to-end has not yet earned its promise. Compare the best SpeechLM, Qwen3-Omni-30B, with the strongest cascade, Whisper plus Gemma-3-27B. ' +
        'On the left, tool accuracy: the SpeechLM picks the right tool more often on six of eight tiers. On the right, parameter F1: the cascade fills arguments better on five of seven tiers, by 10 to 20 points on corrections and dialogue. ' +
        'So audio-native models hear the intent, but the text model is still the better argument filler. ' +
        'ASR is far from free, though: replacing Whisper with gold transcripts buys the cascade 10 to 14 points of tool accuracy on Tiers 2 to 7; that is in the backup slides.',
    });
    const lbl = TIERS.map(t => t.split(' ')[0]);
    s.addChart(pres.charts.LINE, [
      { name: 'Qwen3-Omni-30B (end-to-end)', labels: lbl, values: ACC['Qwen3-Omni-30B (end-to-end)'] },
      { name: 'Whisper-v3 + Gemma-3-27B (cascade)', labels: lbl, values: ACC['Whisper-v3 + Gemma-3-27B (cascade)'] },
    ], Object.assign({}, chartBase, {
      x: 0.5, y: 2.1, w: 6.05, h: 3.85, chartColors: [C.speak, C.act], lineSize: 2.5, lineDataSymbol: 'circle', lineDataSymbolSize: 8,
      showLegend: true, legendPos: 'b', valAxisMinVal: 0, valAxisMaxVal: 100, valAxisMajorUnit: 20,
    }));
    text(s, 'Tool accuracy (%)  ·  end-to-end wins 6 of 8 tiers', { x: 0.6, y: 1.75, w: 5.9, h: 0.35, fontSize: 14, bold: true });
    s.addChart(pres.charts.LINE, [
      { name: 'Qwen3-Omni-30B (end-to-end)', labels: lbl.slice(1), values: F1_E2E },
      { name: 'Whisper-v3 + Gemma-3-27B (cascade)', labels: lbl.slice(1), values: F1_CAS },
    ], Object.assign({}, chartBase, {
      x: 6.8, y: 2.1, w: 6.05, h: 3.85, chartColors: [C.speak, C.act], lineSize: 2.5, lineDataSymbol: 'circle', lineDataSymbolSize: 8,
      showLegend: true, legendPos: 'b', valAxisMinVal: 0, valAxisMaxVal: 60, valAxisMajorUnit: 20,
    }));
    text(s, 'Parameter F1 (%)  ·  cascade wins 5 of 7 tiers', { x: 6.9, y: 1.75, w: 5.9, h: 0.35, fontSize: 14, bold: true });
    card(s, 0.6, 6.05, 12.13, 0.75, C.tint, { line: C.line });
    runs(s, [
      { text: 'Audio-native models hear the intent; text models still fill the arguments better. ', options: { bold: true } },
      { text: 'And ASR is not free: gold transcripts add 10–14 points of tool accuracy to the cascade (backup).', options: { color: C.ink2 } },
    ], { x: 0.85, y: 6.05, w: 11.7, h: 0.75, fontSize: 14.5, valign: 'middle' });
  }

  // =====================================================================
  // 14. FINDING 4: NOISE
  // =====================================================================
  {
    const s = content({
      tag: 'Results · Finding 4', tagColor: C.actDark, title: 'Noise degrades every system, and the cascade degrades fastest',
      notes: '[12:00] Finding four: noise. We ablate three noise families from MS-SNSD, babble, mechanical hum and impulsive noise, at three levels: plus 15, plus 5 and minus 5 dB SNR. ' +
        'Every system degrades monotonically as SNR falls. The cascade degrades fastest, because Whisper errors compound downstream. Qwen3-Omni-30B is the most robust, but still loses substantially at minus 5 dB. ' +
        'That is exactly why noise is built into the benchmark distribution, not left as an ablation: a voice agent that only works in a quiet lab is not a voice agent.',
    });
    s.addImage({ path: path.join(ASSETS, 'fig3_right.png'), x: 0.6, y: 1.75, w: 5.5, h: 4.86 });
    text(s, 'Intent-classification F1 vs. noise level (paper Fig. 3, right). Error bars: std. over noise types.', { x: 0.6, y: 6.62, w: 5.6, h: 0.4, fontSize: 11, italic: true, color: C.muted });
    const pts = [
      [I.noise, C.act, '3 noise families × 3 SNR levels', 'Babble, mechanical hum, impulsive (MS-SNSD [28]) at +15, +5 and −5 dB'],
      [I.chart, C.act, 'Monotonic degradation for everyone', 'F1 falls steadily from low to high noise for every system tested'],
      [I.cogs, C.act, 'Cascades compound ASR errors', 'Whisper + Gemma-3-12B loses the most; Qwen3-Omni-30B is the most robust'],
      [I.db, C.speak, 'So noise is in the benchmark', 'Multiple noise types and levels are part of the released data, not just this ablation'],
    ];
    pts.forEach(([ic, col, h, b], i) => {
      const y = 1.75 + i * 1.23;
      card(s, 6.55, y, 6.18, 1.1, C.tint);
      iconCircle(s, 6.78, y + 0.23, 0.64, col, ic);
      text(s, h, { x: 7.6, y: y + 0.13, w: 5.0, h: 0.38, fontSize: 15, bold: true });
      text(s, b, { x: 7.6, y: y + 0.51, w: 5.0, h: 0.55, fontSize: 12.5, color: C.ink2 });
    });
  }

  // =====================================================================
  // 15. TAKEAWAYS
  // =====================================================================
  {
    const s = content({
      tag: 'Takeaways', title: 'What Audio2Tool tells us about speech tool use today',
      notes: '[12:45] So, four takeaways. Tool selection on simple commands is nearly solved; argument grounding is not, and it is not an ASR problem. ' +
        'Composition, implicit intent and multi-speaker audio are the open problems; long input by itself is fine. ' +
        'End-to-end SpeechLMs do not yet beat a strong cascade, so the audio-native promise is still unrealised. ' +
        'And robustness has to be measured, not assumed. Next, we are adding real recordings, safety-critical scenarios and more domains, and we hope the community will use the tiers to report where their models fail, not just how well they do on average.',
    });
    const pts = [
      [I.check, C.speak, 'Tool selection is nearly solved for direct commands', '>90% for the best model on Tier 1'],
      [I.warn, C.act, 'Argument grounding is the bottleneck (not ASR)', 'Exact match ≤16% on parametric commands, even with gold transcripts'],
      [I.layers, C.call, 'Composition, implicit intent, competing speakers: open', 'Tiers 3–4 and 7–8 sit at 33–75% tool accuracy; long input alone is fine'],
      [I.scale, C.ink2, 'End-to-end does not yet beat a strong cascade', 'SpeechLMs pick tools better; text LLMs fill arguments better; noise hurts cascades most'],
    ];
    pts.forEach(([ic, col, h, b], i) => {
      const y = 1.75 + i * 1.23;
      card(s, 0.6, y, 7.95, 1.1, C.tint);
      iconCircle(s, 0.83, y + 0.23, 0.64, col, ic);
      text(s, h, { x: 1.65, y: y + 0.12, w: 6.8, h: 0.4, fontSize: 15.5, bold: true });
      text(s, b, { x: 1.65, y: y + 0.54, w: 6.8, h: 0.5, fontSize: 13, color: C.ink2 });
    });
    card(s, 8.8, 1.75, 3.93, 4.79, C.ink);
    text(s, 'Next', { x: 9.05, y: 1.92, w: 3.5, h: 0.45, fontSize: 20, bold: true, color: C.speak });
    const nxt = [
      ['Real recordings', 'beyond zero-shot cloned speech'],
      ['Safety-critical scenarios', 'where a wrong action has real cost'],
      ['Broader domains, languages', 'and per-accent, per-noise breakdowns'],
      ['Use the tiers', 'report where a model fails, not just its average'],
    ];
    nxt.forEach(([h, b], i) => {
      const y = 2.5 + i * 0.98;
      circle(s, 9.05, y + 0.08, 0.22, C.speak);
      text(s, h, { x: 9.4, y: y, w: 3.2, h: 0.4, fontSize: 15, bold: true, color: C.white });
      text(s, b, { x: 9.4, y: y + 0.38, w: 3.2, h: 0.5, fontSize: 12.5, color: 'C9D3DF' });
    });
  }

  // =====================================================================
  // 16. CLOSING
  // =====================================================================
  {
    const s = dark({
      notes: '[13:45] Data, benchmark code and audio samples are at audio2tool dot github dot io; the QR code takes you there. ' +
        'Thank you, and thanks to my co-authors Apoorva, Parivesh, Rutu, Saloni, Aruna and Zengli. I am happy to take questions.',
    });
    wave(s, 0.8, 0.7, 11.7, 1.1, C.speak, [0.2, 0.35, 0.55, 0.8, 1, 0.7, 0.45, 0.9, 0.6, 0.3, 0.5, 0.85, 0.65, 0.4, 0.25, 0.55, 0.95, 0.7, 0.35, 0.6, 0.8, 0.45, 0.3, 0.5, 0.7, 0.4, 0.2]);
    runs(s, [
      { text: 'Speak. ', options: { color: C.speak } }, { text: 'Call. ', options: { color: C.call } }, { text: 'Act.', options: { color: C.act } },
    ], { x: 0.8, y: 2.1, w: 8, h: 1.1, fontSize: 60, bold: true });
    text(s, 'Dataset, evaluation harness and audio samples are released.\nWe would love to see your model on the leaderboard, one tier at a time.', { x: 0.8, y: 3.3, w: 8.4, h: 1.0, fontSize: 17, color: 'DCE4EE', lineSpacingMultiple: 1.15 });
    const links = [
      [I.link, 'audio2tool.github.io', 'samples, dataset, benchmark'],
      [I.file, 'arXiv:2604.22821', 'paper'],
      [I.github, 'github.com/RamitPahwa/Audio2Tool', 'code'],
      [I.envelope, 'ramitpahwa@rivianvw.tech', 'contact'],
    ];
    links.forEach(([ic, t, d], i) => {
      const y = 4.55 + i * 0.55;
      s.addImage({ data: ic, x: 0.85, y: y + 0.06, w: 0.34, h: 0.34 });
      runs(s, [{ text: t + '   ', options: { bold: true, color: C.white } }, { text: d, options: { color: C.muted2 } }], { x: 1.4, y, w: 7.5, h: 0.46, fontSize: 16, valign: 'middle' });
    });
    // QR
    card(s, 9.55, 2.1, 3.2, 3.85, C.white, { r: 0.15 });
    s.addImage({ path: path.join(ASSETS, 'qr_demo.png'), x: 9.75, y: 2.3, w: 2.8, h: 2.8 });
    text(s, 'audio2tool.github.io', { x: 9.55, y: 5.15, w: 3.2, h: 0.4, fontSize: 14, bold: true, color: C.ink, align: 'center' });
    text(s, 'listen to Tier 6, 7 and 8 samples', { x: 9.55, y: 5.5, w: 3.2, h: 0.35, fontSize: 11.5, color: C.muted, align: 'center' });
    text(s, 'Thank you  ·  Questions?', { x: 0.8, y: 6.75, w: 12, h: 0.45, fontSize: 18, color: C.speak, bold: true });
  }

  // =====================================================================
  // BACKUP 1: full results table
  // =====================================================================
  {
    const s = content({
      tag: 'Backup', tagColor: C.muted, title: 'Full results by tier (paper Table 3)',
      notes: 'Backup. Full Table 3 from the paper. Top block: oracle transcripts fed to text LLMs. Middle: Whisper-v3 cascades. Bottom: end-to-end SpeechLMs. ' +
        'Tier 8 is not scored for text systems because intent blending is an audio phenomenon.',
    });
    s.addImage({ path: path.join(ASSETS, 'table3.png'), x: 0.6, y: 1.7, w: 12.13, h: 4.5 });
    text(s, 'Rows 1–4: oracle (gold transcript) + text LLM  ·  rows 5–9: Whisper-v3 + text LLM  ·  rows 10–14: end-to-end SpeechLMs.  Acc = tool accuracy, EM = exact match, F1 = parameter F1. F1 undefined for Tier 1 (no parameters).', { x: 0.6, y: 6.2, w: 12.1, h: 0.6, fontSize: 12, color: C.muted });
  }

  // =====================================================================
  // BACKUP 2: the ASR tax
  // =====================================================================
  {
    const s = content({
      tag: 'Backup', tagColor: C.muted, title: 'The ASR tax: gold transcripts add 10–14 points of tool accuracy to the same LLM',
      notes: 'Backup. Same text LLM, two inputs: Whisper-v3 transcript versus the gold transcript. For Qwen3-8B the gap is 7 points on direct commands and 10 to 14 points on Tiers 2 to 7; Gemma-3-12B shows the same pattern. ' +
        'This is the cost the cascade pays for ASR, and it is the headroom an audio-native model could in principle recover.',
    });
    const lbl = TIERS.slice(0, 7).map(t => t.split(' ')[0]);
    s.addChart(pres.charts.LINE, [
      { name: 'Qwen3-8B · gold transcript', labels: lbl, values: ORACLE.q8o },
      { name: 'Qwen3-8B · Whisper-v3', labels: lbl, values: ORACLE.q8w },
      { name: 'Gemma-3-12B · gold transcript', labels: lbl, values: ORACLE.g12o },
      { name: 'Gemma-3-12B · Whisper-v3', labels: lbl, values: ORACLE.g12w },
    ], Object.assign({}, chartBase, {
      x: 0.5, y: 1.75, w: 8.3, h: 4.95, chartColors: [C.speak, '7FCBD3', C.act, 'F0A58E'], lineSize: 2.5, lineDataSymbol: 'circle', lineDataSymbolSize: 7,
      showLegend: true, legendPos: 'b', valAxisMinVal: 0, valAxisMaxVal: 100, valAxisMajorUnit: 20,
      showValAxisTitle: true, valAxisTitle: 'Tool accuracy (%)', valAxisTitleFontSize: 11, valAxisTitleColor: C.muted, valAxisTitleFontFace: FONT,
    }));
    const gaps = ORACLE.q8o.map((v, i) => (v - ORACLE.q8w[i]).toFixed(1));
    card(s, 9.05, 1.85, 3.68, 4.8, C.tint);
    text(s, 'Qwen3-8B gap\n(gold − Whisper)', { x: 9.25, y: 2.0, w: 3.3, h: 0.7, fontSize: 15, bold: true });
    text(s, lbl.map((t, i) => `${t}   +${gaps[i]}`).join('\n'), { x: 9.25, y: 2.7, w: 3.3, h: 3.0, fontFace: MONO, fontSize: 14, color: C.ink2, lineSpacingMultiple: 1.3 });
    text(s, 'points of tool accuracy recovered with perfect ASR', { x: 9.25, y: 5.9, w: 3.3, h: 0.6, fontSize: 12, italic: true, color: C.muted });
  }

  // =====================================================================
  // BACKUP 3: SLU dataset comparison (Table 1)
  // =====================================================================
  {
    const s = content({
      tag: 'Backup', tagColor: C.muted, title: 'Audio2Tool vs. SLU corpora (paper Table 1)',
      notes: 'Backup. Against classic SLU corpora, Audio2Tool spans fewer domains but a much larger intent space, 152 tools, and it explicitly models multi-intent queries. ' +
        'The slot count is lower because tool arguments are typed parameters rather than free-text slots.',
    });
    const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.ink } } });
    const rows = [
      [hdr('Dataset'), hdr('Domains'), hdr('Intents / tools'), hdr('Slots / parameters'), hdr('Multi-intent'), hdr('Output')],
      ['ATIS [6]', '1', '16', '41', 'No', 'intent + slots'],
      ['SNIPS [12]', '2', '7', '4', 'No', 'intent + slots'],
      ['FSC', '2', '6', '2', 'No', 'intent + slots'],
      ['SLURP [7]', '18', '46', '56', 'No', 'intent + slots'],
      ['MixATIS [13]', '1', '16', '41', 'Yes', 'intent + slots'],
      ['MixSNIPS [14]', '2', '7', '4', 'Yes', 'intent + slots'],
      ['MAC-SLU [9]', '8', '81', '192', 'Yes', 'intent + slots'],
      [{ text: 'Audio2Tool', options: { bold: true, color: C.speakDark } }, { text: '3', options: { bold: true } }, { text: '152', options: { bold: true } }, { text: '22', options: { bold: true } }, { text: 'Yes', options: { bold: true } }, { text: 'executable tool call(s)', options: { bold: true, color: C.speakDark } }],
    ];
    s.addTable(rows, { x: 0.6, y: 1.75, w: 12.13, colW: [2.4, 1.6, 2.0, 2.2, 1.6, 2.33], rowH: 0.48, fontFace: FONT, fontSize: 14, color: C.ink, align: 'center', valign: 'middle', border: { type: 'solid', pt: 0.75, color: C.line } });
    text(s, 'Slot count is lower by construction: tool arguments are typed parameters with constrained ranges, not free-text spans.', { x: 0.6, y: 6.3, w: 12.1, h: 0.4, fontSize: 13, italic: true, color: C.muted });
  }

  // =====================================================================
  // BACKUP 4: tier design details (paper Fig. 1)
  // =====================================================================
  {
    const s = content({
      tag: 'Backup', tagColor: C.muted, title: 'Tier generation details: word budgets, prompt inputs and label fields (paper Fig. 1)',
      notes: 'Backup. The generation recipe per tier: word budgets, what the generator sees, and which extra fields the gold label carries. ' +
        'Tier 6 labels store both the original call and the correction type; Tier 8 labels store additional tool calls attributed to the primary speaker only.',
    });
    s.addImage({ path: path.join(ASSETS, 'fig1_tiers.png'), x: 0.6, y: 2.2, w: 12.13, h: 2.15 });
    const facts = [
      ['Generators', 'GPT-5.2 · Gemini 2.5 Pro · Claude Opus'],
      ['Judges (disjoint)', 'GPT-5.1 · Gemini 2.5 Pro: correctness, difficulty, variability'],
      ['Verification', 'manual check of every judge-flagged query and its gold tools'],
      ['TTS', 'Qwen3-TTS [19] · CosyVoice-3 [20], zero-shot voice cloning; noise mixed per Algorithm 1'],
    ];
    facts.forEach(([h, b], i) => {
      const x = 0.6 + (i % 2) * 6.15, y = 4.85 + Math.floor(i / 2) * 0.85;
      card(s, x, y, 5.98, 0.72, C.tint);
      runs(s, [{ text: h + '   ', options: { bold: true } }, { text: b, options: { color: C.ink2 } }], { x: x + 0.2, y, w: 5.6, h: 0.72, fontSize: 13, valign: 'middle' });
    });
  }

  // =====================================================================
  // REFERENCES (numbering follows the paper's bibliography)
  // =====================================================================
  {
    const s = content({
      tag: 'References', tagColor: C.muted, title: 'References',
      notes: 'References cited in the paper, in the paper\'s numbering. Not spoken; here for the audience and for Q&A.',
    });
    // [n, authors, title, venue] — venue kept short; arXiv ids given where the paper gives them
    const REFS = [
      [1, 'Chen, Yue, Zhang, Gao, Tan, Li', 'VoiceBench: Benchmarking LLM-based voice assistants', 'arXiv:2410.17196, 2024'],
      [2, 'Zhong, Du, Zhang, Hu, Tang', 'ComplexFuncBench: Multi-step and constrained function calling under long-context scenario', 'arXiv:2501.10132, 2025'],
      [3, 'Patil, Mao, Yan, Ji, Suresh, Stoica, Gonzalez', 'The Berkeley Function Calling Leaderboard (BFCL): From tool use to agentic evaluation of LLMs', 'ICML 2025'],
      [4, 'Wang, Zou, Lin, Sun, Liu, Zhang, Liu, Aw, Chen', 'AudioBench: A universal benchmark for audio large language models', 'NAACL 2025'],
      [5, 'Jain, Shukla, Rajeev, Kulkarni, Khatri, Agarwal', 'VoiceAgentBench: Are voice assistants ready for agentic tasks?', 'arXiv:2510.07978, 2025'],
      [6, 'Hemphill, Godfrey, Doddington', 'The ATIS spoken language systems pilot corpus', 'Workshop on Speech and Natural Language, 1990'],
      [7, 'Bastianelli et al.', 'SLURP: A spoken language understanding resource package', 'EMNLP 2020'],
      [8, 'Tomasello, Shrivastava, Lazar, et al.', 'STOP: A dataset for spoken task oriented semantic parsing', 'arXiv:2207.10643, 2022'],
      [9, 'Peng, Cai, Liu, et al.', 'MAC-SLU: Multi-intent automotive cabin spoken language understanding benchmark', 'arXiv:2512.01603, 2025'],
      [10, 'Mao, Ginart, Emmons', 'BFCL Audio: A benchmark for audio-native function calling', 'Salesforce AI Research blog, 2025'],
      [11, 'Mao, Patil, Gonzalez', 'MFCL: A multi-modal function calling evaluation for large language models', 'OpenReview, 2025'],
      [12, 'Coucke, Saade, Ball, et al.', 'Snips voice platform: An embedded SLU system for private-by-design voice interfaces', 'EMNLP 2018'],
      [13, 'Nguyen, Hoang, Tu, Ngo', 'Joint multiple intent detection and slot filling with supervised contrastive learning and self-distillation', 'arXiv:2308.14654, 2023'],
      [14, 'Qin, Xu, Che, Liu', 'AGIF: An adaptive graph-interactive framework for joint multiple intent detection and slot filling', 'Findings of EMNLP 2020'],
      [15, 'Grossman, Park, Dhawan, et al.', 'SPGISpeech 2.0: Transcribed multi-speaker financial audio for speaker-tagged transcription', 'arXiv:2508.05554, 2025'],
      [16, 'Shao', 'YodasSpeakerPool: A richly-annotated multi-speaker dataset for voice cloning (built from Emilia-YODAS)', 'GitHub, 2026'],
      [17, 'Zheng, Cheng, Chen, Wang, Chen', '3D-Speaker: A large-scale multi-device, multi-distance, and multi-dialect corpus', 'arXiv:2306.15354, 2023'],
      [18, 'Wang, Riviere, Lee, et al.', 'VoxPopuli: A large-scale multilingual speech corpus for representation learning', 'ACL-IJCNLP 2021'],
      [19, 'Hu, Zhu, He, et al.', 'Qwen3-TTS technical report', 'arXiv:2601.15621, 2026'],
      [20, 'Du, Gao, Wang, et al.', 'CosyVoice 3: Towards in-the-wild speech generation via scaling-up and post-training', 'arXiv:2505.17589, 2025'],
      [21, 'Wu, Yan, Hu, et al.', 'Step-Audio 2 technical report', 'arXiv:2507.16632, 2025'],
      [22, 'Goel, Ghosh, Kim, et al.', 'Audio Flamingo 3: Advancing audio intelligence with fully open large audio language models', 'arXiv:2507.08128, 2025'],
      [23, 'Ding, Ju, Leng, et al.', 'Kimi-Audio technical report', 'arXiv:2504.18425, 2025'],
      [24, 'Xu, Guo, Hu, et al.', 'Qwen3-Omni technical report', 'arXiv:2509.17765, 2025'],
      [25, 'Radford, Kim, Xu, Brockman, McLeavey, Sutskever', 'Robust speech recognition via large-scale weak supervision (Whisper)', 'ICML 2023'],
      [26, 'Yang, Li, Yang, et al.', 'Qwen3 technical report', 'arXiv:2505.09388, 2025'],
      [27, 'Kamath, Ferret, Pathak, et al.', 'Gemma 3 technical report', 'arXiv:2503.19786, 2025'],
      [28, 'Reddy, Beyrami, Pool, Cutler, Srinivasan, Gehrke', 'A scalable noisy speech dataset and online subjective test framework (MS-SNSD)', 'arXiv:1909.08050, 2019'],
    ];
    const col = (items, x) => {
      const paras = [];
      items.forEach(([n, a, t, v], i) => {
        const last = i === items.length - 1;
        const end = (str) => /[.?!]$/.test(str) ? `${str} ` : `${str}. `;  // avoid "et al.." and "tasks?."
        paras.push({ text: `[${n}]  `, options: { bold: true, color: C.speakDark } });
        paras.push({ text: end(a), options: { color: C.ink2 } });
        paras.push({ text: end(t), options: { color: C.ink } });
        paras.push({ text: v, options: { color: C.muted, italic: true, breakLine: !last } });
      });
      runs(s, paras, { x, y: 1.6, w: 5.98, h: 5.35, fontSize: 9.5, lineSpacingMultiple: 1.05, paraSpaceAfter: 3 });
    };
    col(REFS.slice(0, 14), 0.6);
    col(REFS.slice(14), 6.75);
    text(s, 'Numbers match the bracketed citations on the earlier slides and in the paper (arXiv:2604.22821).', { x: 0.6, y: 6.78, w: 12.1, h: 0.28, fontSize: 10, italic: true, color: C.muted });
  }

  await pres.writeFile({ fileName: OUT });
  console.log('wrote', OUT, 'slides:', slideNo);
})().catch(e => { console.error(e); process.exit(1); });
