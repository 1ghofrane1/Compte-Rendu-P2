import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';

function TutorielPage() {
  const router = useRouter();
  const { tutorielId } = router.query; // Récupération de l'ID du tutoriel depuis l'URL
  // États pour stocker les données, gérer le chargement et les erreurs
  const [tutoriel, setTutoriel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  /*useEffect :
    - Se déclenche lorsque `tutorielId` change.
    - Effectue une requête pour récupérer les données du tutoriel.
    - Gère les erreurs et met à jour l'état en conséquence.*/
  useEffect(() => {
    if (!tutorielId) return; // Empêche l'exécution si l'ID n'est pas encore disponible
    async function fetchTutoriel() {
      try {
        setLoading(true);
        const response = await fetch('/tutoriels.json'); // Récupération du fichier JSON
        if (!response.ok) {
          throw new Error('Erreur de récupération des tutoriels');
        }
        const data = await response.json();
        const foundTutoriel = data.find(t => t.id === tutorielId);
        if (!foundTutoriel) {
          throw new Error('Tutoriel introuvable');
        }
        setTutoriel(foundTutoriel); // Mise à jour de l'état avec les données récupérées
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTutoriel();
  }, [tutorielId]); // Déclenché à chaque changement de l'ID du tutoriel
  // Gestion des affichages en fonction de l'état de chargement et des erreurs
  if (loading) return <p>Chargement du tutoriel...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!tutoriel) return <p>Aucun tutoriel trouvé.</p>;
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
export default TutorielPage;