import React, { useState } from "react";
import { FaRobot } from "react-icons/fa";

const AIQuestionGenerator = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  const generateQuestions = async () => {
    if (!topic) {
      alert("Please enter a topic");
      return;
    }

    setLoading(true);

    // For now: Mock AI questions
    setTimeout(() => {
      const generated = Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        text: `AI-Generated Question ${i + 1} on "${topic}" with ${difficulty} difficulty.`,
      }));

      setQuestions(generated);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-6">
        <FaRobot className="text-blue-600" /> AI Question Generator
      </h1>

      <div className="bg-white shadow-xl border rounded-xl p-6">
        {/* Topic Input */}
        <label className="font-semibold text-gray-700">Topic / Chapter</label>
        <input
          type="text"
          placeholder="e.g., Operating System, DBMS, DSA..."
          className="w-full p-3 border rounded-lg bg-gray-50 mt-1 mb-4"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        {/* Difficulty */}
        <label className="font-semibold text-gray-700">Difficulty</label>
        <select
          className="w-full p-3 border rounded-lg bg-gray-50 mt-1 mb-4"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Number of Questions */}
        <label className="font-semibold text-gray-700">Number of Questions</label>
        <input
          type="number"
          className="w-full p-3 border rounded-lg bg-gray-50 mt-1 mb-4"
          value={count}
          min={1}
          max={20}
          onChange={(e) => setCount(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={generateQuestions}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Generate Questions
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center mt-8">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Generated Questions */}
      {questions.length > 0 && !loading && (
        <div className="mt-10 bg-white shadow-md border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Questions:</h2>
          <ul className="space-y-3">
            {questions.map((q) => (
              <li
                key={q.id}
                className="p-3 bg-gray-100 rounded-lg border text-gray-800"
              >
                {q.id}. {q.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIQuestionGenerator;
