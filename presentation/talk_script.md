# Audio2Tool — Interspeech 2026 oral: talk script and Q&A prep

Target: **14:00–14:30 of speaking** inside the 20-minute slot (15 min talk + 5 min Q&A recommended by the organisers).
Cumulative time marks are in brackets. The same text is in the speaker-notes pane of each slide (the lectern laptop runs Presenter View).

Delivery notes
- Slides 1, 2, 6, 13, 17 are the "anchor" slides: title, the one-slide summary, the at-a-glance numbers, the argument-grounding finding, the closing. If you run long, compress slides 9–10 (data generation and TTS), never 12–14.
- Speak the spoken examples out loud ("I'm freezing", "Set an alarm for 7… wait, make it 8"). They land far better heard than read.
- If you embed audio samples (see README checklist), play one on slide 8 (Tier 8 intent blending) and one on slide 15 (−5 dB noise). Budget 20 s each; the cumulative marks below assume no audio.
- See `reference_talks.md` for recordings of past Interspeech orals to model pacing on.

---

## 1 · Title  [0:00 → 0:30]
Good afternoon. I'm Ramit Pahwa from Rivian and Volkswagen Group Technologies. Today I'll present Audio2Tool, a benchmark for a capability that is quickly becoming the centre of voice assistants: going straight from speech to an executable tool call. The title says it all: the user speaks, the model calls a tool, the device acts.

## 2 · This talk in one slide  [0:30 → 1:00]
Here is the entire talk on one slide, so you know where we are going. The question: can today's speech language models turn a spoken request into a correct, executable tool call under realistic acoustic conditions? We built Audio2Tool to answer it: thirty thousand spoken queries over 152 tools, eight complexity tiers, 330 cloned voices and real noise.

And the answers, in one breath: picking the right tool is nearly solved for direct commands; getting the arguments right is not, and that is not an ASR problem; composition, implicit intent and competing speakers are still open; and end-to-end models do not yet beat a strong cascade. The rest of the talk is the evidence.

## 3 · Voice assistants are becoming agents  [1:00 → 2:00]
For a decade, spoken language understanding meant classification. ASR produced text, an NLU module produced an intent and a few slots, and hand-written logic did the rest. Speech language models change the contract: the model now emits the action itself, an API call with typed arguments.

That raises the bar for correctness. The call must be schema-valid, every argument must be right, and for multi-step requests the order matters. A near-miss is not partially right. It is a wrong action, in a car, at highway speed.

## 4 · Speech adds failure modes text never sees  [2:00 → 3:00]
"Fifteen" and "fifty" are one phoneme apart, but one is a comfortable cabin and the other is not. Real cabins have engine, wind and HVAC noise. People repair themselves mid-utterance: "set an alarm for seven… wait, make it eight". And there are other voices in the room, a podcast, a passenger, a radio ad, carrying perfectly valid commands the system must not execute.

In every one of these cases the error doesn't produce a wrong label. It produces a wrong action.

## 5 · Existing benchmarks each cover part of the problem  [3:00 → 4:00]
Text function-calling benchmarks such as BFCL define the executable formalism, but have no audio. Classic SLU corpora, SLURP, STOP, MAC-SLU, are spoken, but label intents and slots rather than executable calls. Recent audio tool-use sets, BFCL-Audio, VoiceAgentBench, MFCL, bring speech and executable calls together, but they are narrow in domain and acoustic conditions, and they don't tell you *why* a model fails.

We wanted all five columns at once, and we wanted the benchmark to be diagnostic: to isolate failure modes rather than report one aggregate number.

## 6 · Audio2Tool at a glance  [4:00 → 4:45]
Here is Audio2Tool in numbers. Roughly thirty thousand queries, each with a gold tool call, over 152 tools in 23 categories across three domains: smart car, smart home and wearables. Eight complexity tiers. 330 cloned voices from two zero-shot TTS engines, mixed with real in-car and indoor noise.

To our knowledge this is the first speech-to-tool benchmark with this combination of domain breadth, acoustic diversity and tiered complexity. Samples are at audio2tool.github.io.

## 7 · A taxonomy grounded in real APIs  [4:45 → 5:45]
The taxonomy is grounded in real, public APIs: Android Automotive functionality, smart-home device standards, wearable SDKs. Smart Car is the largest domain with 14 categories, from climate and driving dynamics to charging and maintenance, because hands-free in-cabin use is where mistakes are most costly.

Two design rules. First, operational intent: we separate state-altering commands like "set temperature" from passive monitoring like "check battery". Second, domain specificity: device-specific categories such as driving dynamics or activity tracking are kept, not flattened. The treemap shows how queries distribute over categories; climate and environment dominate, as they do in real usage.

## 8 · Eight tiers, eight failure modes  [5:45 → 7:00]
Each tier isolates a failure mode. Tiers 1 and 2 test the basics: pick the right tool, extract explicit parameters. Tiers 3 and 4 test composition and pragmatic inference; "I'm freezing" contains no tool name at all.

