# Code Equalize

<p align="left">
  <img src="https://github.com/CodeEqualize/code-equalize/raw/refs/heads/main/extension/media/code-equalize-logo.png" alt="Code Equalize" width="120">
</p>

**Understand coding errors in your preferred language.**

Code Equalize is an AI-powered Visual Studio Code extension that helps developers understand programming errors through simplified, context-aware explanations in their preferred language. It aims to make debugging more accessible, educational, and beginner-friendly.

## Problem

Programming errors can be difficult to understand, especially for beginners. Compiler and runtime messages are often technical and presented primarily in English, creating a learning barrier for students and aspiring developers.

## Solution

Code Equalize uses AI to analyse programming errors, retrieve relevant contextual knowledge, and provide simplified explanations while preserving technical accuracy.

## Features

- **AI-assisted debugging:** Analyse programming errors and generate explanations.
- **Multilingual explanations:** Understand errors in your preferred language.
- **Context-aware suggestions:** Receive relevant explanations based on the available code context.
- **Retrieval-Augmented Generation (RAG):** Retrieve relevant knowledge to improve response quality.
- **ChromaDB integration:** Store and retrieve contextual programming knowledge.
- **Beginner-friendly guidance:** Make complex programming errors easier to understand.

## Supported Programming Languages

- Python
- Java
- C
- C++

## Technology Stack

| Component | Technology |
|---|---|
| Extension | TypeScript |
| Editor integration | VS Code Extension API |
| Backend | Node.js, Express.js |
| AI inference | Groq API |
| AI model | `openai/gpt-oss-120b` |
| Vector database | ChromaDB |
| Hosting | Railway |

## Installation

1. Open Visual Studio Code.
2. Navigate to the Extensions view (`Ctrl + Shift + X`).
3. Search for **Code Equalize**.
4. Select the extension and click **Install**.

## Usage

1. Open a supported programming file in VS Code.
2. Select the relevant code or error context.
3. Right-click and choose **Explain with Code Equalize**, where available.
4. Alternatively, open the Command Palette using `Ctrl + Shift + P`.
5. Search for **Code Equalize: Explain in My Language**.
6. Follow the extension's prompts to receive an explanation.

An active internet connection is required to communicate with the hosted backend.

## Backend

Code Equalize uses a hosted backend deployed on Railway.

The backend integrates AI-powered explanation generation with ChromaDB-based knowledge retrieval.

## Repository

[GitHub – Code Equalize](https://github.com/CodeEqualize/code-equalize)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Project Status

Code Equalize is developed as an academic major project with the goal of improving programming accessibility and helping developers understand, learn from, and resolve coding errors more effectively.

## Release Notes

### 0.0.1

- Initial release of Code Equalize.
- AI-powered programming error explanations.
- Multilingual explanation support.
- Context-aware knowledge retrieval.