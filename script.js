// Configure the number of correct answers needed to finish the trail.
const TOTAL_STEPS = 10;

// Cache the page elements used while the game is running.
const intro = document.querySelector("#intro");
const gamePanel = document.querySelector("#game-panel");
const resultPanel = document.querySelector("#result-panel");
const startButton = document.querySelector("#start-button");
const playAgainButton = document.querySelector("#play-again");
const answerForm = document.querySelector("#answer-form");
const answerInput = document.querySelector("#answer");
const questionElement = document.querySelector("#question");
const hint = document.querySelector("#hint");
const stepsElement = document.querySelector("#steps");
const player = document.querySelector("#player");
const stepCount = document.querySelector("#step-count");
const streakElement = document.querySelector("#streak");
const resultCharacter = document.querySelector("#result-character");
const resultEyebrow = document.querySelector("#result-eyebrow");
const resultTitle = document.querySelector("#result-title");
const resultMessage = document.querySelector("#result-message");

// Keep track of progress, the current answer, and the player's streak.
let currentStep = 0;
let currentAnswer = 0;
let streak = 0;

function makeQuestion() {
  // Pick one of the four supported math operations.
  const operation = ["+", "−", "×", "÷"][Math.floor(Math.random() * 4)];
  let first;
  let second;

  // Generate addition questions with numbers up to three digits.
  if (operation === "+") {
    first = Math.floor(Math.random() * 999) + 1;
    second = Math.floor(Math.random() * 999) + 1;
    currentAnswer = first + second;
  // Generate subtraction questions with a non-negative answer.
  } else if (operation === "−") {
    first = Math.floor(Math.random() * 999) + 1;
    second = Math.floor(Math.random() * first) + 1;
    currentAnswer = first - second;
  // Generate multiplication questions with two-digit factors.
  } else if (operation === "×") {
    first = Math.floor(Math.random() * 98) + 2;
    second = Math.floor(Math.random() * 98) + 2;
    currentAnswer = first * second;
  // Generate exact division questions with a three-digit dividend.
  } else {
    second = Math.floor(Math.random() * 14) + 2;
    const minimumQuotient = Math.ceil(100 / second);
    const maximumQuotient = Math.floor(999 / second);
    const quotient = Math.floor(Math.random() * (maximumQuotient - minimumQuotient + 1)) + minimumQuotient;
    first = second * quotient;
    currentAnswer = quotient;
  }

  // Show the generated question to the player.
  questionElement.textContent = `${first} ${operation} ${second} = ?`;
}

function drawSteps() {
  // Rebuild the trail markers so their completed and active states stay current.
  stepsElement.innerHTML = "";
  for (let index = 0; index < TOTAL_STEPS; index += 1) {
    const step = document.createElement("div");
    step.className = `step ${index < currentStep ? "done" : ""} ${index === currentStep ? "active" : ""}`;
    step.textContent = index < currentStep ? "✓" : index + 1;
    stepsElement.append(step);
  }
  // Update the progress label and move the bunny along the trail.
  stepCount.textContent = currentStep;
  const progress = 74 / (TOTAL_STEPS - 1);
  player.style.left = `${8 + (currentStep * progress)}%`;
}

function startGame() {
  // Reset the run and show the question screen.
  currentStep = 0;
  streak = 0;
  streakElement.textContent = streak;
  intro.classList.add("hidden");
  resultPanel.classList.add("hidden");
  gamePanel.classList.remove("hidden");
  drawSteps();
  makeQuestion();
  answerInput.value = "";
  answerInput.focus();
}

function finish(won) {
  // Replace the game screen with the appropriate result message.
  gamePanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");
  // Celebrate a completed trail.
  if (won) {
    resultCharacter.textContent = "🐰";
    resultEyebrow.textContent = "trail complete!";
    resultTitle.textContent = "You made it!";
    resultMessage.textContent = `Ten clever steps and a ${streak}-answer streak.`;
  } else {
    // Let the player know that a wrong answer ended the run.
    resultCharacter.textContent = "💫";
    resultEyebrow.textContent = "a little wobble...";
    resultTitle.textContent = "Whoopsie!";
    resultMessage.textContent = "One wrong step is all it takes. Your next adventure is waiting!";
  }
}

function submitAnswer(event) {
  // Validate the answer and either advance or end the current run.
  event.preventDefault();
  const answer = Number(answerInput.value);
  // Keep the player on the same question when the input is empty.
  if (!Number.isFinite(answerInput.valueAsNumber)) {
    hint.textContent = "Pop an answer in first!";
    answerInput.focus();
    return;
  }
  // A single incorrect answer makes the character fall.
  if (answer !== currentAnswer) {
    streak = 0;
    streakElement.textContent = streak;
    finish(false);
    return;
  }
  // A correct answer advances the character and increases the streak.
  currentStep += 1;
  streak += 1;
  streakElement.textContent = streak;
  if (currentStep === TOTAL_STEPS) {
    finish(true);
    return;
  }
  // Prepare the next question after a successful step.
  hint.textContent = "Nice step! Keep going ✦";
  drawSteps();
  makeQuestion();
  answerInput.value = "";
  answerInput.focus();
}

// Connect the buttons and answer form to the game actions.
startButton.addEventListener("click", startGame);
playAgainButton.addEventListener("click", startGame);
answerForm.addEventListener("submit", submitAnswer);
