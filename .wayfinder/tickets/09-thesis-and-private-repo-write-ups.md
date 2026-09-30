---
title: Thesis and private-repo write-ups
type: grilling
status: closed
blocked-by: [04-information-architecture-and-flagship-depth.md]
assignee: Rama Ranuh
---

## Question

What is the thesis about, and can it and the private inference-server work (SGLang, vLLM) be shown as write-ups with no code link? Decide whether each gets one, what it may say, and where it lives in the information architecture.

## Resolution

Private work appears only as short lines in **More work**, each marked "code private", with no code links and no separate section.

- **Thesis**: gets one More work line (title, one sentence, "code private") if it is distinct from the ISRITI and ICCSCI papers; if it is the ISRITI work, it is covered by that paper's timeline line and gets no separate line. The `thesis` repo has no README or description, so the topic was not derivable.
- **SGLang / vLLM**: one generic More work line (for example, exploring LLM serving with vLLM and SGLang: benchmarks and monitoring), code private. No GDP-specific detail, systems or internal tooling. The 1.8x throughput / 70% latency figures stay on the resume timeline only.
- **game-engine**: left out entirely (off-brand and unfinished).
- **Wording**: each line says "code private" plainly; add a reason such as "employer work" only if it is true.
- **Placement**: in the More work table with the other lines, so the section list stays five sections.

**Owner follow-ups for the build session** (not decided here):
- The thesis title, topic, one-line result, and whether it is the ISRITI work or separate. The Q1 answer gave no thesis facts, so this is open.
- Confirm GDP does not own the SGLang/vLLM exploration code and is fine with the generic line.
