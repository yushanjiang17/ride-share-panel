const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const timerElement = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
let gameOver = false;

// CPR & AED QUESTIONS
const questions = [
  {
    question: "What is the first step when you see someone collapse?",
    answers: [
      { text: "Check the scene for safety", correct: true },
      { text: "Start chest compressions", correct: false },
      { text: "Call a friend", correct: false },
      { text: "Give them water", correct: false }
    ]
  },
  {
    question: "What number do you call for emergency help in the U.S.?",
    answers: [
      { text: "911", correct: true },
      { text: "811", correct: false },
      { text: "411", correct: false },
      { text: "311", correct: false }
    ]
  },
  {
    question: "How deep should adult chest compressions be?",
    answers: [
      { text: "At least 2 inches (5 cm)", correct: true },
      { text: "Half an inch", correct: false },
      { text: "3 inches", correct: false },
      { text: "1 inch", correct: false }
    ]
  },
  {
    question: "How fast should you give chest compressions?",
    answers: [
      { text: "100–120 per minute", correct: true },
      { text: "60 per minute", correct: false },
      { text: "150 per minute", correct: false },
      { text: "30 per minute", correct: false }
    ]
  },
  {
    question: "What song is often used to match CPR compression rhythm?",
    answers: [
      { text: "Stayin' Alive – Bee Gees", correct: true },
      { text: "Let It Be – Beatles", correct: false },
      { text: "Happy – Pharrell Williams", correct: false },
      { text: "Shape of You – Ed Sheeran", correct: false }
    ]
  },
  {
    question: "Where should you place your hands for compressions?",
    answers: [
      { text: "Center of the chest", correct: true },
      { text: "Over the stomach", correct: false },
      { text: "On the neck", correct: false },
      { text: "Left shoulder", correct: false }
    ]
  },
  {
    question: "What does AED stand for?",
    answers: [
      { text: "Automated External Defibrillator", correct: true },
      { text: "Automatic Energy Device", correct: false },
      { text: "Advanced Electric Detector", correct: false },
      { text: "Auto Emergency Dialer", correct: false }
    ]
  },
  {
    question: "What is the purpose of an AED?",
    answers: [
      { text: "To deliver a shock to restart the heart", correct: true },
      { text: "To measure heart rate", correct: false },
      { text: "To give oxygen", correct: false },
      { text: "To call 911 automatically", correct: false }
    ]
  },
  {
    question: "Before using an AED, what should you do?",
    answers: [
      { text: "Turn it on and follow its voice prompts", correct: true },
      { text: "Start chest compressions again", correct: false },
      { text: "Shake the person", correct: false },
      { text: "Remove all clothing", correct: false }
    ]
  },
  {
    question: "When the AED says 'Analyzing', what should you do?",
    answers: [
      { text: "Don’t touch the person", correct: true },
      { text: "Keep doing CPR", correct: false },
      { text: "Call for help", correct: false },
      { text: "Apply pads again", correct: false }
    ]
  },
  {
    question: "If someone starts breathing normally after CPR, what do you do?",
    answers: [
      { text: "Put them in the recovery position", correct: true },
      { text: "Leave immediately", correct: false },
      { text: "Continue compressions", correct: false },
      { text: "Give water", correct: false }
    ]
  },
  {
    question: "How many rescue breaths after 30 compressions for one rescuer?",
    answers: [
      { text: "2", correct: true },
      { text: "5", correct: false },
      { text: "10", correct: false },
      { text: "1", correct: false }
    ]
  },
  {
    question: "Can you use an AED on a child?",
    answers: [
      { text: "Yes, use pediatric pads if available", correct: true },
      { text: "No, AEDs are for adults only", correct: false },
      { text: "Only if over 10 years old", correct: false },
      { text: "Only in hospitals", correct: false }
    ]
  },
  {
    question: "Should you remove metal jewelry before using an AED?",
    answers: [
      { text: "Only if it’s near the pad area", correct: true },
      { text: "Always remove all jewelry", correct: false },
      { text: "Never remove it", correct: false },
      { text: "Only rings", correct: false }
    ]
  },
  {
    question: "What is the correct compression-to-breath ratio in adult CPR?",
    answers: [
      { text: "30 compressions to 2 breaths", correct: true },
      { text: "15 to 2", correct: false },
      { text: "10 to 1", correct: false },
      { text: "20 to 4", correct: false }
    ]
  }
];

// --- GAME FLOW ---
function startGame() {
  currentQuestionIndex = 0;
  score = 0;
  gameOver = false;
  nextButton.innerHTML = "Next";
  showQuestion();
  updateProgressBar();
}

function showQuestion() {
  resetState();
  startTimer();

  let currentQuestion = questions[currentQuestionIndex];
  questionElement.innerHTML = currentQuestion.question;

  // Shuffle answers
  const shuffledAnswers = [...currentQuestion.answers].sort(() => Math.random() - 0.5);

  shuffledAnswers.forEach(answer => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    answerButtons.appendChild(button);
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
  });
}

function resetState() {
  clearInterval(timer);
  timeLeft = 15;
  timerElement.textContent = timeLeft;
  nextButton.classList.add("hide");
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  clearInterval(timer);
  const selectedBtn = e.target;
  const correct = selectedBtn.dataset.correct === "true";
  if (correct) score++;
  setStatusClass(selectedBtn, correct);
  Array.from(answerButtons.children).forEach(button => {
    setStatusClass(button, button.dataset.correct === "true");
    button.disabled = true;
  });
  nextButton.classList.remove("hide");
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}

nextButton.addEventListener("click", () => {
  if (gameOver) {
    startGame();
    return;
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
    updateProgressBar();
  } else {
    showScore();
  }
});

function showScore() {
  resetState();
  questionElement.innerHTML = `✅ You scored ${score} out of ${questions.length}!<br><br>Great job learning CPR & AED basics.`;
  nextButton.innerHTML = "Play Again";
  nextButton.classList.remove("hide");
  gameOver = true;
  progressBar.style.width = "100%";
}

// --- TIMER ---
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      showTimeUpScreen();
    }
  }, 1000);
}

function showTimeUpScreen() {
  resetState();
  questionElement.innerHTML = `
    ⏰ Time's up!<br>
    You ran out of time.<br><br>
    <strong>Would you like to try again?</strong>
  `;
  nextButton.innerHTML = "Restart";
  nextButton.classList.remove("hide");
  nextButton.onclick = startGame;
  gameOver = true;
}

// --- PROGRESS BAR ---
function updateProgressBar() {
  const progress = (currentQuestionIndex / questions.length) * 100;
  progressBar.style.width = progress + "%";
}

startGame();
