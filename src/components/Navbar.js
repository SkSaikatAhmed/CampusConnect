import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">CampusConnect</h1>

        <ul className="flex gap-6 text-gray-700 font-medium">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/notes">Notes</Link></li>
          <li><Link to="/pyq">PYQs</Link></li>
          <li><Link to="/reviews">Faculty Reviews</Link></li>
          <li><Link to="/ai">AI Generator</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
