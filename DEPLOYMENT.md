# AntiPhishX Production Deployment Guide

This guide details the steps to transition AntiPhishX from development to a live, production-grade enterprise SaaS environment.

## 1. Infrastructure Provisioning

### Database: MongoDB Atlas
1. Create a new Project in [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Deploy a Multi-Region Cluster (M10+ recommended for production).
3. **Network Access**: Add the IP addresses of your Backend hosting (Render/Vercel) or allow `0.0.0.0/0` (secure with strong DB user password).
4. Copy the Connection String.

### Media Storage: Cloudinary
1. Create a [Cloudinary](https://cloudinary.com/) account.
2. In Settings, create a "signed" upload preset for course videos.
3. Note your Cloud Name, API Key, and API Secret.

### Payments: Razorpay Live
1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Switch to **Live Mode**.
3. Generate **API Keys**.
4. Set up a Webhook:
   - URL: `https://your-backend-url.com/api/payments/webhook`
   - Secret: Create a strong random string.
   - Events: `payment.captured`, `payment.failed`.

---

## 2. Backend Deployment (Render/Railway/VPS)

### Environment Variables
Configure the following on your backend host:

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Your Atlas connection string |
| `JWT_SECRET` | Long random string (64+ chars) |
| `FRONTEND_URL` | `https://antiphishx.com` |
| `RAZORPAY_KEY_ID` | Live Key ID |
| `RAZORPAY_KEY_SECRET` | Live Key Secret |
| `RAZORPAY_WEBHOOK_SECRET` | Secret configured in Razorpay |
| `GROQ_API_KEY` | Production Groq key |
| `CLOUDINARY_URL` | `cloudinary://API_KEY:API_SECRET@CLOUD_NAME` |

### Deployment via Docker
The included `Dockerfile` will automatically handle the environment setup.
1. Connect your GitHub Repo.
2. Choose "Web Service" in Render/Railway.
3. Select the `backend` directory.

---

## 3. Frontend Deployment (Vercel/Netlify)

### Environment Variables
Configure on Vercel:

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | `https://your-backend-url.com/api` |
| `VITE_RAZORPAY_KEY_ID` | Live Key ID |

### Deployment
1. Connect Repo.
2. Root Directory: `frontend`.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. The `vercel.json` will handle the SPA routing and security headers.

---

## 4. Final Production Checklist

- [ ] **SSL/HTTPS**: Ensure all traffic is forced to HTTPS.
- [ ] **Admin Account**: Manually update your user role to `superAdmin` in MongoDB Atlas after first registration.
- [ ] **Email Integration**: Configure `RESEND_API_KEY` for transactional emails.
- [ ] **Monitoring**: Add your Sentry DSN to `frontend/.env` and `backend/.env`.

---
**Neural Link Established. AntiPhishX is ready for global uplink.**
