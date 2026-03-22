# TruthLens: AI-Powered Fake News Detection & Credibility Platform

TruthLens is a production-grade, full-stack ecosystem designed to verify news credibility in real-time. It leverages **Groq Llama-3.1** neural inference to perform deep linguistic audits, identifying sensationalism and hidden bias across any URL or raw text snippet.

---

## 🚀 The Three Pillars
**1. Neural Backend (FastAPI)**
- High-speed async inference server.
- Built-in rate limiting (`slowapi`) and structured logging.
- Advanced scraping architecture using `BeautifulSoup4`.

**2. Premium SaaS Dashboard (React + Vite)**
- Stunning dark-themed interface with `Framer Motion` animations.
- **Explainability Engine:** Highlights suspicious phrases directly in the text.
- **Compare Sources Mode:** Side-by-side credibility mapping of different outlets.
- **Export Report:** Instant one-click PDF generation for professional audits.

**3. Chrome Extension (Manifest V3)**
- Real-time page analysis without leaving your favorite news site.
- Automated context extraction from the active tab's DOM.

---

## 🛠️ Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons.
- **Backend:** Python 3.10+, FastAPI, SQLAlchemy, SQLite (Development), PostgreSQL (Production).
- **AI Core:** Groq Llama-3.1-8b-instant (800+ tokens/sec).

---

## 🏁 Quick Start

### 1. Requirements
- Python 3.10+ & Node.js 18+
- [Groq API Key](https://console.groq.com/keys)

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows
pip install -r requirements.txt
```
Create a `.env` file in `/backend`:
```env
GROQ_API_KEY=your_key_here
DATABASE_URL=sqlite:///./truthlens.db
```
Start the engine:
```bash
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📦 Deployment Guide
- **Backend:** Deploy `backend/` to **Render** or **Railway**. Set `GROQ_API_KEY` as an environment variable.
- **Frontend:** Deploy `frontend/` to **Vercel** or **Netlify**. Update `API_URL` to point to your live Render link.
- **Extension:** Point `popup.js` to your live API. Zip the `extension/` folder for distribution.

---

## ⚖️ License
MIT License. Built for career-level portfolio excellence.
