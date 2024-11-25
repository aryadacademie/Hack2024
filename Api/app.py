from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
from crud import *
from schemas import *
from database import get_db
import uvicorn
import hashlib
from db_models import *
from crud import *


# Fonction pour hacher le mot de passe
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Initialisation de l'application FastAPI
app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CommandRequest(BaseModel):
    query: str

# Commandes de test
commands = {
    "comment ça va":"ça va bien petit , et les etudes?",
    "bonjour je m'appelle Faria": "Bonjour, merci d’être venu aujourd’hui. Pour commencer, pourquoi avez-vous postulé à ce poste ?",
    "j'ai postuler au poste d'ingénieur": "Très bien ! Pouvez-vous nous parler d'un projet dont vous êtes particulièrement fier ?",
}

# Endpoint pour traiter les commandes
@app.post("/endpoint")
async def process_command(request: CommandRequest):
    query = request.query.lower()
    response = commands.get(query, "Pouvez-vous reformuler ?")
    return {"response": response}


# Candidats
@app.post("/candidats/", response_model=CandidatResponse)
def create_candidat_endpoint(candidat: CandidatCreate, db: Session = Depends(get_db)): # type: ignore
    created_candidat = create_candidat(db, candidat.nom, candidat.email, candidat.competences, candidat.objectif)
    if not created_candidat:
        raise HTTPException(status_code=400, detail="Erreur lors de la création du candidat")
    return created_candidat

@app.get("/candidats/", response_model=List[CandidatResponse])
def get_candidats_endpoint(db: Session = Depends(get_db)): # type: ignore
    return get_candidats(db)

@app.delete("/candidats/{candidat_id}")
def delete_candidat_endpoint(candidat_id: int, db: Session = Depends(get_db)): # type: ignore
    delete_candidat(db, candidat_id)
    return {"message": "Candidat supprimé"}

# Recruteurs IA
@app.post("/recruteurs/", response_model=RecruteurIAResponse)
def create_recruteur_endpoint(recruteur: RecruteurIACreate, db: Session = Depends(get_db)): # type: ignore
    created_recruteur = create_recruteur_ia(db, recruteur.nom)
    if not created_recruteur:
        raise HTTPException(status_code=400, detail="Erreur lors de la création du recruteur")
    return created_recruteur

@app.get("/recruteurs/", response_model=List[RecruteurIAResponse])
def get_recruteurs_endpoint(db: Session = Depends(get_db)): # type: ignore
    return get_recruteurs_ia(db)

# Entretiens
@app.post("/entretiens/", response_model=EntretienResponse)
def create_entretien_endpoint(entretien: EntretienCreate, db: Session = Depends(get_db)): # type: ignore
    created_entretien = create_entretien(db, entretien.candidat_id, entretien.recruteur_ia_id, entretien.score_final, entretien.commentaires_generaux)
    if not created_entretien:
        raise HTTPException(status_code=400, detail="Erreur lors de la création de l'entretien")
    return created_entretien

@app.get("/entretiens/{entretien_id}", response_model=EntretienResponse)
def get_entretien_endpoint(entretien_id: int, db: Session = Depends(get_db)): # type: ignore
    entretien = get_entretien_by_id(db, entretien_id)
    if not entretien:
        raise HTTPException(status_code=404, detail="Entretien non trouvé")
    return entretien

@app.patch("/entretiens/{entretien_id}/score")
def update_entretien_score_endpoint(entretien_id: int, score: float, db: Session = Depends(get_db)): # type: ignore
    updated_entretien = update_entretien_score(db, entretien_id, score)
    if not updated_entretien:
        raise HTTPException(status_code=404, detail="Erreur lors de la mise à jour du score")
    return {"message": "Score mis à jour"}

@app.delete("/entretiens/{entretien_id}")
def delete_entretien_endpoint(entretien_id: int, db: Session = Depends(get_db)): # type: ignore
    delete_entretien(db, entretien_id)
    return {"message": "Entretien supprimé"}

# Questions
@app.post("/questions/", response_model=QuestionResponse)
def create_question_endpoint(question: QuestionCreate, db: Session = Depends(get_db)): # type: ignore
    created_question = create_question(db, question.texte, question.type)
    if not created_question:
        raise HTTPException(status_code=400, detail="Erreur lors de la création de la question")
    return created_question

@app.delete("/questions/{question_id}")
def delete_question_endpoint(question_id: int, db: Session = Depends(get_db)): # type: ignore
    delete_question(db, question_id)
    return {"message": "Question supprimée"}

# Réponses
@app.post("/reponses/", response_model=ReponseResponse)
def create_reponse_endpoint(reponse: ReponseCreate, db: Session = Depends(get_db)): # type: ignore
    created_reponse = create_reponse(db, reponse.entretien_id, reponse.question_id, reponse.texte, reponse.evaluation, reponse.commentaires)
    if not created_reponse:
        raise HTTPException(status_code=400, detail="Erreur lors de la création de la réponse")
    return created_reponse

@app.patch("/reponses/{reponse_id}")
def update_reponse_endpoint(reponse_id: int, update_data: ReponseCreate, db: Session = Depends(get_db)): # type: ignore
    updated_reponse = update_reponse(db, reponse_id, update_data.texte, update_data.evaluation, update_data.commentaires)
    if not updated_reponse:
        raise HTTPException(status_code=404, detail="Réponse non trouvée ou erreur lors de la mise à jour")
    return {"message": "Réponse mise à jour"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