Tiers 5 to 8 test realism: an intent buried in 25 to 60 words of rambling; mid-utterance corrections; multi-turn USER/AGENT dialogue with persistent state; and, unique to audio, intent blending, where a background speaker issues a valid but unwanted command. Tier 8 is fundamentally a speaker-attribution problem, and it cannot even be posed in text.

## 9 · From taxonomy to ~30K verified queries  [7:00 → 7:30]
Tier-specific prompts over the 152-tool taxonomy, using three frontier LLMs. A *disjoint* set of judge models scored every query for correctness, difficulty and variability, and every query a judge flagged was manually checked, including its ground-truth tool call.

Tiers 3 to 7 have 4,560 queries each; Tier 2 is the largest at 5,800 because parameter coverage needs volume; Tier 8 has 1,000. Within Tier 3, 62% of queries need two calls and 36% three.

## 10 · Making it sound real  [7:30 → 8:00]
We clone 330 voices selected from a pool of almost 60,000 speakers across four public corpora covering the US, Europe, Asia and Latin America: stratified by region, then farthest-point sampling on speaker embeddings for maximal accent diversity. Two zero-shot engines, Qwen3-TTS and CosyVoice-3, render each query in several voices, and we mix in automotive and indoor noise. Synthetic speech is a stated limitation and real recordings are the next step, but this is, to our knowledge, the broadest accent and acoustic coverage in a speech tool-calling benchmark.

## 11 · Evaluation protocol  [8:00 → 9:00]
Two families, zero-shot, open weights only. End-to-end SpeechLMs from 7 to 30 billion parameters: Qwen3-Omni, Qwen2.5-Omni, Kimi-Audio, Step-Audio-2 and Audio Flamingo 3. And cascades: Whisper-v3 transcripts, plus the tool definitions, fed to Qwen3 or Gemma-3 text models. Plus an oracle that feeds the gold transcript to the same text models, which isolates the damage done by ASR.

Three metrics. Tool accuracy: did you pick the right tool, in the right order? Exact match: is the entire call, tools and every argument, exactly right after normalisation? And parameter F1 over arguments. In the worked example one of two arguments is right, so tool accuracy is 1, exact match is 0, parameter F1 is 0.5.

## 12 · Finding 1: accuracy collapses with composition and inference  [9:00 → 10:00]
On direct commands the best model, Qwen3-Omni-30B, picks the right tool 92% of the time. Add composition, two or three calls in one utterance, and it drops to 75%. Implicit intent, "I'm freezing", drops it to 33%.

Notice Tier 5: a long rambling input alone is fine, 91%. So *length* is not the problem; *reasoning* is. Conversation and intent blending land at 55 and 42%. The same shape holds for every model, with the 7B models 15 to 20 points lower across the board.

## 13 · Finding 2: right tool, wrong arguments  [10:00 → 11:00]
This is the one I'd underline. Look at Tier 2, plain parametric commands like "set the temperature to 72". Tool accuracy is around 80% for everyone. Exact match is 10 to 16%. Models know *what* to call; they get the arguments wrong.

And crucially, the last pair: Gemma with a perfect oracle transcript is at 12%. So this is *not* an ASR problem. It is argument grounding and normalisation: units, ranges, enumerations, defaults. If you build voice agents, this is where the work is.

## 14 · Finding 3: end-to-end doesn't yet beat a strong cascade  [11:00 → 12:00]
Compare the best SpeechLM, Qwen3-Omni-30B, with the strongest cascade, Whisper plus Gemma-3-27B. Left, tool accuracy: the SpeechLM picks the right tool more often on six of eight tiers. Right, parameter F1: the cascade fills arguments better on five of seven tiers, by 10 to 20 points on corrections and dialogue.

So audio-native models hear the intent, but the text model is still the better argument filler. ASR is far from free, though: replacing Whisper with gold transcripts buys the cascade 10 to 14 points of tool accuracy on Tiers 2 to 7. That chart is in the backup slides.

## 15 · Finding 4: noise degrades everyone, cascades fastest  [12:00 → 12:45]
Three noise families from MS-SNSD, babble, mechanical hum and impulsive noise, at plus 15, plus 5 and minus 5 dB SNR. Every system degrades monotonically as SNR falls. The cascade degrades fastest because Whisper errors compound downstream. Qwen3-Omni-30B is the most robust, but still loses substantially at minus 5 dB.

That is why noise is built into the benchmark distribution, not left as an ablation. A voice agent that only works in a quiet lab is not a voice agent.

## 16 · Takeaways  [12:45 → 13:45]
Four takeaways. Tool selection on simple commands is nearly solved; argument grounding is not, and it is not an ASR problem. Composition, implicit intent and multi-speaker audio are the open problems; long input by itself is fine. End-to-end SpeechLMs do not yet beat a strong cascade, so the audio-native promise is still unrealised. And robustness has to be measured, not assumed.

Next: real recordings, safety-critical scenarios, more domains, and we hope the community uses the tiers to report *where* models fail, not just how well they do on average.

