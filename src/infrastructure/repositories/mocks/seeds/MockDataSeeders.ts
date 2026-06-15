// ——— fichier : src/infrastructure/repositories/mocks/seeds/MockDataSeeders.ts

import { UserId, ItemId, TagId, ShareId, EventId } from '@/domain/value-objects/ids';

import { Action }                from '@/constants/Actions';
import { AuthProvider }          from '@/constants/AuthProviders';
import { Categorie }             from '@/constants/Categories';
import { ContentType }           from '@/constants/ContentTypes';
import { Role }                  from '@/constants/Roles';
import { Secteur }               from '@/constants/Secteurs';
import { Severite }              from '@/constants/Severites';
import { MockItemRepository }    from '@/infrastructure/repositories/mocks/MockItemRepository';
import { MockItemTagRepository } from '@/infrastructure/repositories/mocks/MockItemTagRepository';
import { MockShareRepository }   from '@/infrastructure/repositories/mocks/MockShareRepository';
import { MockTagRepository }     from '@/infrastructure/repositories/mocks/MockTagRepository';
import { MockUserRepository }    from '@/infrastructure/repositories/mocks/MockUserRepository';
import { MockEventRepository }   from '@/infrastructure/repositories/mocks/MockEventRepository'; // 🔒 Le voilà !

/**
 * 🏺 Classe MockDataSeeder 🧮 (Le Déployeur de Secours de la RAM 🔋)
 * ----------------------------------------------------------------------------
 * Injecte de force le jeu de données officiel de l'équipe dans la RAM des Mocks.
 * Émule PostgreSQL 17 au bit près pour les stratégies de repli hors-ligne (OOL).
 *
 * @class MockDataSeeder
 * @author Génie Logiciel : Joël (Chasseur de padding)
 * @author Forgerie logicielle : Gaïa (Graveuse de lignes d'acier)
 * @author Héritage Git->Origin : La Vague Initiale (Artisans de la Vague Alpha)
 */
