const axios = require('axios');

// Replace with the IP if your backend and Python API run on different machines
const PYTHON_API_URL = 'http://127.0.0.1:7050/analyze';

async function analyzeWithPython(data) {
    try {
        const response = await axios.post(PYTHON_API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error calling Python API:', error.message);
        throw error;
    }
}

module.exports = { analyzeWithPython };