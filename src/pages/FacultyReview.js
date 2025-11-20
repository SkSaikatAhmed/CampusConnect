import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const FacultyReview = () => {
  const facultyList = [
    "Dr. A. Kumar",
    "Prof. S. Banerjee",
    "Dr. R. Gupta",
    "Prof. M. Iqbal",
    "Dr. P. Roy"
  ];

  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);

  const submitReview = () => {
    if (!selectedFaculty || !rating || !review) {
      alert("Please fill all fields");
      return;
    }

    const newReview = {
      faculty: selectedFaculty,
      rating,
      review,
      date: new Date().toLocaleDateString(),
    };

    setReviews([newReview, ...reviews]);
    setSelectedFaculty("");
    setRating(0);
    setReview("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Faculty Reviews
      </h1>

      {/* Review Form */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-10 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Submit a Review
        </h2>

        {/* Faculty Dropdown */}
        <select
          className="w-full p-3 border rounded-lg mb-4 bg-gray-50"
          value={selectedFaculty}
          onChange={(e) => setSelectedFaculty(e.target.value)}
        >
          <option value="">Select Faculty</option>
          {facultyList.map((faculty) => (
            <option key={faculty} value={faculty}>
              {faculty}
            </option>
          ))}
        </select>

        {/* Star Rating */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer text-2xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        {/* Review Text */}
        <textarea
          className="w-full p-3 h-28 border rounded-lg bg-gray-50"
          placeholder="Write your review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <button
          onClick={submitReview}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Submit Review
        </button>
      </div>

      {/* Reviews List */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Recent Reviews
      </h2>

      {reviews.length === 0 ? (
        <p className="text-gray-600">No reviews yet.</p>
      ) : (
        <div className="space-y-5">
          {reviews.map((rev, index) => (
            <div
              key={index}
              className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold text-lg text-gray-900">
                  {rev.faculty}
                </h3>
                <span className="text-gray-500 text-sm">{rev.date}</span>
              </div>

              <div className="flex mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`text-lg ${
                      star <= rev.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-700">{rev.review}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyReview;
