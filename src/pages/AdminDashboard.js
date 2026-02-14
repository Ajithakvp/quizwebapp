import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaClipboardList, FaChartBar } from "react-icons/fa";
import AdminLayout from "../components/AdminLayout";
import "../styles/admin.css";

function AdminDashboard() {

  const [data, setData] = useState({
    total_users: 0,
    total_quizzes: 0,
    total_attempts: 0,
    performance: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost/quizapi/get_admin_dashboard.php")
      .then((res) => {
        setData(res.data || {});
      })
      .catch((err) => {
        console.log(err);
        setData({
          total_users: 0,
          total_quizzes: 0,
          total_attempts: 0,
          performance: []
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>

      <div className="admin-dashboard-wrapper">

        <h2 className="dashboard-title">
          📊 Admin Dashboard Overview
        </h2>

        {/* ===== STAT CARDS ===== */}
        <div className="stats-row">

          <div className="stat-card-modern bg-blue">
            <div>
              <h4>Total Users</h4>
              <h2>{data.total_users || 0}</h2>
            </div>
            <FaUsers className="stat-icon" />
          </div>

          <div className="stat-card-modern bg-green">
            <div>
              <h4>Total Quizzes</h4>
              <h2>{data.total_quizzes || 0}</h2>
            </div>
            <FaClipboardList className="stat-icon" />
          </div>

          <div className="stat-card-modern bg-purple">
            <div>
              <h4>Total Attempts</h4>
              <h2>{data.total_attempts || 0}</h2>
            </div>
            <FaChartBar className="stat-icon" />
          </div>

        </div>

        {/* ===== PERFORMANCE SECTION ===== */}
        <div className="performance-container">

          <h3>📈 Quiz Performance</h3>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : data.performance?.length > 0 ? (

            data.performance.map((p, index) => {

              const avgScore = Math.round(p.avg_score);
              const percentage = Math.min(avgScore, 100);

              return (
                <div key={index} className="performance-item">

                  <div className="performance-header">
                    <strong>
                      Quiz #{p.quiz_id} ({p.category})
                    </strong>
                    <span>{avgScore} Avg Score</span>
                  </div>

                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>

                  <small>
                    Difficulty: {p.difficulty}
                  </small>

                </div>
              );
            })

          ) : (
            <div className="no-data">
              No performance data available
            </div>
          )}

        </div>

      </div>

    </AdminLayout>
  );
}

export default AdminDashboard;
