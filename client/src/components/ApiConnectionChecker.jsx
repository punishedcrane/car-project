import { useState } from 'react';

const ApiConnectionChecker = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState('https://car-projectbackend.onrender.com');

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch(url);
      const data = await response.text();
      setResult({
        status: response.status,
        data: data
      });
    } catch (err) {
      setError({
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">API Connection Checker</h2>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Backend URL:</label>
        <input 
          type="text" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          className="w-full p-2 border rounded"
        />
      </div>
      
      <button 
        onClick={testConnection} 
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      
      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="text-lg font-semibold text-green-800">Success (Status: {result.status})</h3>
          <pre className="mt-2 bg-white p-3 rounded overflow-auto text-sm">{result.data}</pre>
        </div>
      )}
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="text-lg font-semibold text-red-800">Error: {error.message}</h3>
        </div>
      )}
      
      <div className="mt-8 bg-gray-50 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Troubleshooting Tips:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Make sure your backend server is running</li>
          <li>Check CORS configuration on the server</li>
          <li>Verify the URL in your environment variables</li>
          <li>Check for API rate limits on your hosting provider</li>
          <li>Examine network requests in browser developer tools</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiConnectionChecker;