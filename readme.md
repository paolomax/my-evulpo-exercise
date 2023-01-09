# Evulpo Tech Interview Task

## What this webpage does.
- Loads the Google Sheets API client
- Retrieves data from the provided Google Sheet
- Stores the retrieved data
- Randomizes the order of the questions
- Sets up the progress bar
- For each question, the user receives an evaluation and the next question is loaded and displayed.
- Provides feedback to the user after the exercise has been completed.

## Development process
In the development process, I started by connecting to the Google Sheets API. I used the provided boilerplate to retrieve the data.

Once the data was retrieved, I randomized the questions and saved the relevant data for the exercise in corresponding arrays.

I then worked on the progress bar's advancement and the logic for advancing through the containers.

To do this, I imagined that each question corresponds to a container, and that this container is brought, through the transform property: translate(X), to position 0vw if the question should be displayed or to position 100vw if the question should be hidden.

This method is more efficient than animations made with the left property because animations made with the left property are performed by the CPU, which can lead to slower and less smooth animations, especially on devices with weaker CPUs.

In contrast, animations made with the transform property are performed by the GPU, which is specifically designed to handle graphical tasks. As a result, animations made with the transform property are typically smoother and more efficient.

I have then implemented a logic to track the selected answer by the user. The answer is only selected if a previous evaluation has not been made, and if a previous answer was already selected, it is deselected before selecting the new one. To track the selected answer, I have used the array "states", which is filled with the corresponding number of boolean values 'false' every time the user clicks on "Next". The selected element will have its corresponding boolean value set to 'true'. 

In the next phase of development, I focused on the logic of evaluating and creating a container for the next question. I chose this moment to create the new container because it is a phase in which the user receives their evaluation and the page is not currently performing heavy work. The containers could have been created in the initial phase, but the number of these DOM operations would have excessively overloaded the page, making it jerky in animations on less powerful devices.

At this point, I have dedicated myself to calculating the score and restyling to make the page visually more satisfying.

## Technical description

The arrays "questions", "options", "correctIndexes", and "scores" were used to store the data retrieved from the spreadsheet.

The array "states" was used to track, for each question, the choice made by the user. The array "userScores" was used to track the score obtained by the user in each answer. 

I chose, to make the experience more engaging, various messages for correct and wrong answers, stored in the arrays "successMessages()" and "failureMessages()". After the Google API call made after the client initialization, the data is stored in the appropriate arrays and the progress bar is created. 

Then the exercise (function "startExercise()") is started. The buttons are added to the progress bar, and the first execution of the function "goOn()" is made, which is responsible for showing the new question, the new options, advancing the progress bar, and showing the next question (scrolling the containers). 

For each question, the function "toggleChoice()" will allow the user to choose or change the answer. Once the answer is given, the boolean variable "evaluated" will be set to true, so it will no longer be possible to change the answer. For each evaluation (function "myEvaluation()"), the function "toggleShowButton()" will be executed, which hides the evaluation button and shows the one to move on. 
When the evaluation button is clicked, in addition to the evaluation being carried out, the next container is also prepared (unless it is the last question). The reasons for this choice were explained in the development process.

The progress bar was built with as many buttons as there are question numbers, and with as many "blocks that advance" as there are questions - 1.

The progress bar was built with as many buttons as there are questions, and with as many "advancing blocks" as there are questions - 1. The addStepDots(), showDots() and setProgressBar() functions were used. The buttons are then colored according to the correctness of the answer. The total score is then calculated by summing up, through the reduce method, the elements of the arrays scores and userScores. Depending on the score achieved, the user will receive different feedback.
