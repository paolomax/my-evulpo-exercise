// alert('js loaded!')
// this is a basic structure for evaluation of a single choice exercise
// INTENTIONALLY parts of the code have been deleted.
//  It should serve as a hint towards finding a suitable solution for single choice exercise
// Written by GSoosalu ndr3svt

const API_KEY = "AIzaSyCfuQLHd0Aha7KuNvHK0p6V6R_0kKmsRX4";
const DISCOVERY_DOCS = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

//arrays for the exercise data
let questions = [];
let options = [];
let correctIndexes = [];
let scores = [];
let userScores = [];

//array for current question
let currentQuestionIndex = -1;
let states = [];

//boolean to check if the exercise has been evaluated
let evaluated = false;

// load the client
function handleClientLoad() {
  gapi.load("client", initClient);
}

// initialize the client
const initClient = async () => {
  try {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: DISCOVERY_DOCS,
    });
    getData();
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
  }
};

const getData = async () => {
  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: "1hzA42BEzt2lPvOAePP6RLLRZKggbg0RWuxSaEwd5xLc",
      range: "!A1:F3",
    });
    init(response.result.values);
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
  }
};

const init = (data) => {
  setExcerciseData(data);
  setProgressBar();
  startExercise();
};

// initialize the exercise data
const setExcerciseData = (rawData) => {
  //randomize the order of the questions
  //the first row is skipped because it contains the column names
  randomizedQuestions = rawData
    .slice(1, rawData.length)
    .sort(() => Math.random() - 0.5);

  //foreach question, push the question, options, correct answer and score into the corresponding arrays
  for (let i = 0; i < rawData.length - 1; i++) {
    let question = randomizedQuestions[i][2];
    let optionGroup = randomizedQuestions[i][3].split(";");
    let correctIndex = Number(randomizedQuestions[i][4]);
    let score = Number(randomizedQuestions[i][5]);

    questions.push(question);
    options.push(optionGroup);
    correctIndexes.push(correctIndex);
    scores.push(score);
  }
};

// initialize the progress bar and add the step dots to it based on the number of questions
const setProgressBar = () => {
  let progressBar = document.querySelector("#progress-bar");
  let blockLengthPercentage = 100 / (questions.length + 1);

  addStepDots(progressBar, blockLengthPercentage);
};

const startExercise = () => {
  setTimeout(() => {
    //initialize the exercise
    showDots();
    goOn();
    hideLoadingContainer();
  }, 1200);
};

const goOn = () => {
  if (currentQuestionIndex < questions.length - 1) {
    {
      setNextQuestion();
      setNextOptions();
      progressBarGoOn();
      showNextQuestion();
    }
  }
};

const setNextQuestion = () => {
  let question = document.querySelector(
    `#question-${currentQuestionIndex + 1}`
  );
  question.innerHTML = questions[currentQuestionIndex + 1];
};

const setNextOptions = () => {
  let optionsWrapper = document.querySelector(
    `#options-wrapper-${currentQuestionIndex + 1}`
  );
  optionsWrapper.innerHTML = "";
  options[currentQuestionIndex + 1].forEach((option, i) => {
    optionsWrapper.innerHTML += `<div class='unchosen option' onclick='toggleChoice(${i})' id='option-${
      currentQuestionIndex + 1
    }-${i}'><p class='text'>${option}</p></div>`;
  });
};

const progressBarGoOn = () => {
  fillNextDot();
  //set the width of the progress bar to the current question
  let stepBlock = document.querySelector("#progress-bar-inner");
  let progressWidth = (100 / questions.length) * (currentQuestionIndex + 2);
  stepBlock.style.width = progressWidth + "%";
};

const showNextQuestion = () => {
  currentQuestionIndex !== -1 && hidePreviousQuestion();
  setNextStates();
  slideContainers();
  evaluated = false;
  currentQuestionIndex++;
};

const hideLoadingContainer = () => {
  let loadingContainer = document.querySelector("#loading-container");
  loadingContainer.style.transform = "translateX(100vw)";

  //after the animation, set the display of the loading container to none
  setTimeout(() => {
    document.querySelector("#loading-container").style.display = "none";
  }, 800);
};

const slideContainers = () => {
  let nextQuestionContainer = document.querySelector(
    `#question-container-${currentQuestionIndex + 1}`
  );
  nextQuestionContainer.style.transform = `translateX(0vw)`;

  //when this function is called for the first time, the current question index is -1
  //and there is no previous question to hide. Otherwise, hide question shown before
  if (currentQuestionIndex !== -1) {
    let currentQuestionContainer = document.querySelector(
      `#question-container-${currentQuestionIndex}`
    );
    currentQuestionContainer.style.transform = `translateX(100vw)`;
  }
};

const setNextStates = () => {
  //set states to an array of false with the
  //same length as the number of options
  states = new Array(options[currentQuestionIndex + 1].length).fill(false);
};

