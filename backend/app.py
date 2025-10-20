from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import time
import uuid
import os
from dotenv import load_dotenv
import ldclient
from ldclient.config import Config
import ldobserve
from ldobserve import ObservabilityConfig, ObservabilityPlugin, observe
from ldclient import Context

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Configure Flask with environment variables
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['DEBUG'] = os.getenv('FLASK_DEBUG', 'True') == 'True'

# Configure CORS
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
CORS(app, origins=cors_origins)

# Observability configuration from environment variables
observability_config = ObservabilityConfig(
  service_name = os.getenv('SERVICE_NAME', 'tom-and-abrams-incredible-user-list-service'),
  # we recommend setting service_version to the latest deployed git SHA
  service_version = os.getenv('SERVICE_VERSION', '0.1.0'),
  environment = os.getenv('ENVIRONMENT', 'test')
)

# LaunchDarkly configuration with SDK key from environment
ld_sdk_key = os.getenv('LAUNCHDARKLY_SDK_KEY')
if not ld_sdk_key:
    raise ValueError("LAUNCHDARKLY_SDK_KEY environment variable is required")

ldclient.set_config(Config(ld_sdk_key, 
  # optional observability plugin, requires Python SDK v9.12+
  plugins=[ObservabilityPlugin(observability_config)]
  )
)
client = ldclient.get()


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": time.time()})

@app.route('/api/users', methods=['GET'])
def get_users():

    users = [
            # Pretending to get this from data source 2
            {"id": 1, "name": "Alice Johnson", "email": "alice@example.com"},
            {"id": 2, "name": "Bill Bobaggins", "email": "bill@example.com"},
            {"id": 3, "name": "Charlie Brown", "email": "charlie@example.com"},
        ]
    return jsonify({"users": users})

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get a specific user by ID"""
    user = next((u for u in users if u["id"] == user_id), None)
    if user:
        return jsonify(user)
    return jsonify({"error": "User not found"}), 404

@app.route('/api/users', methods=['POST'])
def create_user():
    """Create a new user"""
    data = request.get_json()

    if not data or 'name' not in data or 'email' not in data:
        return jsonify({"error": "Name and email are required"}), 400

    new_user = {
        "id": max([u["id"] for u in users]) + 1 if users else 1,
        "name": data["name"],
        "email": data["email"]
    }
    users.append(new_user)

    return jsonify(new_user), 201

@app.route('/api/random-data', methods=['GET'])
def random_data():
    """Generate random data"""
    return jsonify({
        "value": random.randint(1, 100),
        "timestamp": time.time(),
        "message": "Random data generated successfully"
    })

@app.route('/api/simulate-error', methods=['GET'])
def simulate_error():
    """Endpoint to simulate server errors for testing"""
    error_type = request.args.get('type', 'server')

    if error_type == 'server':
        return jsonify({"error": "Internal server error"}), 500
    elif error_type == 'notfound':
        return jsonify({"error": "Resource not found"}), 404
    elif error_type == 'badrequest':
        return jsonify({"error": "Bad request"}), 400
    else:
        return jsonify({"error": "Unknown error type"}), 400

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    port = int(os.getenv('API_PORT', 5001))
    debug = os.getenv('FLASK_DEBUG', 'True') == 'True'
    app.run(debug=debug, port=port)
