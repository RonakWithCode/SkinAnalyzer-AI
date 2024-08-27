import { useState } from 'react';
import axios from 'axios';
import { Switch } from '@headlessui/react';
import { SunIcon, MoonIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';
import ClipLoader from 'react-spinners/ClipLoader';
import './App.css';


function App() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (imagePreview) {
      const imageBase64 = imagePreview.split(',')[1];
      try {
        setIsLoading(true);
        const { data } = await axios.post('http://localhost:5000/api/images/analyze', { imageBase64 });
        setResult(JSON.parse(data.analysis));  // Ensure the analysis result is parsed as JSON
      } catch (error) {
        console.error('Analysis failed', error);
        setResult('Analysis failed');
      } finally {
        setIsLoading(false);
      }
    } else {
      setResult('Please upload an image first.');
    }
  };

  const renderArray = (items) => (
    <ul className="list-disc list-inside ml-5 space-y-2">
      {items.map((item, index) => (
        <li key={index} className="text-lg text-gray-600 dark:text-gray-300">
          {typeof item === 'string' ? item : renderJson(item)}
        </li>
      ))}
    </ul>
  );

  const renderSection = (title, content) => (
    <div className="json-section mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b-2 pb-2">{title}</h2>
      {Array.isArray(content) ? renderArray(content) : (
        <p className="text-lg text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
          {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
        </p>
      )}
    </div>
  );

  const renderJson = (json) => (
    <div className="json-container space-y-4">
      {Object.keys(json).map((key) => renderSection(key, json[key]))}
    </div>
  );

  return (
    <div className={isDarkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500">
        <motion.h1 
          className="text-4xl font-extrabold mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Skin Condition Analyzer
        </motion.h1>
        <motion.div 
          className="mb-6 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <label className="block mb-3 text-lg font-medium">Upload an image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
          />
        </motion.div>
        {imagePreview && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <img src={imagePreview} alt="Image preview" className="rounded-xl shadow-lg max-h-80" />
          </motion.div>
        )}
        <motion.div 
          className="flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <button
            onClick={handleAnalyze}
            className="bg-green-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-green-700 transition-colors"
          >
            Analyze Image
          </button>
        </motion.div>

        {isLoading && (
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <ClipLoader color={isDarkMode ? '#ffffff' : '#000000'} size={50} />
          </motion.div>
        )}

        {result && (
          <motion.div 
            className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            {result}
            {/* {renderJson(result)} */}
          </motion.div>
        )}

        <Switch
          checked={isDarkMode}
          onChange={setIsDarkMode}
          className={`${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
          } relative inline-flex items-center h-6 rounded-full w-11 mt-10 transition-colors`}
        >
          <span className="sr-only">Toggle Theme</span>
          <span
            className={`${
              isDarkMode ? 'translate-x-6' : 'translate-x-1'
            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
          />
          {isDarkMode ? (
            <MoonIcon className="absolute left-1 w-5 h-5 text-white" />
          ) : (
            <SunIcon className="absolute left-1 w-5 h-5 text-yellow-500" />
          )}
        </Switch>
      </div>
    </div>
  );
}

export default App;
