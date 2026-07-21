# AI Engineering Basic

## What is LLM

At its core, a Large Language Model (LLM) is a type of artificial intelligence trained to understand, generate, and manipulate human language. Think of it as a highly advanced version of "autocomplete" that has read nearly the entire internet to learn the patterns of how humans communicate.

### Commercial vs Open Source

| Feature | Commercial (GPT-class, Claude-class) | Open-Source (Llama, Mistral) |
| --- | --- | --- |
| Setup | Immediate (API key) | Complex (hardware / cloud) |
| Privacy | Shared with provider | Complete privacy when local |
| Customization | Limited (fine-tuning APIs) | Full weight access |
| Cost | Pay-per-token | Upfront hardware / server costs |

## AI engineer vs Machine Learning engineer

| Feature | ML Engineer | AI Engineer |
| --- | --- | --- |
| Primary goal | Improve model accuracy | Build a functional AI-powered product |
| Data type | Mostly structured | Mostly unstructured (text, images, audio) |
| Key tools | PyTorch, TensorFlow, Scikit-learn, SQL | LangChain, LlamaIndex, Vector DBs, APIs |
| Day-to-day | Feature engineering, training, MLOps | Prompting, RAG pipelines, agents |

## How to utilize AI skill in coding

- **Architectural guidance** — design schemas and multi-tenant structures, not only single functions
- **Migration support** — speed up framework upgrades and boilerplate refactors
- **Context-aware development** — use repo-aware IDEs and agents
- **Automated testing** — generate unit and integration coverage from business logic
- **Documentation** — draft README and API docs from code

**Golden rule:** treat AI like a fast junior developer. It handles syntax; you own architecture, security, and performance. Always review the output.

## What is a token

A token is the fundamental unit of text an LLM processes. It can be a character, part of a word, or a whole word. Models map tokens to IDs and predict the next token.

Why it matters:

- **Cost** — APIs bill on input/output tokens
- **Context window** — models forget older chat once the limit is exceeded
- **Language patterns** — tokenization helps across natural language and code

## Context window

The context window is short-term memory: prompt + history + uploaded docs, capped by token limit. Larger windows help with whole-repo analysis.

## Choosing the right model

1. **Task complexity** — flash models for boilerplate; reasoning models for multi-file refactors
2. **Context needs** — small windows for single-file work; massive windows for repo-wide understanding
3. **Agentic reliability** — prefer models strong at tool use and iterative fix loops
4. **Privacy vs performance** — commercial APIs for speed; local open-source for sovereignty

## Important core parameters

- `temperature` — `0.0` for deterministic coding; higher for brainstorming
- `max_tokens` — hard cap on response length
- `top_p` — nucleus sampling alternative to temperature
- `response_format` — force JSON when the app must parse output

*Migrated from [Blog with Codes](https://blogwithcodes.blogspot.com/2026/05/ai-engineering-basic.html).*
