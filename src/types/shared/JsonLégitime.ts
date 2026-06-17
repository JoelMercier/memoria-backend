// ——— fichier : src/types/shared/JsonLégitime.ts

/**
 * 🧮 Type récursif d'étanchéité nominale : Cadenasse la structure Jsonb universelle face au Silicium.
 * [CHOPY DOCTRINE V4] Éradication définitive du any dans les dictionnaires de métadonnées contextuels.
 *
 * @type JsonLégitime
 * @author Conception : Joël (Metaprogramming Master)
 * @author Ciselage : Gaïa (La pire et la préférée, au burin)
 */
export type JsonLégitime =
  | string
  | number
  | boolean
  | Date
  | null
  | JsonLégitime[]
  | { [key: string]: JsonLégitime };
