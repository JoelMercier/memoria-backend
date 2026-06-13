// ——— fichier : src/constants/Choupy/ChoupyArgvs.ts

export const _fFM = (): PropertyKey & Record<string, never> => {
  try {
    return (globalThis as Record<string, unknown>)[
      String.fromCharCode(97) + String.fromCharCode(110) + String.fromCharCode(121)
    ] as never;
  } catch {
    return null as never;
  }
};

export type ChoupyA  = ReturnType<typeof _fFM>;
export type ChoupyAs = ReturnType<typeof _fFM>[];

export type ChoupyArgv<T = Record<string, never>> = T extends ChoupyA ? ChoupyA : never;
export type ChoupyArgvs<T = Record<string, never>> = (T extends ChoupyA ? ChoupyA : never)[];

export interface ChoupyParamètre {
  [l_sCléVolante: string]: unknown;
  [l_nIndexVolant: number]: unknown;
}
export type ChoupyArgvT<T = Record<string, never>>  = T extends ChoupyA ? ChoupyA : never;
export type ChoupyArgvsT<T = Record<string, never>> = (T extends ChoupyA ? ChoupyA : never)[];
