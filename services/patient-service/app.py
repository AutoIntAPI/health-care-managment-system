from flask import Flask
from flask_cors import CORS
from app.routes.patient_routes import patient_bp
import os

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(patient_bp, url_prefix='/api/patients')

# Health check
@app.route('/health', methods=['GET'])
def health_check():
    return {'status': 'OK', 'service': 'patient-service'}, 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return {'error': 'Not found'}, 404

@app.errorhandler(500)
def internal_error(error):
    return {'error': 'Internal server error'}, 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
