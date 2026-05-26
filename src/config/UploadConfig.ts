// ——— fichier : src/config/UploadConfig.ts

import        multer, {
       type   Multer,
       type   FileFilterCallback } from 'multer';
import        path                 from 'node:path';
import      { randomUUID         } from 'node:crypto';
import type { Request            } from 'express';

/**
 * 🏛️ Classe UploadConfig
 * ----------------------
 * Singleton de configuration pour la gestion des téléversements (Uploads) d'images.
 * Configure le stockage local persistant et applique les filtres de sécurité.
 *
 * @class UploadConfig
 */
export class UploadConfig {

  /** 👤 Instance unique globale du gestionnaire Multer */
  static #instance : Multer;

  /** 📁 Répertoire physique de stockage des fichiers */
  private static readonly UPLOAD_DIR : string = 'public/uploads/';

  /** ⚖️ Limite de taille maximale autorisée (5 Mo) */
  private static readonly MAX_FILE_SIZE : number = 5 * 1024 * 1024;

  /** 🖼️ Liste exhaustive des types MIME de fichiers acceptés */
  private static readonly ALLOWED_MIME_TYPES : ReadonlyArray<string> = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
  ];

  /**
   * Empêche l'instanciation directe pour forcer le patron Singleton.
   *
   * @private
   * @constructor
   */
  private constructor() {
    // Verrouillage du constructeur système
  }

  /**
   * 🗺️ Récupère l'instance unique configurée du téléversement de fichiers.
   *
   * @static
   * @returns {Multer} L'instance partagée du middleware Multer.
   */
  public static getInstance(): Multer {
    if (!UploadConfig.#instance) {
      const storage = multer.diskStorage({
        destination: (
          _req : Request,
          _file: Express.Multer.File,
          cb   : (error: Error | null, destination: string) => void
        ): void => {
          cb(null, UploadConfig.UPLOAD_DIR);
        },
        filename: (
          _req : Request,
          file : Express.Multer.File,
          cb   : (error: Error | null, filename: string) => void
        ): void => {
          const uniqueSuffix : string = randomUUID();
          const ext          : string = path.extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        }
      });

      const fileFilter = (
        _req: Request,
        file: Express.Multer.File,
        cb  : FileFilterCallback
      ): void => {
        if (UploadConfig.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Format de fichier non supporté. Images uniquement.'));
        }
      };

      UploadConfig.#instance = multer({
        storage,
        fileFilter,
        limits: { fileSize: UploadConfig.MAX_FILE_SIZE }
      });
    }
    return UploadConfig.#instance;
  }
}
