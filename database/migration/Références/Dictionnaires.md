# 📜 Amélioration de Mémoria

## 🎯 1. Les trois verrous de soute à arbitrer pour l'avenir
À ce stade de la refonte, les 7 tables de dictionnaire sont closes et prêtes. Pour pousser la V4 à un niveau de sécurité et de performance militaire, voici les trois pistes d'optimisation issues de notre analyse croisée :

* **Ajustement n°1 : Le dictionnaire "ShareModes" (Char(4))**
  Stocker des configurations ou des politiques d'accès dans un Jsonb libre réintroduit du texte variable. Créer une table de référence Char(4) permet de figer les modes de base (PUBL, PROT, EXPI) avant de laisser le Jsonb gérer les métadonnées variables.
* **Ajustement n°2 : Le dictionnaire "UserStatus" (Char(4))**
  Un simple booléen ne permet pas de distinguer un compte en attente de validation d'un compte banni ou en cours de purge RGPD. La table "UserStatus" en Char(4) fige proprement la machine d'état : ACTI (Actif), PEND (En attente), BANN (Banni).
* **Ajustement n°3 : Le dictionnaire "TagCategories" (Char(4))**
  Permet de catégoriser les mots-clés (TECH, PERS, PROJ) pour offrir aux Repositories une puissance de filtrage combinatoire redoutable lors des futures requêtes de masse.
