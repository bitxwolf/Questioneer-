# QUESTIONEER

A professional, client-side NCERT-based question paper generator powered by **DeepSeek R1 (via OpenRouter)**.

![Questioneer Banner](https://img.shields.io/badge/Status-Active-success) ![License](https://img.shields.io/badge/License-MIT-blue) ![React](https://img.shields.io/badge/React-19-cyan) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## 📖 Overview

**Questioneer** helps teachers and educators effortlessly create formatted, syllabus-compliant exam papers. By leveraging the reasoning capabilities of the DeepSeek R1 model, it transforms simple configuration inputs (Class, Subject, Topics) into a structured, printable question paper complete with sections, marks distribution, and time estimates.

It is designed as a **Single Page Application (SPA)** that runs entirely in the browser, utilizing local storage for history and direct API calls for content generation.

## 🚀 Key Features

*   **🧠 AI-Powered Generation:** Uses `deepseek-r1` to generate logical, context-aware questions based on the specific chapters provided.
*   **🏫 NCERT Compliant:** Prompts are engineered to strictly follow the Indian CBSE/NCERT curriculum standards for Classes 6-12.
*   **📄 Instant PDF Export:** Built-in `html2pdf.js` integration allows for one-click download of professional-grade PDF exam papers.
*   **🎨 Formal Formatting:** Automatically arranges content into standard school exam layouts (School Header, General Instructions, Sections A/B/C).
*   **💾 Local History:** Generated papers are automatically saved to the browser's `localStorage`, allowing users to revisit or reprint previous exams.
*   **🛡️ Resilient API Layer:** Implements a client-side Round-Robin strategy to handle rate limits and ensure high availability.
*   **📱 Responsive Design:** Fully functional on mobile devices with a dedicated split-view interface.

## 🛠️ Tech Stack

*   **Frontend Framework:** React 19
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM v6/v7
*   **Icons:** Lucide React
*   **PDF Generation:** html2pdf.js
*   **AI Service:** OpenRouter API (DeepSeek R1 Model)

## 📂 Project Structure

```bash
/
├── components/           # Reusable UI components
│   ├── InputPanel.tsx    # Left-side configuration form
│   └── OutputPanel.tsx   # Right-side preview & PDF engine
├── pages/                # Main Application Routes
│   ├── HomePage.tsx      # Landing page with feature overview
│   ├── GeneratorPage.tsx # Core application split-screen view
│   └── HistoryPage.tsx   # List of previously generated papers
├── services/             # Core Business Logic
│   └── ai.ts             # OpenRouter API integration & Prompt Engineering
├── styles/               # Global CSS & Tailwind imports
├── types.ts              # TypeScript interfaces & type definitions
├── App.tsx               # Main Router setup
└── index.tsx             # Entry point
```

## ⚙️ Configuration & Setup

### 1. API Configuration (Crucial)

This application communicates with OpenRouter to access the DeepSeek model. For safety, API keys are not included in this repository.

**To run the app, you must provide your own API key:**

1.  Get a free/paid API key from [OpenRouter](https://openrouter.ai/).
2.  Open `services/ai.ts`.
3.  Locate the `API_KEYS` array at the top of the file.
4.  Replace the placeholder with your key:
    ```typescript
    const API_KEYS = [
      'sk-or-v1-YOUR-ACTUAL-KEY-HERE'
    ];
    ```

> **Note:** Since this is a client-side app, API keys are exposed in the source code if you push them to a public repo. For production, consider using a proxy server or Vercel functions (template included in `api/generate.ts`) to hide your keys.

## 🚀 Usage

1.  **Select Details:** On the Generator page, fill in the School Name, Class (6-12), Subject, and specific Chapters.
2.  **Configure Exam:** Choose the Exam Type (Periodic Test, Half-Yearly, etc.), Total Marks, and Difficulty level.
3.  **Generate:** Click "Generate Question Paper". The app will communicate with DeepSeek R1. This usually takes 30-60 seconds.
4.  **Preview & Edit:** View the generated paper on the right panel.
5.  **Export:** Click "Download PDF" to save the file or "Print" to print directly from the browser.

## 🔧 Installation (Local Development)

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/questioneer.git
    cd questioneer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure API Key:**
    Follow the [API Configuration](#1-api-configuration-crucial) steps above.

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    npm start
    ```

5.  **Build for production:**
    ```bash
    npm run build
    ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