// after the user has chosen an option, set the question to chosen
const toggleChoice = (i) => {
  enableCurrentEvaluationButton();
  //if the question has been evaluated, do nothing
  if (evaluated) return;

  //if there is another option chosen, set it to unchosen
  if (states.includes(true)) {
    let index = states.indexOf(true);
    states[index] = false;
    let optionNode = document.querySelector(
      `#option-${currentQuestionIndex}-${index}`
    );

    optionNode.classList.remove("chosen");
    optionNode.classList.add("unchosen");
  }

  //set correspondent option to chosen
  states[i] = true;

  let optionNode = document.querySelector(
    `#option-${currentQuestionIndex}-${i}`
  );
  optionNode.classList.remove("unchosen");
  optionNode.classList.add("chosen");
};

const enableCurrentEvaluationButton = () => {
  let evButton = document.querySelectorAll(`.evaluation-button`);
  evButton[currentQuestionIndex].disabled = false;
  evButton.disabled = false;
};

const evaluateAndSetNextContainer = () => {
  myEvaluation();

  if (currentQuestionIndex < questions.length - 1) {
    setNextContainer();
  }
};

const myEvaluation = () => {
  toggleShowButton();

  let pickedCorrect = false;
  evaluated = true;

  let evMessage = document.querySelector(
    `#evaluation-message-${currentQuestionIndex}`
  );

  let chosenIndex = states.indexOf(true);
  if (chosenIndex == correctIndexes[currentQuestionIndex]) {
    pickedCorrect = true;
    evMessage.innerHTML = "Awesome!";
    userScores.push(scores[currentQuestionIndex]);
  } else {
    evMessage.innerHTML = "Keep trying!";
  }

  colorButtons(pickedCorrect);
};

const toggleShowButton = () => {
  //select current evaluation button
  let evButtons = document.querySelectorAll(`.evaluation-button`);
  let evButton = evButtons[currentQuestionIndex];

  //hide it and show the next button
  evButton.style.display = "none";
  let nextButton =
    document.querySelectorAll(`.next-button`)[currentQuestionIndex];

  nextButton.style.display = "block";
};

const setNextContainer = () => {
  let questionContainer = document.createElement("div");
  questionContainer.classList.add("question-container");
  questionContainer.id = `question-container-${currentQuestionIndex + 1}`;

  let nextNode = "";
  if (currentQuestionIndex == questions.length - 2) {
    nextNode = `<button class="next-button" onclick="showResults()">Show Results</button>`;
  } else {
    nextNode = `<button class="next-button" onclick="goOn()">Next</button>`;
  }

  questionContainer.innerHTML = questionContainerContent = `
      <div class="question" id="question-${currentQuestionIndex + 1}">
      </div>
      <div class="options-wrapper" id="options-wrapper-${
        currentQuestionIndex + 1
      }"></div>
      <button disabled class="evaluation-button" onclick="evaluateAndSetNextContainer()">Evaluate</button>
      ${nextNode}
      <p class="evaluation-message" id="evaluation-message-${
        currentQuestionIndex + 1
      }"></p>
      `;

  questionContainer.style.transform = `translateX(-100vw)`;

  //append the question container after last question container
  let lastQuestionContainer = document.querySelector(
    `#question-container-${currentQuestionIndex}`
  );

  lastQuestionContainer.parentNode.insertBefore(
    questionContainer,
    lastQuestionContainer.nextSibling
  );
};

// add the step dots to the progress bar and set their position and opacity
const addStepDots = (progressBar, blockLengthPercentage) => {
  //a span element for each question is created and added to the progress bar
  for (let i = 1; i < questions.length + 1; i++) {
    let span = document.createElement("span");
    span.classList.add("step-dot");
    let leftPosition = blockLengthPercentage * i;
    span.style.left = leftPosition + "%";
    span.style.opacity = 0;
    progressBar.appendChild(span);
  }
};

const fillNextDot = () => {
  let stepDots = document.querySelectorAll(".step-dot");
  let currentDot = stepDots[currentQuestionIndex + 1];
  currentDot.classList.add("completed-step-dot");
};

const showDots = () => {
  let stepDots = document.querySelectorAll(".step-dot");
  for (let i = 0; i < stepDots.length; i++) {
    stepDots[i].style.opacity = 1;
  }
};

const hidePreviousQuestion = () => {
  //after the animation, set the display of the current question container to none

  let questionContainer = document.querySelector(
    `#question-container-${currentQuestionIndex}`
  );

  setTimeout(() => {
    questionContainer.style.display = "none";
  }, 800);
};

const colorButtons = (pickedCorrect) => {
  if (pickedCorrect) {
    //if the user picked the correct option just color it
    let chosenIndex = states.indexOf(true);
    let chosenOption = document.querySelector(
      `#option-${currentQuestionIndex}-${chosenIndex}`
    );
    chosenOption.classList.add("correct");
  } else {
    //if the user picked the wrong option, color the correct one and the wrong ones
    let optionsWrapper = document.querySelector(
      `#options-wrapper-${currentQuestionIndex}`
    );

    optionsWrapper.childNodes.forEach((option, i) => {
      i !== correctIndexes[currentQuestionIndex]
        ? option.classList.add("wrong")
        : option.classList.add("correct");
    });
  }
};

const showResults = () => {
  hidePreviousQuestion();
  let resultsContainer = document.querySelector("#results-container");
  resultsContainer.style.transform = "translateX(0)";
};
