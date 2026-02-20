# Amin's AI Assistant (یاریدەدەری ئەمین)

A personal AI assistant designed for Amin's portfolio website. This chat interface allows visitors to ask questions about Amin's skills, work, and general coding topics in both Kurdish and English.

![Project Screenshot](https://via.placeholder.com/800x450?text=Amin%27s+AI+Assistant)

## ✨ Features

- **🤖 Powered by Gemini AI**: Uses Google's advanced Gemini models for intelligent responses.
- **🗣️ Voice-to-Text**: Speak your questions using the built-in microphone support.
- **🌍 Kurdish Language Support**: Fully localized interface in Kurdish (Sorani) with RTL layout.
- **💻 Code Highlighting**: Beautifully renders code snippets with syntax highlighting and copy functionality.
- **🎨 Modern UI**: Dark-themed, responsive design built with Tailwind CSS and Framer Motion.
- **🚀 Fast & Lightweight**: Built with Vite and React for optimal performance.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI**: Google Generative AI SDK (`@google/genai`)
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion)
- **Markdown**: React Markdown

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Gemini API Key (Get it from [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/amins-ai-assistant.git
   cd amins-ai-assistant
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Create a `.env` file in the root directory.
   - Add your Gemini API key:
     ```env
     GEMINI_API_KEY=your_api_key_here
     ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` to see the app.

## 📦 Deployment (Vercel)

This project is optimized for deployment on Vercel.

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and add a new project.
3. Import your repository.
4. In the **Environment Variables** section, add:
   - Key: `GEMINI_API_KEY`
   - Value: `your_actual_api_key`
5. Click **Deploy**.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
