import random
import json
import os

# Définir le chemin du fichier JSON
JSON_FILE_PATH = "temp.json"

# Fonction pour générer des questions et réponses
def generate_questions(title, description, company_name):
    questions = []
    
    # Identifier les compétences basées sur le titre et la description
    if "développeur" in title.lower():
        skills = ['logique', 'résolution de problèmes', 'compétences en programmation']
    elif "commercial" in title.lower():
        skills = ['communication', 'négociation', 'résolution de conflits']
    elif "manager" in title.lower():
        skills = ['gestion d’équipe', 'leadership', 'prise de décision sous pression']
    else:
        skills = ['compétences diverses']
    
    # Catégoriser les types de questions
    logic_questions = [
        {
            'question': "Quel est le prochain nombre dans cette séquence: 1, 3, 5, 7, ?",
            'options': ["9", "10", "11", "12"],
            'correct_answer': "9"
        },
        {
            'question': "Si vous avez 3 pommes et que vous en donnez 2, combien de pommes vous reste-t-il ?",
            'options': ["0", "1", "2", "3"],
            'correct_answer': "1"
        }
    ]
    
    programming_questions = [
        {
            'question': "Que fait la fonction `len()` en Python ?",
            'options': ["Elle retourne la longueur d'une chaîne de caractères.", 
                        "Elle convertit un objet en chaîne de caractères.",
                        "Elle ajoute deux listes.",
                        "Elle trie une liste."],
            'correct_answer': "Elle retourne la longueur d'une chaîne de caractères."
        },
        {
            'question': "Quelle est la sortie du code suivant : `print('Hello' + ' ' + 'World')` ?",
            'options': ["Hello World", "HelloWorld", "Helloworld", "Hellow World"],
            'correct_answer': "Hello World"
        }
    ]
    
    communication_questions = [
        {
            'question': "Si vous êtes dans une équipe et que vous avez un conflit avec un collègue, comment réagiriez-vous ?",
            'options': [
                "Éviter toute confrontation.",
                "Discuter ouvertement et calmement pour trouver un compromis.",
                "Informer le manager sans discuter.",
                "Ignorer la situation et continuer de travailler."
            ],
            'correct_answer': "Discuter ouvertement et calmement pour trouver un compromis."
        },
        {
            'question': "Comment expliqueriez-vous un concept technique à une personne non technique ?",
            'options': [
                "Utiliser des métaphores simples et des analogies.",
                "Détailler chaque aspect technique en profondeur.",
                "Utiliser des termes techniques sans simplification.",
                "Demander à la personne de lire la documentation elle-même."
            ],
            'correct_answer': "Utiliser des métaphores simples et des analogies."
        }
    ]
    
    behavioral_questions = [
        {
            'question': "Un client est mécontent de votre travail. Comment réagissez-vous ?",
            'options': [
                "Je me défends et explique pourquoi il a tort.",
                "Je cherche à comprendre le problème et propose une solution.",
                "Je l'ignore et continue mon travail.",
                "Je reporte le problème à un supérieur."
            ],
            'correct_answer': "Je cherche à comprendre le problème et propose une solution."
        },
        {
            'question': "Vous avez une échéance serrée et beaucoup de travail. Que faites-vous ?",
            'options': [
                "Je travaille seul sans interruption.",
                "Je demande de l'aide pour gérer la charge de travail.",
                "Je reporte tout à plus tard.",
                "Je commence à procrastiner."
            ],
            'correct_answer': "Je demande de l'aide pour gérer la charge de travail."
        }
    ]
    
    # Ajout de questions en fonction du titre et des compétences
    if "développeur" in title.lower():
        questions.extend(programming_questions)
    if "commercial" in title.lower():
        questions.extend(communication_questions)
    if "manager" in title.lower():
        questions.extend(behavioral_questions)
    questions.extend(logic_questions)

    # Mélanger les questions pour les rendre aléatoires
    random.shuffle(questions)
    
    # Limiter à 10 questions
    questions = questions[:10]
    
    return questions

