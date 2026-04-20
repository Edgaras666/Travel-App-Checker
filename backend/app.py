from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
from google.genai import types
import os
import time
import traceback

load_dotenv()

app = Flask(__name__)

CORS(app, resources={
    r"/check": {
        "origins": [
            "http://localhost:3000",
            "http://127.0.0.1:3000"
        ]
    }
})

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
FALLBACK_MODEL = os.getenv("GEMINI_FALLBACK_MODEL", "gemini-2.5-flash-lite")

if not GEMINI_API_KEY:
    raise ValueError("Missing GEMINI_API_KEY in environment variables.")

client = genai.Client(api_key=GEMINI_API_KEY)

VALID_COUNTRIES = {
    "afghanistan", "albania", "algeria", "argentina", "armenia", "australia",
    "austria", "azerbaijan", "bahamas", "bahrain", "bangladesh", "belarus",
    "belgium", "belize", "bolivia", "bosnia and herzegovina", "brazil",
    "bulgaria", "cambodia", "cameroon", "canada", "chile", "china", "colombia",
    "croatia", "cuba", "cyprus", "czech republic", "denmark", "dominican republic",
    "ecuador", "egypt", "estonia", "ethiopia", "finland", "france", "georgia",
    "germany", "ghana", "greece", "hungary", "iceland", "india", "indonesia",
    "iran", "iraq", "ireland", "israel", "italy", "jamaica", "japan",
    "jordan", "kazakhstan", "kenya", "kuwait", "latvia", "lebanon", "lithuania",
    "luxembourg", "malaysia", "mexico", "moldova", "mongolia", "morocco",
    "netherlands", "new zealand", "nigeria", "north korea", "norway",
    "pakistan", "peru", "philippines", "poland", "portugal", "qatar",
    "romania", "russia", "saudi arabia", "serbia", "singapore", "slovakia",
    "slovenia", "south africa", "south korea", "spain", "sweden",
    "switzerland", "thailand", "turkey", "ukraine", "united arab emirates",
    "united kingdom", "united states", "uruguay", "venezuela", "vietnam"
}

cache = {}
CACHE_TTL = 60 * 60  # 1 hour


def normalize_country(country: str) -> str:
    return country.strip().lower()


def display_country(country: str) -> str:
    return " ".join(word.capitalize() for word in country.strip().split())


def get_cached(country: str):
    key = normalize_country(country)

    if key in cache:
        data, timestamp = cache[key]
        if time.time() - timestamp < CACHE_TTL:
            return data
        del cache[key]

    return None


def set_cache(country: str, data):
    key = normalize_country(country)
    cache[key] = (data, time.time())


def generate_with_model(model_name: str, prompt: str):
    response = client.models.generate_content(
        model=model_name,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema={
                "type": "object",
                "properties": {
                    "safety": {
                        "type": "string",
                        "enum": ["Safe", "Caution", "Avoid"]
                    },
                    "score": {
                        "type": "integer"
                    },
                    "disasters": {
                        "type": "string"
                    },
                    "conflicts": {
                        "type": "string"
                    },
                    "advice": {
                        "type": "string"
                    }
                },
                "required": ["safety", "score", "disasters", "conflicts", "advice"]
            }
        )
    )

    parsed = response.parsed
    if not parsed:
        raise ValueError("AI response was empty or invalid.")

    return {
        "safety": str(parsed.get("safety", "Caution")),
        "score": max(0, min(100, int(parsed.get("score", 0)))),
        "disasters": str(parsed.get("disasters", "None")),
        "conflicts": str(parsed.get("conflicts", "None")),
        "advice": str(parsed.get("advice", "Check official travel advisories before travel."))
    }


def generate_with_retry(prompt: str):
    models_to_try = [MODEL_NAME, FALLBACK_MODEL]
    retry_delays = [1, 2, 4]

    last_error = None

    for model_name in models_to_try:
        for delay in retry_delays:
            try:
                return generate_with_model(model_name, prompt)
            except Exception as e:
                last_error = e
                error_text = str(e)

                # Retry only for temporary overload / availability problems
                if "503" in error_text or "UNAVAILABLE" in error_text:
                    print(f"Model {model_name} unavailable, retrying in {delay}s...")
                    time.sleep(delay)
                    continue

                # For non-503 errors, stop immediately
                raise

        print(f"Model {model_name} still unavailable after retries. Trying next model...")

    raise last_error if last_error else RuntimeError("Unknown AI provider error.")


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


@app.route("/check", methods=["POST"])
def check_safety():
    try:
        data = request.get_json(silent=True) or {}
        country = (data.get("country") or "").strip()

        if not country:
            return jsonify({"error": "Please provide a country name."}), 400

        normalized = normalize_country(country)

        if normalized not in VALID_COUNTRIES:
            return jsonify({
                "error": "Invalid country name. Please enter a valid country from the list."
            }), 400

        cached = get_cached(country)
        if cached:
            return jsonify(cached), 200

        pretty_country = display_country(country)

        prompt = f"""
You are a travel safety assistant.

Task:
Assess whether it is reasonably safe to travel to {pretty_country} soon.

Look at:
- general travel safety
- recent natural disasters
- recent conflicts, protests, strikes, or major disruptions
- short practical advice

Rules:
- Keep answers short and factual
- safety must be exactly one of: Safe, Caution, Avoid
- score must be an integer from 0 to 100
- disasters must be brief
- conflicts must be brief
- advice must be brief
"""

        result = generate_with_retry(prompt)

        set_cache(country, result)
        return jsonify(result), 200

    except Exception as e:
        print("SERVER ERROR:", e)
        traceback.print_exc()

        error_text = str(e)
        if "503" in error_text or "UNAVAILABLE" in error_text:
            return jsonify({
                "error": "AI provider is busy right now. Please try again in a moment."
            }), 503

        return jsonify({"error": "Server error while checking travel safety."}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)