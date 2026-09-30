# Flagship project evidence

Research for issue #3 ("Collect evidence for the four flagship projects"). Planning only; the site is unchanged.
Sources: the READMEs and files of the four public repos under `RamadhaRanuh`, read via the GitHub API on 2026-09-30.
Raw image URLs below use the default branch (`master`, except the chatbot which uses `main`).

---

## 1. Local Notebook (repo `Deepnote`, to be renamed)

- **Repo**: https://github.com/RamadhaRanuh/Deepnote (default branch `master`, MIT, no homepage/demo, no releases). Description on GitHub is still the old RAG-chatbot text, so it needs updating alongside the rename.
- **One line**: Problem: NotebookLM-style research over your own documents without sending data anywhere. Approach: fully local pipeline (Docling ingestion, hybrid dense+BM25 retrieval, reranker, JSON-constrained citations checked sentence by sentence, Deep mode for multi-part questions) on an 8 GB laptop GPU. Result: 0.95 correctness and 0.94 citation recall on a hand-verified eval set at ~5 s median latency.
- **Stack**: Python 3.12, FastAPI + SSE, SQLite (also the job queue), LanceDB (vectors + BM25), Docling + EasyOCR, Ollama (qwen3:4b-instruct, qwen3:4b, qwen3-embedding:0.6b, qwen3-vl:4b-instruct), bge-reranker-v2-m3, React 19 + Vite + Tailwind v4, pdf.js, React Flow, Docker Compose (2 containers). 54 tests that run without a GPU. Source: README "How it works", "Development".
- **Hard results** (source: README "Benchmarks > Results"; measured on RTX 4070 Laptop 8 GB, i9, 32 GB RAM, Ollama 0.34.4; 37-item public eval set with gold passages, each hand-checked):
  - Default Chat: correctness 0.95, citation precision 0.90, citation recall 0.94, MRR 0.71, p50 4.95 s.
  - Deep mode: correctness 0.95, citation precision 0.94, citation recall 0.91, p50 28 s.
  - Private 10-item set: Deep mode 0.90 correctness / 1.00 citation recall vs default 0.60 / 0.89. Only aggregates are reported.
  - Pass bar stated in README: correctness and citation recall both >= 0.85. Judge is qwen3:8b, spot-checked 8 of 8.
  - Also quotable: a bake-off of 8 configurations preceded the build (README "How the pipeline was chosen").
- **Images** (all static PNG, no GIF/video in the repo; `docs/images/`):
  - Chat with a citation opened in the Reader: https://raw.githubusercontent.com/RamadhaRanuh/Deepnote/master/docs/images/chat-citation.png (153 KB). Best hero candidate.
  - Mind map: https://raw.githubusercontent.com/RamadhaRanuh/Deepnote/master/docs/images/studio-mind-map.png (91 KB)
  - Briefing doc: https://raw.githubusercontent.com/RamadhaRanuh/Deepnote/master/docs/images/studio-briefing.png (121 KB)
  - Settings with GPU fit check: https://raw.githubusercontent.com/RamadhaRanuh/Deepnote/master/docs/images/settings.png (161 KB)
  - README also has Mermaid architecture, ingestion and chat diagrams (render on GitHub only).
- **Links**: repo above. No demo, video or paper.
- **Gaps only the owner can fill**:
  - Final name and whether the repo will be renamed (Local Notebook vs `Deepnote`); GitHub repo description update. Renaming changes the URL, so any links must use the new one.
  - A GIF or short screen recording (a citation click opening the passage would sell it); none exists.
  - The eval set is not published (README says so), so the numbers are not independently reproducible; decide whether to publish the 37 public items or caveat the numbers.
  - Whether the README's private-set numbers should be shown at all.
  - Role/dates: solo or team, when built (last push 2026-09-30).

---

## 2. Medical RAG chatbot (repo `Natural-Language-Processing-Chatbot`)

