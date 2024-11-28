
let questions = [];
let currentIndex = 0;

async function loadQuestions() {
    const title = "Développeur Python";
    const description = "Responsable de la création et maintenance des applications Python.";
    const name_company = "TechCorp";

    try {
        const response = await fetch('http://127.0.0.1:8000/api/endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description, name_company })
        });

        if (!response.ok) throw new Error('Erreur lors de la récupération des questions');

        const data = await response.json();
        questions = data.data; // Assurez-vous que votre API renvoie les données dans ce format

        if (questions && questions.length > 0) {
            loadQuestion(currentIndex); // Charge la première question
        } else {
            console.error('Aucune question reçue de l’API.');
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function loadQuestion(index) {
    const questionBox = document.getElementById("questionBox");
    questionBox.innerHTML = ""; // Efface les précédentes questions

    const currentQuestion = questions[index];

    const questionText = document.createElement("h3");
    questionText.textContent = currentQuestion.question;
    questionBox.appendChild(questionText);

    currentQuestion.options.forEach(option => {
        const optionContainer = document.createElement("div");
        optionContainer.className = "in_put";
        optionContainer.innerHTML = `
            <div>${option}</div>
            <div class="circle-in">
                <img src="static/icons/check.png" alt="Check" height="70%" width="70%">
            </div>
        `;
        optionContainer.addEventListener("click", () => selectOption(optionContainer));
        questionBox.appendChild(optionContainer);
    });
}

function selectOption(optionElement) {
    const allOptions = document.querySelectorAll(".in_put");
    allOptions.forEach(opt => opt.classList.remove("selected"));
    optionElement.classList.add("selected");
}

document.getElementById("nextQuestionBtn").addEventListener("click", () => {
    const selectedOption = document.querySelector(".in_put.selected");
    if (!selectedOption) {
        alert("Please select an answer before proceeding.");
        return;
    }

    if (currentIndex < questions.length - 1) {
        currentIndex++;
        loadQuestion(currentIndex);
    } else {
        alert("You have completed the quiz. Thank you!");
    }
});

// Charger les questions au démarrage
loadQuestions();



    const timerElement = document.getElementById('timer');
const progressCircle = document.getElementById('progress');

// Temps total en secondes
let totalTime = 45;

// Calcul de la circonférence
const radius = 45;
const circumference = 2 * Math.PI * radius;

// Initialisation de la progression
progressCircle.style.strokeDasharray = `${circumference}`;
progressCircle.style.strokeDashoffset = `${circumference}`;

let remainingTime = totalTime;

function updateTimer() {
  const offset = (remainingTime / totalTime) * circumference;
  progressCircle.style.strokeDashoffset = `${offset}`;
  timerElement.textContent = remainingTime;
  remainingTime--;

  if (remainingTime < 0) {
    clearInterval(timerInterval);
    timerElement.textContent = "Fini!";
  }
}

// Mise à jour toutes les secondes
const timerInterval = setInterval(updateTimer, 1000);
