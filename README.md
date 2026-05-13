# AntiPhishX 🛡️
<img width="1919" height="927" alt="image" src="https://github.com/user-attachments/assets/1ee83b04-76a5-49c1-a21c-9cf867fd7a0b" />
<img width="1919" height="971" alt="image" src="https://github.com/user-attachments/assets/cac22cb9-cc69-4002-b35d-e796f40a76f7" />

> **Enterprise-Grade AI-Powered Phishing Awareness & Security Training Platform**

AntiPhishX is a full-stack cybersecurity SaaS platform designed to train, test, and certify individuals and organizations against modern phishing and social engineering threats.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Framer Motion, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **Auth** | JWT, Argon2, SSO/SAML |
| **Payments** | Razorpay |
| **AI Engine** | Groq (LLaMA 3) |
| **Real-time** | Socket.io |
| **Media** | Cloudinary |

---

## 📦 Features

- 🧠 **AI Adaptive Learning** — Personalized training paths powered by LLaMA 3
- 🎭 **Phishing Simulations** — Realistic multi-stage attack scenarios
- 📊 **Human Risk Intelligence (HRI)** — Real-time behavioral risk scoring
- 🏆 **Certifications** — Auto-generated PDF certificates upon course completion
- 👑 **Admin Command Core** — Full enterprise management dashboard
- 💳 **Subscription Plans** — Razorpay-integrated tiered billing
- 🔒 **Enterprise SSO** — SAML/SCIM integration

---

## ⚙️ Setup

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Razorpay account (for payments)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/AntiPhishX.git
cd AntiPhishX

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Environment Variables

Copy `.env.example` to `.env` in both `/backend` and `/frontend` directories and fill in your credentials.

**Backend** (`backend/.env`):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Running Locally

```bash
# Start backend (from /backend directory)
npm run dev

# Start frontend (from /frontend directory)
npm run dev
```

---

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full production deployment instructions.

---

## 📄 License

ISC © AntiPhishX Team
