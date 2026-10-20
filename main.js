// Select Elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpan = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".submit-button");
let theResultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;


function getQuestions(){
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200){
            let questionsObject = JSON.parse(this.responseText);
            let qCount = questionsObject.length;
            
            // Create Bullets + Set Questions Count
            createBullets(qCount);

            // Add Question Data
            addQuestionData(questionsObject[currentIndex],qCount);

            countdown(90, qCount);

            // submitBtn.onclick = () => {
            //     let theRightAnswer = questionsObject[currentIndex].right_answer;
            //     currentIndex++;
                
            //     checkedAnswer(theRightAnswer , qCount);
            //     quizArea.innerHTML = '';
            //     answersArea.innerHTML = '';

            //     // Add Question Data
            //     addQuestionData(questionsObject[currentIndex],qCount);

            //     handleBullets();

            //     clearInterval(countdownInterval);
            //     countdown(90,qCount);

            //     showResults(qCount);
            // }

        submitBtn.onclick = () => {
            let theRightAnswer = questionsObject[currentIndex].right_answer;

            // Check Answer
            let answerStatus = checkedAnswer(theRightAnswer);

            // Update Current Bullet
            let allBullets = document.querySelectorAll(".bullets .spans span");

            allBullets[currentIndex].className = answerStatus ? "correct" : "wrong";

            currentIndex++;

            quizArea.innerHTML = "";
            answersArea.innerHTML = "";

            // Add Next Question
            addQuestionData(questionsObject[currentIndex], qCount);

            handleBullets();

            clearInterval(countdownInterval);
            countdown(90, qCount);

            showResults(qCount);
        };

        }
    }

    myRequest.open("GET","questions.json",true);
    myRequest.send();
}

getQuestions();

function createBullets(num){
    countSpan.innerHTML = num;

    // Create Bullets
    for(let i = 0; i<num; i++){
        let theBullet = document.createElement('span');
        if(i === 0){
            theBullet.className = 'on';
        }
        bulletsSpan.appendChild(theBullet);
    }

}

function addQuestionData(obj , count){

    if(currentIndex < count){
        let questionTitle = document.createElement("h2");
        let questionText = document.createTextNode(obj.title);

        questionTitle.appendChild(questionText);
        quizArea.appendChild(questionTitle);

        for(let i = 1; i < 5; i++){
            let mainDiv = document.createElement("div");
            mainDiv.className = 'answer';
            let radioButton = document.createElement("input");
            radioButton.name = 'question';
            radioButton.type = 'radio';
            radioButton.id = `answer_${i}`;
            radioButton.dataset.answer = obj[`answer_${i}`];

            // if(i === 1){
            //     radioButton.checked = true;
            // }

            let label = document.createElement('label');
            let labelText = document.createTextNode(obj[`answer_${i}`]);
            label.htmlFor = `answer_${i}`;

            label.appendChild(labelText);

            mainDiv.appendChild(radioButton);
            mainDiv.appendChild(label);

            answersArea.appendChild(mainDiv);
        }
    }
}

// function checkedAnswer(rAnswer,qCount){
//     let answers = document.getElementsByName("question");
//     let chooseAnswer;
//     for(let i = 0; i < answers.length; i++){
//         if(answers[i].checked){
//             chooseAnswer = answers[i].dataset.answer;
//         }
//     }

//     if(rAnswer === chooseAnswer){
//         rightAnswers++;
//     }
// }

function checkedAnswer(rAnswer, qCount){
    let answers = document.getElementsByName("question");
    let chooseAnswer;

    for(let i = 0; i < answers.length; i++){
        if(answers[i].checked){
            chooseAnswer = answers[i].dataset.answer;
            break;
        }
    }

    if(rAnswer === chooseAnswer){
        rightAnswers++;
        return true;
    }

    return false;
}

// function handleBullets(){
//     let bulletsSpan = document.querySelectorAll(".bullets .spans span");
//     let arrayBullets = Array.from(bulletsSpan);
//     arrayBullets.forEach((span,index) => {
//         if(currentIndex === index){
//             span.className = 'on';
//         }
//     })
// }

function handleBullets() {
    let allBullets = document.querySelectorAll(".bullets .spans span");

    allBullets.forEach((span) => {
        span.classList.remove("on");
    });

    if (currentIndex < allBullets.length) {
        allBullets[currentIndex].classList.add("on");
    }
}

function showResults(count){
    let theResults;
    if(currentIndex === count){
        quizArea.remove();
        answersArea.remove();
        bullets.remove();
        submitBtn.remove();
        if(rightAnswers === count){
            theResults = `<span class="perfect">Perfect</span>, All Answers Is Good.`;
        }else if (rightAnswers > count / 2){
                theResults = `<span class="good">Good</span>, You Answered ${rightAnswers} From ${count}.`;
        }else{
            theResults = `<span class="bad">Bad</span>, You Answered ${rightAnswers} From ${count}.`;
        }
        theResultsContainer.innerHTML = theResults;
    }
}

function countdown(duration, count){
    if(currentIndex < count){
        let minutes, seconds;
        countdownInterval = setInterval(function(){

            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` :  minutes;
            seconds = seconds < 10 ? `0${seconds}` :  seconds;

            countdownElement.innerHTML = `${minutes}:${seconds}`;

            if(--duration < 0){
                clearInterval(countdownInterval);
                submitBtn.click();
            }
        }, 1000);
    }
}