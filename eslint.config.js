// ——— fichier : eslint.config.js

import js       from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals  from 'globals';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'logs/**', '**/*.js']
  },
  js.configs.recommended,
  {
    files:   ['src/**/*.ts'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        projectService:  true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      //-- 🛡️ Section d'Élite Turbo Pascal : Les points-virgules faits main
      'semi'                                             : ['error', 'always'],                   //-- Erreur rouge obligatoire si tu oublies un ";" (Régime Pascal) ! [1.1]
      'no-extra-semi'                                    : 'error',                               //-- Interdiction absolue de doubler un ";" par mégarde. [1.1]

      //-- 🧹 Section de Nettoyage Automatique des Accolades
      'object-curly-spacing'                             : ['error', 'always'],                   //-- Insère seul l'espace de confort dans les accolades : { idShare: string }. [1.1]

      //-- ⚙️ Règles existantes de l'infrastructure Mémoria V4
      'no-console'                                       : ['warn', { allow: ['warn', 'error'] }], //-- Interdit les "console.log" de débutant, n'accepte que les alertes de soute. [1.1]
      '@typescript-eslint/consistent-type-imports'       : 'error',                                //-- Erreur rouge si tu importes un type sans mettre le mot-clé "type" (Gain de performance RAM). [1.1]
      '@typescript-eslint/explicit-function-return-type' : 'warn',                                 //-- Alerte jaune si tu oublies de typer explicitement le retour de tes fonctions de production. [1.1]
      '@typescript-eslint/no-unused-vars'                : ['warn', { argsIgnorePattern: '^_' }]   //-- Alerte jaune si tu déclares une variable locale inutile qui pollue la soute. [1.1]
    }

  },
  {
    files: ['**/Mock*.ts', '**/__tests__/**/*.ts', '**/*.test.ts'],
    rules: {
      //-- 🧪 Débrayages des tests triés par Ordre Alphabétique
      '@typescript-eslint/explicit-function-return-type' : 'warn',  //-- Attention jaune si tu oublies de typer ce que renvoie une fonction.
      '@typescript-eslint/no-explicit-any'               : 'off',   //-- Autorise le type joker "any" (le passe-partout de la triche).
      '@typescript-eslint/no-unsafe-argument'            : 'off',   //-- Autorise à passer un truc pas typé en paramètre d'une fonction.
      '@typescript-eslint/no-unsafe-assignment'          : 'off',   //-- Autorise à stocker un truc pas typé dans une variable locale.
      '@typescript-eslint/no-unsafe-call'                : 'off',   //-- Autorise à appeler une méthode sans prouver qu'elle existe.
      '@typescript-eslint/no-unsafe-member-access'       : 'off',   //-- Autorise à lire une propriété cachée dans un objet flou.
      '@typescript-eslint/no-unsafe-return'              : 'off',   //-- Autorise une fonction à renvoyer une tôle non certifiée.
      '@typescript-eslint/require-await'                 : 'off',   //-- Autorise une fonction "async" sans "await" (pratique pour les faux dépôts en RAM).
      '@typescript-eslint/unbound-method'                : 'error'  //-- Erreur rouge si tu détaches une méthode de sa classe (perte du pointeur "this.").
    }
  }
);