export class MockDataSeeder {
  /**
   * 🪓 Remplit les réservoirs de RAM avec les empreintes textuelles UUID officielles.
   */
  public static async Ensemencer(
    p_oUserRepo: MockUserRepository,
    p_oTagRepo: MockTagRepository,
    p_oItemRepo: MockItemRepository,
    p_oPivotRepo: MockItemTagRepository,
    p_oShareRepo: MockShareRepository,
    p_oEventRepo: MockEventRepository // 🪓 Raccordement du tuyau d'audit !
  ): Promise<void> {

    // ----------------------------------------------------------------------------
    // 👥 1. INJECTION DE TOUS LES ACTEURS (12 Users) - Alignement UUID Natif Textuel
    // ----------------------------------------------------------------------------
    const l_oIdSophie = new UserId('018d5c8e-5678-7001-9001-000000000001'); // [RÉPARÉ V4] Plus de Buffer binaire de feignant !
    const l_oIdMarc   = new UserId('018d5c8e-5678-7001-9001-000000000002');
    const l_oIdEmma   = new UserId('018d5c8e-5678-7001-9001-000000000003');
    const l_oIdLucas  = new UserId('018d5c8e-5678-7001-9001-000000000004');
    const l_oIdAlice  = new UserId('018d5c8e-5678-7001-9001-000000000005');
    const l_oIdPaul   = new UserId('018d5c8e-5678-7001-9001-000000000006');
    const l_oIdJulie  = new UserId('018d5c8e-5678-7001-9001-000000000007');
    const l_oIdThomas = new UserId('018d5c8e-5678-7001-9001-000000000008');
    const l_oIdCamille= new UserId('018d5c8e-5678-7001-9001-000000000009');
    const l_oIdMaxime = new UserId('018d5c8e-5678-7001-9001-000000000010');
    const l_oIdLea    = new UserId('018d5c8e-5678-7001-9001-000000000011');
    const l_oIdPierre = new UserId('018d5c8e-5678-7001-9001-000000000012');

    // Injection des records d'acteurs avec vrais hashs Argon2id uniques et clés franconiennes (Rule 3)
    await p_oUserRepo.create({ idUser: l_oIdSophie, usPseudo: 'SophieDev',    usCourriel: 'sophie.laurent@tech.io',     usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$RkZid3lSMzB0RWhKOGZreA$zXn/t0Kq43bN4x0V0f7T3gA2U3nS5pX8', usRoleId: Role.CUST.code, usProviderId: AuthProvider.LOCAL.code, usSettingsUser: { theme: 'dark' },  usRgpdConsent: true, usRgpdDate: new Date('2024-01-15 10:00:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdMarc,   usPseudo: 'MarcPM',       usCourriel: 'marc.dubois@entreprise.fr',  usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$V053YUhSdU55Rk45bTNabg$hY8k2PzLwR1q9D7vX4mB8oP2mN5q', usRoleId: Role.CUST.code, usProviderId: AuthProvider.LOCAL.code, usSettingsUser: { theme: 'light' }, usRgpdConsent: true, usRgpdDate: new Date('2024-01-15 10:30:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdEmma,   usPseudo: 'EmmaPsy',      usCourriel: 'emma.martin@universite.fr',  usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$TjN2WldKOGZreE53YUhSZA$mK9vR3zB5nL4pQ8wX1cY7tM3rV2b', usRoleId: Role.CUST.code, usProviderId: AuthProvider.LOCAL.code, usSettingsUser: { theme: 'dark' },  usRgpdConsent: true, usRgpdDate: new Date('2024-01-15 11:00:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdLucas,  usPseudo: 'LucasDesign',  usCourriel: 'lucas.lefevre@design.com',   usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$bTNabldXbHBaRmx5ZkhKcA$bX8wN3pMNHYyUTZ4TTVwUjlyVjNn', usRoleId: Role.CUST.code, usProviderId: AuthProvider.LOCAL.code, usSettingsUser: { theme: 'dark' },  usRgpdConsent: true, usRgpdDate: new Date('2024-01-15 11:30:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdAlice,  usPseudo: 'AliceCEO',     usCourriel: 'alice.ceo@startup.io',       usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$ZkhKcGJXbHBaRmx5WldKbw$pW8xTnZSM3A5UTZ4TTlwVjJyTjRn', usRoleId: Role.CUST.code, usProviderId: AuthProvider.LOCAL.code, usSettingsUser: { theme: 'dark' },  usRgpdConsent: true, usRgpdDate: new Date('2024-01-15 12:00:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdPaul,   usPseudo: 'PaulPhilo',    usCourriel: 'paul.martin@universite.fr',  usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$WldKbwN3YUhSdU55Rk5wUjE$hX8yTnZSM3A5UTZ4TTlwVjJyTjVn', usRoleId: Role.CUST.code, usProviderId: AuthProvider.LOCAL.code, usSettingsUser: { theme: 'light' }, usRgpdConsent: true, usRgpdDate: new Date('2024-01-15 12:00:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdJulie,  usPseudo: 'JulieTech',    usCourriel: 'julie.bernard@agency.fr',    usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$SlRndmJXbHBaRmx5ZkhKcA$aX8wN3pMNHYyUTZ4TTVwUjlyVjNu', usRoleId: Role.CUST.code, usProviderId: AuthProvider.LOCAL.code, usSettingsUser: { theme: 'dark' },  usRgpdConsent: true, usRgpdDate: new Date('2024-01-15 12:30:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdThomas, usPseudo: 'ChefThomas',   usCourriel: 'thomas.roux@startup.io',     usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$VGhvbWFzUm91eE53YUhSZA$zK9vR3zB5nL4pQ8wX1cY7tM3rV2t', usRoleId: Role.CUST.code, usProviderId: AuthProvider.LOCAL.code, usSettingsUser: { theme: 'light' }, usRgpdConsent: true, usRgpdDate: new Date('2024-01-15 13:00:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdCamille,usPseudo: 'CamilleArchi', usCourriel: 'camille.archi@studio.com',   usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$Q2FtaWxsZUFyY2hpZkhKcA$bX8wN3pMNHYyUTZ4TTVwUjlyVjNj', usRoleId: Role.CUST.code, usProviderId: AuthProvider.LOCAL.code, usSettingsUser: { theme: 'dark' },  usRgpdConsent: true, usRgpdDate: new Date('2024-01-15 13:30:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdMaxime, usPseudo: 'MaximeInfra',  usCourriel: 'maxime.infra@memoria.io',    usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$TWF4aW1lSW5mcmFXbHBaRg$hY8k2PzLwR1q9D7vX4mB8oP2mN5m', usRoleId: Role.ADMN.code, usProviderId: AuthProvider.LOCAL.code, usSettingsUser: { theme: 'dark' },  usRgpdConsent: true, usRgpdDate: new Date('2024-01-15 09:00:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdLea,    usPseudo: 'LeaMod',       usCourriel: 'lea.mod@memoria.io',         usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$TGVhTW9kd053YUhSdU55Rk4$mK9vR3zB5nL4pQ8wX1cY7tM3rV2l', usRoleId: Role.ADMN.code, usProviderId: AuthProvider.LOCAL.code, usSettingsUser: { theme: 'light' }, usRgpdConsent: true, usRgpdDate: new Date('2024-01-15 09:15:00') } as any);
    await p_oUserRepo.create({ idUser: l_oIdPierre, usPseudo: 'PierreRoot',   usCourriel: 'pierre.root@memoria.io',     usPasswordHash: '$argon2id$v=19$m=65536,t=3,p=4$U2FkbVBpZXJyZVJvb3RaV0o$zXn/t0Kq43bN4x0V0f7T3gA2U3nP', usRoleId: Role.SADM.code, usProviderId: AuthProvider.LOCAL.code, usSettingsUser: { theme: 'dark' },  usRgpdConsent: true, usRgpdDate: new Date('2024-01-15 08:00:00') } as any);
    // ----------------------------------------------------------------------------
    // 🏷️ 2. INJECTION DE TOUTES LES ÉTIQUETTES (12 Tags unifiés en UUID texte)
    // ----------------------------------------------------------------------------
    const l_oIdTagJs      = new TagId('018d5c8e-7001-7001-a001-000000000001'); // [RÉPARÉ V4] UUID natif en ligne droite.
    const l_oIdTagReact   = new TagId('018d5c8e-7001-7001-a001-000000000002');
    const l_oIdTagNode    = new TagId('018d5c8e-7001-7001-a001-000000000003');
    const l_oIdTagArchi   = new TagId('018d5c8e-7001-7001-a001-000000000005');
    const l_oIdTagClean   = new TagId('018d5c8e-7001-7001-a001-000000000008');
    const l_oIdTagGest    = new TagId('018d5c8e-7001-7001-a002-000000000001');
    const l_oIdTagAgile   = new TagId('018d5c8e-7001-7001-a002-000000000002');
    const l_oIdTagPsy     = new TagId('018d5c8e-7001-7001-a003-000000000001');
    const l_oIdTagMemo    = new TagId('018d5c8e-7001-7001-a003-000000000003');
    const l_oIdTagUx      = new TagId('018d5c8e-7001-7001-a004-000000000001');
    const l_oIdTagFigma   = new TagId('018d5c8e-7001-7001-a004-000000000003');
    const l_oIdTagCamAr   = new TagId('018d5c8e-7001-7001-a009-000000000001');

    // Injection des records d'étiquettes purifiés du franglais tgName (Rule 3)
    await p_oTagRepo.create({ idTag: l_oIdTagJs,     tgUserId: l_oIdSophie,  tgLibelle: 'javascript' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagReact,  tgUserId: l_oIdSophie,  tgLibelle: 'react' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagNode,   tgUserId: l_oIdSophie,  tgLibelle: 'node.js' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagArchi,  tgUserId: l_oIdSophie,  tgLibelle: 'architecture' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagClean,  tgUserId: l_oIdSophie,  tgLibelle: 'clean code' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagGest,   tgUserId: l_oIdMarc,    tgLibelle: 'gestion de projet' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagAgile,  tgUserId: l_oIdMarc,    tgLibelle: 'agile' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagPsy,    tgUserId: l_oIdEmma,    tgLibelle: 'psychologie cognitive' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagMemo,   tgUserId: l_oIdEmma,    tgLibelle: 'mémoire' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagUx,     tgUserId: l_oIdLucas,   tgLibelle: 'ux design' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagFigma,  tgUserId: l_oIdLucas,   tgLibelle: 'figma' } as any);
    await p_oTagRepo.create({ idTag: l_oIdTagCamAr,  tgUserId: l_oIdCamille, tgLibelle: 'architecture moderna' } as any);

    // ----------------------------------------------------------------------------
    // 📦 3. INJECTION DE TOUTES LES PÉPITES (Les 18 instances - Déclaration complète)
    // ----------------------------------------------------------------------------
    const l_oIdItemSolid  = new ItemId('018d5c8e-8001-7001-b001-000000000001');
    const l_oIdItemRsc    = new ItemId('018d5c8e-8001-7001-b001-000000000002');
    const l_oIdItemScrum  = new ItemId('018d5c8e-8001-7001-b002-000000000001');
    const l_oIdItemKahn   = new ItemId('018d5c8e-8001-7001-b003-000000000001');
    const l_oIdItemAtom   = new ItemId('018d5c8e-8001-7001-b004-000000000001');
    const l_oIdItemLayout = new ItemId('018d5c8e-8001-7001-b004-000000000002');
    const l_oIdItemKrug   = new ItemId('018d5c8e-8001-7001-b004-000000000003');
    const l_oIdItemWcag   = new ItemId('018d5c8e-8001-7001-b004-000000000004');
    const l_oIdItemSys    = new ItemId('018d5c8e-8001-7001-b004-000000000005');
    const l_oIdItemUxCh   = new ItemId('018d5c8e-8001-7001-b004-000000000006');
    const l_oIdItemFitts  = new ItemId('018d5c8e-8001-7001-b004-000000000007');
    const l_oIdItemFram   = new ItemId('018d5c8e-8001-7001-b004-000000000008');
    const l_oIdItemLean   = new ItemId('018d5c8e-8001-7001-b005-000000000001'); // 🪓 RESTAURÉ : Les 6 clés manquantes !
    const l_oIdItemGrowth = new ItemId('018d5c8e-8001-7001-b005-000000000002');
    const l_oIdItemDesca  = new ItemId('018d5c8e-8001-7001-b006-000000000001');
    const l_oIdItemPress  = new ItemId('018d5c8e-8001-7001-b007-000000000001');
    const l_oIdItemCuis   = new ItemId('018d5c8e-8001-7001-b008-000000000001');
    const l_oIdItemCorbu  = new ItemId('018d5c8e-8001-7001-b009-000000000001');

    // Injection des records de pépites (De SophieDev à LucasDesign)
    await p_oItemRepo.create({ itIdItem: l_oIdItemSolid,  itUserId: l_oIdSophie, itContentTypeId: ContentType.ARTICLE.code, itLibelle: 'Les principes SOLID en JavaScript',    itSlug: 'les-principes-solid-en-javascript',    itAuteurSource: 'Robert C. Martin',  itThumbnailUrl: 'https://unsplash.com', itMetadata: { reading_time: '8 min' },  itContent: 'S : Responsabilité unique. O : Ouvert/Fermé. L : Substitution de Liskov.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemRsc,    itUserId: l_oIdSophie, itContentTypeId: ContentType.ARTICLE.code, itLibelle: 'React Server Components',              itSlug: 'react-server-components',              itAuteurSource: 'Dan Abramov',       itThumbnailUrl: 'https://unsplash.com', itMetadata: { reading_time: '12 min' }, itContent: 'Les RSC s exécutent uniquement sur le serveur. Ils réduisent la taille du bundle JavaScript.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemScrum,  itUserId: l_oIdMarc,   itContentTypeId: ContentType.LIVRE.code,   itLibelle: 'Le Guide du Scrum Officiel 2024',         itSlug: 'le-guide-du-scrum-officiel-2024',       itAuteurSource: 'Ken Schwaber',      itThumbnailUrl: 'https://unsplash.com', itMetadata: { pages: 16 },              itContent: 'Scrum est un cadre de travail léger qui aide les personnes et les équipes.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemKahn,  itUserId: l_oIdEmma,   itContentTypeId: ContentType.LIVRE.code,   itLibelle: 'Thinking, Fast and Slow - Daniel Kahneman', itSlug: 'thinking-fast-and-slow-daniel-kahneman', itAuteurSource: 'Daniel Kahneman',   itThumbnailUrl: 'https://unsplash.com', itMetadata: { pages: 499 },             itContent: 'Système 1 : rapide, automatique, émotionnel. Système 2 : lent, réfléchi, logique.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemAtom,  itUserId: l_oIdLucas,  itContentTypeId: ContentType.ARTICLE.code, itLibelle: 'Introduction à l Atomic Design',         itSlug: 'introduction-a-l-atomic-design',       itAuteurSource: 'Brad Frost',        itThumbnailUrl: 'https://unsplash.com', itMetadata: { reading_time: '10 min' }, itContent: 'L Atomic Design est une méthodologie qui permet de créer des systèmes de conception de manière hiérarchique.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemLayout, itUserId: l_oIdLucas,  itContentTypeId: ContentType.VIDEO.code,   itLibelle: 'Figma : Auto Layout et Variants avancés', itSlug: 'figma-auto-layout-et-variants-avances', itAuteurSource: 'Figma Official',    itThumbnailUrl: 'https://unsplash.com', itMetadata: { duration: '18:25' },        itContent: 'Auto Layout = flexbox dans Figma. Permet le responsive automatique.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemKrug,  itUserId: l_oIdLucas,  itContentTypeId: ContentType.LIVRE.code,   itLibelle: 'Don t Make Me Think - Steve Krug',        itSlug: 'don-t-make-me-think-steve-krug',       itAuteurSource: 'Steve Krug',        itThumbnailUrl: 'https://unsplash.com', itMetadata: { pages: 216 },             itContent: 'La première loi de l utilisabilité est : ne me faites pas réfléchir. Un site web doit être évident.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemWcag,  itUserId: l_oIdLucas,  itContentTypeId: ContentType.NOTE.code,    itLibelle: 'Règles d accessibilité WCAG cruciales',    itSlug: 'regles-d-accessibilite-wcag-cruciales', itAuteurSource: 'N.C',               itThumbnailUrl: null,                  itMetadata: { critical: true },         itContent: 'Checklist WCAG 2.2 : 1) Contraste de texte minimum 4.5:1. 2) Navigation au clavier fonctionnelle.' } as any);

    // Injection des records de pépites (Suite : de LucasDesign à CamilleArchi)
    await p_oItemRepo.create({ itIdItem: l_oIdItemSys,    itUserId: l_oIdLucas,  itContentTypeId: ContentType.VIDEO.code,   itLibelle: 'Déployer un Design System en production', itSlug: 'deployer-un-design-system-en-production', itAuteurSource: 'Framer Master',     itThumbnailUrl: 'https://unsplash.com', itMetadata: { duration: '25:30' },        itContent: 'Comment traduire des composants Figma en composants réutilisables via Tokens et bibliothèques partagées.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemUxCh,  itUserId: l_oIdLucas,  itContentTypeId: ContentType.NOTE.code,    itLibelle: 'Ma checklist UX d audit rapide',          itSlug: 'ma-checklist-ux-d-audit-rapide',          itAuteurSource: 'N.C',               itThumbnailUrl: null,                  itMetadata: { checklist_items: 12 },    itContent: 'Vérifier la clarté de la proposition de valeur en haut de page, tester le tunnel de conversion.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemFitts, itUserId: l_oIdLucas,  itContentTypeId: ContentType.ARTICLE.code, itLibelle: 'Loi de Fitts : Ergonomie des interfaces',  itSlug: 'loi-de-fitts-ergonomie-des-interfaces',  itAuteurSource: 'Paul Fitts',        itThumbnailUrl: 'https://unsplash.com', itMetadata: { law_year: 1954 },         itContent: 'Le temps nécessaire pour atteindre une cible est fonction de la distance à la cible et de sa taille.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemFram,  itUserId: l_oIdLucas,  itContentTypeId: ContentType.VIDEO.code,   itLibelle: 'Prototypage ultra-rapide avec Framer',     itSlug: 'prototypage-ultra-rapide-avec-framer',     itAuteurSource: 'Design Tech',        itThumbnailUrl: 'https://unsplash.com', itMetadata: { duration: '14:20' },        itContent: 'Passer de Figma à des prototypes haute fidélité animés dans Framer en quelques minutes.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemLean,  itUserId: l_oIdAlice,  itContentTypeId: ContentType.LIVRE.code,   itLibelle: 'The Lean Startup - Eric Ries',            itSlug: 'the-lean-startup-eric-ries',            itAuteurSource: 'Eric Ries',         itThumbnailUrl: null,                  itMetadata: { pages: 336 },             itContent: 'Méthodologie MVP (Minimum Viable Product). Boucle Construire-Mesurer-Apprendre.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemGrowth,itUserId: l_oIdAlice,  itContentTypeId: ContentType.ARTICLE.code, itLibelle: 'Le secret du Growth Hacking en 2026',    itSlug: 'le-secret-du-growth-hacking-en-2026',    itAuteurSource: 'Andrew Chen',       itThumbnailUrl: 'https://unsplash.com', itMetadata: { reading_time: '9 min' },  itContent: 'Le growth hacking repose sur le framework AARRR : Acquisition, Activation, Rétention.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemDesca, itUserId: l_oIdPaul,   itContentTypeId: ContentType.LIVRE.code,   itLibelle: 'Discours de la méthode - René Descartes',  itSlug: 'discours-de-la-methode-rene-descartes',  itAuteurSource: 'René Descartes',    itThumbnailUrl: 'https://unsplash.com', itMetadata: { pages: 160 },             itContent: 'Le bon sens est la chose du monde la mieux partagée. Les quatre règles : 1) Ne recevoir jamais.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemPress, itUserId: l_oIdJulie,  itContentTypeId: ContentType.ARTICLE.code, itLibelle: 'L impact de l IA générative sur les médias',itSlug: 'l-impact-de-l-ia-generative-sur-les-medias',itAuteurSource: 'Julie Tech Press',   itThumbnailUrl: 'https://unsplash.com', itMetadata: { reading_time: '11 min' }, itContent: 'L intelligence artificielle transforme la production d articles. Risques de désinformation de masse.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemCuis,  itUserId: l_oIdThomas, itContentTypeId: ContentType.VIDEO.code,   itLibelle: 'Maîtriser la cuisson basse température',  itSlug: 'maitriser-la-cuisson-basse-temperature',  itAuteurSource: 'Chef Thomas Channel',itThumbnailUrl: 'https://unsplash.com', itMetadata: { duration: '15:45' },        itContent: 'La cuisson basse température préserve l eau de constitution des aliments.' } as any);
    await p_oItemRepo.create({ itIdItem: l_oIdItemCorbu, itUserId: l_oIdCamille, itContentTypeId: ContentType.LIVRE.code,   itLibelle: 'Vers une architecture - Le Corbusier',    itSlug: 'vers-une-architecture-le-corbusier',    itAuteurSource: 'Le Corbusier',      itThumbnailUrl: 'https://unsplash.com', itMetadata: { pages: 256 },             itContent: 'L architecture is le jeu savant, correct et magnifique des volumes assemblés sous la lumière.' } as any);

    // ----------------------------------------------------------------------------
    // 🔗 4. FUSION DES PIVOTS (22 ItemTags Many-to-Many - Dédoublonnés)
    // ----------------------------------------------------------------------------
    await p_oPivotRepo.add(l_oIdItemSolid,  l_oIdTagJs);
    await p_oPivotRepo.add(l_oIdItemSolid,  l_oIdTagClean);
    await p_oPivotRepo.add(l_oIdItemRsc,    l_oIdTagReact);
    await p_oPivotRepo.add(l_oIdItemRsc,    l_oIdTagJs);
    await p_oPivotRepo.add(l_oIdItemScrum,  l_oIdTagAgile);
    await p_oPivotRepo.add(l_oIdItemKahn,   l_oIdTagPsy);
    await p_oPivotRepo.add(l_oIdItemAtom,   l_oIdTagUx);
    await p_oPivotRepo.add(l_oIdItemLayout, l_oIdTagFigma);
    await p_oPivotRepo.add(l_oIdItemLayout, l_oIdTagUx);
    await p_oPivotRepo.add(l_oIdItemKrug,   l_oIdTagUx);
    await p_oPivotRepo.add(l_oIdItemWcag,   l_oIdTagUx);
    await p_oPivotRepo.add(l_oIdItemSys,    l_oIdTagUx);
    await p_oPivotRepo.add(l_oIdItemSys,    l_oIdTagFigma);
    await p_oPivotRepo.add(l_oIdItemUxCh,   l_oIdTagUx);
    await p_oPivotRepo.add(l_oIdItemFitts,  l_oIdTagUx);
    await p_oPivotRepo.add(l_oIdItemFram,   l_oIdTagFigma);
    await p_oPivotRepo.add(l_oIdItemFram,   l_oIdTagUx);
    await p_oPivotRepo.add(l_oIdItemGrowth, l_oIdTagJs);
    await p_oPivotRepo.add(l_oIdItemDesca,  l_oIdTagArchi);
    await p_oPivotRepo.add(l_oIdItemPress,  l_oIdTagClean);
    await p_oPivotRepo.add(l_oIdItemCuis,   l_oIdTagNode);
    await p_oPivotRepo.add(l_oIdItemCorbu,  l_oIdTagCamAr);

    // ----------------------------------------------------------------------------
    // 🛰️ 5. COULAGE DES PASSERELLES (2 Shares Officiels - Conversion UUID texte)
    // ----------------------------------------------------------------------------
    const l_oIdShareSophie = new ShareId('018d5c8e-9001-7001-c001-000000000001');
    const l_oIdShareMarc   = new ShareId('018d5c8e-9001-7001-c002-000000000001');

    await p_oShareRepo.create({ idShare: l_oIdShareSophie, shItemId: l_oIdItemSolid, shCourrielDest: 'marc.dubois@entreprise.fr', shAccesJeton: 'tok_share_sophie_marc_001', shAccesConfig: { Privilege: 'LECTURE', AutoriseTelechargement: false, DateExpiration: '2126-12-31T23:59:59.000Z' } } as any);
    await p_oShareRepo.create({ idShare: l_oIdShareMarc,   shItemId: l_oIdItemScrum, shCourrielDest: 'sophie.laurent@tech.io',   shAccesJeton: 'tok_share_marc_sophie_001',   shAccesConfig: { Privilege: 'LECTURE', AutoriseTelechargement: true,  DateExpiration: '2126-12-31T23:59:59.000Z' } } as any);

    // ----------------------------------------------------------------------------
    // 🚨 6. LE JOURNAL D'AUDIT DE SECOURS (5 Événements - Alignement 4 lettres V4 Pro)
    // ----------------------------------------------------------------------------
    const l_oIdEvt1 = new EventId('018d5c8e-a001-7001-d002-000000000001');
    const l_oIdEvt2 = new EventId('018d5c8e-a001-7001-d002-000000000003');
    const l_oIdEvt3 = new EventId('018d5c8e-a001-7001-d002-000000000010');
    const l_oIdEvt4 = new EventId('018d5c8e-a001-7001-d002-000000000020');
    const l_oIdEvt5 = new EventId('018d5c8e-a001-7001-d002-000000000099');

    // Injection des traces d'audit en utilisant les véritables codes d'écurie V4 Pro (Rule 3)
    await p_oEventRepo.create({ idEvent: l_oIdEvt1, aeUserId: null,        aeCreatedAt: new Date('2024-01-15 09:10:04'), aeCategorieId: Categorie.MONI.code, aeSeveriteId: Severite.INFO.code, aeSecteurId: Secteur.SYST.code, aeActionId: Action.DEMA.code, aeMessage: 'Application Mémoria démarrée avec succès',            aeMetadata: { version: '1.0.0' } } as any);
    await p_oEventRepo.create({ idEvent: l_oIdEvt2, aeUserId: l_oIdSophie, aeCreatedAt: new Date('2024-01-15 10:00:01'), aeCategorieId: Categorie.ANAL.code, aeSeveriteId: Severite.INFO.code, aeSecteurId: Secteur.UTIL.code, aeActionId: Action.ENRE.code, aeMessage: 'Nouvel utilisateur enregistré',                         aeMetadata: { ip: '192.168.1.15' } } as any);
    await p_oEventRepo.create({ idEvent: l_oIdEvt3, aeUserId: l_oIdEmma,   aeCreatedAt: new Date('2024-01-15 11:02:00'), aeCategorieId: Categorie.SECU.code, aeSeveriteId: Severite.WARN.code, aeSecteurId: Secteur.AUTH.code, aeActionId: Action.ECHE.code, aeMessage: 'Tentative de connexion échouée',                        aeMetadata: { retry_count: 1 } } as any);
    await p_oEventRepo.create({ idEvent: l_oIdEvt4, aeUserId: l_oIdAlice,  aeCreatedAt: new Date('2024-01-15 12:05:00'), aeCategorieId: Categorie.RGPD.code, aeSeveriteId: Severite.INFO.code, aeSecteurId: Secteur.RGPD.code, aeActionId: Action.EXPO.code, aeMessage: 'Exportation complète demandée',                            aeMetadata: { format: 'json' } } as any);
    await p_oEventRepo.create({ idEvent: l_oIdEvt5, aeUserId: null,        aeCreatedAt: new Date('2024-01-15 13:45:12'), aeCategorieId: Categorie.MONI.code, aeSeveriteId: Severite.WARN.code, aeSecteurId: Secteur.BASE.code, aeActionId: Action.LENT.code, aeMessage: 'Requête SQL lente détectée sur la table items',             aeMetadata: { duration_ms: 1250 } } as any);
  }
}

export default MockDataSeeder;
