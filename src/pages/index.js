import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

function HomePage() {
  // États pour gérer les données et l'affichage
  const [tutoriels, setTutoriels] = useState([]); // Liste des tutoriels récupérés
  const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
  const [error, setError] = useState(null); // Stocke le message d'erreur en cas de problème
  const [selectedTag, setSelectedTag] = useState(""); // Stocke le tag sélectionné pour filtrer les tutoriels
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle pour la pagination
  const itemsPerPage = 2; // Nombre d'éléments affichés par page
  const [favoris, setFavoris] = useState([]); // Liste des tutoriels favoris

  // Effet pour récupérer les tutoriels depuis un fichier JSON
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true); // Active l'indicateur de chargement
        const response = await fetch('/tutoriels.json'); // Requête pour récupérer les données
        if (!response.ok) throw new Error('Erreur de récupération des tutoriels');
        const data = await response.json();
        setTutoriels(data); // Mise à jour de l'état avec les données récupérées
        setError(null); // Réinitialise le message d'erreur si tout va bien
      } catch (err) {
        setError(err.message); // Stocke le message d'erreur pour affichage
      } finally {
        setLoading(false); // Désactive l'indicateur de chargement
      }
    }
    fetchData(); // Appel de la fonction pour récupérer les données
  }, []); // S'exécute une seule fois au montage du composant

  // Effet pour récupérer les favoris stockés dans le localStorage
  useEffect(() => {
    const savedFavoris = JSON.parse(localStorage.getItem('favoris')) || [];
    setFavoris(savedFavoris); // Charge les favoris stockés dans le state
  }, []);

  // Fonction pour ajouter ou supprimer un tutoriel des favoris
  const toggleFavori = (id) => {
    let newFavoris = favoris.includes(id)
      ? favoris.filter(fav => fav !== id) // Supprime si déjà favori
      : [...favoris, id]; // Ajoute sinon
    setFavoris(newFavoris); // Met à jour l'état
    localStorage.setItem('favoris', JSON.stringify(newFavoris)); // Stocke dans localStorage
  };

  // Extraction des tags uniques pour filtrer les tutoriels
  const uniqueTags = [...new Set(tutoriels.flatMap(t => t.tags || []))];

  // Filtrage des tutoriels selon le tag sélectionné
  const filteredTutoriels = selectedTag
    ? tutoriels.filter(tutoriel => tutoriel.tags?.includes(selectedTag))
    : tutoriels;

  // Gestion de la pagination
  const indexOfLastItem = currentPage * itemsPerPage; // Dernier élément affiché
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // Premier élément affiché
  const currentItems = filteredTutoriels.slice(indexOfFirstItem, indexOfLastItem); // Découpe la liste
  const totalPages = Math.ceil(filteredTutoriels.length / itemsPerPage); // Nombre total de pages

  // Affichage d'un message si les données sont en cours de chargement ou si une erreur est survenue
  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
    <div>
      <Header />
      <h1>Tutoriels et Ressources</h1>

      {/* Sélecteur pour filtrer les tutoriels par tag */}
      <label>Filtrer par tag :</label>
      <select onChange={(e) => setSelectedTag(e.target.value)}>
        <option value="">Tous</option>
        {uniqueTags.map(tag => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>

      {/* Liste des tutoriels */}
      <ul>
        {currentItems.map(tutoriel => (
          <li key={tutoriel.id}>
            <Link href={`/tutoriels/${tutoriel.id}`}>{tutoriel.title}</Link>
            
            {/* Bouton favoris selon le type du tutoriel */}
            {tutoriel.type === "tutoriel" ? (
              <button 
                onClick={() => toggleFavori(tutoriel.id)}
                style={{
                  background: favoris.includes(tutoriel.id) ? "#dc3545" : "#28a745", // Rouge si favori, vert sinon
                  color: "white",
                }}
              >
                {favoris.includes(tutoriel.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
              </button>
            ) : (
              <button disabled style={{ background: "#6c757d", color: "white", cursor: "not-allowed" }}>
                Ce n'est pas un tutoriel
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Précédent
        </button>
        <span> Page {currentPage} / {totalPages} </span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Suivant
        </button>
      </div>
    </div>
  );
}

export default HomePage;
