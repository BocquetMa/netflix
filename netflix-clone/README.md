# 🎬 Netflix Clone - Application Angular

Clone de Netflix créé avec Angular 20 pour l'apprentissage et l'entraînement.

## 🚀 Fonctionnalités

- **Page d'accueil** : Bannière hero avec film en vedette + lignes de films par catégorie
- **Navigation** : Barre de navigation dynamique type Netflix avec effet de scroll
- **Catalogue de films** : 10 films/séries mockés avec images générées
- **Pages de détails** : Vue détaillée de chaque film/série avec synopsis et informations
- **Lecteur vidéo** : Simulation d'un lecteur vidéo avec contrôles
- **Design responsive** : Optimisé pour mobile et desktop
- **Animations** : Effets de hover et transitions fluides

## 📁 Structure du projet

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/          # Barre de navigation
│   │   ├── home/            # Page d'accueil
│   │   ├── movie-card/      # Carte de film
│   │   ├── movie-row/       # Ligne de films défilante
│   │   ├── movie-detail/    # Page de détails d'un film
│   │   └── video-player/    # Lecteur vidéo
│   ├── models/
│   │   └── movie.ts         # Interface Movie
│   ├── services/
│   │   └── movies.ts        # Service de gestion des films
│   └── app.routes.ts        # Configuration du routing
└── styles.scss              # Styles globaux
```

## 🎨 Technologies utilisées

- **Angular 20** - Framework principal
- **TypeScript** - Langage de programmation
- **SCSS** - Préprocesseur CSS
- **RxJS** - Programmation réactive
- **Standalone Components** - Architecture moderne d'Angular

## 🛠️ Installation et démarrage

```bash
# Installation des dépendances
npm install

# Démarrer le serveur de développement
npm start

# L'application sera accessible sur http://localhost:4200
```

## 📱 Routes disponibles

- `/` - Page d'accueil avec catalogue
- `/movie/:id` - Détails d'un film/série
- `/watch/:id` - Lecteur vidéo

## 🎯 Données mockées

L'application contient 10 contenus fictifs :
- Films : Stellar Odyssey, Les Secrets de l'Ombre, Royaume Perdu, etc.
- Séries : Code Crimson, Détectives Nocturnes, La Légende des Samouraïs, etc.

Les images sont générées via Picsum Photos avec des seeds pour avoir des images cohérentes.

## 🎨 Design

Le design s'inspire de Netflix avec :
- Palette de couleurs : Noir (#141414), Rouge Netflix (#e50914), Blanc/Gris
- Typographie : Helvetica Neue
- Effets de hover sur les cartes de films
- Scrolling horizontal pour les lignes de films
- Navbar transparente qui devient opaque au scroll

## 📝 Points d'amélioration possibles

- Ajouter un vrai lecteur vidéo (Video.js, Plyr)
- Implémenter une recherche
- Ajouter une authentification
- Créer une fonctionnalité "Ma liste"
- Backend API avec base de données réelle
- Système de filtres avancés
- Player avec sous-titres et qualité vidéo

## 🎓 Objectif pédagogique

Ce projet est parfait pour apprendre :
- L'architecture Angular avec standalone components
- Le routing et la navigation
- Les services et l'injection de dépendances
- RxJS et les Observables
- Le styling avec SCSS et BEM
- Les composants réutilisables
- Le responsive design

## 🛠️ Commandes Angular CLI

```bash
# Générer un nouveau composant
ng generate component component-name

# Build de production
ng build

# Lancer les tests
ng test
```

---

**Note** : Ce projet est uniquement à des fins d'apprentissage et n'utilise aucune donnée réelle de Netflix.
