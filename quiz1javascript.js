
document.getElementById('registration-form')?.addEventListener('submit', function(event) {

    event.preventDefault();
    console.log(document.getElementById('number-question'));

    var numberOfQuestions = document.getElementById('number-question').value;

    var level = document.querySelector('input[name="level"]:checked').value;
    var questionCategory = document.querySelector('input[name="category"]:checked').value;

    if (numberOfQuestions < 5) {
        alert('Please select at least 5 questions.');
        return; // Stop form submission
    }
    fetch('https://opentdb.com/api.php?amount='+ numberOfQuestions + ' &category= ' + questionCategory + '&difficulty=' + level +'&type=' + 'multiple')
    .then(function(response) {
        console.log(response);
        if (!response.ok) {
            throw new Error(response.status);
        }
        return response.json();

    })
    // .then(function(data) {
    //     console.log(data);
    //     showQuestions(data);
    // })
    // Inside your fetch success callback
    .then(function(data) {
        // Redirect to the new page
        window.location.href = 'quiz.html?questions=' + encodeURIComponent(JSON.stringify(data.results));
    })


    .catch(function(error) {
        displayError(error);
    });

});


function showQuestions(questions) {
    console.log(questions); // Log the entire questions object
    const questionElement = document.getElementById('quiz-questions');
    questionElement.innerHTML = '';

    questions.results.forEach(function (question, index) {
        const questionText = question.question;
        const answerChoices = [question.correct_answer, ...question.incorrect_answers];
        
        // Shuffle the answer choices to randomize their order
        shuffleArray(answerChoices);

        // Create a new element for each question and append it to the container
        const questionDiv = document.createElement('div');
        questionDiv.innerHTML = '<p>Question ' + (index + 1) + ': ' + questionText + '</p>';
        
        // Create a list of radio buttons for answer choices
        const choicesList = document.createElement('ul');
        answerChoices.forEach(function (choice, choiceIndex) {
            const choiceItem = document.createElement('li');
            const choiceInput = document.createElement('input');
            choiceInput.type = 'radio';
            choiceInput.name = 'question' + index; // Use a unique name for each question
            choiceInput.value = choice;
            choiceItem.appendChild(choiceInput);
            choiceItem.appendChild(document.createTextNode(choice));
            choicesList.appendChild(choiceItem);
        });

        questionDiv.appendChild(choicesList);
        questionElement.appendChild(questionDiv);
    });
}

// Function to shuffle an array (used to randomize answer choices)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}



function displayError(error) {
    var questionElement = document.getElementById('error-block');
    console.log(questionElement)
    questionElement.innerHTML = '<p>Error: ' + error.message + '</p>';
}