import React, { useEffect, useState } from "react";
import axios from "axios";
import UserLayout from "../components/UserLayout";
import "../styles/userProfile.css";

function UserProfile() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState({});
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [editName, setEditName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {

    axios.get(
      `http://localhost/quizapi/get_profile.php?user_id=${user.id}`
    )
    .then(res => {

      if(res.data.status){
        const data = res.data.data;

        setProfile(data.profile);
        setHistory(data.history);
        setSummary(data.summary);
        setAchievements(data.achievements);
        setEditName(data.profile.name);
      }

    });

  }, [user.id]);

  const updateProfile = async () => {

    await axios.post(
      "http://localhost/quizapi/update_profile.php",
      {
        user_id: user.id,
        name: editName,
        password: newPassword
      }
    );

    alert("Profile Updated");
    window.location.reload();
  };

  return (
    <UserLayout>

      <div className="profile-wrapper">

        {/* PROFILE CARD */}
        <div className="profile-card">

          <div className="profile-avatar">
            {profile.name?.charAt(0)}
          </div>

          <h2>{profile.name}</h2>
          <p>{profile.email}</p>
          <span>Joined: {profile.created_at}</span>

        </div>

        {/* SUMMARY CARDS */}
        <div className="summary-grid">

          <div className="summary-card">
            <h4>Total Attempts</h4>
            <h2>{summary.total_attempts || 0}</h2>
          </div>

          <div className="summary-card">
            <h4>Total Score</h4>
            <h2>{summary.total_score || 0}</h2>
          </div>

          <div className="summary-card">
            <h4>Avg %</h4>
            <h2>{Math.round(summary.avg_percentage || 0)}%</h2>
          </div>

        </div>

        {/* ACHIEVEMENTS */}
        <div className="section-card">
          <h3>🏆 Achievements</h3>

          {achievements.length > 0 ? (
            achievements.map((a,i)=>(
              <div key={i} className="achievement-badge">
                {a}
              </div>
            ))
          ) : (
            <p>No achievements yet</p>
          )}
        </div>

        {/* QUIZ HISTORY */}
        <div className="section-card">
          <h3>📜 Quiz History</h3>

          {history.map((h,i)=>(
            <div key={i} className="history-item">
              <div>
                Score: <strong>{h.score}</strong>
              </div>
              <div>
                {h.percentage}%
              </div>
              <div>
                {h.created_at}
              </div>
            </div>
          ))}

        </div>

        {/* ACCOUNT SETTINGS */}
        <div className="section-card">
          <h3>⚙ Account Settings</h3>

          <input
            value={editName}
            onChange={(e)=>setEditName(e.target.value)}
            placeholder="Name"
          />

          <input
            type="password"
            placeholder="New Password (optional)"
            onChange={(e)=>setNewPassword(e.target.value)}
          />

          <button onClick={updateProfile}>
            Update Profile
          </button>

        </div>

      </div>

    </UserLayout>
  );
}

export default UserProfile;
