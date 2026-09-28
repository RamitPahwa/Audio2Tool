# LinkedIn post — Audio2Tool oral at Interspeech 2026

Talk: Tuesday 29 September 2026, 17:10, ICC Sydney. Suggested posting time: Monday evening or Tuesday morning Sydney time,
so it is near the top of feeds in Europe and the US when the talk happens. Add the room or session name after "ICC Sydney" once confirmed.

---

## Main post

On Tuesday at Interspeech 2026 in Sydney I will be presenting Audio2Tool, our benchmark for going straight from speech to an executable tool call. If you work on voice assistants, speech LLMs or in-car voice, come and say hello.

📍 Oral session · Tuesday 29 September · 17:10 · ICC Sydney

The question we set out to answer: can today's speech language models turn a spoken request into a correct, executable tool call under realistic acoustic conditions?

To find out, we built Audio2Tool:
• ~30,000 spoken queries, each with a gold tool call
• 152 tools across smart car, smart home and wearables
• 8 complexity tiers, from "open the trunk" to multi-turn dialogue and a second speaker issuing a competing command
• 330 cloned voices from four regions, mixed with real in-car and indoor noise

What we found, testing open-weight SpeechLMs against Whisper + LLM cascades:

1. Picking the right tool is nearly solved for direct commands (92% for the best model).
2. Getting the arguments right is not. Exact match stays below 16% on plain parametric commands, even with perfect transcripts. This is not an ASR problem.
3. Composition, implicit intent ("I'm freezing") and competing speakers are still open.
4. End-to-end SpeechLMs do not yet beat a strong cascade. They pick tools better; text LLMs fill the arguments better.

Dataset, benchmark code and audio samples: audio2tool.github.io
Paper: arxiv.org/abs/2604.22821

Huge thanks to my co-authors Apoorva Beedu, Parivesh Priye, Rutu Gandhi, Saloni Takawale, Aruna Baijal and Zengli Yang, and to the team at Rivian and Volkswagen Group Technologies.

#Interspeech2026 #SpeechAI #VoiceAssistants #ToolCalling #SpeechLLM #Benchmark #SpokenLanguageUnderstanding

---

## Short version (day-of reminder or comment)

Presenting Audio2Tool at Interspeech 2026 today: ~30K spoken queries, 152 tools, 8 complexity tiers, 330 voices, real noise. Headline finding: SpeechLMs pick the right tool but get the arguments wrong, and it is not an ASR problem.

📍 17:10 · ICC Sydney · oral session
📄 arxiv.org/abs/2604.22821 · 🔊 audio2tool.github.io

#Interspeech2026 #SpeechAI

---

Notes
- LinkedIn truncates after roughly the first 210 characters, so the first sentence carries the talk, the venue and the invitation.
- Tag co-authors and the company page with @ mentions when pasting; plain names are used here so the text copies cleanly.
- A good image is slide 2 ("This talk in one slide") or slide 8 (the eight tiers) exported as PNG from the deck.
