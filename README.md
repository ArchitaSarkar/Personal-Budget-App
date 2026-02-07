# 💰 Personal Budget & Finance Management App

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/Node.js-v16%2B-green)
![React](https://img.shields.io/badge/React-v18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-v5-blue)

A powerful, full-stack finance management application designed to help users take control of their financial health. This app goes beyond simple tracking by integrating **AI-powered receipt scanning**, **recurring transaction automation**, and **advanced analytics** to visualize spending habits.

## 🌟 Key Features

* **🔐 Secure Authentication:** Robust user login and registration system using **JWT (JSON Web Tokens)** for secure session management.
* **🤖 AI-Powered Receipt Scanning:** Upload a photo of your bill, and the integrated AI automatically extracts merchant details, date, and total amount to create a transaction entry.
* **📊 Interactive Dashboards:** Visualize your financial data with dynamic charts and graphs, powered by complex **MongoDB aggregation pipelines**.
* **🔄 Recurring Transactions:** Set up automated entries for monthly bills (rent, subscriptions) to never miss a payment record.
* **🏷️ Categorization:** Organize income and expenses into custom categories for better budgeting.
* **📱 Responsive Design:** Built with **TailwindCSS** to ensure a seamless experience across desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

**Frontend:**
* **Framework:** React.js
* **Language:** TypeScript
* **State Management:** Redux Toolkit
* **Styling:** Tailwind CSS
* **Charts:** [Chart.js / Recharts]

**Backend:**
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Authentication:** JWT & Bcrypt

**Tools & Services:**
* **AI Integration:** [OpenAI API / Tesseract.js / Google Vision] (for receipt scanning)
* **Version Control:** Git & GitHub

## 📂 Project Structure

```bash
Personal-Budget-App/
├── backend/          # Node.js & Express server
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API endpoints
│   ├── controllers/  # Request logic
│   └── config/       # DB connections
├── frontend/         # React & TypeScript application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # App views (Dashboard, Login, etc.)
│   │   ├── store/      # Redux state slices
│   │   └── utils/      # Helper functions
└── README.md

**Archita Sarkar**
* GitHub: [@ArchitaSarkar](https://github.com/ArchitaSarkar)

---
*If you found this project useful, please give it a ⭐!*
