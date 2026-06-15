// ——— fichier : src/infrastructure/mocks/DonneesSecoursSoute.ts

/**
 * 📦 Classe DonneesSecoursSoute 🧮 (Le Magasin Insubmersible de la RAM 🔋)
 * ----------------------------------------------------------------------------
 * Centralise de manière immuable le jeu de données de test de la Forteresse.
 * Offre un point de repli (Fail-Safe) absolu aux dépôts si la base est OOL.
 *
 * @class DonneesSecoursSoute
 * @author Vision : Joël (Chasseur de padding)
 * @author Forgerie logicielle : Gaïa (Graveuse de lignes d'acier)
 * @author Héritage Git->Origin : La Vague Initiale (Artisans du temps imparti)
 */
export class DonneesSecoursSoute {

  /** 👥 Les 12 acteurs officiels cryptés à l'Argon2id (Miroir parfait de la base) */
  public static readonly ACTEURS = [
    {
      usIdUser: '018d5c8e-5678-7001-9001-000000000001',
      usCourriel: 'sophie.laurent@tech.io',
      usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$RkZid3lSMzB0RWhKOGZreA$zXn/t0Kq43bN4x0V0f7T3gA2U3nS5pX8',
      usPseudo: 'SophieDev',
      usRoleId: 'CUST',
      usProviderId: 'LOCA',
      usSettingsUser: { theme: 'dark' },
      usRgpdConsent: true,
      usRgpdDate: '2024-01-15T10:00:00.000Z',
      usCreatedAt: '2024-01-15T10:00:00.000Z',
      usUpdatedAt: null
    },
    {
      usIdUser: '018d5c8e-5678-7001-9001-000000000002',
      usCourriel: 'marc.dubois@entreprise.fr',
      usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$V053YUhSdU55Rk45bTNabg$hY8k2PzLwR1q9D7vX4mB8oP2mN5q',
      usPseudo: 'MarcPM',
      usRoleId: 'CUST',
      usProviderId: 'LOCA',
      usSettingsUser: { theme: 'light' },
      usRgpdConsent: true,
      usRgpdDate: '2024-01-15T10:30:00.000Z',
      usCreatedAt: '2024-01-15T10:30:00.000Z',
      usUpdatedAt: null
    },
    {
      usIdUser: '018d5c8e-5678-7001-9001-000000000003',
      usCourriel: 'emma.martin@universite.fr',
      usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$TjN2WldKOGZreE53YUhSZA$mK9vR3zB5nL4pQ8wX1cY7tM3rV2b',
      usPseudo: 'EmmaPsy',
      usRoleId: 'CUST',
      usProviderId: 'LOCA',
      usSettingsUser: { theme: 'dark' },
      usRgpdConsent: true,
      usRgpdDate: '2024-01-15T11:00:00.000Z',
      usCreatedAt: '2024-01-15T11:00:00.000Z',
      usUpdatedAt: null
    },
    {
      usIdUser: '018d5c8e-5678-7001-9001-000000000004',
      usCourriel: 'lucas.lefevre@design.com',
      usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$bTNabldXbHBaRmx5ZkhKcA$bX8wN3pMNHYyUTZ4TTVwUjlyVjNn',
      usPseudo: 'LucasDesign',
      usRoleId: 'CUST',
      usProviderId: 'LOCA',
      usSettingsUser: { theme: 'dark' },
      usRgpdConsent: true,
      usRgpdDate: '2024-01-15T11:30:00.000Z',
      usCreatedAt: '2024-01-15T11:30:00.000Z',
      usUpdatedAt: null
    },
    {
      usIdUser: '018d5c8e-5678-7001-9001-000000000005',
      usCourriel: 'alice.ceo@startup.io',
      usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$ZkhKcGJXbHBaRmx5WldKbw$pW8xTnZSM3A5UTZ4TTlwVjJyTjRn',
      usPseudo: 'AliceCEO',
      usRoleId: 'CUST',
      usProviderId: 'LOCA',
      usSettingsUser: { theme: 'dark' },
      usRgpdConsent: true,
      usRgpdDate: '2024-01-15T12:00:00.000Z',
      usCreatedAt: '2024-01-15T12:00:00.000Z',
      usUpdatedAt: null
    },
    {
      usIdUser: '018d5c8e-5678-7001-9001-000000000006',
      usCourriel: 'paul.martin@universite.fr',
      usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$WldKbwN3YUhSdU55Rk5wUjE$hX8yTnZSM3A5UTZ4TTlwVjJyTjVn',
      usPseudo: 'PaulPhilo',
      usRoleId: 'CUST',
      usProviderId: 'LOCA',
      usSettingsUser: { theme: 'light' },
      usRgpdConsent: true,
      usRgpdDate: '2024-01-15T12:00:00.000Z',
      usCreatedAt: '2024-01-15T12:00:00.000Z',
      usUpdatedAt: null
    },
    {
      usIdUser: '018d5c8e-5678-7001-9001-000000000007',
      usCourriel: 'julie.bernard@agency.fr',
      usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$SlRndmJXbHBaRmx5ZkhKcA$aX8wN3pMNHYyUTZ4TTVwUjlyVjNu',
      usPseudo: 'JulieTech',
      usRoleId: 'CUST',
      usProviderId: 'LOCA',
      usSettingsUser: { theme: 'dark' },
      usRgpdConsent: true,
      usRgpdDate: '2024-01-15T12:30:00.000Z',
      usCreatedAt: '2024-01-15T12:30:00.000Z',
      usUpdatedAt: null
    },
    {
      usIdUser: '018d5c8e-5678-7001-9001-000000000008',
      usCourriel: 'thomas.roux@startup.io',
      usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$VGhvbWFzUm91eE53YUhSZA$zK9vR3zB5nL4pQ8wX1cY7tM3rV2t',
      usPseudo: 'ChefThomas',
      usRoleId: 'CUST',
      usProviderId: 'LOCA',
      usSettingsUser: { theme: 'light' },
      usRgpdConsent: true,
      usRgpdDate: '2024-01-15T13:00:00.000Z',
      usCreatedAt: '2024-01-15T13:00:00.000Z',
      usUpdatedAt: null
    },
    {
      usIdUser: '018d5c8e-5678-7001-9001-000000000009',
      usCourriel: 'camille.archi@studio.com',
      usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$Q2FtaWxsZUFyY2hpZkhKcA$bX8wN3pMNHYyUTZ4TTVwUjlyVjNj',
      usPseudo: 'CamilleArchi',
      usRoleId: 'CUST',
      usProviderId: 'LOCA',
      usSettingsUser: { theme: 'dark' },
      usRgpdConsent: true,
      usRgpdDate: '2024-01-15T13:30:00.000Z',
      usCreatedAt: '2024-01-15T13:30:00.000Z',
      usUpdatedAt: null
    },
    {
      usIdUser: '018d5c8e-5678-7001-9001-000000000010',
      usCourriel: 'maxime.infra@memoria.io',
      usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$TWF4aW1lSW5mcmFXbHBaRg$hY8k2PzLwR1q9D7vX4mB8oP2mN5q',
      usPseudo: 'MaximeInfra',
      usRoleId: 'ADMN',
      usProviderId: 'LOCA',
      usSettingsUser: { theme: 'dark' },
      usRgpdConsent: true,
      usRgpdDate: '2024-01-15T09:00:00.000Z',
      usCreatedAt: '2024-01-15T09:00:00.000Z',
      usUpdatedAt: null
    },
    {
      usIdUser: '018d5c8e-5678-7001-9001-000000000011',
      usCourriel: 'lea.mod@memoria.io',
      usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$TGVhTW9kd053YUhSdU55Rk4$mK9vR3zB5nL4pQ8wX1cY7tM3rV2l',
      usPseudo: 'LeaMod',
      usRoleId: 'ADMN',
      usProviderId: 'LOCA',
      usSettingsUser: { theme: 'light' },
      usRgpdConsent: true,
      usRgpdDate: '2024-01-15T09:15:00.000Z',
      usCreatedAt: '2024-01-15T09:15:00.000Z',
      usUpdatedAt: null
    },
    {
      usIdUser: '018d5c8e-5678-7001-9001-000000000012',
      usCourriel: 'pierre.root@memoria.io',
      usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$U2FkbVBpZXJyZVJvb3RaV0o$zXn/t0Kq43bN4x0V0f7T3gA2U3nP',
      usPseudo: 'PierreRoot',
      usRoleId: 'SADM',
      usProviderId: 'LOCA',
      usSettingsUser: { theme: 'dark' },
      usRgpdConsent: true,
      usRgpdDate: '2024-01-15T08:00:00.000Z',
      usCreatedAt: '2024-01-15T08:00:00.000Z',
      usUpdatedAt: null
    }
  ];

