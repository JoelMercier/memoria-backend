// ——— fichier : src/dto/event/__tests__/CreateEventDto.test.ts

import { describe, expect, it } from 'vitest';
import { CreateEventDto }       from '../CreateEventDto';
import { Categorie }     from '@/constants/Categories';
import { Secteur   }      from '@/constants/Secteurs';
import { Action    }       from '@/constants/Actions';
import { Severite  }     from '@/constants/Severites';

describe('CreateEventDto', () => {

  // 🪓 ALIGNEMENT STRATÉGIQUE : Typage explicite du gabarit pour autoriser le type null sur l'ID de l'acteur
  const createValidPayload = () => ({
    idAppEvent    : '018f3a3c-5000-7000-8000-000000000001',
    userId        : '018f3a3c-5000-7000-8000-000000000002' as string | null,
    eventCategory : 'MONI',
    eventSecteur  : 'SYST',
    eventAction   : 'DEMA',
    severity      : 'WARN',
    message       : 'Démarrage initial de la soute de supervision',
    metadata      : { runtime: 'Node18' }
  });

  it('accepte un payload valide et instancie correctement les types nominaux', () => {
    const l_oPayload = createValidPayload();
    const l_oDto = new CreateEventDto(l_oPayload);

    expect(l_oDto.idEvent.valeur).toBe(l_oPayload.idAppEvent);
    expect(l_oDto.userId?.valeur).toBe(l_oPayload.userId);
    expect(l_oDto.eventCategorie).toBe(Categorie.MONI);
    expect(l_oDto.eventSecteur  ).toBe(Secteur  .SYST);
    expect(l_oDto.eventAction   ).toBe(Action   .DEMA);
    expect(l_oDto.eventSeverite ).toBe(Severite .WARN);
    expect(l_oDto.message       ).toBe(l_oPayload.message);
    expect(l_oDto.metadata      ).toEqual(l_oPayload.metadata);
  });

  it('applique automatiquement le repli de sévérité INFO si le champ est absent', () => {
    const l_oPayload = createValidPayload();
    delete (l_oPayload as any).severity;

    const l_oDto = new CreateEventDto(l_oPayload);
    expect(l_oDto.eventSeverite).toBe(Severite.INFO);
  });

  it('accepte un userId à Null pour la conformité ou les purges RGPD', () => {
    const l_oPayload = createValidPayload();
    l_oPayload.userId = null; // 🪓 [RÉPARÉ V4] Validé par le compilateur grâce au transtypage du gabarit

    const l_oDto = new CreateEventDto(l_oPayload);
    expect(l_oDto.userId).toBeNull();
  });

  it('refuse de s\'instancier et jette une exception si Zod bloque la douane', () => {
    const l_oPayload = createValidPayload();
    l_oPayload.eventSecteur = 'FOOBAR';

    expect(() => new CreateEventDto(l_oPayload)).toThrow();
  });
});
