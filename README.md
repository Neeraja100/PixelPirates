The Financial Mirror

🔗 Problem Statement

Most people today have only a surface-level understanding of their financial behavior. They may notice overspending or lower savings, but they often do not know where their money is going, what drives their spending, or how their daily choices affect long-term financial health. Traditional financial tools mainly track transactions and display them in charts or categories, but they rarely provide meaningful interpretation. As a result, users are left with data but no direction, unable to connect spending with behavior, identify inefficiencies, or take informed action. There is a clear need for a system that goes beyond tracking and acts as an intelligent layer over financial data—one that can analyze, interpret, and explain spending behavior in a simple, honest, and actionable way.

---

🔗 Project Goal

The goal of this project is to build a system that functions as a “financial mirror,” reflecting not just what users spend, but what their spending actually means. The system aims to analyze income, expenses, and behavioral patterns to uncover hidden insights, detect inefficiencies, and provide users with a deeper understanding of their financial habits.

Instead of overwhelming users with raw data, the platform focuses on transforming financial information into clear insights and practical actions. By identifying patterns, assigning behavioral context, and offering personalized recommendations, the system helps users make better financial decisions. Ultimately, the goal is to enable users to move from passive tracking to active financial awareness and improvement.

---

🔗 Features & Workflow

🔗 1. First-Time User Experience

A guided demo experience is shown on first visit
Explains how the system works and builds user trust
Highlights privacy-focused approach to encourage users to share financial details like income

---

🔗 2. User Authentication

Login system with basic user details
Designed to ensure a smooth and trustworthy onboarding experience

---

🔗 3. Data Collection via SMS

User grants permission to access transaction-related SMS
System scans messages and processes data

🔗 Parsing Feedback:

Displays real-time parsing instead of generic loading

Example:
Total messages scanned
Relevant transaction messages identified
Irrelevant messages ignored

---

🔗 4. Dashboard Overview

The dashboard is the central interface where all financial insights are presented in a structured manner:

🔗 Analytics

Timeline-based spending
Category-wise expenditure
Numerical summary of financial activity

🔗 Insights

Displays key behavioral insights
Highlights spending patterns and inefficiencies

🔗 Financial Personality

Assigns a personality based on spending behavior
Includes tagline, strengths, and weaknesses

🔗 Transactions

Displays all tracked transactions
Allows manual addition via text input
Supports voice-based input (speech-to-text) for cash expenses

🔗 Actions

Provides actionable suggestions
Helps users reduce expenses and improve financial habits

---

🔗 Tech Stack

🔗 Backend

Python + FastAPI

🔗 Data Processing

pandas, pdfplumber, tabula-py

🔗 Categorization

Rule-based engine (dictionary-based)
OpenAI gpt-4o-mini (fallback for classification)

🔗 Insight Generation

OpenAI GPT-4o / Gemini 1.5 Flash

🔗 Frontend

React + Recharts + TailwindCSS

🔗 Authentication (Demo)

None / localStorage-based mock

🔗 Deployment

Vercel (frontend)
Railway / Render (backend)

🔗 Database

SQLite (local) or in-memory (for demo)

---

🔗 System Overview

The system collects financial data through SMS and manual inputs, processes and filters it, analyzes behavioral patterns, generates insights, and provides actionable recommendations to improve financial decision-making.

---

🔗 Outcome

A platform that not only tracks financial activity but also explains spending behavior, builds awareness, and helps users take meaningful actions toward better financial habits.


