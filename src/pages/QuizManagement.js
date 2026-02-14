import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "../styles/quizManagement.css";

function QuizManagement() {

  const [questions, setQuestions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    category_id: "",
    difficulty: "Easy",
    time_limit: 30,
    status: "Unpublished",
    question_id: ""
  });

  /* ================= FETCH QUESTIONS ================= */
  const fetchQuestions = async () => {
    try {
      const res = await axios.get(
        "http://localhost/quizapi/get_questions.php"
      );

      setQuestions(Array.isArray(res.data) ? res.data : []);

    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuestions([]);
    }
  };

  /* ================= FETCH QUIZZES ================= */
  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(
        "http://localhost/quizapi/get_quizzes.php"
      );

      console.log("Quiz Response:", res.data);

      setQuizzes(Array.isArray(res.data) ? res.data : []);

    } catch (error) {
      console.error("Error fetching quizzes:", error);
      setQuizzes([]);
    }
  };

  /* ================= FETCH CATEGORIES ================= */
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost/quizapi/get_categories.php"
      );

      setCategories(Array.isArray(res.data) ? res.data : []);

    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchQuizzes();
    fetchCategories();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category_id) {
      alert("Please select category");
      return;
    }

    if (!form.question_id) {
      alert("Please select question");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("category_id", form.category_id);
      formData.append("difficulty", form.difficulty);
      formData.append("time_limit", form.time_limit);
      formData.append("status", form.status);
      formData.append("question_id", form.question_id);

      const res = await axios.post(
        "http://localhost/quizapi/create_quiz.php",
        formData
      );

      alert(res.data.message);

      setForm({
        category_id: "",
        difficulty: "Easy",
        time_limit: 30,
        status: "Unpublished",
        question_id: ""
      });

      fetchQuizzes();

    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  return (
    <AdminLayout>

      <div className="quiz-wrapper">

        <div className="quiz-card">
          <div className="quiz-heading">📚 Quiz Management</div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* CATEGORY */}
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={form.category_id}
                  onChange={(e) =>
                    setForm({ ...form, category_id: e.target.value })
                  }
                  required
                >
                  <option value="">-- Select Category --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* DIFFICULTY */}
              <div className="form-group">
                <label className="form-label">Difficulty</label>
                <select
                  className="form-select"
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm({ ...form, difficulty: e.target.value })
                  }
                >
                  <option value="Easy">🟢 Easy</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Hard">🔴 Hard</option>
                </select>
              </div>

              {/* TIME LIMIT */}
              <div className="form-group">
                <label className="form-label">Time Limit (Seconds)</label>
                <select
                  className="form-select"
                  value={form.time_limit}
                  onChange={(e) =>
                    setForm({ ...form, time_limit: e.target.value })
                  }
                >
                  {Array.from({ length: 91 }, (_, i) => i + 30).map(sec => (
                    <option key={sec} value={sec}>
                      {sec} Seconds
                    </option>
                  ))}
                </select>
              </div>

              {/* STATUS */}
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option value="Published">Published</option>
                  <option value="Unpublished">Unpublished</option>
                </select>
              </div>

            </div>

            {/* QUESTION */}
            <div className="question-box">
              <label className="form-label">Select Question</label>

              <select
                className="form-select"
                value={form.question_id}
                onChange={(e) =>
                  setForm({ ...form, question_id: e.target.value })
                }
                required
              >
                <option value="">-- Select Question --</option>
                {questions.map(q => (
                  <option key={q.id} value={q.id}>
                    {q.question}
                  </option>
                ))}
              </select>
            </div>

            <button className="create-btn">
              Create Quiz
            </button>

          </form>
        </div>

        {/* ================= QUIZ TABLE ================= */}

        <table className="quiz-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Question</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(quizzes) && quizzes.length > 0 ? (
              quizzes.map(q => (
                <tr key={q.id}>
                  <td>{q.id}</td>
                  <td>{q.quiz_title}</td>
                  <td>{q.category}</td>
                  <td>{q.difficulty}</td>
                  <td>{q.time_limit} sec</td>
                  <td>
                    <span
                      className={`status-badge ${
                        q.status === "Published"
                          ? "published"
                          : "unpublished"
                      }`}
                    >
                      {q.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No quizzes found
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

    </AdminLayout>
  );
}

export default QuizManagement;
