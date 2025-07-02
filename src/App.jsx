import { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [targetLang, setTargetLang] = useState("English");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const LANGUAGES = [
    "English",
    "French",
    "Spanish",
    "German",
    "Urdu",
    "Persian",
  ];

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(
        "https://textlangdetecttranslator.onrender.com/detect_translate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, target_lang: targetLang }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown server error");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message || "Something went wrong" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F3F3] p-4">
      <div className="w-full max-w-md bg-white rounded shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#4CAF50]">
          Language Detector & Translator
        </h2>

        <div className="flex flex-col gap-4">
          <textarea
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            placeholder="Enter text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />

          <select
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          <button
            onClick={handleSubmit}
            disabled={!text || loading}
            className={`bg-[#4CAF50] text-white py-2 px-4 rounded hover:bg-green-600 transition ${
              loading || !text ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex justify-center items-center">
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Loading...
              </span>
            ) : (
              "Detect & Translate"
            )}
          </button>

          {result && (
            <div className="border border-gray-200 rounded p-3 bg-gray-50">
              {result.error ? (
                <p className="text-red-600">{result.error}</p>
              ) : (
                <>
                  <p>
                    <strong>Detected Language:</strong> {result.detected_lang}
                  </p>
                  <p className="mt-2">
                    <strong>Translation:</strong> {result.translation}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
