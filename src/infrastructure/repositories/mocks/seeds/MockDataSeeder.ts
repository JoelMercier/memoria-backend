// ——— fichier : src/infrastructure/repositories/mocks/seeds/MockDataSeeder.ts

import { MockUserRepository }    from '@/infrastructure/repositories/mocks/MockUserRepository';
import { MockTagRepository }     from '@/infrastructure/repositories/mocks/MockTagRepository';
import { MockItemRepository }    from '@/infrastructure/repositories/mocks/MockItemRepository';
import { MockItemTagRepository } from '@/infrastructure/repositories/mocks/MockItemTagRepository';
import { MockShareRepository }   from '@/infrastructure/repositories/mocks/MockShareRepository';
import { UserId, ItemId, TagId, ShareId } from '@/domain/value-objects/IdMetier';
import { ContentType }           from '@/constants/ContentType';
import { Role }                  from '@/constants/Role';
import { AuthProvider }          from '@/constants/AuthProvider';


/**
 * 🏺 Classe MockDataSeeder 🧮 (L Ensemenceur de RAM Impérial 🤖)
 * ----------------------------------------------------------------------------
 * Injecte de force le jeu de données officiel de l équipe dans la RAM des Mocks.
 * Émule PostgreSQL 17 à l index près pour les tests Domaines hors-ligne.
 *
 * @class MockDataSeeder
 * @author Vision : Joël (Virtual worker)
 * @author Frapperie du code : Gaïa (Gardienne du feu binaire)
 * @author Héritage Git->Origin : La Vague Initiale (Artisans du temps imparti)
 */
