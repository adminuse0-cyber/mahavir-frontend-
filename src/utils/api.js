// ✅ CENTRAL API URL CONFIGURATION
// Local development ma: http://localhost:5000
// Production (Render) ma: taro actual Render URL yahan nakhjo

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_BASE_URL;
