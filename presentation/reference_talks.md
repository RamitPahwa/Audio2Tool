# How past Interspeech orals are built — reference notes

Collected 12 Sep 2026 while preparing the Audio2Tool oral. Two kinds of material: full talk recordings
(Interspeech recorded every paper talk in the hybrid years 2020–2022) and slide decks that authors posted
after in-person orals. No earlier Interspeech deck from the Rivian/VW team was found in Google Drive.

## 1. Where full talk recordings live

| Year | Where | Notes |
|---|---|---|
| Interspeech 2021 (Brno, hybrid) | YouTube channel `INTERSPEECH2021` — https://www.youtube.com/channel/UC2-z0HD4WpSbJONj73BgfwQ/videos | 600+ talks. Most papers have two cuts: a 3-minute "introduction" and the full 12–18 minute oral. Mirror: https://www.superlectures.com/interspeech2021/ (unreachable from this environment; try from your machine). |
| Interspeech 2022 (Incheon) | https://www.youtube.com/channel/UC5v1QPB4issDEqcD2slZmqw | Keynotes, six survey talks, sketch video; a subset of orals. |
| Interspeech 2020 (virtual) | https://www.superlectures.com/interspeech2020/ and https://www.youtube.com/channel/UCBbaGU7JqAgalMoRtSIIkiw | Every paper had a pre-recorded talk. |
| Interspeech 2019 (Graz) | https://www.youtube.com/channel/UC5KMlgs8x5G3r4W9rImMHlg | Keynotes and selected sessions. |
| Index of all of the above | https://isca-speech.org/Video-Archive | ISCA's official video index (Interspeech 2010–2022). |
| 2023–2025 | not centrally recorded | Authors post their own; examples below. |

## 2. Recordings worth watching before rehearsing

Closest in genre to Audio2Tool (dataset / benchmark / SLU papers), all verified links.

| Talk | Why it is useful | Length | Link |
|---|---|---|---|
| Spoken ObjectNet: A Bias-Controlled Spoken Caption Dataset (Interspeech 2021) | A dataset paper compressed to its essentials: motivation in 30 s, construction, one results table. | 4 min | https://youtu.be/BrHTrNft3B8 |
| DDS: A Device-Degraded Speech Dataset for Speech Enhancement (NII Yamagishi Lab) | Dataset-construction pipeline plus an "acoustic realism" argument very close to our TTS + noise story. | 10 min | https://youtu.be/G_wEdWFR1hg |
| CLAC: A Speech Corpus of Healthy English Speakers (Interspeech 2021, 3-min cut) | How to state corpus statistics fast without reading a table aloud. | 3 min | https://youtu.be/wXmolB2j4q8 |
| Contrastive Learning for Improving ASR Robustness in SLU (Interspeech 2022, NTU MiuLab) | Full-length SLU oral. The ASR-error-robustness framing parallels our Finding 3 (the ASR tax). | 14 min | https://youtu.be/uZq5k7-Fhzk |
| Few-Shot Spoken Language Understanding via Joint Speech-Text Models | Full-length SLU oral; clean problem → method → results arc. | 14 min | https://youtu.be/8K8BcCt8UjI |
| Integrating Dialog History into End-to-End SLU (Interspeech 2021, 3-min cut) | Multi-turn SLU, relevant to how we explain Tier 7. | 3 min | https://youtu.be/KQY0xEvJNmk |
| Interspeech 2021 Acoustic Echo Cancellation Challenge (oral) | How a benchmark organiser presents dataset + baselines + leaderboard in one talk. | 19 min | https://youtu.be/8y6NGCIlIOw |
| CommonAccent @ Interspeech 2023 | Accent-diversity dataset talk; useful for the 330-voice, four-region slide. | 14 min | https://youtu.be/EWPVq3Q4I18 |
| Comparison of Multilingual Self-Supervised and Weakly-Supervised Speech Pre-training (Interspeech 2023) | Recent in-person-style oral; good pacing model. | 13 min | https://youtu.be/dy2K_ZU8eYs |
| Auxiliary Network Based Word-Level End-to-End Neural Speaker Diarization (Interspeech 2024) | Recent oral; shows current slide density and pacing. | 16 min | https://youtu.be/uMV1W8MmwSw |
| Interspeech 2022 Survey Talks 1 & 2 | Long-form; how senior speakers structure a narrative for this audience. | 74 min | https://youtu.be/b1erA6vGnNc |

## 3. Slide decks from Interspeech orals (PDF)

1. **Zhao, Ding, Gutierrez-Osuna — "Foreign Accent Conversion by Synthesizing Speech from Phonetic Posteriorgrams", Interspeech 2019 oral.**
   17 slides. Title → Introduction (problem + challenge, one slide) → Related work (one slide, cited inline) → Method overview (one diagram) →
   five method slides → Experimental setup → Baseline → three results slides, one metric and one chart each (MOS, preference, accentedness) →
   Discussion → Conclusion (future work + data, code and demo links) → "Thanks / Q&A". Every slide has one heading, one figure and at most six bullets, with footnote citations.
   https://guanlongzhao.github.io/media/publication/zhao2019interspeech_slides.pdf
