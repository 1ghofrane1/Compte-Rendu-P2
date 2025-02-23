import React from 'react';
import Header from '@/components/Header';

function TutorielPage({ tutoriel }) {
    // Vérification si le tutoriel existe, sinon affichage d'un message d'erreur.
    if (!tutoriel) {
        return <p>Tutoriel non trouvé</p>;
    }
    return (
        <div>
            <Header />
            <h1>{tutoriel.title}</h1>
            <p>Auteur: {tutoriel.author}</p>
            <p>{tutoriel.description}</p>

            {/* Affichage des sections uniquement si le type est "tutoriel" */}
            {tutoriel.type === "tutoriel" && (
                <>
                    <h2>Sections :</h2>
                    <ul>
                        {tutoriel.sections.map(section => (
                            <li key={section.id}>
                                {/* Lien vers la page de la section du tutoriel */}
                                <a href={`/tutoriels/${tutoriel.id}/${section.id}`}>
                                    {section.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
/*
Fonction getStaticPaths :
- Utilisée pour définir les chemins dynamiques à pré-générer lors du build (SSG).
- Elle récupère la liste des tutoriels et génère les routes correspondantes.
*/
export async function getStaticPaths() {
    // Récupération des données statiques des tutoriels (JSON simulant une API)
    const response = await fetch('http://localhost:3000/tutoriels.json');
    const data = await response.json();
    // Filtrage des tutoriels de type "tutoriel"
    const tutoriels = data.filter(tutoriel => tutoriel.type === "tutoriel");
    // Génération des chemins dynamiques pour Next.js
    const paths = tutoriels.map(tutoriel => ({
        params: { tutorielId: tutoriel.id.toString() },
    }));
    return {
        paths,
        fallback: false, // Si une page demandée n'est pas pré-générée, retourne une erreur 404
    };
}
/*
Fonction getStaticProps :
- Récupère les données du tutoriel à afficher en fonction de l'ID.
- Cette méthode est utilisée pour la génération statique (SSG).
*/
export async function getStaticProps({ params }) {
    // Récupération des tutoriels
    const response = await fetch('http://localhost:3000/tutoriels.json');
    const data = await response.json();
    // Recherche du tutoriel correspondant à l'ID passé en paramètre d'URL
    const tutoriel = data.find(tutoriel => tutoriel.id.toString() === params.tutorielId);
    return {
        props: {
            tutoriel, // Passage des données du tutoriel au composant
        },
    };
}
export default TutorielPage;