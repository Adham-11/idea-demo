const axios = require('axios');

const PYTHON_API_BASE = 'http://127.0.0.1:7050';

async function analyzeWithPython(data) {
    try {
        const response = await axios.post(`${PYTHON_API_BASE}/analyze`, data);
        return response.data;
    } catch (error) {
        console.error('Error calling Python /analyze API:', error.message);
        throw error;
    }
}

async function analyzeWithPythonFraud() {
    try {
        const response = await axios.get(`${PYTHON_API_BASE}/detect_fraud`);
        return response.data;
    } catch (error) {
        console.error('Error calling Python /detect_fraud API:', error.message);
        throw error;
    }
}

module.exports = { analyzeWithPython, analyzeWithPythonFraud };