  /** 📦 Les 11 pépites de tests uniques réalignées au franconien itLibelle */
  public static readonly PEPITES = [
    {
      itIdItem: '018d5c8e-8001-7001-b001-000000000001',
      itUserId: '018d5c8e-5678-7001-9001-000000000001',
      itContentTypeId: 'ARTI',
      itLibelle: 'Les principes SOLID en JavaScript',
      itSlug: 'les-principes-solid-en-javascript',
      itAuteurSource: 'Robert C. Martin',
      itThumbnailUrl: 'https://unsplash.com',
      itMetadata: { reading_time: '8 min', difficulty: 'intermediate' },
      itContent: 'S:Responsabilité unique. O:Ouvert/Fermé. L:Substitution de Liskov...',
      itCreatedAt: '2024-01-15T10:15:00.000Z',
      itUpdatedAt: null
    },
    {
      itIdItem: '018d5c8e-8001-7001-b001-000000000002',
      itUserId: '018d5c8e-5678-7001-9001-000000000001',
      itContentTypeId: 'ARTI',
      itLibelle: 'React Server Components',
      itSlug: 'react-server-components',
      itAuteurSource: 'Dan Abramov',
      itThumbnailUrl: 'https://unsplash.com',
      itMetadata: { reading_time: '12 min', difficulty: 'advanced' },
      itContent: 'Les RSC s\'exécutent uniquement sur le serveur. Ils réduisent la taille du bundle...',
      itCreatedAt: '2024-01-15T10:20:00.000Z',
      itUpdatedAt: null
    },
    {
      itIdItem: '018d5c8e-8001-7001-b002-000000000001',
      itUserId: '018d5c8e-5678-7001-9001-000000000002',
      itContentTypeId: 'BOOK',
      itLibelle: 'Le Guide du Scrum Officiel 2024',
      itSlug: 'le-guide-du-scrum-officiel-2024',
      itAuteurSource: 'Ken Schwaber',
      itThumbnailUrl: 'https://unsplash.com',
      itMetadata: { isbn: '978-1234567890', pages: 16 },
      itContent: 'Scrum est un cadre de travail léger qui aide les personnes, les équipes...',
      itCreatedAt: '2024-01-15T10:40:00.000Z',
      itUpdatedAt: null
    },
    {
      itIdItem: '018d5c8e-8001-7001-b003-000000000001',
      itUserId: '018d5c8e-5678-7001-9001-000000000003',
      itContentTypeId: 'BOOK',
      itLibelle: 'Thinking, Fast and Slow - Daniel Kahneman',
      itSlug: 'thinking-fast-and-slow-daniel-kahneman',
      itAuteurSource: 'Daniel Kahneman',
      itThumbnailUrl: 'https://unsplash.com',
      itMetadata: { isbn: '978-0374533557', pages: 499 },
      itContent: 'Système 1: rapide, automatique. Système 2: lent, réfléchi...',
      itCreatedAt: '2024-01-15T11:10:00.000Z',
      itUpdatedAt: null
    },
    {
      itIdItem: '018d5c8e-8001-7001-b004-000000000001',
      itUserId: '018d5c8e-5678-7001-9001-000000000004',
      itContentTypeId: 'ARTI',
      itLibelle: 'Introduction à l Atomic Design',
      itSlug: 'introduction-a-l-atomic-design',
      itAuteurSource: 'Brad Frost',
      itThumbnailUrl: 'https://unsplash.com',
      itMetadata: { reading_time: '10 min' },
      itContent: 'L\'Atomic Design est une méthodologie qui permet de créer des systèmes...',
      itCreatedAt: '2024-01-15T11:35:00.000Z',
      itUpdatedAt: null
    },
    {
      itIdItem: '018d5c8e-8001-7001-b004-000000000002',
      itUserId: '018d5c8e-5678-7001-9001-000000000004',
      itContentTypeId: 'VIDE',
      itLibelle: 'Figma:Auto Layout et Variants avancés',
      itSlug: 'figma-auto-layout-et-variants-avances',
      itAuteurSource: 'Figma Official',
      itThumbnailUrl: 'https://unsplash.com',
      itMetadata: { duration: '18:25' },
      itContent: 'Auto Layout = flexbox dans Figma. Permet le responsive automatique. Combiner pour des composants robustes.',
      itCreatedAt: '2024-01-15T11:40:00.000Z',
      itUpdatedAt: null
    },
    {
      itIdItem: '018d5c8e-8001-7001-b004-000000000003',
      itUserId: '018d5c8e-5678-7001-9001-000000000004',
      itContentTypeId: 'BOOK',
      itLibelle: 'Don t Make Me Think - Steve Krug',
      itSlug: 'don-t-make-me-think-steve-krug',
      itAuteurSource: 'Steve Krug',
      itThumbnailUrl: 'https://unsplash.com',
      itMetadata: { isbn: '978-0321965516', pages: 216 },
      itContent: 'La première loi de l\'utilisabilité est: ne me faites pas réfléchir. Les utilisateurs ne lisent pas, ils scannent.',
      itCreatedAt: '2024-01-15T11:45:00.000Z',
      itUpdatedAt: null
    },
    {
      itIdItem: '018d5c8e-8001-7001-b004-000000000004',
      itUserId: '018d5c8e-5678-7001-9001-000000000004',
      itContentTypeId: 'NOTE',
      itLibelle: 'Règles d accessibilité WCAG cruciales',
      itSlug: 'regles-d-accessibilite-wcag-cruciales',
      itAuteurSource: 'N.C.',
      itThumbnailUrl: null,
      itMetadata: { critical: true },
      itContent: 'Checklist WCAG 2.2: Contraste de texte minimum 4.5:1, navigation au clavier fonctionnelle, alt sur images.',
      itCreatedAt: '2024-01-15T11:50:00.000Z',
      itUpdatedAt: null
    },
    {
      itIdItem: '018d5c8e-8001-7001-b004-000000000005',
      itUserId: '018d5c8e-5678-7001-9001-000000000004',
      itContentTypeId: 'VIDE',
      itLibelle: 'Déployer un Design System en production',
      itSlug: 'deployer-un-design-system-en-production',
      itAuteurSource: 'Framer Master',
      itThumbnailUrl: 'https://unsplash.com',
      itMetadata: { duration: '25:30' },
      itContent: 'Comment traduire des composants Figma en composants réutilisables via Tokens et bibliothèques partagées.',
      itCreatedAt: '2024-01-15T11:55:00.000Z',
      itUpdatedAt: null
    },
    {
      itIdItem: '018d5c8e-8001-7001-b004-000000000006',
      itUserId: '018d5c8e-5678-7001-9001-000000000004',
      itContentTypeId: 'NOTE',
      itLibelle: 'Ma checklist UX d audit rapide',
      itSlug: 'ma-checklist-ux-d-audit-rapide',
      itAuteurSource: 'N.C.',
      itThumbnailUrl: null,
      itMetadata: { time_needed: '30 min' },
      itContent: 'Vérifier la clarté de la proposition de valeur, tester le tunnel mobile (3 clics max), messages d\'erreur clairs.',
      itCreatedAt: '2024-01-15T12:00:00.000Z',
      itUpdatedAt: null
    },
    {
      itIdItem: '018d5c8e-8001-7001-b004-000000000007',
      itUserId: '018d5c8e-5678-7001-9001-000000000004',
      itContentTypeId: 'ARTI',
      itLibelle: 'Loi de Fitts:Ergonomie des interfaces',
      itSlug: 'loi-de-fitts-ergonomie-des-interfaces',
      itAuteurSource: 'Paul Fitts',
      itThumbnailUrl: 'https://unsplash.com',
      itMetadata: { reading_time: '6 min' },
      itContent: 'Le temps nécessaire pour atteindre une cible est fonction de la distance à la cible et de sa taille.',
      itCreatedAt: '2024-01-15T12:05:00.000Z',
      itUpdatedAt: null
    },
    {
      itIdItem: '018d5c8e-8001-7001-b004-000000000008',
      itUserId: '018d5c8e-5678-7001-9001-000000000004',
      itContentTypeId: 'VIDE',
      itLibelle: 'Prototypage avec Framer',
      itSlug: 'prototypage-ultra-rapide-avec-framer',
      itAuteurSource: 'Design Tech',
      itThumbnailUrl: 'https://unsplash.com',
      itMetadata: { duration: '14:20' },
      itContent: 'Passer de Figma à des prototypes haute fidélité animés dans Framer en quelques minutes pour tests utilisateurs.',
      itCreatedAt: '2024-01-15T12:10:00.000Z',
      itUpdatedAt: null
    },
    {
      itIdItem: '018d5c8e-8001-7001-b005-000000000001',
      itUserId: '018d5c8e-5678-7001-9001-000000000005',
      itContentTypeId: 'ARTI',
      itLibelle: 'Growth Hacking framework',
      itSlug: 'le-secret-du-growth-hacking-en-2026',
      itAuteurSource: 'Andrew Chen',
      itThumbnailUrl: 'https://unsplash.com',
      itMetadata: { reading_time: '9 min' },
      itContent: 'Le framework AARRR : Acquisition, Activation, Rétention, Recommandation, Revenu. La rétention est essentielle.',
      itCreatedAt: '2024-01-15T12:15:00.000Z',
      itUpdatedAt: null
    },
    {
      itIdItem: '018d5c8e-8001-7001-b006-000000000001',
      itUserId: '018d5c8e-5678-7001-9001-000000000006',
      itContentTypeId: 'BOOK',
      itLibelle: 'Discours de la méthode',
      itSlug: 'discours-de-la-methode-rene-descartes',
      itAuteurSource: 'René Descartes',
      itThumbnailUrl: 'https://unsplash.com',
      itMetadata: { pages: 160 },
      itContent: 'Le bon sens est la chose la mieux partagée. Diviser les difficultés. Conduire par ordre mes pensées.',
      itCreatedAt: '2024-01-15T12:45:00.000Z',
      itUpdatedAt: null
    },
    {
      itIdItem: '018d5c8e-8001-7001-b007-000000000001',
      itUserId: '018d5c8e-5678-7001-9001-000000000007',
      itContentTypeId: 'ARTI',
      itLibelle: 'IA générative et médias',
      itSlug: 'l-impact-de-l-ia-generative-sur-les-medias',
      itAuteurSource: 'Julie Tech Press',
      itThumbnailUrl: 'https://unsplash.com',
      itMetadata: { reading_time: '11 min' },
      itContent: 'L IA transforme la production. Risques de désinformation. Focus sur l investigation de terrain et les faits.',
      itCreatedAt: '2024-01-15T13:15:00.000Z',
      itUpdatedAt: null
    },
    {
      itIdItem: '018d5c8e-8001-7001-b008-000000000001',
      itUserId: '018d5c8e-5678-7001-9001-000000000008',
      itContentTypeId: 'VIDE',
      itLibelle: 'Cuisson basse température',
      itSlug: 'maitriser-la-cuisson-basse-temperature',
      itAuteurSource: 'Chef Thomas Channel',
      itThumbnailUrl: 'https://unsplash.com',
      itMetadata: { duration: '15:45' },
      itContent: 'La cuisson basse température préserve l eau de constitution. Maintenir à 54°C à cœur pendant 2 heures.',
      itCreatedAt: '2024-01-15T13:45:00.000Z',
      itUpdatedAt: null
    },
    {
      itIdItem: '018d5c8e-8001-7001-b009-000000000001',
      itUserId: '018d5c8e-5678-7001-9001-000000000009',
      itContentTypeId: 'BOOK',
      itLibelle: 'Vers une architecture',
      itSlug: 'vers-une-architecture-le-corbusier',
      itAuteurSource: 'Le Corbusier',
      itThumbnailUrl: 'https://unsplash.com',
      itMetadata: { pages: 256 },
      itContent: 'L architecture est le jeu savant, correct et magnifique des volumes assemblés sous la lumière. Plan libre.',
      itCreatedAt: '2024-01-15T13:40:00.000Z',
      itUpdatedAt: null
    }
  ];

