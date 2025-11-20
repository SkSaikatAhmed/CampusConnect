import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import FacultyReview from './pages/FacultyReview'
import Notes from './pages/Notes'
import PYQ from './pages/PYQ'
import AIQuestionGenerator from './pages/AIQuestionGenerator'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/pyq" element={<PYQ />} />
        <Route path="/reviews" element={<FacultyReview />} />
        <Route path="/ai" element={<AIQuestionGenerator />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
