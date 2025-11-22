# Qudrat Test Preparation Platform

The **Qudrat Test Preparation Platform** is a modern, interactive web app designed for Saudi high-school students preparing for the Qudrat exam. Traditional methods—PDFs, scattered question banks, and long YouTube videos don’t track progress, provide explanations, or separate question types effectively. This leads to confusion, lack of structure, and inconsistent studying.

This platform solves these problems by offering a **structured, personalized, and fully data driven learning experience** tailored to each student.

## Features

### 🟣 Daily Learning Plan
- Set a daily target (e.g., 50 questions).
- Real-time progress bars.
- Completed vs remaining questions.

### 🟣 Organized Question Bank (Quantitative & Verbal)
- All Qudrat topics categorized clearly.
- Track mastered, pending, and completed questions.

### 🟣 Smart Practice Mode
- One-question-at-a-time interface.
- Save questions.
- Report errors.
- View full explanations instantly.

### 🟣 Daily Exam (30 Questions)
- Balanced, timed daily test.
- Automatic scoring.
- Detailed performance breakdown.

### 🟣 Custom Exam Builder
- Choose topics.
- Select number of questions.
- Set time per question.
- Build focused exams instantly.

### 🟣 Performance Analytics Dashboard
- Accuracy percentage.
- Best score.
- Exam count.
- Weekly activity.
- Study streaks.
- Total correct & incorrect answers.

### 🟣 Wrong Answers Review
- Centralized module to revisit mistakes.
- Helps reinforce weak areas.

## Why This Platform?
- Tracks real improvement over time.
- Shows strengths and weaknesses by topic.
- Keeps students consistent through daily goals.
- Provides explanations—not just answers.
- Saves time and avoids confusion.
- Makes studying structured, flexible, and enjoyable.

The **Qudrat Test Preparation Platform** gives students a smarter, more efficient way to prepare and raise their Qudrat exam scores using modern, user-friendly tools.


---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (Node Package Manager)

### Installation

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd qudrat-preparation-platform
   ```
2.  **Go to folder**
 ```bash
 cd client
 ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Install React Router**
   ```bash
   npm install react-router-dom
   ```

### Running the Application

In the project directory, you can run:

```bash
npm start
```

This runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will automatically reload when you make changes. You may also see any lint errors in the console.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner in interactive watch mode
- `npm run build` - Builds the app for production to the `build` folder
- `npm run eject` - **Note: this is a one-way operation. Once you eject, you can't go back!**

---

## 📖 Usage Instructions and Examples

### 1. Student Usage

#### **1.1 Daily Plan**
- After logging in, open **`/dashboard`**.
- View your daily study plan, including target, progress, and remaining questions.
- Adjust your daily target anytime for a personalized study pace.

#### **1.2 Training & Practice**
- Navigate to **`/training`**.
- Select any topic to begin practicing questions.
- For each question, students can:
  - Submit an answer and get instant feedback.
  - View a full explanation.
  - Save the question for later practice.
- Students may also take topic-specific mini-tests.

#### **1.3 Custom Test**
- Go to **`/exams`** → **Custom Test**.
- Choose:
  - Any topics (e.g., “جبر”). for testing choose “جبر” 
  - Number of questions.
  - Time per question (or disable the timer for testing).
- Ideal for focused practice and UI testing.

#### **1.4 Daily Exam**
- From **`/exams`**, select **Daily Test**.
- Take the official daily 30-question mixed exam.
- Timer, auto-scoring, and full result analysis are included.

#### **1.5 Statistics & Performance**
- Visit **`/stats`** to view:
  - Accuracy
  - Exam count
  - Score history
  - Study streaks
  - Weekly activity
- All metrics update automatically based on your practice.

#### **1.6 Review Wrong Answers**
- Inside **`/stats`**, scroll to the **Review Questions** section.
- See previously incorrect questions to improve mastery.

---

### 2. Admin Usage

#### **2.1 Admin Dashboard**
- Open the Admin Dashboard to view:
  - Total questions in the system
  - Number of registered students
  - Number of teachers
- This overview provides fast platform-level insights.

#### **2.2 User Management**
- Manage users through separate tabs for **Students** and **Teachers**.
- Each user entry includes actions to:
  - **Edit** account details
  - **Delete** accounts when necessary

#### **2.3 Question Review System**
- Access the **Question Review** page.
- Review all submitted questions with their current status:
  - Active
  - Under Review
  - Rejected
- Admin actions include:
  - Approve questions to publish them to students
  - Edit questions directly
  - Reject low-quality or incorrect questions

#### **2.4 Announcements & Tools**
- Send a global announcement to all users with one click.
- Access core content-management tools directly from the dashboard.

---

### 3. Teacher Usage

#### **3.1 Create & Manage Questions**
- Teachers can create new questions with:
  - Question text
  - Options
  - Correct answer
  - Explanation
  - Topic
- Once submitted, questions enter the **review workflow**.

#### **3.2 Track Question Status**
- Teachers can see each question’s status:
  - Under Review
  - Approved
  - Rejected
- This helps teachers improve quality and resubmit updated content.

#### **3.3 View Performance Insights**
- Teachers can access statistics relevant to their submitted questions.
- This includes student performance indicators that help improve question difficulty and clarity.


---

## 👥 Team Members

### Development Team

**Turki Alslamah and Khalid Alanazi** - *Student Interface Developer*
- Role: User Perspective & Student Experience
- Focus: Building intuitive interfaces for student practice, progress tracking, and learning features


**Rayan Alsaedi** – *Admin Dashboard Developer*  
- Role: Administrative Perspective  
- Focus: Managing total questions in the system, tracking number of registered students and teachers, reviewing and approving questions, sending global announcements to all users, and controlling all content management tools.
**NOTE:** Rayan has an issue where he committed, pushed, and merged, but his contribution is not showing in **/contributors**.  
You can still see his commits inside **Pulse**, so the work is there it’s just not counted in the contributors tab.


**Omar Slik** – *Teacher Portal Developer*  
- Role: Teacher Perspective  
- Focus: Building teacher tools for creating questions, viewing statistics, and providing feedback to improve question quality and student learning


---

## 🛠️ Technology Stack

- **Frontend Framework:** React.js (with JSX)
- **Routing:** React Router DOM
- **Build Tool:** Create React App
- **Package Manager:** npm
- **UI Styling:** Bootstrap (React-Bootstrap + custom CSS)

  ---
  ## Figma link
  https://www.figma.com/design/B4e88NbKRB6m8ns4S0NNnT/Positivus-Landing-Page-Design--Community-?node-id=403-333&t=HhOYZKtRMROeTY61-1


---


