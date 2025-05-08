
# 💰 CrediSynth

CrediSynth is a smart, AI-powered personal finance web application designed to help users achieve their financial goals. With features like **goal-based saving suggestions**, **investment tracking**, and **spending insights**, CrediSynth empowers users to make data-driven financial decisions with ease.

---

## 🚀 Features

### 🎯 Goal-Based Saving Suggestions
- Users set short- or long-term financial goals (e.g., vacation, home, emergency fund).
- Our AI engine recommends optimized saving plans tailored to individual income and lifestyle.

### 📈 Investment Tracking
- Monitor performance across multiple investment types like stocks, mutual funds, and crypto.
- Get visual insights into your asset allocation and risk exposure.

### 💡 Money Insights
- Analyze your spending behavior and monthly trends.
- Receive AI-driven tips to improve savings and reduce unnecessary expenses.

---

## 🛠️ Tech Stack

| Layer       | Technology         | Description                              |
|-------------|--------------------|------------------------------------------|
| Frontend    | React.js           | Interactive and responsive user interface |
| Backend     | Spring Boot (Java) | RESTful APIs, business logic, and data flow |
| Data Engine | Python             | AI/ML models for financial suggestions and insights |
| Database    | MySQL              | Stores user info, transactions, goals, etc. |

---

## 🧠 How It Works

1. **User Input**: Users enter financial details like income, expenses, goals, and investments.
2. **Data Handling**: React frontend sends this data to the Spring Boot backend via REST API.
3. **AI Processing**: The backend communicates with Python-based services for running analytics and AI models.
4. **Results Displayed**: Insights and suggestions are returned and visualized on the frontend.

---

## 📦 Project Structure

```plaintext
credisynth/
├── frontend/           # React app
│   ├── src/
│   └── public/
├── backend/            # Spring Boot app
│   ├── src/
│   └── pom.xml
├── python/        # Python scripts for AI/data analysis
│   ├── models/
│   └── main.py
└── README.md

```
## ⚙️ Setup Instructions
### 1. Clone the repository
- git clone https://github.com/your-username/credisynth.git
- cd credisynth
### 2. Set up the Python Data Engine (AI & Analytics)
- cd python
- pip install -r requirements.txt
- (run python code)
### 3. Start the Spring Boot Backend
- cd backend
- ./mvnw spring-boot:run
### 4. Run the React Frontend
- cd frontend
- npm install
- npm run dev
## Note:
#### - Ensure proper CORS setup in Spring Boot for frontend-backend communication.
#### - Configure Python backend URL in your React frontend if needed.
#### - Ports must not conflict; adjust if any are already in use.

---

## 🙌 Contributors

- [@yasheshpatel4](https://github.com/yasheshpatel4) – Full Stack Developer  
- [@zeel-patel2005](https://github.com/zeel-patel2005) –   Full Stack Developer
- [@harmit-patel](https://github.com/harmit-patel) – Full Stack Developer

