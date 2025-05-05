from flask import Flask, request, jsonify
import pandas as pd
import joblib
import pickle
import requests
from flask_cors import CORS
import os
from urllib.parse import quote
app = Flask(__name__)
CORS(app)
# Load both the model and the target scaler
model = joblib.load('salary_predictor_model.pkl')
with open('target_scaler.pkl', 'rb') as f:
    target_scaler = pickle.load(f)

# Adzuna API credentials (use environment variables in production)
ADZUNA_APP_ID = os.environ.get('ADZUNA_APP_ID', 'ecdeda3a')  # Replace with yours
ADZUNA_API_KEY = os.environ.get('ADZUNA_API_KEY', '3c76dc48e6bbbdd0e7c9ed91d64a77f8')  # Replace with yours


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = ['TotalWorkingYears', 'JobLevel']
    
    # Create DataFrame
    sample = pd.DataFrame([[
        data['TotalWorkingYears'],
        data['JobLevel']
    ]], columns=features)
    
    # Get normalized prediction
    prediction_normalized = model.predict(sample)
    
    # Convert to real salary value
    prediction_denormalized = target_scaler.inverse_transform(
        prediction_normalized.reshape(-1, 1)
    )
    
    return jsonify({
        'predicted_salary_real': float(prediction_denormalized[0][0])
    })

@app.route('/api/market-salary', methods=['GET'])
def get_market_salary():
    try:
        location = request.args.get('location', 'us')  # Use ISO country codes
        job_title = request.args.get('title', 'software engineer')

        response = requests.get(
            f'https://api.adzuna.com/v1/api/jobs/{location}/search/1',
            params={
                'app_id': ADZUNA_APP_ID,
                'app_key': ADZUNA_API_KEY,
                'what': job_title,
                'category': 'it-jobs',
                'results_per_page': 50
            },
            headers={'Content-Type': 'application/json'}
        )

        response.raise_for_status()
        data = response.json()

        # Compute average salary from results
        salaries = [
            (item.get('salary_min', 0) + item.get('salary_max', 0)) / 2
            for item in data.get('results', [])
            if item.get('salary_min') and item.get('salary_max')
        ]

        avg_salary = sum(salaries) / len(salaries) if salaries else 0

        # Fake "history" using the same value for past months
        import datetime
        from dateutil.relativedelta import relativedelta

        market_data = []
        for i in range(12):
            date = (datetime.datetime.now() - relativedelta(months=i)).strftime('%Y-%m')
            market_data.append({
                "date": date,
                "marketAvg": round(avg_salary, 2)
            })

        return jsonify(market_data)

    except requests.exceptions.HTTPError as e:
        return jsonify({"error": f"Adzuna API Error: {str(e)}"}), e.response.status_code
    except Exception as e:
        return jsonify({"error": f"Server Error: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)