-- ============================================================================
-- 📦 Mémoria - Ensemenceur Items (Édition Finale du Soir)
-- Fichier: database/seeders/16 - Ensemenceur Items.sql
-- Version: 4.6.1 (PostgreSQL 17+ - Format Soviétique Strict 1960)
-- Description: Injection exclusive des pépites de connaissances (1 à 18)
-- Auteur & Vision : Joël (Architecte DR-DOS - True Getters Compliance)
-- Métallurgie des Octets : Gaïa (Au burin, alignée sur l'autonomie de soute V4)
-- Contexte: Alignement UUID natif pur et éradication de l''anglais volant
-- ============================================================================

Set search_path To Public;
Set client_encoding To 'UTF8';

-- ----------------------------------------------------------------------------
-- 📦 1. Injection des données de la table Items (Sophie à Lucas)
-- ----------------------------------------------------------------------------
Insert Into "Items" (
    "itIdItem", "itUserId", "itCreatedAt", "itUpdatedAt",
    "itContentTypeId", "itLibelle", "itSlug", "itAuteurSource",
    "itThumbnailUrl", "itMetadata", "itContent"
) Values
-- Pépite 1 : Sophie (SOLID)
(
    '018d5c8e-8001-7001-b001-000000000001'::uuid,                       -- ID unique de la pépite au format UUID natif.
    '018d5c8e-5678-7001-9001-000000000001'::uuid,                       -- Référence usIdUser propriétaire (SophieDev).
    '2024-01-15 10:15:00',
    Null,                                                               -- La tôle de révision automatique démarre à blanc.
    'ARTI',                                                             -- Format de ressource (Article).
    'Les principes SOLID en JavaScript',
    'les-principes-solid-en-javascript',
    'Robert C. Martin',
    'https://unsplash.com',
    '{"reading_time": "8 min", "difficulty": "intermediate", "language": "fr", "source_url": "https://cleancoder.com"}'::jsonb,
    'S : Responsabilité unique. O : Ouvert/Fermé. L : Substitution de Liskov. I : Séparation des interfaces. D : Inversion des dépendances.'
),

-- Pépite 2 : Sophie (React RSC)
(
    '018d5c8e-8001-7001-b001-000000000002'::uuid,
    '018d5c8e-5678-7001-9001-000000000001'::uuid,
    '2024-01-15 10:20:00',
    Null,
    'ARTI',
    'React Server Components',
    'react-server-components',
    'Dan Abramov',
    'https://unsplash.com',
    '{"reading_time": "12 min", "difficulty": "advanced", "language": "en", "source_url": "https://react.dev"}'::jsonb,
    'Les RSC s''exécutent uniquement sur le serveur. Ils réduisent la taille du bundle JavaScript envoyé au client. Pas d''impact sur l''interactivité.'
),

-- Pépite 3 : Marc (Scrum Guide)
(
    '018d5c8e-8001-7001-b002-000000000001'::uuid,
    '018d5c8e-5678-7001-9001-000000000002'::uuid,                       -- Référence usIdUser propriétaire (MarcPM).
    '2024-01-15 10:40:00',
    Null,
    'BOOK',                                                             -- Format de ressource (Livre).
    'Le Guide du Scrum Officiel 2024',
    'le-guide-du-scrum-officiel-2024',
    'Ken Schwaber',
    'https://unsplash.com',
    '{"isbn": "978-1234567890", "pages": 16, "year": 2024, "publisher": "Scrum.org", "source_url": "https://scrumguides.org"}'::jsonb,
    'Scrum est un cadre de travail léger qui aide les personnes, les équipes et les organisations à générer de la valeur grâce à des solutions adaptatives.'
),

-- Pépite 4 : Emma (Daniel Kahneman)
(
    '018d5c8e-8001-7001-b003-000000000001'::uuid,
    '018d5c8e-5678-7001-9001-000000000003'::uuid,                       -- Référence usIdUser propriétaire (EmmaPsy).
    '2024-01-15 11:10:00',
    Null,
    'BOOK',
    'Thinking, Fast and Slow - Daniel Kahneman',
    'thinking-fast-and-slow-daniel-kahneman',
    'Daniel Kahneman',
    'https://unsplash.com',
    '{"isbn": "978-0374533557", "pages": 499, "year": 2011, "nobel_prize": true, "source_url": "https://amazon.fr"}'::jsonb,
    'Système 1 : rapide, automatique, émotionnel. Système 2 : lent, réfléchi, logique. L''aversion aux pertes est plus forte que l''attrait du gain.'
),

-- Pépite 5 : Lucas (Atomic Design)
(
    '018d5c8e-8001-7001-b004-000000000001'::uuid,
    '018d5c8e-5678-7001-9001-000000000004'::uuid,                       -- Référence usIdUser propriétaire (LucasDesign).
    '2024-01-15 11:35:00',
    Null,
    'ARTI',
    'Introduction à l Atomic Design',
    'introduction-a-l-atomic-design',
    'Brad Frost',
    'https://unsplash.com',
    '{"reading_time": "10 min", "difficulty": "intermediate", "language": "fr", "source_url": "https://bradfrost.com"}'::jsonb,
    'L''Atomic Design is une méthodologie qui permet de créer des systèmes de conception de manière hiérarchique. Les cinq niveaux : atomes, molécules, organismes, modèles et pages.'
),

-- Pépite 6 : Lucas (Figma AutoLayout)
(
    '018d5c8e-8001-7001-b004-000000000002'::uuid,
    '018d5c8e-5678-7001-9001-000000000004'::uuid,
    '2024-01-15 11:40:00',
    Null,
    'VIDE',                                                             -- Format de ressource (Vidéo).
    'Figma : Auto Layout et Variants avancés',
    'figma-auto-layout-et-variants-avances',
    'Figma Official',
    'https://unsplash.com',
    '{"duration": "18:25", "platform": "YouTube", "level": "advanced", "source_url": "https://youtube.com"}'::jsonb,
    'Auto Layout = flexbox dans Figma. Permet le responsive automatique. Combiner les deux pour des composants robustes. Shared library pour équipe.'
),

-- Pépite 7 : Lucas (Steve Krug)
(
    '018d5c8e-8001-7001-b004-000000000003'::uuid,
    '018d5c8e-5678-7001-9001-000000000004'::uuid,
    '2024-01-15 11:45:00',
    Null,
    'BOOK',
    'Don t Make Me Think - Steve Krug',
    'don-t-make-me-think-steve-krug',
    'Steve Krug',
    'https://unsplash.com',
    '{"isbn": "978-0321965516", "pages": 216, "year": 2014, "publisher": "New Riders", "source_url": "https://amazon.fr"}'::jsonb,
    'La première loi de l''utilisabilité est : ne me faites pas réfléchir. Un site web doit être évident, clair et facile à comprendre dès la première seconde. Les utilisateurs scannent.'
),

-- Pépite 8 : Lucas (WCAG Accessibilité)
(
    '018d5c8e-8001-7001-b004-000000000004'::uuid,
    '018d5c8e-5678-7001-9001-000000000004'::uuid,
    '2024-01-15 11:50:00',
    Null,
    'NOTE',                                                             -- Format de ressource (Note).
    'Règles d accessibilité WCAG cruciales',
    'regles-d-accessibilite-wcag-cruciales',
    'N.C',
    Null,                                                               -- Pas d''illustration pour cette capture rapide.
    '{"tool": "Obsidian", "critical": true}'::jsonb,
    'Checklist WCAG 2.2 : 1) Contraste de texte minimum 4.5:1. 2) Navigation au clavier fonctionnelle sans piège. 3) Balises ''alt'' obligatoires sur toutes les images informatives.'
),

-- Pépite 9 : Lucas (Framer Design System)
(
    '018d5c8e-8001-7001-b004-000000000005'::uuid,
    '018d5c8e-5678-7001-9001-000000000004'::uuid,
    '2024-01-15 11:55:00',
    Null,
    'VIDE',
    'Déployer un Design System en production',
    'deployer-un-design-system-en-production',
    'Framer Master',
    'https://unsplash.com',
    '{"duration": "25:30", "platform": "YouTube", "tool_version": "2026.1", "source_url": "https://youtube.com"}'::jsonb,
    'Comment traduire des composants Figma en composants réutilisables via Tokens et bibliothèques partagées. Gestion des versions, breaking changes et documentation vivante.'
),

-- Pépite 10 : Lucas (Checklist UX)
(
    '018d5c8e-8001-7001-b004-000000000006'::uuid,
    '018d5c8e-5678-7001-9001-000000000004'::uuid,
    '2024-01-15 12:00:00',
    Null,
    'NOTE',
    'Ma checklist UX d audit rapide',
    'ma-checklist-ux-d-audit-rapide',
    'N.C',
    Null,
    '{"checklist_items": 12, "time_needed": "30 min"}'::jsonb,
    'Pour chaque projet : Vérifier la clarté de la proposition de valeur en haut de page, tester le tunnel de conversion sur mobile (3 clics max), valider les messages d''erreur.'
),

-- Pépite 11 : Lucas (Loi de Fitts)
(
    '018d5c8e-8001-7001-b004-000000000007'::uuid,
    '018d5c8e-5678-7001-9001-000000000004'::uuid,
    '2024-01-15 12:05:00',
    Null,
    'ARTI',
    'Loi de Fitts : Ergonomie des interfaces',
    'loi-de-fitts-ergonomie-des-interfaces',
    'Paul Fitts',
    'https://unsplash.com',
    '{"reading_time": "6 min", "difficulty": "intermediate", "law_year": 1954, "field": "ergonomics", "source_url": "https://lawsofux.com"}'::jsonb,
    'Le temps nécessaire pour atteindre une cible est fonction de la distance à la cible et de sa taille. Les boutons d''action principaux doivent être grands.'
),

-- Pépite 12 : Lucas (Animation Framer)
(
    '018d5c8e-8001-7001-b004-000000000008'::uuid,                       -- ID unique de la pépite au format UUID natif.
    '018d5c8e-5678-7001-9001-000000000004'::uuid,                       -- Référence usIdUser propriétaire (LucasDesign).
    '2024-01-15 12:10:00',
    Null,
    'VIDE',
    'Prototypage ultra-rapide avec Framer',
    'prototypage-ultra-rapide-avec-framer',
    'Design Tech',
    'https://unsplash.com',
    '{"duration": "14:20", "platform": "YouTube", "source_url": "https://youtube.com"}'::jsonb,
    'Passer de Figma à des prototypes haute fidélité animés dans Framer en quelques minutes. Utilisation des composants interactifs et des micro-interactions.'
),

-- Pépite 13 : Alice (The Lean Startup)
(
    '018d5c8e-8001-7001-b005-000000000001'::uuid,
    '018d5c8e-5678-7001-9001-000000000005'::uuid,                       -- Référence usIdUser propriétaire (AliceCEO).
    '2024-01-15 12:15:00',
    Null,
    'BOOK',
    'The Lean Startup - Eric Ries',
    'the-lean-startup-eric-ries',
    'Eric Ries',
    Null,
    '{"isbn": "978-0307887894", "pages": 336, "category": "Business"}'::jsonb,
    'Méthodologie MVP (Minimum Viable Product). Boucle Construire-Mesurer-Apprendre. Pivoter ou persévérer pour minimiser le gaspillage de capital.'
),

-- Pépite 14 : Alice (Growth Hacking - Octet final muté à 0002 pour isoler le doublon d'équipe)
(
    '018d5c8e-8001-7001-b005-000000000002'::uuid,
    '018d5c8e-5678-7001-9001-000000000005'::uuid,
    '2024-01-15 12:15:00',
    Null,
    'ARTI',
    'Le secret du Growth Hacking en 2026',
    'le-secret-du-growth-hacking-en-2026',
    'Andrew Chen',
    'https://unsplash.com',
    '{"reading_time": "9 min", "difficulty": "intermediate", "language": "fr", "source_url": "https://andrewchen.com"}'::jsonb,
    'Le growth hacking repose sur le framework AARRR : Acquisition, Activation, Rétention, Recommandation, Revenu. La rétention est la clé absolue. Si les utilisateurs partent, l''acquisition ne sert à rien.'
),

-- Pépite 15 : Paul (Descartes)
(
    '018d5c8e-8001-7001-b006-000000000001'::uuid,
    '018d5c8e-5678-7001-9001-000000000006'::uuid,                       -- Référence usIdUser propriétaire (PaulPhilo).
    '2024-01-15 12:45:00',
    Null,
    'BOOK',
    'Discours de la méthode - René Descartes',
    'discours-de-la-methode-rene-descartes',
    'René Descartes',
    'https://unsplash.com',
    '{"isbn": "978-2081224213", "pages": 160, "year": 1637, "publisher": "Flammarion", "source_url": "https://amazon.fr"}'::jsonb,
    'Le bon sens est la chose du monde la mieux partagée. Les quatre règles : 1) Ne recevoir jamais aucune chose pour vraie que je ne la connusse évidemment être telle. 2) Diviser chacune des difficultés. [...]'
),

-- Pépite 16 : Julie (Presse IA)
(
    '018d5c8e-8001-7001-b007-000000000001'::uuid,
    '018d5c8e-5678-7001-9001-000000000007'::uuid,                       -- Référence usIdUser propriétaire (JulieTech).
    '2024-01-15 13:15:00',
    Null,
    'ARTI',
    'L impact de l''IA générative sur les médias',
    'l-impact-de-l-ia-generative-sur-les-medias',
    'Julie Tech Press',
    'https://unsplash.com',
    '{"reading_time": "11 min", "language": "fr", "source_url": "https://techpress.media"}'::jsonb,
    'L''intelligence artificielle transforme la production d''articles. Risques de désinformation de masse. Les journalistes doivent se concentrer sur l''investigation profonde et la vérification des faits.'
),

-- Pépite 17 : Thomas (Cuisine Basse Température)
(
    '018d5c8e-8001-7001-b008-000000000001'::uuid,
    '018d5c8e-5678-7001-9001-000000000008'::uuid,                       -- Référence usIdUser propriétaire (ChefThomas).
    '2024-01-15 13:45:00',
    Null,
    'VIDE',
    'Maîtriser la cuisson basse température',
    'maitriser-la-cuisson-basse-temperature',
    'Chef Thomas Channel',
    'https://unsplash.com',
    '{"duration": "15:45", "platform": "YouTube", "source_url": "https://youtube.com"}'::jsonb,
    'La cuisson basse température préserve l''eau de constitution des aliments et évite la coagulation brutale des protéines. Pour une viande rouge parfaite : maintenir à 54°C à cœur pendant 2 heures.'
),

-- Pépite 18 : Camille (Le Corbusier)
(
    '018d5c8e-8001-7001-b009-000000000001'::uuid,
    '018d5c8e-5678-7001-9001-000000000009'::uuid,                       -- Référence usIdUser propriétaire (CamilleArchi).
    '2024-01-15 13:40:00',
    Null,
    'BOOK',
    'Vers une architecture - Le Corbusier',
    'vers-une-architecture-le-corbusier',
    'Le Corbusier',
    'https://unsplash.com',
    '{"isbn": "978-2081216570", "pages": 256, "year": 1923, "publisher": "Flammarion", "source_url": "https://amazon.fr"}'::jsonb,
    'L''architecture est le jeu savant, correct et magnificent des volumes assemblés sous la lumière. Les temps modernes imposent le plan libre.'
)
On Conflict Do Nothing;