export class MockDataSeeder {
  /**
   * 🪓 Remplit les réservoirs de RAM avec les empreintes binaires officielles.
   */
  public static async Ensemencer(
    p_oUserRepo: MockUserRepository,
    p_oTagRepo: MockTagRepository,
    p_oItemRepo: MockItemRepository,
    p_oPivotRepo: MockItemTagRepository,
    p_oShareRepo: MockShareRepository
  ): Promise<void> {

    // ----------------------------------------------------------------------------
    // 👥 1. INJECTION DE TOUS LES ACTEURS (12 Users)
    // ----------------------------------------------------------------------------
    const l_oIdSophie = new UserId(Buffer.from('018d5c8e567870019001000000000001', 'hex'));
    const l_oIdMarc   = new UserId(Buffer.from('018d5c8e567870019001000000000002', 'hex'));
    const l_oIdEmma   = new UserId(Buffer.from('018d5c8e567870019001000000000003', 'hex'));
    const l_oIdLucas  = new UserId(Buffer.from('018d5c8e567870019001000000000004', 'hex'));
    const l_oIdAlice  = new UserId(Buffer.from('018d5c8e567870019001000000000005', 'hex'));
    const l_oIdPaul   = new UserId(Buffer.from('018d5c8e567870019001000000000006', 'hex'));
    const l_oIdJulie  = new UserId(Buffer.from('018d5c8e567870019001000000000007', 'hex'));
    const l_oIdThomas = new UserId(Buffer.from('018d5c8e567870019001000000000008', 'hex'));
    const l_oIdCamille= new UserId(Buffer.from('018d5c8e567870019001000000000009', 'hex'));
    const l_oIdMaxime = new UserId(Buffer.from('018d5c8e567870019001000000000010', 'hex'));
    const l_oIdLea    = new UserId(Buffer.from('018d5c8e567870019001000000000011', 'hex'));
    const l_oIdPierre = new UserId(Buffer.from('018d5c8e567870019001000000000012', 'hex'));

    await p_oUserRepo.create({ idUser: l_oIdSophie, usPseudo: 'SophieDev', usCourriel: 'sophie.laurent@tech.io', usPasswordHash: '$2b$10$X7', usRoleId: Role.CUST, usProviderId: AuthProvider.LOCAL, usSettingsUser: { theme: 'dark' }, usGdprConsent: true, usGdprDate: new Date('2024-01-15 10:00:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdMarc, usPseudo: 'MarcPM', usCourriel: 'marc.dubois@entreprise.fr', usPasswordHash: '$2b$10$Y8', usRoleId: Role.CUST, usProviderId: AuthProvider.LOCAL, usSettingsUser: { theme: 'light' }, usGdprConsent: true, usGdprDate: new Date('2024-01-15 10:30:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdEmma, usPseudo: 'EmmaPsy', usCourriel: 'emma.martin@universite.fr', usPasswordHash: '$2b$10$Z9', usRoleId: Role.CUST, usProviderId: AuthProvider.LOCAL, usSettingsUser: { theme: 'dark' }, usGdprConsent: true, usGdprDate: new Date('2024-01-15 11:00:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdLucas, usPseudo: 'LucasDesign', usCourriel: 'lucas.lefevre@design.com', usPasswordHash: '$2b$10$W6', usRoleId: Role.CUST, usProviderId: AuthProvider.LOCAL, usSettingsUser: { theme: 'dark' }, usGdprConsent: true, usGdprDate: new Date('2024-01-15 11:30:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdAlice, usPseudo: 'AliceCEO', usCourriel: 'alice.ceo@startup.io', usPasswordHash: '$2b$10$A1', usRoleId: Role.CUST, usProviderId: AuthProvider.LOCAL, usSettingsUser: { theme: 'dark' }, usGdprConsent: true, usGdprDate: new Date('2024-01-15 12:00:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdPaul, usPseudo: 'PaulPhilo', usCourriel: 'paul.martin@universite.fr', usPasswordHash: '$2b$10$P1', usRoleId: Role.CUST, usProviderId: AuthProvider.LOCAL, usSettingsUser: { theme: 'light' }, usGdprConsent: true, usGdprDate: new Date('2024-01-15 12:00:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdJulie, usPseudo: 'JulieTech', usCourriel: 'julie.bernard@agency.fr', usPasswordHash: '$2b$10$J2', usRoleId: Role.CUST, usProviderId: AuthProvider.LOCAL, usSettingsUser: { theme: 'dark' }, usGdprConsent: true, usGdprDate: new Date('2024-01-15 12:30:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdThomas, usPseudo: 'ChefThomas', usCourriel: 'thomas.roux@startup.io', usPasswordHash: '$2b$10$T3', usRoleId: Role.CUST, usProviderId: AuthProvider.LOCAL, usSettingsUser: { theme: 'light' }, usGdprConsent: true, usGdprDate: new Date('2024-01-15 13:00:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdCamille, usPseudo: 'CamilleArchi', usCourriel: 'camille.archi@studio.com', usPasswordHash: '$2b$10$C4', usRoleId: Role.CUST, usProviderId: AuthProvider.LOCAL, usSettingsUser: { theme: 'dark' }, usGdprConsent: true, usGdprDate: new Date('2024-01-15 13:30:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdMaxime, usPseudo: 'MaximeInfra', usCourriel: 'maxime.infra@memoria.io', usPasswordHash: '$2b$10$M5', usRoleId: Role.ADMN, usProviderId: AuthProvider.LOCAL, usSettingsUser: { theme: 'dark' }, usGdprConsent: true, usGdprDate: new Date('2024-01-15 09:00:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdLea, usPseudo: 'LeaMod', usCourriel: 'lea.mod@memoria.io', usPasswordHash: '$2b$10$L6', usRoleId: Role.ADMN, usProviderId: AuthProvider.LOCAL, usSettingsUser: { theme: 'light' }, usGdprConsent: true, usGdprDate: new Date('2024-01-15 09:15:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdPierre, usPseudo: 'PierreRoot', usCourriel: 'pierre.root@memoria.io', usPasswordHash: '$2b$10$R7', usRoleId: Role.SADM, usProviderId: AuthProvider.LOCAL, usSettingsUser: { theme: 'dark' }, usGdprConsent: true, usGdprDate: new Date('2024-01-15 08:00:00') } as any);

    // ----------------------------------------------------------------------------
    // 🏷️ 2. INJECTION DE TOUTES LES ÉTIQUETTES (12 Tags)
    // ----------------------------------------------------------------------------
    const l_oIdTagJs     = new TagId(Buffer.from('018d5c8e70017001a001000000000001', 'hex'));
    const l_oIdTagReact  = new TagId(Buffer.from('018d5c8e70017001a001000000000002', 'hex'));
    const l_oIdTagNode   = new TagId(Buffer.from('018d5c8e70017001a001000000000003', 'hex'));
    const l_oIdTagArchi  = new TagId(Buffer.from('018d5c8e70017001a001000000000005', 'hex'));
    const l_oIdTagClean  = new TagId(Buffer.from('018d5c8e70017001a001000000000008', 'hex'));
    const l_oIdTagGest   = new TagId(Buffer.from('018d5c8e70017001a002000000000001', 'hex'));
    const l_oIdTagAgile  = new TagId(Buffer.from('018d5c8e70017001a002000000000002', 'hex'));
    const l_oIdTagPsy    = new TagId(Buffer.from('018d5c8e70017001a003000000000001', 'hex'));
    const l_oIdTagMemo   = new TagId(Buffer.from('018d5c8e70017001a003000000000003', 'hex'));
    const l_oIdTagUx     = new TagId(Buffer.from('018d5c8e70017001a004000000000001', 'hex'));
    const l_oIdTagFigma  = new TagId(Buffer.from('018d5c8e70017001a004000000000003', 'hex'));
    const l_oIdTagCamAr  = new TagId(Buffer.from('018d5c8e70017001a009000000000001', 'hex'));

    await p_oTagRepo.create({ idTag: l_oIdTagJs, tgUserId: l_oIdSophie, tgName: 'javascript' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagReact, tgUserId: l_oIdSophie, tgName: 'react' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagNode, tgUserId: l_oIdSophie, tgName: 'node.js' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagArchi, tgUserId: l_oIdSophie, tgName: 'architecture' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagClean, tgUserId: l_oIdSophie, tgName: 'clean code' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagGest, tgUserId: l_oIdMarc, tgName: 'gestion de projet' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagAgile, tgUserId: l_oIdMarc, tgName: 'agile' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagPsy, tgUserId: l_oIdEmma, tgName: 'psychologie cognitive' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagMemo, tgUserId: l_oIdEmma, tgName: 'mémoire' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagUx, tgUserId: l_oIdLucas, tgName: 'ux design' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagFigma, tgUserId: l_oIdLucas, tgName: 'figma' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagCamAr, tgUserId: l_oIdCamille, tgName: 'architecture moderna' } as any);
    // ----------------------------------------------------------------------------
    // 📦 3. INJECTION DE TOUTES LES PÉPITES (18 Items dédoublonnés)
    // ----------------------------------------------------------------------------
    const l_oIdItemSolid = new ItemId(Buffer.from('018d5c8e80017001b001000000000001', 'hex'));
    const l_oIdItemRsc   = new ItemId(Buffer.from('018d5c8e80017001b001000000000002', 'hex'));
    const l_oIdItemScrum = new ItemId(Buffer.from('018d5c8e80017001b002000000000001', 'hex'));
    const l_oIdItemKahn  = new ItemId(Buffer.from('018d5c8e80017001b003000000000001', 'hex'));
    const l_oIdItemAtom  = new ItemId(Buffer.from('018d5c8e80017001b004000000000001', 'hex'));
    const l_oIdItemLayout= new ItemId(Buffer.from('018d5c8e80017001b004000000000002', 'hex'));
    const l_oIdItemKrug  = new ItemId(Buffer.from('018d5c8e80017001b004000000000003', 'hex'));
    const l_oIdItemWcag  = new ItemId(Buffer.from('018d5c8e80017001b004000000000004', 'hex'));
    const l_oIdItemSys   = new ItemId(Buffer.from('018d5c8e80017001b004000000000005', 'hex'));
    const l_oIdItemUxCh  = new ItemId(Buffer.from('018d5c8e80017001b004000000000006', 'hex'));
    const l_oIdItemFitts = new ItemId(Buffer.from('018d5c8e80017001b004000000000007', 'hex'));
    const l_oIdItemFram  = new ItemId(Buffer.from('018d5c8e80017001b004000000000008', 'hex'));
    const l_oIdItemLean  = new ItemId(Buffer.from('018d5c8e80017001b005000000000001', 'hex'));
    const l_oIdItemGrowth= new ItemId(Buffer.from('018d5c8e80017001b005000000000002', 'hex'));
    const l_oIdItemDesca = new ItemId(Buffer.from('018d5c8e80017001b006000000000001', 'hex'));
    const l_oIdItemPress = new ItemId(Buffer.from('018d5c8e80017001b007000000000001', 'hex'));
    const l_oIdItemCuis  = new ItemId(Buffer.from('018d5c8e80017001b008000000000001', 'hex'));
    const l_oIdItemCorbu = new ItemId(Buffer.from('018d5c8e80017001b009000000000001', 'hex'));

    await p_oItemRepo.create({ itIdItem: l_oIdItemSolid, itUserId: l_oIdSophie, itContentTypeId: ContentType.ARTICLE, itTitle: 'Les principes SOLID en JavaScript', itSlug: 'les-principes-solid-en-javascript', itSourceAuthor: 'Robert C. Martin', itThumbnailUrl: 'https://unsplash.com', itMetadata: { reading_time: '8 min' }, itContent: 'S : Responsabilité unique. O : Ouvert/Fermé. L : Substitution de Liskov.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemRsc, itUserId: l_oIdSophie, itContentTypeId: ContentType.ARTICLE, itTitle: 'React Server Components', itSlug: 'react-server-components', itSourceAuthor: 'Dan Abramov', itThumbnailUrl: 'https://unsplash.com', itMetadata: { reading_time: '12 min' }, itContent: 'Les RSC s exécutent uniquement sur le serveur. Ils réduisent la taille du bundle JavaScript.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemScrum, itUserId: l_oIdMarc, itContentTypeId: ContentType.LIVRE, itTitle: 'Le Guide du Scrum Officiel 2024', itSlug: 'le-guide-du-scrum-officiel-2024', itSourceAuthor: 'Ken Schwaber', itThumbnailUrl: 'https://unsplash.com', itMetadata: { pages: 16 }, itContent: 'Scrum est un cadre de travail léger qui aide les personnes et les équipes.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemKahn, itUserId: l_oIdEmma, itContentTypeId: ContentType.LIVRE, itTitle: 'Thinking, Fast and Slow - Daniel Kahneman', itSlug: 'thinking-fast-and-slow-daniel-kahneman', itSourceAuthor: 'Daniel Kahneman', itThumbnailUrl: 'https://unsplash.com', itMetadata: { pages: 499 }, itContent: 'Système 1 : rapide, automatique, émotionnel. Système 2 : lent, réfléchi, logique.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemAtom, itUserId: l_oIdLucas, itContentTypeId: ContentType.ARTICLE, itTitle: 'Introduction à l Atomic Design', itSlug: 'introduction-a-l-atomic-design', itSourceAuthor: 'Brad Frost', itThumbnailUrl: 'https://unsplash.com', itMetadata: { reading_time: '10 min' }, itContent: 'L Atomic Design est une méthodologie qui permet de créer des systèmes de conception de manière hiérarchique.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemLayout, itUserId: l_oIdLucas, itContentTypeId: ContentType.VIDEO, itTitle: 'Figma : Auto Layout et Variants avancés', itSlug: 'figma-auto-layout-et-variants-avances', itSourceAuthor: 'Figma Official', itThumbnailUrl: 'https://unsplash.com', itMetadata: { duration: '18:25' }, itContent: 'Auto Layout = flexbox dans Figma. Permet le responsive automatique.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemKrug, itUserId: l_oIdLucas, itContentTypeId: ContentType.LIVRE, itTitle: 'Don t Make Me Think - Steve Krug', itSlug: 'don-t-make-me-think-steve-krug', itSourceAuthor: 'Steve Krug', itThumbnailUrl: 'https://unsplash.com', itMetadata: { pages: 216 }, itContent: 'La première loi de l utilisabilité est : ne me faites pas réfléchir. Un site web doit être évident.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemWcag, itUserId: l_oIdLucas, itContentTypeId: ContentType.NOTE, itTitle: 'Règles d accessibilité WCAG cruciales', itSlug: 'regles-d-accessibilite-wcag-cruciales', itSourceAuthor: 'N.C', itThumbnailUrl: null, itMetadata: { critical: true }, itContent: 'Checklist WCAG 2.2 : 1) Contraste de texte minimum 4.5:1. 2) Navigation au clavier fonctionnelle.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemSys, itUserId: l_oIdLucas, itContentTypeId: ContentType.VIDEO, itTitle: 'Déployer un Design System en production', itSlug: 'deployer-un-design-system-en-production', itSourceAuthor: 'Framer Master', itThumbnailUrl: 'https://unsplash.com', itMetadata: { duration: '25:30' }, itContent: 'Comment traduire des composants Figma en composants réutilisables via Tokens et bibliothèques partagées.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemUxCh, itUserId: l_oIdLucas, itContentTypeId: ContentType.NOTE, itTitle: 'Ma checklist UX d audit rapide', itSlug: 'ma-checklist-ux-d-audit-rapide', itSourceAuthor: 'N.C', itThumbnailUrl: null, itMetadata: { checklist_items: 12 }, itContent: 'Vérifier la clarté de la proposition de valeur en haut de page, tester le tunnel de conversion.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemFitts, itUserId: l_oIdLucas, itContentTypeId: ContentType.ARTICLE, itTitle: 'Loi de Fitts : Ergonomie des interfaces', itSlug: 'loi-de-fitts-ergonomie-des-interfaces', itSourceAuthor: 'Paul Fitts', itThumbnailUrl: 'https://unsplash.com', itMetadata: { law_year: 1954 }, itContent: 'Le temps nécessaire pour atteindre une cible est fonction de la distance à la cible et de sa taille.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemFram, itUserId: l_oIdLucas, itContentTypeId: ContentType.VIDEO, itTitle: 'Prototypage ultra-rapide avec Framer', itSlug: 'prototypage-ultra-rapide-avec-framer', itSourceAuthor: 'Design Tech', itThumbnailUrl: 'https://unsplash.com', itMetadata: { duration: '14:20' }, itContent: 'Passer de Figma à des prototypes haute fidélité animés dans Framer en quelques minutes.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemLean, itUserId: l_oIdAlice, itContentTypeId: ContentType.LIVRE, itTitle: 'The Lean Startup - Eric Ries', itSlug: 'the-lean-startup-eric-ries', itSourceAuthor: 'Eric Ries', itThumbnailUrl: null, itMetadata: { pages: 336 }, itContent: 'Méthodologie MVP (Minimum Viable Product). Boucle Construire-Mesurer-Apprendre.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemGrowth, itUserId: l_oIdAlice, itContentTypeId: ContentType.ARTICLE, itTitle: 'Le secret du Growth Hacking en 2026', itSlug: 'le-secret-du-growth-hacking-en-2026', itSourceAuthor: 'Andrew Chen', itThumbnailUrl: 'https://unsplash.com', itMetadata: { reading_time: '9 min' }, itContent: 'Le growth hacking repose sur le framework AARRR : Acquisition, Activation, Rétention.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemDesca, itUserId: l_oIdPaul, itContentTypeId: ContentType.LIVRE, itTitle: 'Discours de la méthode - René Descartes', itSlug: 'discours-de-la-methode-rene-descartes', itSourceAuthor: 'René Descartes', itThumbnailUrl: 'https://unsplash.com', itMetadata: { pages: 160 }, itContent: 'Le bon sens est la chose du monde la mieux partagée. Les quatre règles : 1) Ne recevoir jamais.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemPress, itUserId: l_oIdJulie, itContentTypeId: ContentType.ARTICLE, itTitle: 'L impact de l IA générative sur les médias', itSlug: 'l-impact-de-l-ia-generative-sur-les-medias', itSourceAuthor: 'Julie Tech Press', itThumbnailUrl: 'https://unsplash.com', itMetadata: { reading_time: '11 min' }, itContent: 'L intelligence artificielle transforme la production d articles. Risques de désinformation de masse.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemCuis, itUserId: l_oIdThomas, itContentTypeId: ContentType.VIDEO, itTitle: 'Maîtriser la cuisson basse température', itSlug: 'maitriser-la-cuisson-basse-temperature', itSourceAuthor: 'Chef Thomas Channel', itThumbnailUrl: 'https://unsplash.com', itMetadata: { duration: '15:45' }, itContent: 'La cuisson basse température préserve l eau de constitution des aliments.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemCorbu, itUserId: l_oIdCamille, itContentTypeId: ContentType.LIVRE, itTitle: 'Vers une architecture - Le Corbusier', itSlug: 'vers-une-architecture-le-corbusier', itSourceAuthor: 'Le Corbusier', itThumbnailUrl: 'https://unsplash.com', itMetadata: { pages: 256 }, itContent: 'L architecture est le jeu savant, correct et magnifique des volumes assemblés sous la lumière.' } as any);

  // ----------------------------------------------------------------------------
  // 🔗 4. FUSION DES PIVOTS (22 ItemTags Many-to-Many - Dédoublonnés)
  // ----------------------------------------------------------------------------
  await p_oPivotRepo.add(l_oIdItemSolid, l_oIdTagJs);
  await p_oPivotRepo.add(l_oIdItemSolid, l_oIdTagClean);
  await p_oPivotRepo.add(l_oIdItemRsc, l_oIdTagReact);
  await p_oPivotRepo.add(l_oIdItemRsc, l_oIdTagJs);
  await p_oPivotRepo.add(l_oIdItemScrum, l_oIdTagAgile);
    await p_oPivotRepo.add(l_oIdItemKahn, l_oIdTagPsy);
    await p_oPivotRepo.add(l_oIdItemAtom, l_oIdTagUx);
    await p_oPivotRepo.add(l_oIdItemLayout, l_oIdTagFigma);
    await p_oPivotRepo.add(l_oIdItemLayout, l_oIdTagUx);
    await p_oPivotRepo.add(l_oIdItemKrug, l_oIdTagUx);
    await p_oPivotRepo.add(l_oIdItemWcag, l_oIdTagUx);
    await p_oPivotRepo.add(l_oIdItemSys, l_oIdTagUx);
    await p_oPivotRepo.add(l_oIdItemSys, l_oIdTagFigma);
    await p_oPivotRepo.add(l_oIdItemUxCh, l_oIdTagUx);
    await p_oPivotRepo.add(l_oIdItemFitts, l_oIdTagUx);
    await p_oPivotRepo.add(l_oIdItemFram, l_oIdTagFigma);
    await p_oPivotRepo.add(l_oIdItemFram, l_oIdTagUx);
    await p_oPivotRepo.add(l_oIdItemGrowth, l_oIdTagJs);
    await p_oPivotRepo.add(l_oIdItemDesca, l_oIdTagArchi);
    await p_oPivotRepo.add(l_oIdItemPress, l_oIdTagClean);
    await p_oPivotRepo.add(l_oIdItemCuis, l_oIdTagNode);
    await p_oPivotRepo.add(l_oIdItemCorbu, l_oIdTagCamAr);

    // ----------------------------------------------------------------------------
    // 🛰️ 5. COULAGE DES PASSERELLES (2 Shares Officiels - Double Injection de l ID)
    // ----------------------------------------------------------------------------
    const l_oIdShareSophie = new ShareId(Buffer.from('018d5c8e90017001c001000000000001', 'hex'));
    const l_oIdShareMarc   = new ShareId(Buffer.from('018d5c8e90017001c002000000000001', 'hex'));

    // Éradication du doublon de propriété et alignement sémantique du propriétaire sur l'interface
    await p_oShareRepo.create({ idShare: l_oIdShareSophie, shIdShare: l_oIdShareSophie, shItemId: l_oIdItemSolid, shCourrielDest: 'marc.dubois@entreprise.fr', shJeton: 'tok_share_sophie_marc_001', shConfiguration: { level: 'read', allow_download: false } } as any);
    await p_oShareRepo.create({ idShare: l_oIdShareMarc  , shIdShare: l_oIdShareMarc  , shItemId: l_oIdItemScrum, shCourrielDest: 'sophie.laurent@tech.io', shJeton: 'tok_share_marc_sophie_001', shConfiguration: { level: 'read', allow_download: true } } as any);
  }
}

