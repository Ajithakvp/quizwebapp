import React, { useEffect, useState } from "react";
import axios from "axios";
import UserLayout from "../components/UserLayout";
import "../styles/quizAttempt.css";

function QuizAttempt() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);

  /* ================= FETCH QUESTIONS ================= */
  useEffect(() => {
    axios.get("http://localhost/quizapi/get_quiz_questions.php")
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setQuestions(res.data);
          setCurrent(0);
          setTimeLeft(res.data[0].time_limit || 30);
        }
      })
      .catch(err => console.error(err));
  }, []);

  /* ================= RESET TIMER ON QUESTION CHANGE ================= */
  useEffect(() => {
    if (questions.length > 0 && questions[current]) {
      setTimeLeft(questions[current].time_limit || 30);
    }
  }, [current, questions]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (submitted) return;
    if (!questions[current]) return;
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, submitted, current, questions]);

  /* ================= AUTO MOVE WHEN TIME OVER ================= */
  useEffect(() => {

    if (submitted) return;
    if (!questions[current]) return;
    if (timeLeft !== 0) return;

    const currentQuestion = questions[current];

    // If not answered, mark as wrong
    if (!answers[currentQuestion.id]) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: "TIME_OVER"
      }));
    }

    // Move next or submit
    if (current < questions.length - 1) {
      setCurrent(prev => prev + 1);
    } else {
      handleSubmit();
    }

  }, [timeLeft]);

  /* ================= SELECT OPTION ================= */
  const selectOption = (opt) => {
    if (submitted) return;

    setAnswers(prev => ({
      ...prev,
      [questions[current].id]: opt
    }));
  };

  /* ================= CALCULATE SCORE ================= */
  const calculateScore = () => {

    let total = 0;
    let correctCount = 0;

    questions.forEach(q => {

      const selected = answers[q.id];

      if (selected === q.correct_option) {
        total += 2;
        correctCount++;
      }
      else if (selected) {
        total -= 1;
      }

    });

    const percent = (
      (correctCount / questions.length) * 100
    ).toFixed(1);

    return { total, percent };
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {

    if (submitted) return;

    const resultData = calculateScore();

    setScore(resultData.total);
    setPercentage(resultData.percent);
    setSubmitted(true);

    try {
      await axios.post(
        "http://localhost/quizapi/save_result.php",
        {
          user_id: user?.id,
          score: resultData.total,
          percentage: resultData.percent
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= SAFE LOADING ================= */
  if (!questions.length || !questions[current]) {
    return (
      <UserLayout>
        <div style={{ padding: 50, textAlign: "center" }}>
          Loading Questions...
        </div>
      </UserLayout>
    );
  }

  const q = questions[current];
  const isLastQuestion = current === questions.length - 1;
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <UserLayout>

      <div className="exam-wrapper">

        <div className="exam-left">

          <h2>Quiz Attempt</h2>

          {/* TIMER */}
          <div className="timer-box">
            ⏱ {timeLeft}s
          </div>

          {/* PROGRESS */}
          <div className="progress-container">
            <div className="progress-bar">
              <div style={{ width: progress + "%" }}></div>
            </div>
            <span>{Math.round(progress)}%</span>
          </div>

          {/* QUESTION */}
          <div className="question-box">

            <h4>
              Question {current + 1}/{questions.length}
            </h4>

            <p>{q.question}</p>

            {["A","B","C","D"].map(opt => {

              const selected = answers[q.id] === opt;
              const isCorrect = q.correct_option === opt;

              return (
                <div
                  key={opt}
                  className={`option
                    ${selected ? "selected" : ""}
                    ${submitted && isCorrect ? "correct" : ""}
                    ${submitted && selected && !isCorrect ? "wrong" : ""}
                  `}
                  onClick={() => selectOption(opt)}
                >
                  {q["option_" + opt.toLowerCase()]}
                </div>
              );
            })}

          </div>

          {/* SCORE DISPLAY */}
          {submitted && (
            <div className="score-display">
              <h3>Total Score: {score}</h3>
              <h4>Percentage: {percentage}%</h4>
            </div>
          )}

          {/* ===== CORRECT NAVIGATION LOGIC ===== */}
          <div className="nav-buttons">

            {/* Previous */}
            <button
              disabled={current === 0 || submitted}
              onClick={() => setCurrent(current - 1)}
            >
              Previous
            </button>

            {/* Next only if not last */}
            {!isLastQuestion && (
              <button
                disabled={submitted}
                onClick={() => setCurrent(current + 1)}
              >
                Next
              </button>
            )}

            {/* Submit only on last */}
            {isLastQuestion && (
              <button
                className="submit-btn"
                disabled={submitted}
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}

          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="exam-right">

          {questions.map((_, index) => {

            const qid = questions[index].id;
            const selected = answers[qid];
            const correct = questions[index].correct_option;

            return (
              <div
                key={index}
                className={`nav-item
                  ${selected ? "answered" : ""}
                  ${submitted && selected === correct ? "correct-nav" : ""}
                  ${submitted && selected && selected !== correct ? "wrong-nav" : ""}
                  ${index === current ? "active" : ""}
                `}
                onClick={() => setCurrent(index)}
              >
                Q{index + 1}
              </div>
            );
          })}

        </div>

      </div>

    </UserLayout>
  );
}

export default QuizAttempt;
