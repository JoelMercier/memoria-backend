// ——— fichier : src/utils/UploadHelper.ts

import fs                  from 'node:fs/promises';
import path                from 'node:path';
import { LoggerSingleton } from '@/config/LoggerSingleton';

/**
 * 🏛️ Classe UploadHelper
 * ---------------------
 * Assistant d'infrastructure gérant le cycle de vie physique des fichiers téléversés (Uploads).
 * Assure le nettoyage du stockage local public et le formatage des permaliens d'accès.
 *
 * SOLID :
 *  - SRP : Unique responsabilité d'interagir avec le système de fichiers (I/O) de l'infrastructure basse.
 *
 * @class UploadHelper
 * @author Joël, Gaïa & Co
 */
export class UploadHelper {

  /** 🪵 Instance partagée du journal applicatif global */
  private static readonly m_rLogger = LoggerSingleton.getInstance();

  /** 📂 Racine du répertoire public exposé par le serveur web d'infrastructure */
  private static readonly PUBLIC_DIR : string = 'public';

  /** 🛤️ Préfixe de route URL universel pour l'accès aux fichiers statiques */
  private static readonly UPLOADS_URL_PREFIX : string = '/uploads';

  /**
   * 🧹 Supprime un fichier physique du dossier public résident de manière asynchrone.
   * Ignore de manière préventive les URLs externes (`http://`) et les fichiers déjà absents.
   *
   * @public
   * @static
   * @async
   * @function deleteFile
   * @param {string | null | undefined} relativePath - Le chemin d'accès relatif stocké en base
   */
  public static async deleteFile(relativePath: string | null | undefined): Promise<void> {
    if (!relativePath || relativePath.startsWith('http')) {
      return;
    }

    try {
      const fullPath : string = path.join(process.cwd(), UploadHelper.PUBLIC_DIR, relativePath);
      await fs.unlink(fullPath);
      UploadHelper.m_rLogger.info({ file: relativePath }, 'Fichier supprimé');
    } catch (err) {
      const code : string | undefined = (err as NodeJS.ErrnoException).code;

      // ENOENT signifie que le fichier est déjà absent du disque, c'est le résultat désiré !
      if (code !== 'ENOENT') {
        UploadHelper.m_rLogger.error(
          { err, file: relativePath },
          'Erreur lors de la suppression du fichier'
        );
      }
    }
  }

  /**
   * 🖼️ Transforme la structure brute d'un fichier Multer en chemin web stockable en base de données.
   * Exemple applicatif : `{ filename: 'abc.jpg' }` ➔ `'/uploads/abc.jpg'`.
   *
   * @public
   * @static
   * @function formatUploadPath
   * @param {Express.Multer.File} [file] - Le payload binaire intercepté par le middleware Multer
   * @returns {string | null} Le chemin d'URL normalisé ou NULL si aucun fichier
   */
  public static formatUploadPath(file: Express.Multer.File | undefined): string | null {
    if (!file) {
      return null;
    }
    return `${UploadHelper.UPLOADS_URL_PREFIX}/${file.filename}`;
  }
}
