import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import "../styles/question.css";

function QuestionManagement() {

  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    quiz_id: 1,
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: "A",
    explanation: ""
  });

  const [media, setMedia] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchQuestions = () => {
    axios.get("http://localhost/quizapi/get_questions.php")
      .then(res => setQuestions(res.data));
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if(media) formData.append("media", media);

    if(editingId){
      formData.append("id", editingId);
      await axios.post("http://localhost/quizapi/update_question.php", formData);
    } else {
      await axios.post("http://localhost/quizapi/add_question.php", formData);
    }

    setForm({
      quiz_id: 1,
      question: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_option: "A",
      explanation: ""
    });

    setEditingId(null);
    setMedia(null);
    fetchQuestions();
  };

  const handleEdit = (q) => {
    setForm(q);
    setEditingId(q.id);
  };

  const handleDelete = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this question?"
  );

  if (!confirmDelete) return;

  try {
    await axios.get(
      `http://localhost/quizapi/delete_question.php?id=${id}`
    );

    fetchQuestions();

  } catch (error) {
    console.error("Delete error:", error);
  }
};


  return (
    <AdminLayout>

      <div className="question-page-title">
        📝 Question Management
      </div>

      {/* ===== FORM ===== */}
      <div className="question-form-card">
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <textarea
              className="form-textarea"
              placeholder="Enter Question"
              value={form.question}
              onChange={(e)=>setForm({...form,question:e.target.value})}
              required
            />
          </div>

          <div className="option-grid">
            <input className="form-input" placeholder="Option A"
              value={form.option_a}
              onChange={(e)=>setForm({...form,option_a:e.target.value})}
              required
            />
            <input className="form-input" placeholder="Option B"
              value={form.option_b}
              onChange={(e)=>setForm({...form,option_b:e.target.value})}
              required
            />
            <input className="form-input" placeholder="Option C"
              value={form.option_c}
              onChange={(e)=>setForm({...form,option_c:e.target.value})}
              required
            />
            <input className="form-input" placeholder="Option D"
              value={form.option_d}
              onChange={(e)=>setForm({...form,option_d:e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <select
              className="form-select"
              value={form.correct_option}
              onChange={(e)=>setForm({...form,correct_option:e.target.value})}
            >
              <option value="A">Correct: A</option>
              <option value="B">Correct: B</option>
              <option value="C">Correct: C</option>
              <option value="D">Correct: D</option>
            </select>
          </div>

          <div className="form-group">
            <textarea
              className="form-textarea"
              placeholder="Explanation"
              value={form.explanation}
              onChange={(e)=>setForm({...form,explanation:e.target.value})}
            />
          </div>

          <div className="form-group">
            <input type="file" onChange={(e)=>setMedia(e.target.files[0])} />
          </div>

          <button type="submit" className="submit-btn">
            {editingId ? "Update Question" : "Add Question"}
          </button>

        </form>
      </div>

      {/* ===== TABLE ===== */}
      <table className="question-table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Correct</th>
            <th>Media</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map(q => (
            <tr key={q.id}>
              <td>{q.question}</td>
              <td>{q.correct_option}</td>
              <td>
                {q.media && (
                  <img
                    src={`http://localhost/quizapi/uploads/${q.media}`}
                    alt="media"
                    className="media-preview"
                  />
                )}
              </td>
              <td>
                <button className="action-btn edit-btn"
                  onClick={()=>handleEdit(q)}>
                  Edit
                </button>
                <button className="action-btn delete-btn"
                  onClick={()=>handleDelete(q.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </AdminLayout>
  );
}

export default QuestionManagement;
