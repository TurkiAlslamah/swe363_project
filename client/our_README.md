# SWE363 React Project

This project is a modern **React-based web application** built for the SWE363 course.  
It demonstrates a clean front-end architecture with routing, authentication context, and multi-role support (User, Admin, Teacher).

---

## 🚀 Features

### 🌐 General
- Built with **React + Vite (or CRA)**.
- Organized folder structure for scalability.
- Supports **RTL Arabic layout**.
- Responsive and mobile-friendly using **Bootstrap 5**.
- Modern design with **Framer Motion animations**.

### 👤 Authentication
- Simulated login and register (via `AuthContext`).
- Role-based routing for:
  - 👥 User (`/home`)
  - 👨‍🏫 Teacher (`/teacher/courses`)
  - 👨‍💼 Admin (`/admin/dashboard`)
- Context handles login/logout and user roles.

### 💡 UI Pages
| Page | Route | Description |
|------|--------|-------------|
| 🏠 Home | `/` or `/home` | Landing page with animated SVG and Arabic hero section |
| 🔐 Login | `/login` | Arabic login form with modern gradient background |
| 🧾 Register | `/register` | Arabic registration form (glass-style card) |
| 🧑‍💼 Admin | `/admin/dashboard` | Placeholder for admin dashboard |
| 🧑‍🏫 Teacher | `/teacher/courses` | Placeholder for teacher course page |

---

## 🧱 Folder Structure

client/
└── src/
├── assets/
│ └── images/
│ └── book.svg
├── components/
│ └── common/
│ ├── Header.jsx
│ └── Footer.jsx
├── context/
│ └── AuthContext.jsx
├── pages/
│ ├── Home.jsx
│ ├── auth/
│ │ ├── Login.jsx
│ │ └── Register.jsx
│ ├── admin/
│ │ └── Dashboard.jsx
│ └── teacher/
│ └── Courses.jsx
├── routes/
│ └── ProtectedRoute.jsx
├── App.js
└── index.js


---

## 🧠 Technologies Used

| Stack | Purpose |
|-------|----------|
| **React 18+** | Front-end library |
| **React Router DOM** | Client-side routing |
| **Bootstrap 5** | Styling framework |
| **Framer Motion** | Animation effects |
| **Context API** | Global user state (auth) |

---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/swe363_project.git
cd swe363_project/client

# Install dependencies
npm install

# Run the development server
npm start
