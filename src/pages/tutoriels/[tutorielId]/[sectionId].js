import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/Header';

/* Composant SectionPage;:
 - Affiche le contenu d'une section spécifique d'un tutoriel.
 - Récupère dynamiquement les données d'un fichier JSON.
 - Utilise useRouter pour obtenir les paramètres d'URL (`tutorielId` et `sectionId`).*/
function SectionPage() {
  const router = useRouter();
  const { tutorielId, sectionId } = router.query; // Extraction des paramètres dynamiques de l'URL.

  // États pour stocker les données de la section et gérer le chargement et les erreurs.
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* useEffect :
   - Se déclenche lorsque sectionId ou tutorielId change.
   - Récupère les données depuis tutoriels.json simulant une API.
   - Vérifie l'existence du tutoriel et de la section demandée.*/
  useEffect(() => {
    async function fetchSectionData() {
      try {
        setLoading(true); // Active le mode loading.
        const response = await fetch("/tutoriels.json"); // Récupération des données JSON.
        // Vérifie si la réponse est valide (statut HTTP 200-299).
        if (!response.ok) {
          throw new Error('Erreur de récupération des tutoriels');
        }

        const data = await response.json();
        const tutoriel = data.find(tutoriel => tutoriel.id === tutorielId); // Recherche du tutoriel correspondant.
        // Vérifie si le tutoriel existe.
        if (!tutoriel) {
          throw new Error('Tutoriel introuvable');
        }
        const foundSection = tutoriel.sections.find(section => section.id === sectionId); // Recherche de la section.
        // Vérifie si la section existe.
        if (!foundSection) {
          throw new Error('Section introuvable');
        }
        setSection(foundSection); // Mise à jour de l'état avec la section trouvée.
        setError(null); // Réinitialisation des erreurs (null).
      } catch (err) {
        setError(err.message); // Stocke l'erreur en cas de problème.
      } finally {
        setLoading(false); // Désactive le mode chargement.
      }
    }

    // Exécute la récupération uniquement si les paramètres d'URL sont définis.
    if (sectionId && tutorielId) {
      fetchSectionData();
    }
  }, [sectionId, tutorielId]); // exécute l'effet lorsque sectionId ou tutorielId change.

  /* Gestion des affichages conditionnels :
   - Affichage d'un message de chargement.
   - Affichage des erreurs éventuelles.
   - Affichage du contenu de la section si elle est trouvée. */
  if (loading) {
    return <p>Chargement de la section...</p>; // Message de chargement.
  }
  if (error) {
    return <p>Erreur: {error}</p>; // Affichage d'une erreur en cas de problème.
  }
  if (!section) {
    return <p>Section introuvable.</p>; // Message si la section n'existe pas.
  }

  return (
    <div>
      <Header />
      <h1>{section.title}</h1>
      <p>{section.content}</p>
    </div>
  );
}
export default SectionPage;