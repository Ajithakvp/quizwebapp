import React, { useEffect, useState } from "react";
import axios from "axios";
import UserLayout from "../components/UserLayout";
import "../styles/userDashboard.css";

function UserDashboard() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [available, setAvailable] = useState([]);
  const [recent, setRecent] = useState([]);
  const [summary, setSummary] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!user?.id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const availableRes = await axios.get(
          "http://localhost/quizapi/get_available_quizzes.php"
        );

        const recentRes = await axios.get(
          `http://localhost/quizapi/get_recent_attempts.php?user_id=${user.id}`
        );

        const summaryRes = await axios.get(
          `http://localhost/quizapi/get_score_summary.php?user_id=${user.id}`
        );

        const leaderboardRes = await axios.get(
          "http://localhost/quizapi/get_leaderboard.php"
        );

        // SAFE ARRAY HANDLING
        setAvailable(Array.isArray(availableRes.data) ? availableRes.data : []);
        setRecent(Array.isArray(recentRes.data) ? recentRes.data : []);
        setLeaderboard(Array.isArray(leaderboardRes.data) ? leaderboardRes.data : []);

        // Summary is object
        setSummary(
          typeof summaryRes.data === "object" ? summaryRes.data : {}
        );

      } catch (error) {
        console.error("Dashboard Error:", error);

        setAvailable([]);
        setRecent([]);
        setLeaderboard([]);
        setSummary({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [user?.id]);

  return (
    <UserLayout>

      <div className="dashboard-wrapper">

        {/* ===== SUMMARY CARDS ===== */}
        <div className="stat-cards">

          <div className="stat-card card-blue">
            <h4>Total Attempts</h4>
            <h3>{summary?.total_attempts || 0}</h3>
          </div>

          <div className="stat-card card-green">
            <h4>Total Score</h4>
            <h3>{summary?.total_score || 0}</h3>
          </div>

          <div className="stat-card card-purple">
            <h4>Average Score</h4>
            <h3>{Math.round(summary?.average_score || 0)}</h3>
          </div>

        </div>

        {/* ===== AVAILABLE QUIZZES ===== */}
        <div className="section-card">
          <h3>📚 Available Quizzes</h3>

          {loading ? (
            <div>Loading...</div>
          ) : available.length > 0 ? (
            available.map(q => (
              <div key={q.id} className="quiz-item">
                <div className="quiz-info">
                  <strong>{q.question || q.title}</strong><br />
                  {q.category} • {q.difficulty} • {q.time_limit}s
                </div>

                <button
                  className="start-btn"
                  onClick={() => window.location.href = `/quiz-attempt/${q.id}`}
                >
                  Start
                </button>
              </div>
            ))
          ) : (
            <div>No quizzes available</div>
          )}
        </div>

        {/* ===== RECENT ATTEMPTS ===== */}
        {/* ===== RECENT ATTEMPTS ===== */}
        <div className="section-card">
          <h3>🕒 Recent Attempts</h3>

          {recent.length > 0 ? (
            recent.map(r => (
              <div key={r.id} className="recent-card">

                <div className="recent-top">
                  <div className="recent-title">
                    {r.category} Quiz
                  </div>

                  <div className="recent-date">
                    {new Date(r.created_at).toLocaleDateString()}
                  </div>
                </div>


                <div className="recent-score">
                  <strong>{r.score}</strong> Marks &nbsp;|&nbsp;
                  <span>percentage : {r.percentage}%</span>
                </div>

              </div>
            ))
          ) : (
            <div>No recent attempts</div>
          )}
        </div>


        {/* ===== LEADERBOARD ===== */}
        <div className="section-card">
          <h3>🏆 Top 5 Leaderboard</h3>

          {leaderboard.length > 0 ? (
            leaderboard.map((l, index) => (
              <div key={index} className="leaderboard-item">
                <div>
                  <span className="rank">#{index + 1}</span> {l.name}
                </div>
                <div>{l.total_score}</div>
              </div>
            ))
          ) : (
            <div>No leaderboard data</div>
          )}
        </div>

      </div>

    </UserLayout>
  );
}

export default UserDashboard;
