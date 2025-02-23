import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import classNames from 'classnames';

/*Composant `Header`
  - Affiche un menu de navigation en haut de la page.
  - Utilise classNames pour combiner les classes CSS et gérer les styles dynamiques.
  - Inclut des liens vers les pages principales du site */
const Header = ({ className }) => {
    // Définition des éléments de navigation du menu
    const navItems = [
        { href: "/", label: "Accueil" }, // Lien vers la page d'accueil
        { href: "/recherche", label: "Recherche" } // Lien vers la page de recherche
    ];

    return (
        <header className={classNames(styles.header, className)}> {/* Application des styles CSS dynamiques */}
            <nav className={styles.nav}>
                {/* Boucle sur les éléments de navigation pour afficher les liens */}
                {navItems.map((item) => (
                    <Link href={item.href} key={item.href} className={styles.link}>
                        {item.label} {/* Texte du lien */}
                    </Link>
                ))}
            </nav>
        </header>
    );
};

export default Header;
