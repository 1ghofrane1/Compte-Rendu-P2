import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { useRouter } from 'next/router';

/* Composant RecherchePage:
 - Permet d'effectuer une recherche parmi les tutoriels disponibles.
 - Utilise un champ de recherche pour filtrer dynamiquement les résultats.
 - Récupère les données depuis le fichier tutoriels.json en mode client-side. */
function RecherchePage() {
    // États pour gérer les tutoriels, le chargement, les erreurs et la recherche
    const [tutoriels, setTutoriels] = useState([]); // Liste complète des tutoriels
    const [loading, setLoading] = useState(true); // Indicateur de chargement
    const [error, setError] = useState(null); // Stocke les erreurs éventuelles
    const [searchQuery, setSearchQuery] = useState(""); // Stocke la requête de recherche
    const [searchResults, setSearchResults] = useState([]); // Stocke les résultats de recherche
    const router = useRouter(); // Utilisé pour gérer la navigation (tres utile pour la recherche)

    /* useEffect :
     - Récupère les données des tutoriels au chargement de la page.
     - Simule une requête API en récupérant le fichier JSON local.
     - Gère les erreurs et met à jour l’état des tutoriels.*/
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true); // Active le mode loading
                const response = await fetch('/tutoriels.json'); // Récupération des données statiques
                // Vérifie si la requête a réussi
                if (!response.ok) {
                    throw new Error('Erreur de récupération des tutoriels');
                }
                const data = await response.json();
                setTutoriels(data); // Stocke les tutoriels récupérés
                setError(null); // Réinitialise l’état d’erreur si la récupération est réussie
            } catch (err) {
                setError(err.message); // Capture et stocke le message d’erreur
            } finally {
                setLoading(false); // Désactive le mode loading
            }}
        fetchData(); // Appelle la fonction au montage du composant
    }, []);

    // handleSearchInputChange : met à jour l’état searchQuery lorsque l'utilisateur tape dans le champ de recherche.
    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    /* useEffect :
     - Filtre les tutoriels en fonction de la requête utilisateur.
     - Met à jour les résultats de recherche dès que la requête ou la liste des tutoriels change.*/
    useEffect(() => {
        if (searchQuery) { 
            const results = tutoriels.filter((tutoriel) =>  
                tutoriel.title.toLowerCase().includes(searchQuery.toLowerCase()) // Recherche insensible à la casse
            );
            setSearchResults(results); // Stocke les résultats filtrés
        } else {
            setSearchResults([]); // Réinitialise les résultats si la recherche est vide
        }
    }, [searchQuery, tutoriels]); // Eexécute l’effet lorsque searchQuery ou tutoriels change

    // Affichage des messages en fonction de l'état de la récupération des données
    if (loading) {
        return <p>Chargement des tutoriels...</p>; // Affiche un message de chargement
    }
    if (error) {
        return <p>Erreur: {error}</p>; // Affiche un message d’erreur si la récupération échoue
    }

    return (
        <div>
            <Header />
            <h1>Recherche</h1>

            {/* Champ de saisie pour la recherche */}
            <input 
                type="text" 
                placeholder="Rechercher un tutoriel" 
                value={searchQuery} 
                onChange={handleSearchInputChange} 
            />
            {/* Affichage des résultats de la recherche */}
            {searchResults.length > 0 ? (
                <ul>
                    {searchResults.map(tutoriel => (
                        <li key={tutoriel.id}>
                            {tutoriel.type === "tutoriel" ? (
                                /* Si le résultat est un tutoriel, créer un lien vers sa page */
                                <Link href={`/tutoriels/${tutoriel.id}`}>
                                    {tutoriel.title}
                                </Link>
                            ) : (
                                /* Sinon, afficher uniquement le titre et le type */
                                <>{tutoriel.title} ({tutoriel.type})</>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucun résultat pour "{searchQuery}".</p> // Message affiché si aucun résultat
            )}
        </div>
    );
}
export default RecherchePage;