## 17 · Closing  [13:45 → 14:15]
Data, benchmark code and audio samples are at audio2tool.github.io; the QR code takes you there. Thank you, and thanks to my co-authors Apoorva, Parivesh, Rutu, Saloni, Aruna and Zengli. Happy to take questions.

---

## Q&A preparation

Reviewer concerns from the Interspeech reviews, plus the questions this talk invites. Backup slides: **18** full Table 3, **19** ASR tax, **20** SLU comparison, **21** tier generation details. Slide **22** lists the paper's references in the paper's numbering; jump to it if a questioner asks "which benchmark was that?".

**"It's all synthetic speech. How realistic is this?"**
Acknowledged as a limitation (Section 6). We maximised realism with zero-shot voice cloning from *real* speakers (330 voices from SPGISpeech 2.0, Emilia-YODAS, 3D-Speaker, VoxPopuli), stratified + farthest-point sampling for accent coverage, two TTS engines, and real recorded noise at controlled SNRs. The tiers, taxonomy and evaluation harness are TTS-agnostic, so real recordings drop in without changing the benchmark. That is the next release.

**"You used LLMs to generate and to judge. Isn't that circular?"**
Generation (GPT-5.2, Gemini 2.5 Pro, Claude Opus) and judging (GPT-5.1, Gemini 2.5 Pro) used non-overlapping model sets, the two stages have different jobs (produce a query for given tools/slots vs. verify correctness/difficulty/variability), and every judge-flagged query was manually checked. The models under evaluation are open-weight SpeechLMs and text LLMs, not the generators.

**"What does speech add over a text tool-calling benchmark?"**
Three things text cannot encode: (1) prosodic and accent variation across 330 speakers; (2) audio-only phenomena, namely mid-utterance repair in Tier 6, hesitation in Tier 5 and intent blending with a second speaker in Tier 8, which is a speaker-attribution problem with no text analogue; (3) the noise ablation, which reveals model-specific degradation invisible in text. And the oracle-vs-Whisper gap (slide 19) quantifies the ASR cost directly.

**"Why is exact match so low even with oracle transcripts?"**
Because the failure is argument grounding, not recognition: unit and range normalisation, enumerations, default values, and correct pairing of arguments to tools in multi-call queries. This is the most actionable finding for anyone building voice agents.

**"Slot F1 vs. Parameter F1?"**
Same metric; the camera-ready unifies the terminology to Parameter F1 and adds the worked example shown on slide 11 (tool accuracy 1, exact match 0, F1 0.5 when one of two arguments is right).

**"Why do end-to-end models beat the cascade on tool accuracy but lose on F1?"**
Hypothesis, not yet proven: audio-native models capture intent well from acoustics, but their text-generation heads are weaker at faithfully emitting structured arguments than a 27B text LLM. Two directions follow: better structured decoding for SpeechLMs, and hybrid systems that use the SpeechLM for tool selection and a text LLM for argument filling. The benchmark makes both measurable.

**"Why is Tier 5 (needle in a haystack) easier than Tier 3?"**
Tier 5 has one intent buried in irrelevant context; once located, it is a single call. Tier 3 requires two or three correctly ordered calls with correctly paired arguments, so errors compound. Length is not the difficulty; composition is.

**"Why is Smart Car the majority domain?"**
Deliberate: hands-free, high-stakes environment with dense parameterisation (climate zones, charge limits, driving modes). The taxonomy itself is built from public API references, not from any proprietary vehicle documentation.

**"Per-accent or per-noise-type breakdowns?"**
Not in the paper for space reasons; Figure 3 reports noise-response curves. The dataset is released with speaker and noise metadata, so per-accent and per-model breakdowns are straightforward follow-ups.

**"How were the 330 speakers chosen?"**
Pool of ~60K speakers from four corpora; stratified by region, then farthest-point sampling on speaker embeddings to maximise diversity within a fixed budget (100 / 100 / 30 / 100).

**"Tier 7 turn count?"**
Multi-turn USER/AGENT dialogue of 20–200 words. Note: the paper text says 4–8 turns and Figure 1 says 2–4 turns; check the camera-ready and answer with the released data's actual range.

**"Licence and release?"**
Dataset, benchmark code and samples via audio2tool.github.io and the GitHub repository; the arXiv version is CC BY 4.0. Confirm the dataset licence wording before the talk.

---

## Rehearsal checklist
- [ ] Two full timed run-throughs; land at 14:00–14:30.
- [ ] Practise the four spoken examples out loud (slides 4, 8, 12, 13).
- [ ] Decide whether to play audio samples; if yes, embed them and re-time.
- [ ] Have slide 19 (ASR tax) ready as the first backup to jump to during Q&A.
- [ ] Watch two of the recordings in `reference_talks.md` for pacing (the 14-min SLU orals are the closest genre).
- [ ] Rename the file per the organisers' pattern and upload; re-check in the Speaker Preparation Room ≥ 3 h before the session.
