# 💰 Finance Management App

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
* **Charts:** Chart.js / Recharts

**Backend:**
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Authentication:** JWT & Bcrypt

**Tools & Services:**
* **AI Integration:** OpenAI API / Tesseract.js (for receipt scanning)
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
```
## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
* **Node.js** (v14 or higher)
* **MongoDB** (Local instance or Atlas URI)
* **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone [https://github.com/ArchitaSarkar/Personal-Budget-App.git](https://github.com/ArchitaSarkar/Personal-Budget-App.git)
```
### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```
### Create a .env file in the backend/ directory:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
AI_API_KEY=your_ai_service_key
```
### Start the server:
```bash
npm start
```
### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:
```bash
cd ../frontend
npm install
```
### Start the React development server:
```bash
npm start
```
### The app should now be running on http://localhost:3000!
## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user |
| **POST** | `/api/auth/login` | Login user & get token |
| **GET** | `/api/transactions` | Get all transactions |
| **POST** | `/api/transactions` | Add a new transaction |
| **POST** | `/api/upload` | Upload receipt for AI analysis |
## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 👤 Author

**Archita Sarkar**
* GitHub: [@ArchitaSarkar](https://github.com/ArchitaSarkar)
* LinkedIn: [Archita Sarkar](https://www.linkedin.com/in/archita-sarkar-010421308)

---
*If you found this project useful, please give it a ⭐!*

