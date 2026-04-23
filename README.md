# 🚀 Productify

A full-stack product sharing and selling platform built with modern technologies. Users can create products, explore listings, interact via comments, and securely initiate payments.

---

## 🌐 Live Demo

* 🔗 Frontend: https://productify-weld.vercel.app
* 🔗 Backend API: https://productify-fats.onrender.com/api/health

---

## ✨ Key Features

* 🔐 **Authentication** — Secure user login/signup with Clerk
* 🛍️ **Product Management** — Create, edit, and delete products
* 📦 **Product Listing** — Explore all products with clean UI
* 💬 **Comments System** — Engage with products via comments
* 👤 **User Profiles** — View your own uploaded products
* 💳 **Payments Integration** — Razorpay integration for purchases
* ⚡ **Optimized API Calls** — Managed with React Query
* 🌍 **Fully Deployed** — Frontend (Vercel) + Backend (Render)

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS + DaisyUI
* React Query (TanStack)
* Axios

### Backend

* Node.js + Express
* TypeScript
* Drizzle ORM
* PostgreSQL (Neon)

### Auth & Payments

* Clerk Authentication
* Razorpay Payment Gateway

---

## 📁 Project Structure

```bash
productify/
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── db/
│   │   ├── config/
│   │   └── index.ts
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   └── App.jsx
```

---

## ⚙️ Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/Siddhant733/productify.git
cd productify
```

---

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Backend (.env)

```env
DATABASE_URL=your_database_url
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
FRONTEND_URL=http://localhost:5173
```

---

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

---

## 🚀 Deployment

* Frontend deployed on **Vercel**
* Backend deployed on **Render**
* Database hosted on **Neon (PostgreSQL)**

---

## 📌 Challenges Faced

* Handling **CORS issues** between Vercel and Render
* Managing **environment variables across environments**
* Fixing **Drizzle ORM query structure issues**
* Handling **payment integration errors with Razorpay**

---

## 🔮 Future Improvements

* 🧾 Order history & payment verification
* 📊 Admin dashboard
* 🖼️ Image upload optimization (Cloudinary/S3)
* 🔍 Advanced search & filtering

---

## 👨‍💻 Author

**Siddhant Titame**

---

## ⭐ Show your support

If you found this project helpful, consider giving it a ⭐ on GitHub!