2. **Xin Wang et al. — "Revisiting and Improving Scoring Fusion for Spoofing-aware Speaker Verification", Interspeech 2024 oral (session A4-O2.3).**
   36 slides + 6 appendix. Slide 2 is literally titled **"Summary in one slide"** (question, message, methods, results). Then Background (5) →
   the question, shown on one diagram annotated progressively (4) → "Answers by this work" (2) → Method 1 (7 slides, one idea added per slide) →
   Method 2 (4) → demo on toy data (3) → Recap → Experiments (6) → "Main messages" → "Pointers" (related resources) → Thank-you slide with three QR codes
   (code, appendix, dataset) → Appendix. Because most slides are incremental builds of the same figure, the effective idea count is about 15.
   https://drive.google.com/file/d/11IlXr_XCcBB93wxj2pzeQNDLRm4OUfiM/view
3. **Xin Wang — "Comparison of (some) Recent Neural Network Spoofing Countermeasures for Logical Access", Interspeech 2021.**
   30 slides + 8 appendix. Background → This study → Motivation → Methods → Experiments → Results → Summary → Messages → Discussion → Appendix.
   https://drive.google.com/file/d/1QXqbwgtwIeSz78c4U0C6DVcu-bV9LqWo/view
4. **Xin Wang — "Using Cyclic Noise as Source Signal for Neural Source-Filter Waveform Models", Interspeech 2020.**
   34 slides + 16 appendix, heavy use of builds; a samples page is linked on the summary slide.
   https://drive.google.com/file/d/1i5oxGxXZNuWyYe3znTYyo38kK6siGkkh/view
5. Index of all of Xin Wang's Interspeech decks (2016–2024): https://tonywangx.github.io/slide.html
6. Tutorial decks (not orals, but the same audience and slide idiom): Interspeech 2023 source-separation tutorial on Speaker Deck
   https://speakerdeck.com/yoshipon/interspeech2023-t5-part4-bando ; Interspeech 2023 anti-spoofing tutorial https://github.com/Jungjee/INTERSPEECH2023_T6 ;
   Interspeech 2025 speech-interpretability tutorial https://interpretingdl.github.io/speech-interpretability-tutorial/

## 4. Patterns across these talks, and where our deck stands

| Pattern seen in the reference talks | Audio2Tool deck |
|---|---|
| **Answer first.** Wang 2024 opens with "Summary in one slide"; the 3-minute Interspeech 2021 cuts state the contribution in the first 30 s. | Added slide 2 "This talk in one slide" (question, what we built, four findings). |
| **One idea per slide, built incrementally.** The Wang decks reuse one diagram across 4–7 slides, adding one annotation at a time; ~15 ideas fill 15 minutes. | 17 static slides. If you want the same effect, add PowerPoint "Appear" animations to the cards on slides 4, 8 and 12 so each card lands as you speak. |
| **One metric, one chart per results slide** (Zhao: MOS, preference, accentedness on three slides). | Findings 1–4 are each one chart plus one message. |
| **Explicit "messages" slide, then a "pointers/resources" slide; closing slide carries QR codes** (Wang 2024 has three). | Takeaways slide + closing slide with one QR. Consider a second QR for the arXiv PDF. |
| **Appendix slides for Q&A** (6–16 in the Wang decks). | 4 backups: full Table 3, ASR tax, SLU comparison, tier generation details. |
| **Footnote citations on the slide**, not a references slide. | Related benchmarks are named in text on slides 5 and 9; small footnote citations (BFCL, SLURP, MAC-SLU, VoiceAgentBench, MS-SNSD) would match the idiom. |
| **Audio samples or a demo page are standard for speech talks** (Zhao: demo page; Wang 2020: samples page). | audio2tool.github.io on slides 6 and 17; embedding 2–3 clips (Tier 6, Tier 8, −5 dB) would be the strongest single upgrade. |
| **Length:** 15-minute orals run 15–20 content slides (Zhao 17; Wang ~30 with builds ≈ 15 ideas). | 17 talk slides + 4 backups. |
| **Institution logo on the title slide; small footer with conference name and slide number** (all decks). | Footer and slide number present. Add the Rivian and Volkswagen Group Technologies logo on slide 1 if brand guidelines allow (asset not available in this environment). |

## 5. General advice that recurs in the presenter guides

- Interspeech's own guidance since 2016: 15 minutes strictly, questions after; session chairs cut speakers off. Rehearse to 14:00–14:30.
- Be at your data by minute 6 (we reach the first result at 9:00 because the benchmark itself is a contribution; the summary slide at 0:30 compensates by giving the answers early).
- Roughly 100–130 spoken words per minute; prepare exactly the material for the time, no more. Our script is ~1,500 spoken words for slides 1–17, about 12 minutes at 125 wpm, so the 14:15 cumulative marks already include pauses and chart-pointing time.
- Design for the back row: 14 pt minimum body text, one message per slide, signpost where you are in the talk.

Sources: [ISCA Video Archive](https://isca-speech.org/Video-Archive), [INTERSPEECH2021 YouTube](https://www.youtube.com/channel/UC2-z0HD4WpSbJONj73BgfwQ/videos),
[INTERSPEECH 2022 YouTube](https://www.youtube.com/channel/UC5v1QPB4issDEqcD2slZmqw), [Zhao 2019 slides](https://guanlongzhao.github.io/media/publication/zhao2019interspeech_slides.pdf),
[Xin Wang talks & slides](https://tonywangx.github.io/slide.html), [Interspeech 2016 presentation guidelines](http://www.interspeech2016.org/Presentation-Guidelines),
[Mark Hill, Oral Presentation Advice](https://pages.cs.wisc.edu/~markhill/conference-talk.html), [Jennifer Widom, Tips for conference talks](https://cs.stanford.edu/people/widom/conference-talks.html),
[Paul Edwards, How to Give an Academic Talk](https://pne.people.si.umich.edu/PDF/howtotalk.pdf).
