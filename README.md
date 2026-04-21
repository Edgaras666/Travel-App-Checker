# Travel Safety Checker

Travel Safety Checker is an AI-powered web application that helps users quickly check whether a country is currently safe to travel to.

The app uses Google Gemini AI to generate a travel safety overview and provides:

* Safety score (0 to 100)
* Safety level (Safe / Caution / Avoid)
* Natural disaster summary
* Conflict / protest summary
* Practical travel advice

---

# Live Demo

[https://travel-app-checker.vercel.app]

---

# GitHub Repository

[https://github.com/Edgaras666/Travel-App-Checker]

---

# Technologies Used

## Frontend

* React

## Backend

* Python

## Framework

* Flask

## AI Provider

* Google Gemini API

## Deployment

* Frontend hosted on Vercel
* Backend hosted on Render

---

# Project Structure

Travel-App-Checker/
├── frontend/
├── backend/
├── README.md
└── .gitignore

---

# How To Test The App (Live Website)

## Open the live website:

[https://travel-app-checker.vercel.app](https://travel-app-checker.vercel.app)

## Test Steps

1. Open the website in browser

2. Type a country name in the search box, for example:

* Japan
* France
* Brazil
* Thailand
* Ukraine

3. Click:

Check Safety

4. Wait a few seconds while the AI checks travel conditions.

5. Review the generated result:

* Safety score
* Safety level
* Natural disasters
* Conflicts / protests
* Travel advice

---

# Example Test Cases

## Safe Destination

Japan

Expected:
High score, low risk, practical advice.

## Medium Risk Destination

Brazil

Expected:
Mixed score, caution areas, crime or disruption notes.

## Higher Risk Destination

Ukraine

Expected:
Lower score, conflict warnings, avoid unnecessary travel.

---

# Features

* Country autocomplete search
* AI travel safety analysis
* Score indicator bar
* Country flag display
* Loading state while checking
* Error handling
* Responsive modern UI
* Public live deployment

---

# How It Works

1. User enters a country name
2. React frontend sends request to Flask backend
3. Backend validates request
4. Backend sends prompt to Google Gemini API
5. Gemini returns structured travel safety data
6. Frontend displays results to the user

---

# Local Development Setup

## Backend

cd backend

python -m venv venv

Windows:

venv\Scripts\activate

Install packages:

pip install -r requirements.txt

Run backend:

python app.py

## Frontend

cd frontend

npm install

npm start

---

# Security Notes

* API key stored only in backend environment variables
* API key never exposed in frontend
* .env files ignored using .gitignore

---

# Disclaimer

This app provides AI-generated travel safety summaries.

Users should always verify information using official travel advisories, embassies, airlines, and local government sources before making travel decisions.

---

# Author

Edgaras
