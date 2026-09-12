# Interspeech 2026 oral presentation — Audio2Tool

Materials for the oral presentation of
*Audio2Tool: Speak, Call, Act – A Dataset for Benchmarking Speech Tool Use*
(arXiv:2604.22821) at Interspeech 2026, ICC Sydney, 28 Sep – 1 Oct 2026.

| File | What it is |
|---|---|
| `Audio2Tool_Interspeech2026_Oral.pptx` | The deck: 16 talk slides + 4 backup slides, 16:9, speaker notes on every slide |
| `talk_script.md` | Timed speaking script (≈14 min), Q&A preparation, rehearsal checklist |
| `src/build_deck.js` | Generator script (pptxgenjs). Every number is typed in from the paper, so edits are reproducible |
| `src/assets/` | Figure crops from the paper PDF (Fig. 1, 2c, 3, Table 3) and the QR code for audio2tool.github.io |

## Official Interspeech 2026 presenter requirements

Source: the "Presentation Requirements" section published on interspeech2026.org
(the site renders client-side; the text is embedded in the page data). Verified 12 Sep 2026.

- **Format:** PowerPoint (`.ppt` / `.pptx`), **16:9 widescreen**. Keynote/Canva/Google Slides must be exported to PowerPoint.
- **Timing:** each oral is allocated **20 minutes including Q&A**; **15 min talk + 5 min Q&A** is the recommended split.
- **Upload:** in advance via the conference ShareFile link (open from Mon 7 Sep). File name pattern
  `Day_Time_Room_Yourname.pptx`, e.g. `Fri_1345_C3.4_Jane Smith.pptx`; revisions as `..._v2.pptx`, `..._v3.pptx`.
- **Onsite check:** presentations run on **Windows conference computers** through the AV system; you **cannot present from your own laptop**.
  Check the final file in the **Speaker Preparation Room at least 3 hours before the session**. Bring a backup on USB or cloud.
- **Room AV:** digital lectern, microphone, projector/screen, audio playback (so embedded audio samples will play).
- Session, time and room are listed in the Preliminary Program.

Previous editions (Interspeech 2023/2024) additionally recommended embedding all fonts and media in the file and avoiding any
dependence on internet access or online slides. This deck follows that: system fonts only (Calibri, Courier New), no links that must resolve live.

## Pre-conference checklist

- [ ] Look up session day/time/room in the Preliminary Program; rename the file `Day_Time_Room_RamitPahwa_v1.pptx`.
- [ ] Optional: drop 2–3 short audio samples (Tier 6 correction, Tier 8 intent blending, one −5 dB noisy clip) onto slides 7 and 14 as embedded media (`Insert → Audio → Audio on My PC`, set "Play in Click Sequence"). The room has audio playback.
- [ ] Open the file in PowerPoint on Windows once; confirm charts, fonts and the notes pane look right.
- [ ] Upload via ShareFile; re-upload as `_v2` after any change.
- [ ] Onsite: Speaker Preparation Room ≥ 3 h before the session; also carry the file on USB.
- [ ] Rehearse to 14:00–14:30 with a timer; the script in `talk_script.md` has cumulative time marks.

## Rebuilding the deck

```bash
cd presentation/src
npm install pptxgenjs sharp react react-dom react-icons
node build_deck.js ../Audio2Tool_Interspeech2026_Oral.pptx
```
