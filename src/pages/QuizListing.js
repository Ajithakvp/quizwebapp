import React, { useEffect, useState } from "react";
import axios from "axios";
import UserLayout from "../components/UserLayout";
import "../styles/quizListing.css";
import { useNavigate } from "react-router-dom";


function QuizListing() {

    const navigate = useNavigate();


    const [quizzes, setQuizzes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        category: "",
        difficulty: "",
        search: ""
    });

    /* ================= FETCH QUIZZES ================= */
    const fetchQuizzes = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                "http://localhost/quizapi/get_quiz_list.php",
                { params: filters }
            );

            setQuizzes(Array.isArray(res.data) ? res.data : []);

        } catch (error) {
            console.error("Error:", error);
            setQuizzes([]);
        } finally {
            setLoading(false);
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
            setCategories([]);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchQuizzes();
    }, [filters]);

    return (
        <UserLayout>

            <div className="quiz-list-wrapper">

                <h2 className="page-title">Explore Quizzes</h2>

                {/* ================= FILTER SECTION ================= */}
                <div className="filter-bar">

                    <input
                        className="search-input"
                        placeholder="Search quizzes..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />

                    <select
                        className="filter-select"
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="filter-select"
                        value={filters.difficulty}
                        onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                    >
                        <option value="">All Difficulty</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>

                </div>

                {/* ================= QUIZ CARDS ================= */}
                <div className="quiz-grid">

                    {loading ? (
                        <div className="no-data">Loading quizzes...</div>
                    ) : quizzes.length > 0 ? (
                        quizzes.map(q => (

                            <div key={q.id} className="quiz-card-modern">

                                <div className="quiz-header">
                                    <h3>{q.title}</h3>
                                    <span className={`difficulty-badge ${q.difficulty.toLowerCase()}`}>
                                        {q.difficulty}
                                    </span>
                                </div>

                                <div className="quiz-details">
                                    <div>📂 {q.category}</div>
                                    <div>📝 {q.total_questions} Questions</div>
                                    <div>⏱ {q.time_limit}s</div>
                                </div>

                                <button
                                    className="start-btn"
                                    onClick={() => navigate(`/quiz-attempt/${q.id}`)}
                                >
                                    ▶ Start Quiz
                                </button>



                            </div>

                        ))
                    ) : (
                        <div className="no-data">No quizzes found</div>
                    )}

                </div>

            </div>

        </UserLayout>
    );
}

export default QuizListing;
