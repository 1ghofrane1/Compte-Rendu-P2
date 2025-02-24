import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

function ProfilePage() {
  // Déclaration de l'état pour stocker les tutoriels favoris et la liste complète des tutoriels
  const [favoris, setFavoris] = useState([]);
  const [tutoriels, setTutoriels] = useState([]);

  // Chargement des favoris depuis le localStorage au premier rendu du composant
  useEffect(() => {
    const savedFavoris = JSON.parse(localStorage.getItem('favoris')) || [];
    setFavoris(savedFavoris);
  }, []);

  // Récupération de la liste des tutoriels depuis un fichier JSON
  useEffect(() => {
    async function fetchTutoriels() {
      try {
        const response = await fetch('/tutoriels.json');
        if (!response.ok) throw new Error('Erreur de récupération des tutoriels');
        const data = await response.json();
        setTutoriels(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTutoriels();
  }, []);

  // Fonction pour retirer un tutoriel des favoris
  const retirerDesFavoris = (id) => {
    const newFavoris = favoris.filter(fav => fav !== id);
    setFavoris(newFavoris);
    localStorage.setItem('favoris', JSON.stringify(newFavoris));
  };

  // Filtrage des tutoriels pour ne garder que ceux qui sont dans les favoris
  const favorisTutoriels = tutoriels.filter(tuto => favoris.includes(tuto.id));

  return (
    <div>
      <Header />
      <h1>Mes Favoris</h1>
      {/* Affichage d'un message si aucun favori n'est enregistré */}
      {favorisTutoriels.length === 0 ? (
        <p>Aucun favori enregistré.</p>
      ) : (
        <ul>
          {/* Affichage de la liste des tutoriels favoris */}
          {favorisTutoriels.map(tutoriel => (
            <li key={tutoriel.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link href={`/tutoriels/${tutoriel.id}`}>
                {tutoriel.title}
              </Link>
              {/* Bouton permettant de retirer un tutoriel des favoris */}
              <button onClick={() => retirerDesFavoris(tutoriel.id)} style={{
                  background: favoris.includes(tutoriel.id) ? "#dc3545" : "#28a745",
                  color: "white",
                }}>
              Retirer des favoris 
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProfilePage;