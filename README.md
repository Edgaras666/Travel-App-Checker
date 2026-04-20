### Travel Safety Checker ###

Travel Safety Checker is an AI-powered web application that helps users check whether a country is currently safe to travel to.

The app uses Google Gemini AI to generate a travel safety overview and provides:

* Safety score (0 to 100)
* Safety level
* Natural disaster summary
* Conflict / protest summary
* Practical travel advice

# Technologies Used

* React
* Python
* Flask
* Google Gemini API

# Project Structure

travel-safety-checker/
├── frontend/
├── backend/
├── README.md
└── .gitignore

### Full Setup Guide ###

## 1. Download / Clone Project

git clone YOUR_GITHUB_REPO_URL
cd travel-safety-checker

If using ZIP download, simply extract and open the project folder.

## 2. Backend Setup

Open terminal inside project folder:

cd backend
python -m venv venv

Activate Virtual Environment

Windows:

venv\Scripts\activate

Mac / Linux:

source venv/bin/activate

Install Backend Packages:

pip install -r requirements.txt

Create backend/.env file and paste:

GEMINI_API_KEY=your_key_here

Run Backend:

python app.py

Backend runs on:

http://127.0.0.1:5000

## 3. Frontend Setup

Open SECOND terminal inside project folder:

cd frontend
npm install

Create frontend/.env file and paste:

REACT_APP_API_BASE_URL=http://127.0.0.1:5000

Run Frontend:

npm start

Frontend runs on:

http://localhost:3000

# How To Use

1. Open browser at http://localhost:3000
2. Enter country name
3. Click Check Safety
4. Review results:

* Safety score
* Safety level
* Natural disasters
* Conflicts / protests
* Travel advice

# Features

* Country autocomplete search
* AI travel safety analysis
* Safety score bar
* Country flag display
* Loading indicator
* Error handling
* Responsive modern UI

# How It Works

1. User enters country name
2. React frontend sends POST request to backend
3. Flask backend validates request
4. Backend sends prompt to Gemini API
5. Gemini returns structured result
6. Frontend displays data

# Security Notes

* API key stored only in backend .env
* API key never exposed in frontend
* .env files ignored using .gitignore


# Disclaimer

AI-generated information. Always verify travel information with official travel advisories, embassies, airlines, and local government sources.

# Author
Edgaras B.
