import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import QuestionManagement from "./pages/QuestionManagement";
import QuizManagement from "./pages/QuizManagement";
import QuizListing from "./pages/QuizListing";
import QuizAttempt from "./pages/QuizAttempt";
import UserProfile from "./pages/UserProfile";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/question-management" element={<QuestionManagement />} />
        <Route path="/quiz-management" element={<QuizManagement />} />
        <Route path="/quiz-list" element={< QuizListing />} />
        <Route path="/quiz-attempt" element={< QuizAttempt />} />
        <Route path="/profile" element={< UserProfile />} />






      </Routes>
    </BrowserRouter>
  )
}

export default App;