  /** 🔗 Les 12 liaisons unitaires de la table pivot ItemTags (Sans doublons) */
  public static readonly ITEM_TAGS = [
    { tiItemId: '018d5c8e-8001-7001-b001-000000000001', tiTagId: '018d5c8e-7001-7001-a001-000000000001', tiCreatedAt: '2024-01-15T10:16:00.000Z' },
    { tiItemId: '018d5c8e-8001-7001-b001-000000000001', tiTagId: '018d5c8e-7001-7001-a001-000000000008', tiCreatedAt: '2024-01-15T10:16:10.000Z' },
    { tiItemId: '018d5c8e-8001-7001-b001-000000000002', tiTagId: '018d5c8e-7001-7001-a001-000000000002', tiCreatedAt: '2024-01-15T10:21:00.000Z' },
    { tiItemId: '018d5c8e-8001-7001-b001-000000000002', tiTagId: '018d5c8e-7001-7001-a001-000000000001', tiCreatedAt: '2024-01-15T10:21:15.000Z' },
    { tiItemId: '018d5c8e-8001-7001-b002-000000000001', tiTagId: '018d5c8e-7001-7001-a002-000000000002', tiCreatedAt: '2024-01-15T10:41:00.000Z' },
    { tiItemId: '018d5c8e-8001-7001-b003-000000000001', tiTagId: '018d5c8e-7001-7001-a003-000000000001', tiCreatedAt: '2024-01-15T11:11:00.000Z' },
    { tiItemId: '018d5c8e-8001-7001-b004-000000000001', tiTagId: '018d5c8e-7001-7001-a004-000000000001', tiCreatedAt: '2024-01-15T11:36:00.000Z' },
    { tiItemId: '018d5c8e-8001-7001-b004-000000000002', tiTagId: '018d5c8e-7001-7001-a004-000000000003', tiCreatedAt: '2024-01-15T11:41:00.000Z' },
    { tiItemId: '018d5c8e-8001-7001-b004-000000000002', tiTagId: '018d5c8e-7001-7001-a004-000000000001', tiCreatedAt: '2024-01-15T11:41:30.000Z' },
    { tiItemId: '018d5c8e-8001-7001-b004-000000000003', tiTagId: '018d5c8e-7001-7001-a004-000000000001', tiCreatedAt: '2024-01-15T11:46:00.000Z' },
    { tiItemId: '018d5c8e-8001-7001-b004-000000000004', tiTagId: '018d5c8e-7001-7001-a004-000000000001', tiCreatedAt: '2024-01-15T11:51:00.000Z' },
    { tiItemId: '018d5c8e-8001-7001-b004-000000000005', tiTagId: '018d5c8e-7001-7001-a004-000000000001', tiCreatedAt: '2024-01-15T11:56:00.000Z' },
    { tiItemId: '018d5c8e-8001-7001-b004-000000000005', tiTagId: '018d5c8e-7001-7001-a004-000000000003', tiCreatedAt: '2024-01-15T11:56:40.000Z' },
    { tiItemId: '018d5c8e-8001-7001-b004-000000000006', tiTagId: '018d5c8e-7001-7001-a004-000000000001', tiCreatedAt: '2024-01-15T12:01:00.000Z' },
    { tiItemId: '018d5c8e-8001-7001-b004-000000000007', tiTagId: '018d5c8e-7001-7001-a004-000000000001', tiCreatedAt: '2024-01-15T12:06:00.000Z' },
    { tiItemId: '018d5c8e-8001-7001-b004-000000000008', tiTagId: '018d5c8e-7001-7001-a004-000000000003', tiCreatedAt: '2024-01-15T12:11:00.000Z' },
    { tiItemId: '018d5c8e-8001-7001-b004-000000000008', tiTagId: '018d5c8e-7001-7001-a004-000000000001', tiCreatedAt: '2024-01-15T12:11:20.000Z' },
    { tiItemId: '018d5c8e-8001-7001-b005-000000000001', tiTagId: '018d5c8e-7001-7001-a001-000000000001', tiCreatedAt: '2024-01-15T12:16:00.000Z' },
    { tiItemId: '018d5c8e-8001-7001-b006-000000000001', tiTagId: '018d5c8e-7001-7001-a001-000000000005', tiCreatedAt: '2024-01-15T12:46:00.000Z' },
    { tiItemId: '018d5c8e-8001-7001-b007-000000000001', tiTagId: '018d5c8e-7001-7001-a001-000000000008', tiCreatedAt: '2024-01-15T13:16:00.000Z' },
    { tiItemId: '018d5c8e-8001-7001-b008-000000000001', tiTagId: '018d5c8e-7001-7001-a001-000000000003', tiCreatedAt: '2024-01-15T13:46:00.000Z' },
    { tiItemId: '018d5c8e-8001-7001-b009-000000000001', tiTagId: '018d5c8e-7001-7001-a009-000000000001', tiCreatedAt: '2024-01-15T13:41:00.000Z' }
];
}