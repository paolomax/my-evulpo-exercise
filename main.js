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

let states = [false, false, false];
let correct_answer_index = 0;

// document.addEventListener("DOMContentLoaded", init);

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
      range: "!A1:F10",
    });
    init(response.result.values);
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
  }
};

const init = (data) => {
  setExcerciseData(data);
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

// function init() {
//   let optionsContainer = document.querySelector("#options-wrapper");
//   for (let i = 0; i < options.length; i++) {
//     optionsContainer.innerHTML +=
//       "<div class='unchosen option'><p class='text'>" +
//       options[i] +
//       "</p></div>";
//   }
//   // ...
// }

// function toggleChoice(i) {
//   states[i] = true;
//   // ...
// }

// function myEvaluation() {
//   let evMessage = document.querySelector("#evaluation-message");
//   for (let i = 0; i < options.length; i++) {
//     if (states[i] && i == correct_answer_index) {
//       evMessage.innerHTML = "<p>Awesome!</p>";
//       // console.log('awesome')
//       break;
//     } else {
//       evMessage.innerHTML = "<p>Keep trying!</p>";
//       // console.log('tryAgain')
//       break;
//     }
//   }
// }
