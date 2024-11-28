function sendDataToAPI() {
    // Récupérer les valeurs des champs input
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const name_company = document.getElementById('name_company').value;

    // Vérifier si tous les champs sont remplis
    if (title.trim() === "" || description.trim() === "" || name_company.trim() === "") {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    // URL de l'API
    const apiUrl = 'http://127.0.0.1:8000/api/endpoint';

    // Créer l'objet de données à envoyer
    const data = {
        title: title,
        description: description,
        name_company: name_company
    };

    // Utilisation de la méthode fetch pour envoyer une requête POST
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Convertir l'objet en JSON
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur lors de l'envoi des données: ${response.status}`);
            }
            return response.json(); // Convertir la réponse en JSON
        })
        .then(data => {
            console.log('Réponse de l\'API:', data);
            alert("Données envoyées avec succès!");

            // Redirection après succès
            window.location.href = "http://127.0.0.1:8000/next";
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert("Une erreur est survenue lors de l'envoi.");
        });
}