- **Repo**: https://github.com/RamadhaRanuh/Natural-Language-Processing-Chatbot (default branch `main`, no homepage). Current site already links it (`index.html` line 146).
- **One line**: Problem: answer complex medical questions from trusted local literature. Approach: LlamaIndex RAG over the Gale Encyclopedia of Medicine (5 volumes) with a local GGUF model, FastAPI streaming backend and an "OpenEvidence"-style Next.js UI. Result: working streaming chat app; no measured results in the repo.
- **Stack**: Python, FastAPI, LlamaIndex, ChromaDB, llama-cpp-python (GGUF, e.g. Qwen3-4B-Instruct-2507 Q5_K_S), Next.js + TypeScript + Tailwind + React Markdown. Source: README "Features"/"Architecture". Note `Main.ipynb` (6.4 MB) holds the earlier notebook experiments.
- **Hard results**: none found. No accuracy, latency or retrieval metrics in the README, notebook description or repo files. Only quantifiable facts are corpus scale: 5 volumes of the Gale Encyclopedia of Medicine (~92 MB of PDFs) and a prebuilt `Nodes/nodes.pkl` (~42 MB). Caveat: the Gale PDFs are committed to a public repo, which is a copyright concern (see gaps).
- **Images**: no UI screenshots. Only architecture diagrams committed at repo root:
  - https://raw.githubusercontent.com/RamadhaRanuh/Natural-Language-Processing-Chatbot/main/RAG.png
  - https://raw.githubusercontent.com/RamadhaRanuh/Natural-Language-Processing-Chatbot/main/Advanced%20RAG.png
  - https://raw.githubusercontent.com/RamadhaRanuh/Natural-Language-Processing-Chatbot/main/ChatEngineType.png
  - These look like generic RAG explainers (not verified as the owner's own drawings; check licence/origin before reuse).
- **Links**: repo only. `frontend/README.md` is the untouched create-next-app boilerplate.
- **Gaps only the owner can fill**:
  - A screenshot or GIF of the running UI (none exists; must be captured by running the app).
  - Any evaluation numbers (even a small hand-checked question set) or a decision to present it without metrics.
  - Whether to keep the Gale PDFs public (copyright), and whether the diagram PNGs are original.
  - Final project name (repo name reads as a generic NLP chatbot) and whether a demo can be hosted (needs a local GGUF model, so likely not).
  - Timeline and whether it is personal or work-related.

---

## 3. From-Scratch (repo `From-Scratch`)

- **Repo**: https://github.com/RamadhaRanuh/From-Scratch (default branch `master`, no homepage). Contains two implementations: `transformers/` and `llama2-from-scratch/`. Not linked from the current site.
- **One line**: Problem: understand modern architectures by building them. Approach: the original encoder-decoder Transformer in PyTorch, trained for English-to-Indonesian translation on Helsinki-NLP/opus-100, plus a Llama 2-style decoder (RMSNorm, RoPE, GQA, KV cache, SwiGLU). Result: complete, documented implementations; no BLEU or final-loss figure published.
- **Stack**: Python, PyTorch, Hugging Face `datasets` and `tokenizers` (word-level), TensorBoard, tqdm. Config (`transformers/config.py`): d_model 512, seq_len 350, batch 8, 20 epochs, lr 1e-4. Source: `transformers/README.md`, `config.py`.
- **Hard results**: no headline metric in any README. Candidate facts (verifiable in the repo):
  - Config above and the dataset/task (source: `transformers/config.py`, `transformers/README.md`).
  - TensorBoard event files exist under `transformers/runs/tmodel/` (one is ~111 KB, the rest tiny), so a loss curve could be regenerated, but the values were not extracted here and it is unclear whether the 20 epochs completed.
  - Llama 2 README states architecture features only; the `ModelArgs` defaults (dim 4096, 32 layers, 32 heads, max_seq_len 2048) are the 7B configuration, not a trained model.
- **Images**:
  - Transformer architecture diagram (hosted as a GitHub user-attachment; appears to be the Wikipedia "Transformer, full architecture" figure, so check its licence): https://github.com/user-attachments/assets/b73dfe0f-ee81-4a78-b3bd-4bcfa5f0262c
  - Llama 2 diagram: https://github.com/user-attachments/assets/0a99a773-c2e3-4ac2-9221-3f346950c58e
  - No training curves or output samples committed as images.
- **Links**: repo and the two sub-READMEs: https://github.com/RamadhaRanuh/From-Scratch/tree/master/transformers and https://github.com/RamadhaRanuh/From-Scratch/tree/master/llama2-from-scratch. Paper referenced: "Attention Is All You Need" (Vaswani et al., 2017); Llama 2 (Touvron et al., 2023) is implied but not linked in the README.
- **Gaps only the owner can fill**:
  - The one number that makes it credible: final training/validation loss, BLEU (or a few sample translations) after training; requires the checkpoint or re-running.
  - A sample-translation screenshot or a loss-curve image (owner's own render of the TensorBoard logs).
  - Whether the Llama 2 code was trained or run against any weights, and whether it is tested against the reference implementation.
  - Which of the two implementations is the flagship, and the "(Transformer in PyTorch)" framing from issue #1 versus the repo covering both.
  - Licence check on the borrowed diagrams, or replacement with an original one.

---

## 4. Hyperpigmented skin disease classification (repo `Hyperpigmented-Skin-Disease-Classification`)

- **Repo**: https://github.com/RamadhaRanuh/Hyperpigmented-Skin-Disease-Classification (default branch `master`). Current site links the repo and a YouTube video (`https://www.youtube.com/watch?v=mVzJN3HjZPQ&t=259s`, `index.html` line 233) and calls the paper "A Comparative Study of Deep Learning Algorithms for Image Based Classification of Hyperpigmented Skin Disease" (line 220), presented at ICCSCI (BINUS University, line 508-510).
- **One line**: Problem: hyperpigmented skin conditions look alike and are hard to diagnose. Approach: compare five pretrained models (YOLO, DenseNet201, GoogLeNet, InceptionResNetV2, MobileNet) on four conditions over 50 epochs. Result: YOLO reached the best test accuracy (97.56%).
- **Stack**: Python, TensorFlow/Keras for DenseNet201, GoogLeNet, InceptionResNetV2, MobileNet; Ultralytics YOLOv8n-cls (`yolov8n-cls.pt`, imgsz 224, 50 epochs) for YOLO; NumPy, Pandas, Matplotlib, scikit-learn. Source: README badges, `Yolo/runs/classify/train/args.yaml`.
- **Hard results** (source: README "Results", 50 epochs):

  | Model | Train acc | Test acc |
  |---|---|---|
  | YOLO | 97.43% | 97.56% |
  | InceptionResNetV2 | 98.77% | 89.74% |
  | DenseNet201 | 100% | 87.18% |
  | GoogLeNet | 93.8% | 87.18% |
  | MobileNet | 100% | 79.49% |

  - YOLO run log (`Yolo/runs/classify/train/results.csv`): top-1 validation accuracy 0.974 at epoch 50 (0.923 at epoch 49), consistent with the README.
  - Per-class AUC from the committed figure `RM AUC1.png` (read visually): YOLO 1.00 / 0.90 / 0.99 / 1.00; DenseNet201 1.00 / 0.97 / 0.99 / 1.00; InceptionResNetV2 1.00 / 0.77 / 0.99 / 1.00; GoogLeNet 0.90 / 0.80 / 0.95 / 0.96; MobileNet 1.00 / 0.96 / 1.00 / 0.98. Class 1 is the hard class for every model.
  - Sample-size caution: 97.56% is not a multiple of 1/39 (the other test accuracies, 87.18 / 89.74 / 79.49, are 34/39, 35/39, 31/39). 97.56% equals 40/41, so YOLO seems to have been evaluated on a different test count than the others. Verify before quoting side by side.
- **Inconsistencies in the repo to resolve before publishing**:
  - README "Conclusion" says DenseNet201 is the best model, while "Best Model" says YOLO; the table supports YOLO.
  - README says four diseases, but the YOLO `args.yaml` points to `./6disease_new`.
  - "Best Model" lists conditions as CS, MN, ML, CN with a placeholder "Condition 1..4"; the figures label classes only 0-3. Dataset folders name them Cafe-au-lait Spot, Congenital-Nevus, Malignant-melanoma (spelled "menanoma") and Melasma.
  - README Getting Started is template text (fake clone URL, `src/train.py` paths that do not exist).
- **Images** (committed at repo root, not embedded in the README):
  - Confusion matrices for all five models: https://raw.githubusercontent.com/RamadhaRanuh/Hyperpigmented-Skin-Disease-Classification/master/RM%20Confussion%20matrix1.png (182 KB, 2100x1500)
  - ROC curves with per-class AUC for all five models: https://raw.githubusercontent.com/RamadhaRanuh/Hyperpigmented-Skin-Disease-Classification/master/RM%20AUC1.png (330 KB, 2100x1200)
  - Both use the matplotlib default colormap and are dense; a cropped YOLO panel or a redrawn bar chart of the table would fit the editorial style better. The portfolio's existing thumbnail is `images/skindisease.jpg` in this repo.
  - Dataset thumbnails exist in `DenseNet201/4disease_new copy/` but are patient/clinical images of unknown provenance; do not reuse without confirming the licence.
- **Links**: repo; YouTube video (from the current site); paper title and ICCSCI venue (from the current site). No DOI, proceedings URL or PDF is referenced in the repo or the site.
- **Gaps only the owner can fill**:
  - The paper reference: DOI or proceedings link, year, co-authors, and whether it is published (IEEE/Springer proceedings) or accepted only. Nothing in the repos gives this.
  - Which YOLO test set size is correct and the per-class names behind indices 0-3; confirm the four-vs-six disease question.
  - Dataset source and licence (needed to show images or to publish the numbers as claimed).
  - The role in the paper (first author, which parts) and whether the YouTube link is the ICCSCI presentation.
  - Fix or accept the README contradiction (YOLO vs DenseNet201 as best model).

---

## Cross-cutting gaps

- Hard results are strong for Local Notebook and Hyperpigmented, thin for From-Scratch and absent for the Medical RAG chatbot. Issue #1 says each flagship needs one image/GIF and one or two hard results; the owner must supply a number for the chatbot and From-Scratch (or the plan accepts a qualitative line for them).
- Only Local Notebook has real UI screenshots; no GIFs or videos exist in any of the four repos.
- Public site (`index.html`) currently links only the chatbot and Hyperpigmented repos; `Deepnote` and `From-Scratch` are new to the site.
- `Deepnote` last-commit and push dates are today (2026-09-30), so the README numbers may still change.
