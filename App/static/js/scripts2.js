function triggerLink() {
    stopCamera();
    window.location.href = "http://127.0.0.1:8000/congrate";
}


const wave = document.querySelector("#wave-container");
const texts = document.querySelector(".texts");
wave.style.display = "none";

// Vérification de la compatibilité du navigateur
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!window.SpeechRecognition) {
    texts.innerHTML = "<p>Votre navigateur ne supporte pas la reconnaissance vocale.</p>";
} else {
    let recognition;
    let isRecognizing = false;
    let currentQuestion = '';
    let isSpeaking = false;
    let silenceTimer;

    function startRecognition() {
        if (isRecognizing || isSpeaking) return;

        recognition = new SpeechRecognition();
        recognition.interimResults = true;
        recognition.lang = "fr-FR";

        recognition.addEventListener("result", async (e) => {
            if (isSpeaking) return; // Ignorer les résultats pendant la synthèse vocale

            let text = Array.from(e.results)
                .map(result => result[0].transcript)
                .join("");

            currentQuestion = text;

            if (e.results[0].isFinal) {
                const questionElement = document.createElement("p");
                questionElement.className = "question";
                questionElement.innerText = currentQuestion;
                texts.appendChild(questionElement);

                try {
                    const response = await fetch("http://127.0.0.1:8000/endpoint", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ query: currentQuestion }),
                    });

                    if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);

                    const data = await response.json();
                    const reply = data.response || "Aucune réponse disponible.";

                    const replyElement = document.createElement("p");
                    replyElement.classList.add("reply");
                    replyElement.innerText = reply;
                    texts.appendChild(replyElement);

                    recognition.stop();
                    isRecognizing = false;

                    // Synthèse vocale
                    const utterance = new SpeechSynthesisUtterance(reply);
                    utterance.lang = "fr-FR";
                    wave.style.display = "block";

                    utterance.onstart = () => {
                        isSpeaking = true;
                    };

                    utterance.onend = () => {
                        isSpeaking = false;
                        wave.style.display = "none";
                        setTimeout(startRecognition, 2000); // Redémarrer après 2 secondes
                    };

                    speechSynthesis.speak(utterance);
                } catch (error) {
                    console.error("Erreur lors de l'appel à l'API :", error);
                    const errorElement = document.createElement("p");
                    errorElement.classList.add("error");
                    errorElement.innerText = "Une erreur est survenue lors de l'appel à l'API.";
                    texts.appendChild(errorElement);
                }

                currentQuestion = '';
            }

            // Réinitialiser le timer de silence à chaque nouveau résultat
            clearTimeout(silenceTimer);
            silenceTimer = setTimeout(() => {
                if (!isSpeaking) {
                    recognition.stop(); // Arrêter la reconnaissance après 3 secondes de silence
                    isRecognizing = false;
                }
            }, 2000); // 3 secondes de silence
        });

        recognition.addEventListener("end", () => {
            if (!isSpeaking && !isRecognizing) {
                recognition.start(); // Redémarre la reconnaissance si l'utilisateur parle encore
            }
        });

        recognition.addEventListener("error", (e) => {
            console.error("Speech recognition error:", e.error);
            const errorElement = document.createElement("p");
            errorElement.classList.add("error");
            errorElement.innerText = `Une erreur est survenue : ${e.error}`;
            texts.appendChild(errorElement);
        });

        recognition.start();
        isRecognizing = true;
    }

    const startRecognitionBtn = document.getElementById("startRecognitionBtn");
    startRecognitionBtn.addEventListener("click", startRecognition);
}


function alarm() {
    const status = document.querySelector("#pressmidlle");
    const record = document.querySelector("#ondevoice");

    let text = "Recording ...";

    // Supprimer le contenu existant dans 'status'
    status.innerHTML = "";

    // Créer et insérer le nouveau paragraphe
    let message = document.createElement("p");
    message.innerHTML = text;
    status.appendChild(message);  // Remplace le contenu avec le nouveau texte
    // Commence le compteur dès le chargement
    startTimer();
    // Vérifie si la fonction startCamera est définie, sinon crée une fonction vide pour éviter des erreurs
    if (typeof startCamera === "function") {
        startCamera();  // Vérifie si cette fonction existe
    }
    record.style.display = "block";  // Affiche l'élément #ondevoice
}

let cameraStream = null; // Variable pour stocker le flux vidéo
function startCamera() {
    const video = document.getElementById("camera");

    // Vérifie si le navigateur supporte l'API getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }) // Accède à la caméra
            .then(function (stream) {
                cameraStream = stream; // Stocke le flux dans une variable globale
                video.srcObject = stream; // Associe le flux vidéo au <video>
            })
            .catch(function (error) {
                console.error("Erreur lors de l'accès à la caméra :", error);
                alert("Impossible d'accéder à la caméra. Vérifiez vos paramètres de confidentialité.");
            });
    } else {
        alert("Votre navigateur ne supporte pas l'accès à la caméra.");
    }
}

function stopCamera() {
    const video = document.getElementById("camera");

    if (cameraStream) {
        // Arrête toutes les pistes du flux vidéo
        cameraStream.getTracks().forEach((track) => track.stop());
        cameraStream = null; // Réinitialise la variable
    }

    // Retire la source vidéo pour libérer le <video>
    video.srcObject = null;
}



let durationElement = document.getElementById("duration");
let finishButton = document.getElementById("finish");

let seconds = 0;
let timerInterval;

// Fonction pour mettre à jour l'affichage de la durée
function updateDuration() {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    // Formate l'affichage des secondes avec un zéro initial si < 10
    durationElement.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    seconds++;
}

// Démarre le compteur de temps
function startTimer() {
    timerInterval = setInterval(updateDuration, 1000); // Appelle `updateDuration` chaque seconde
}

// Arrête le compteur de temps
function stopTimer() {
    clearInterval(timerInterval);
}


// Arrête le compteur lorsqu'on clique sur le bouton "Finish"
finishButton.addEventListener("click", stopTimer);
