import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

/*  Ce composant HomePage affiche une liste de tutoriels récupérés depuis "tutoriels.json".
  On utilise 'useEffect' pour effectuer un appel à l’API lors du chargement de la page et mettre à jour l'état avec les données récupérées.*/
function HomePage() {
  // Déclaration des états pour stocker les tutoriels, gérer le chargement et détecter les erreurs.  
  const [tutoriels, setTutoriels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*
    useEffect :
    - S'exécute au montage du composant (`[]` comme dépendance).
    - Fait une requête pour récupérer les tutoriels.
    - Gère les erreurs et met à jour l'état en conséquence.
  */
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true); // Active l’état de chargement avant la requête.
        const response = await fetch('/tutoriels.json'); // Récupération des tutoriels depuis "tutoriels.json".
        // Vérification du statut de la réponse.
        if (!response.ok) {
          throw new Error('Erreur de récupération des tutoriels');
        }
        const data = await response.json();
        setTutoriels(data); // Mise à jour des tutoriels avec les tutoriels récupérés.
        setError(null); // Réinitialisation de l’erreur si la récupération réussit.
      } catch (err) {
        setError(err.message); // Stocke le message d’erreur en cas d’échec.
      } finally {
        setLoading(false); // Désactive l’état de chargement, quelle que soit l'issue.
      }
    }
    fetchData(); // On appelle la fonction pour récupérer les données au chargement du composant.
  }, []);

   // Affichage conditionnel selon l’état du chargement et des erreurs.
   if (loading) {
    return <p>Chargement des tutoriels...</p>; // Si les données ne sont pas encore disponibles, on affiche un message de chargement.
  }
  if (error) {
    return <p>Erreur: {error}</p>; // Affiche un message d'erreur en cas de problème/erreur.
  }
  if (!tutoriels || tutoriels.length === 0) {
    return <p>Aucun tutoriel trouvé.</p>; // Affiche un message si la liste est vide.
  }
  return (
    <div>
      <Header />
      <h1>Tutoriels et Ressources</h1>
      <ul>
        {tutoriels.map((tutoriel) => (
          <li key={tutoriel.id}>
            {/* Vérifie si l'élément est un tutoriel ou un autre type de ressource */}
            {tutoriel.type === 'tutoriel' ? (
              /* Si c'est un tutoriel, affiche un lien vers sa page */
              <Link href={`/tutoriels/${tutoriel.id}`}>{tutoriel.title}</Link>
            ) : (
              /* Sinon, affiche simplement son titre et son type */
              <>{tutoriel.title} ({tutoriel.type})</>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default HomePage;
