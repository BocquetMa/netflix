import { Injectable } from '@angular/core';
import { Movie } from '../models/movie';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Movies {
  private movies: Movie[] = [
    {
      id: 1,
      title: 'Stellar Odyssey',
      description: 'Un voyage épique à travers les galaxies pour sauver l\'humanité d\'une menace extraterrestre imminente.',
      imageUrl: 'https://picsum.photos/seed/movie1/300/450',
      backdropUrl: 'https://picsum.photos/seed/back1/1200/675',
      year: 2023,
      duration: '2h 15min',
      genre: ['Science-Fiction', 'Action'],
      rating: 8.5,
      type: 'movie',
      featured: true
    },
    {
      id: 2,
      title: 'Les Secrets de l\'Ombre',
      description: 'Un thriller psychologique où rien n\'est ce qu\'il semble être.',
      imageUrl: 'https://picsum.photos/seed/movie2/300/450',
      backdropUrl: 'https://picsum.photos/seed/back2/1200/675',
      year: 2023,
      duration: '1h 55min',
      genre: ['Thriller', 'Mystère'],
      rating: 7.8,
      type: 'movie'
    },
    {
      id: 3,
      title: 'Royaume Perdu',
      description: 'Une aventure fantastique dans un monde oublié rempli de magie et de créatures mythiques.',
      imageUrl: 'https://picsum.photos/seed/movie3/300/450',
      backdropUrl: 'https://picsum.photos/seed/back3/1200/675',
      year: 2022,
      duration: '2h 30min',
      genre: ['Fantaisie', 'Aventure'],
      rating: 9.2,
      type: 'movie'
    },
    {
      id: 4,
      title: 'Code Crimson',
      description: 'Une série d\'action palpitante suivant une équipe d\'élite dans leurs missions dangereuses.',
      imageUrl: 'https://picsum.photos/seed/series1/300/450',
      backdropUrl: 'https://picsum.photos/seed/back4/1200/675',
      year: 2023,
      duration: '8 épisodes',
      genre: ['Action', 'Drame'],
      rating: 8.0,
      type: 'series'
    },
    {
      id: 5,
      title: 'Rires en Cascade',
      description: 'Une comédie hilarante sur les péripéties d\'une famille dysfonctionnelle.',
      imageUrl: 'https://picsum.photos/seed/movie4/300/450',
      backdropUrl: 'https://picsum.photos/seed/back5/1200/675',
      year: 2023,
      duration: '1h 40min',
      genre: ['Comédie'],
      rating: 7.5,
      type: 'movie'
    },
    {
      id: 6,
      title: 'Détectives Nocturnes',
      description: 'Deux enquêteurs résolvent des crimes mystérieux qui se produisent uniquement la nuit.',
      imageUrl: 'https://picsum.photos/seed/series2/300/450',
      backdropUrl: 'https://picsum.photos/seed/back6/1200/675',
      year: 2022,
      duration: '10 épisodes',
      genre: ['Crime', 'Mystère'],
      rating: 8.7,
      type: 'series'
    },
    {
      id: 7,
      title: 'Horizon Infini',
      description: 'Un drame émotionnel sur l\'amour et le sacrifice dans un monde post-apocalyptique.',
      imageUrl: 'https://picsum.photos/seed/movie5/300/450',
      backdropUrl: 'https://picsum.photos/seed/back7/1200/675',
      year: 2023,
      duration: '2h 05min',
      genre: ['Drame', 'Romance'],
      rating: 7.9,
      type: 'movie'
    },
    {
      id: 8,
      title: 'La Légende des Samouraïs',
      description: 'Une série historique captivante sur l\'honneur et la tradition au Japon féodal.',
      imageUrl: 'https://picsum.photos/seed/series3/300/450',
      backdropUrl: 'https://picsum.photos/seed/back8/1200/675',
      year: 2022,
      duration: '12 épisodes',
      genre: ['Historique', 'Action'],
      rating: 9.0,
      type: 'series'
    },
    {
      id: 9,
      title: 'Cyber Revolution',
      description: 'Dans un futur proche, un hacker tente de démanteler un empire technologique corrompu.',
      imageUrl: 'https://picsum.photos/seed/movie6/300/450',
      backdropUrl: 'https://picsum.photos/seed/back9/1200/675',
      year: 2023,
      duration: '2h 20min',
      genre: ['Science-Fiction', 'Thriller'],
      rating: 8.3,
      type: 'movie'
    },
    {
      id: 10,
      title: 'Famille Moderne',
      description: 'Une série comique documentant la vie quotidienne de trois familles interconnectées.',
      imageUrl: 'https://picsum.photos/seed/series4/300/450',
      backdropUrl: 'https://picsum.photos/seed/back10/1200/675',
      year: 2023,
      duration: '15 épisodes',
      genre: ['Comédie', 'Famille'],
      rating: 8.1,
      type: 'series'
    },
    {
      id: 11,
      title: 'L\'Empire des Dragons',
      description: 'Une saga épique médiévale où plusieurs familles nobles se disputent le contrôle d\'un royaume légendaire.',
      imageUrl: 'https://picsum.photos/seed/series5/300/450',
      backdropUrl: 'https://picsum.photos/seed/back11/1200/675',
      year: 2023,
      duration: '10 épisodes',
      genre: ['Fantaisie', 'Drame'],
      rating: 9.3,
      type: 'series'
    },
    {
      id: 12,
      title: 'Stranger Lab',
      description: 'Des événements surnaturels se produisent dans une petite ville après la disparition mystérieuse d\'un adolescent.',
      imageUrl: 'https://picsum.photos/seed/series6/300/450',
      backdropUrl: 'https://picsum.photos/seed/back12/1200/675',
      year: 2022,
      duration: '8 épisodes',
      genre: ['Science-Fiction', 'Horreur'],
      rating: 8.9,
      type: 'series'
    },
    {
      id: 13,
      title: 'Breaking Code',
      description: 'Un professeur de chimie diagnostiqué d\'un cancer terminal se lance dans la fabrication de drogues pour assurer l\'avenir de sa famille.',
      imageUrl: 'https://picsum.photos/seed/series7/300/450',
      backdropUrl: 'https://picsum.photos/seed/back13/1200/675',
      year: 2021,
      duration: '13 épisodes',
      genre: ['Drame', 'Crime'],
      rating: 9.5,
      type: 'series'
    },
    {
      id: 14,
      title: 'The Crown Legacy',
      description: 'L\'histoire intime et politique de la reine Elizabeth II et des événements qui ont façonné le XXe siècle.',
      imageUrl: 'https://picsum.photos/seed/series8/300/450',
      backdropUrl: 'https://picsum.photos/seed/back14/1200/675',
      year: 2023,
      duration: '10 épisodes',
      genre: ['Historique', 'Drame'],
      rating: 8.7,
      type: 'series'
    },
    {
      id: 15,
      title: 'Dark Matter',
      description: 'Des voyageurs temporels tentent de réparer les anomalies du continuum espace-temps.',
      imageUrl: 'https://picsum.photos/seed/series9/300/450',
      backdropUrl: 'https://picsum.photos/seed/back15/1200/675',
      year: 2023,
      duration: '12 épisodes',
      genre: ['Science-Fiction', 'Thriller'],
      rating: 8.4,
      type: 'series'
    },
    {
      id: 16,
      title: 'Tokyo Underground',
      description: 'Une équipe de braqueurs planifie le plus grand vol de l\'histoire dans les coffres de Tokyo.',
      imageUrl: 'https://picsum.photos/seed/series10/300/450',
      backdropUrl: 'https://picsum.photos/seed/back16/1200/675',
      year: 2023,
      duration: '8 épisodes',
      genre: ['Crime', 'Action'],
      rating: 8.2,
      type: 'series'
    },
    {
      id: 17,
      title: 'The Witcher Saga',
      description: 'Un chasseur de monstres solitaire lutte pour trouver sa place dans un monde où les humains sont souvent plus mauvais que les bêtes.',
      imageUrl: 'https://picsum.photos/seed/series11/300/450',
      backdropUrl: 'https://picsum.photos/seed/back17/1200/675',
      year: 2022,
      duration: '8 épisodes',
      genre: ['Fantaisie', 'Action'],
      rating: 8.6,
      type: 'series'
    },
    {
      id: 18,
      title: 'Squid Challenge',
      description: 'Des centaines de joueurs endettés acceptent une invitation étrange pour participer à des jeux d\'enfants mortels.',
      imageUrl: 'https://picsum.photos/seed/series12/300/450',
      backdropUrl: 'https://picsum.photos/seed/back18/1200/675',
      year: 2023,
      duration: '9 épisodes',
      genre: ['Thriller', 'Drame'],
      rating: 8.8,
      type: 'series'
    },
    {
      id: 19,
      title: 'Westworld Reborn',
      description: 'Dans un parc à thème futuriste, des androïdes développent une conscience et se rebellent contre leurs créateurs.',
      imageUrl: 'https://picsum.photos/seed/series13/300/450',
      backdropUrl: 'https://picsum.photos/seed/back19/1200/675',
      year: 2023,
      duration: '10 épisodes',
      genre: ['Science-Fiction', 'Thriller'],
      rating: 8.5,
      type: 'series'
    },
    {
      id: 20,
      title: 'The Last Kingdom',
      description: 'L\'histoire d\'un guerrier saxon élevé par des Vikings qui doit choisir son camp dans l\'Angleterre du IXe siècle.',
      imageUrl: 'https://picsum.photos/seed/series14/300/450',
      backdropUrl: 'https://picsum.photos/seed/back20/1200/675',
      year: 2022,
      duration: '10 épisodes',
      genre: ['Historique', 'Action'],
      rating: 8.7,
      type: 'series'
    },
    {
      id: 21,
      title: 'Arcane Legends',
      description: 'Deux sœurs se retrouvent de part et d\'autre d\'un conflit entre deux villes rivales utilisant la magie et la technologie.',
      imageUrl: 'https://picsum.photos/seed/series15/300/450',
      backdropUrl: 'https://picsum.photos/seed/back21/1200/675',
      year: 2023,
      duration: '9 épisodes',
      genre: ['Animation', 'Fantaisie'],
      rating: 9.2,
      type: 'series'
    },
    {
      id: 22,
      title: 'Narcos: Empire',
      description: 'L\'ascension et la chute des plus grands barons de la drogue de l\'histoire moderne.',
      imageUrl: 'https://picsum.photos/seed/series16/300/450',
      backdropUrl: 'https://picsum.photos/seed/back22/1200/675',
      year: 2022,
      duration: '10 épisodes',
      genre: ['Crime', 'Drame'],
      rating: 8.8,
      type: 'series'
    },
    {
      id: 23,
      title: 'Black Mirror Society',
      description: 'Une anthologie explorant les côtés sombres de la technologie et de la société moderne.',
      imageUrl: 'https://picsum.photos/seed/series17/300/450',
      backdropUrl: 'https://picsum.photos/seed/back23/1200/675',
      year: 2023,
      duration: '6 épisodes',
      genre: ['Science-Fiction', 'Thriller'],
      rating: 8.9,
      type: 'series'
    },
    {
      id: 24,
      title: 'Vikings: Valhalla',
      description: 'Cent ans après les événements originaux, de nouveaux héros vikings émergent dans cette saga épique.',
      imageUrl: 'https://picsum.photos/seed/series18/300/450',
      backdropUrl: 'https://picsum.photos/seed/back24/1200/675',
      year: 2023,
      duration: '8 épisodes',
      genre: ['Historique', 'Action'],
      rating: 8.3,
      type: 'series'
    },
    {
      id: 25,
      title: 'The Umbrella Academy',
      description: 'Une famille dysfonctionnelle de super-héros se réunit pour résoudre le mystère de la mort de leur père adoptif.',
      imageUrl: 'https://picsum.photos/seed/series19/300/450',
      backdropUrl: 'https://picsum.photos/seed/back25/1200/675',
      year: 2023,
      duration: '10 épisodes',
      genre: ['Science-Fiction', 'Comédie'],
      rating: 8.4,
      type: 'series'
    },
    {
      id: 26,
      title: 'Peaky Blinders',
      description: 'Une famille de gangsters de Birmingham étend son empire criminel dans l\'Angleterre de l\'après Première Guerre mondiale.',
      imageUrl: 'https://picsum.photos/seed/series20/300/450',
      backdropUrl: 'https://picsum.photos/seed/back26/1200/675',
      year: 2022,
      duration: '6 épisodes',
      genre: ['Crime', 'Drame'],
      rating: 8.9,
      type: 'series'
    },
    {
      id: 27,
      title: 'The Mandalorian',
      description: 'Un chasseur de primes solitaire parcourt la galaxie avec un mystérieux enfant possédant des pouvoirs extraordinaires.',
      imageUrl: 'https://picsum.photos/seed/series21/300/450',
      backdropUrl: 'https://picsum.photos/seed/back27/1200/675',
      year: 2023,
      duration: '8 épisodes',
      genre: ['Science-Fiction', 'Aventure'],
      rating: 8.8,
      type: 'series'
    },
    {
      id: 28,
      title: 'Ozark',
      description: 'Un conseiller financier déménage sa famille dans les Ozarks pour blanchir de l\'argent pour un cartel de la drogue.',
      imageUrl: 'https://picsum.photos/seed/series22/300/450',
      backdropUrl: 'https://picsum.photos/seed/back28/1200/675',
      year: 2022,
      duration: '10 épisodes',
      genre: ['Crime', 'Thriller'],
      rating: 8.5,
      type: 'series'
    },
    {
      id: 29,
      title: 'The Boys',
      description: 'Un groupe de justiciers se bat contre des super-héros corrompus qui abusent de leurs pouvoirs.',
      imageUrl: 'https://picsum.photos/seed/series23/300/450',
      backdropUrl: 'https://picsum.photos/seed/back29/1200/675',
      year: 2023,
      duration: '8 épisodes',
      genre: ['Action', 'Comédie'],
      rating: 8.7,
      type: 'series'
    },
    {
      id: 30,
      title: 'Sherlock Modern',
      description: 'Le célèbre détective résout des crimes dans le Londres du 21e siècle avec des méthodes modernes.',
      imageUrl: 'https://picsum.photos/seed/series24/300/450',
      backdropUrl: 'https://picsum.photos/seed/back30/1200/675',
      year: 2022,
      duration: '3 épisodes',
      genre: ['Mystère', 'Crime'],
      rating: 9.1,
      type: 'series'
    },
    {
      id: 31,
      title: 'Altered Carbon',
      description: 'Dans un futur où la conscience peut être transférée, un ancien soldat enquête sur un meurtre mystérieux.',
      imageUrl: 'https://picsum.photos/seed/series25/300/450',
      backdropUrl: 'https://picsum.photos/seed/back31/1200/675',
      year: 2023,
      duration: '8 épisodes',
      genre: ['Science-Fiction', 'Thriller'],
      rating: 8.3,
      type: 'series'
    },
    {
      id: 32,
      title: 'The Expanse',
      description: 'L\'humanité a colonisé le système solaire et différentes factions luttent pour le pouvoir et les ressources.',
      imageUrl: 'https://picsum.photos/seed/series26/300/450',
      backdropUrl: 'https://picsum.photos/seed/back32/1200/675',
      year: 2023,
      duration: '10 épisodes',
      genre: ['Science-Fiction', 'Drame'],
      rating: 8.8,
      type: 'series'
    },
    {
      id: 33,
      title: 'Mindhunter',
      description: 'Deux agents du FBI interviewent des tueurs en série pour comprendre leur psychologie et résoudre des affaires en cours.',
      imageUrl: 'https://picsum.photos/seed/series27/300/450',
      backdropUrl: 'https://picsum.photos/seed/back33/1200/675',
      year: 2022,
      duration: '9 épisodes',
      genre: ['Crime', 'Thriller'],
      rating: 8.6,
      type: 'series'
    },
    {
      id: 34,
      title: 'The Walking Dead',
      description: 'Des survivants tentent de reconstruire la civilisation dans un monde envahi par des zombies.',
      imageUrl: 'https://picsum.photos/seed/series28/300/450',
      backdropUrl: 'https://picsum.photos/seed/back34/1200/675',
      year: 2022,
      duration: '16 épisodes',
      genre: ['Horreur', 'Drame'],
      rating: 8.1,
      type: 'series'
    },
    {
      id: 35,
      title: 'Succession',
      description: 'Une famille de milliardaires se déchire pour le contrôle d\'un empire médiatique mondial.',
      imageUrl: 'https://picsum.photos/seed/series29/300/450',
      backdropUrl: 'https://picsum.photos/seed/back35/1200/675',
      year: 2023,
      duration: '10 épisodes',
      genre: ['Drame'],
      rating: 8.9,
      type: 'series'
    },
    {
      id: 36,
      title: 'The Handmaid\'s Tale',
      description: 'Dans une société dystopique, les femmes sont réduites à l\'esclavage reproductif.',
      imageUrl: 'https://picsum.photos/seed/series30/300/450',
      backdropUrl: 'https://picsum.photos/seed/back36/1200/675',
      year: 2023,
      duration: '10 épisodes',
      genre: ['Drame', 'Science-Fiction'],
      rating: 8.5,
      type: 'series'
    },
    {
      id: 37,
      title: 'Better Call Saul',
      description: 'L\'histoire d\'un avocat raté qui se transforme en criminel pour survivre.',
      imageUrl: 'https://picsum.photos/seed/series31/300/450',
      backdropUrl: 'https://picsum.photos/seed/back37/1200/675',
      year: 2022,
      duration: '13 épisodes',
      genre: ['Drame', 'Crime'],
      rating: 9.0,
      type: 'series'
    },
    {
      id: 38,
      title: 'The Office Chronicles',
      description: 'Les aventures comiques des employés d\'une entreprise de papier ordinaire.',
      imageUrl: 'https://picsum.photos/seed/series32/300/450',
      backdropUrl: 'https://picsum.photos/seed/back38/1200/675',
      year: 2022,
      duration: '22 épisodes',
      genre: ['Comédie'],
      rating: 8.9,
      type: 'series'
    },
    {
      id: 39,
      title: 'Lost in Time',
      description: 'Les survivants d\'un crash aérien découvrent que leur île cache de terribles secrets.',
      imageUrl: 'https://picsum.photos/seed/series33/300/450',
      backdropUrl: 'https://picsum.photos/seed/back39/1200/675',
      year: 2021,
      duration: '24 épisodes',
      genre: ['Mystère', 'Drame'],
      rating: 8.4,
      type: 'series'
    },
    {
      id: 40,
      title: 'Cobra Kai',
      description: 'Trente ans après leur rivalité, deux anciens ennemis rouvrent leurs dojos de karaté.',
      imageUrl: 'https://picsum.photos/seed/series34/300/450',
      backdropUrl: 'https://picsum.photos/seed/back40/1200/675',
      year: 2023,
      duration: '10 épisodes',
      genre: ['Action', 'Comédie'],
      rating: 8.6,
      type: 'series'
    },
    {
      id: 41,
      title: 'The Crown of Thorns',
      description: 'Une enquête sur un meurtre dans un monastère médiéval révèle une conspiration plus vaste.',
      imageUrl: 'https://picsum.photos/seed/series35/300/450',
      backdropUrl: 'https://picsum.photos/seed/back41/1200/675',
      year: 2023,
      duration: '8 épisodes',
      genre: ['Mystère', 'Historique'],
      rating: 8.2,
      type: 'series'
    },
    {
      id: 42,
      title: 'Lucifer Morningstar',
      description: 'Le Diable en personne s\'ennuie en enfer et décide de prendre des vacances à Los Angeles.',
      imageUrl: 'https://picsum.photos/seed/series36/300/450',
      backdropUrl: 'https://picsum.photos/seed/back42/1200/675',
      year: 2023,
      duration: '16 épisodes',
      genre: ['Fantaisie', 'Crime'],
      rating: 8.4,
      type: 'series'
    },
    {
      id: 43,
      title: 'The Haunting',
      description: 'Une famille doit affronter les fantômes de son passé en retournant dans sa maison hantée.',
      imageUrl: 'https://picsum.photos/seed/series37/300/450',
      backdropUrl: 'https://picsum.photos/seed/back43/1200/675',
      year: 2022,
      duration: '10 épisodes',
      genre: ['Horreur', 'Drame'],
      rating: 8.7,
      type: 'series'
    },
    {
      id: 44,
      title: 'Brooklyn Nine-Nine',
      description: 'Les enquêtes hilarantes d\'une équipe de détectives excentriques dans un commissariat de New York.',
      imageUrl: 'https://picsum.photos/seed/series38/300/450',
      backdropUrl: 'https://picsum.photos/seed/back44/1200/675',
      year: 2023,
      duration: '22 épisodes',
      genre: ['Comédie', 'Crime'],
      rating: 8.5,
      type: 'series'
    },
    {
      id: 45,
      title: 'Chernobyl Chronicles',
      description: 'La reconstitution dramatique de la catastrophe nucléaire de Tchernobyl et de ses conséquences.',
      imageUrl: 'https://picsum.photos/seed/series39/300/450',
      backdropUrl: 'https://picsum.photos/seed/back45/1200/675',
      year: 2022,
      duration: '5 épisodes',
      genre: ['Historique', 'Drame'],
      rating: 9.4,
      type: 'series'
    },
    {
      id: 46,
      title: 'La Casa de Papel',
      description: 'Huit voleurs prennent en otage la Banque d\'Espagne dans le plus audacieux braquage de l\'histoire.',
      imageUrl: 'https://picsum.photos/seed/series40/300/450',
      backdropUrl: 'https://picsum.photos/seed/back46/1200/675',
      year: 2023,
      duration: '10 épisodes',
      genre: ['Crime', 'Action'],
      rating: 8.6,
      type: 'series'
    },
    {
      id: 47,
      title: 'Bridgerton',
      description: 'Les intrigues amoureuses et les scandales de la haute société londonienne de l\'époque Régence.',
      imageUrl: 'https://picsum.photos/seed/series41/300/450',
      backdropUrl: 'https://picsum.photos/seed/back47/1200/675',
      year: 2023,
      duration: '8 épisodes',
      genre: ['Romance', 'Drame'],
      rating: 8.3,
      type: 'series'
    },
    {
      id: 48,
      title: 'The Queen\'s Gambit',
      description: 'Une prodige des échecs orpheline lutte contre l\'addiction tout en visant le championnat du monde.',
      imageUrl: 'https://picsum.photos/seed/series42/300/450',
      backdropUrl: 'https://picsum.photos/seed/back48/1200/675',
      year: 2022,
      duration: '7 épisodes',
      genre: ['Drame'],
      rating: 8.9,
      type: 'series'
    },
    {
      id: 49,
      title: 'Shadow and Bone',
      description: 'Une jeune cartographe découvre qu\'elle possède un pouvoir magique qui pourrait sauver son monde.',
      imageUrl: 'https://picsum.photos/seed/series43/300/450',
      backdropUrl: 'https://picsum.photos/seed/back49/1200/675',
      year: 2023,
      duration: '8 épisodes',
      genre: ['Fantaisie', 'Aventure'],
      rating: 8.1,
      type: 'series'
    },
    {
      id: 50,
      title: 'The Sandman',
      description: 'Le seigneur des rêves s\'échappe de sa prison après 70 ans et tente de restaurer son royaume.',
      imageUrl: 'https://picsum.photos/seed/series44/300/450',
      backdropUrl: 'https://picsum.photos/seed/back50/1200/675',
      year: 2023,
      duration: '10 épisodes',
      genre: ['Fantaisie', 'Horreur'],
      rating: 8.5,
      type: 'series'
    },
    {
      id: 51,
      title: 'Wednesday',
      description: 'La fille de la famille Addams résout des mystères surnaturels dans son internat.',
      imageUrl: 'https://picsum.photos/seed/series45/300/450',
      backdropUrl: 'https://picsum.photos/seed/back51/1200/675',
      year: 2023,
      duration: '8 épisodes',
      genre: ['Comédie', 'Mystère'],
      rating: 8.4,
      type: 'series'
    },
    {
      id: 52,
      title: 'The Night Agent',
      description: 'Un agent du FBI de bas niveau se retrouve au centre d\'une conspiration menaçant la Maison Blanche.',
      imageUrl: 'https://picsum.photos/seed/series46/300/450',
      backdropUrl: 'https://picsum.photos/seed/back52/1200/675',
      year: 2023,
      duration: '10 épisodes',
      genre: ['Thriller', 'Action'],
      rating: 8.2,
      type: 'series'
    },
    {
      id: 53,
      title: 'Invincible',
      description: 'Un adolescent découvre que son père est le super-héros le plus puissant de la planète et développe ses propres pouvoirs.',
      imageUrl: 'https://picsum.photos/seed/series47/300/450',
      backdropUrl: 'https://picsum.photos/seed/back53/1200/675',
      year: 2023,
      duration: '8 épisodes',
      genre: ['Animation', 'Action'],
      rating: 8.8,
      type: 'series'
    },
    {
      id: 54,
      title: 'Yellowstone',
      description: 'Une famille qui contrôle le plus grand ranch des États-Unis défend ses terres contre tous les fronts.',
      imageUrl: 'https://picsum.photos/seed/series48/300/450',
      backdropUrl: 'https://picsum.photos/seed/back54/1200/675',
      year: 2023,
      duration: '10 épisodes',
      genre: ['Drame', 'Western'],
      rating: 8.7,
      type: 'series'
    },
    {
      id: 55,
      title: 'Euphoria',
      description: 'Une adolescente en réadaptation navigue dans les complexités de l\'amitié, de l\'amour et de l\'identité.',
      imageUrl: 'https://picsum.photos/seed/series49/300/450',
      backdropUrl: 'https://picsum.photos/seed/back55/1200/675',
      year: 2023,
      duration: '8 épisodes',
      genre: ['Drame'],
      rating: 8.4,
      type: 'series'
    },
    {
      id: 56,
      title: 'The Last of Us',
      description: 'Dans un monde post-apocalyptique ravagé par un champignon mortel, un contrebandier doit escorter une jeune fille immunisée.',
      imageUrl: 'https://picsum.photos/seed/series50/300/450',
      backdropUrl: 'https://picsum.photos/seed/back56/1200/675',
      year: 2023,
      duration: '9 épisodes',
      genre: ['Action', 'Drame'],
      rating: 9.1,
      type: 'series'
    },
    {
      id: 57,
      title: 'Severance',
      description: 'Des employés subissent une procédure qui sépare chirurgicalement leurs souvenirs professionnels et personnels.',
      imageUrl: 'https://picsum.photos/seed/series51/300/450',
      backdropUrl: 'https://picsum.photos/seed/back57/1200/675',
      year: 2023,
      duration: '9 épisodes',
      genre: ['Science-Fiction', 'Thriller'],
      rating: 8.7,
      type: 'series'
    },
    {
      id: 58,
      title: 'House of the Dragon',
      description: 'L\'histoire de la maison Targaryen, 200 ans avant les événements de Game of Thrones.',
      imageUrl: 'https://picsum.photos/seed/series52/300/450',
      backdropUrl: 'https://picsum.photos/seed/back58/1200/675',
      year: 2023,
      duration: '10 épisodes',
      genre: ['Fantaisie', 'Drame'],
      rating: 8.6,
      type: 'series'
    },
    {
      id: 59,
      title: 'Abbott Elementary',
      description: 'Les enseignants dévoués d\'une école primaire sous-financée tentent de donner le meilleur à leurs élèves.',
      imageUrl: 'https://picsum.photos/seed/series53/300/450',
      backdropUrl: 'https://picsum.photos/seed/back59/1200/675',
      year: 2023,
      duration: '13 épisodes',
      genre: ['Comédie'],
      rating: 8.3,
      type: 'series'
    },
    {
      id: 60,
      title: 'Andor',
      description: 'L\'histoire d\'un voleur qui devient un héros révolutionnaire dans la galaxie Star Wars.',
      imageUrl: 'https://picsum.photos/seed/series54/300/450',
      backdropUrl: 'https://picsum.photos/seed/back60/1200/675',
      year: 2023,
      duration: '12 épisodes',
      genre: ['Science-Fiction', 'Action'],
      rating: 8.8,
      type: 'series'
    }
  ];

  getAllMovies(): Observable<Movie[]> {
    return of(this.movies);
  }

  getMovieById(id: number): Observable<Movie | undefined> {
    return of(this.movies.find(movie => movie.id === id));
  }

  getFeaturedMovie(): Observable<Movie | undefined> {
    return of(this.movies.find(movie => movie.featured));
  }

  getMoviesByGenre(genre: string): Observable<Movie[]> {
    return of(this.movies.filter(movie => movie.genre.includes(genre)));
  }

  getMoviesByType(type: 'movie' | 'series'): Observable<Movie[]> {
    return of(this.movies.filter(movie => movie.type === type));
  }
}
