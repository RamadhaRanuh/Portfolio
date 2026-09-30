---
title: Collect evidence for the four flagship projects
type: research
status: closed
blocked-by: []
assignee:
---

## Question

For Local Notebook (repo `Deepnote`), Medical RAG chatbot (`Natural-Language-Processing-Chatbot`), From-Scratch, and Hyperpigmented skin disease classification: pull from the repos and READMEs the existing screenshots/GIFs, one or two hard results each (benchmarks, accuracy), stack, links (repo, demo, paper), and a one-line problem/approach/result. List what's missing that only the owner can supply.

## Resolution

Resolved. Findings are in [.wayfinder/research/flagship-evidence.md](https://github.com/RamadhaRanuh/Portfolio/blob/research/flagship-evidence/.wayfinder/research/flagship-evidence.md) on branch `research/flagship-evidence`.

- **Local Notebook (`Deepnote`)**: strongest evidence. Benchmarks in README: default Chat 0.95 correctness / 0.94 citation recall / 4.95 s p50; Deep mode 0.95 / 0.91 / 28 s (37-item hand-checked eval, RTX 4070 Laptop 8 GB). Four static screenshots in `docs/images/` (hero candidate: chat-citation.png). No GIF or demo. Repo description is stale and the rename is pending.
- **Medical RAG chatbot**: stack and links are clear (FastAPI, LlamaIndex, ChromaDB, Next.js, Gale Encyclopedia of Medicine), but there are no metrics and no UI screenshots, only three generic RAG diagram PNGs. Gale PDFs are committed publicly (copyright concern).
- **From-Scratch**: Transformer (EN-ID, opus-100) plus a Llama 2-style decoder, well documented, but no BLEU or final loss and no owner-made images. TensorBoard logs exist and could be turned into a loss curve.
- **Hyperpigmented classification**: test accuracy YOLO 97.56%, InceptionResNetV2 89.74%, DenseNet201 87.18%, GoogLeNet 87.18%, MobileNet 79.49%; confusion-matrix and ROC/AUC figures are committed but not embedded. The repo is inconsistent (README says both DenseNet201 and YOLO are best; four vs six diseases; YOLO's 97.56% implies a different test count, 40/41, than the others, 39). No DOI or proceedings link anywhere.

The owner-only gaps are listed per project in the file. Main ones: paper DOI/link, a chatbot result and screenshot, a From-Scratch metric, a Local Notebook GIF, dataset and diagram licences, and the final Local Notebook name.

