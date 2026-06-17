# 🏛️ Compte-Rendu Technique : TP 2 — Conception Orientée Objet (BorneFlash)

## 🎛️ Exercice 1 — Du diagramme au code (Squelette Strategy)

### 1.1 — Implémentation TypeScript des structures d'écurie

```typescript
// --- Fichier : src/domain/Tarif.ts

export interface Tarif {

  calculerCout(p_nEnergieKwh: number): number;

}

export class TarifAuKwh implements Tarif {

  constructor(private readonly m_nPrixParKwh: number) {
    //
  }

  public calculerCout(p_nEnergieKwh: number): number {

    return p_nEnergieKwh * this.m_nPrixParKwh;
  }
}

export class TarifForfait implements Tarif {

  constructor(private readonly m_nMontantFixe: number) {
    //
  }

  public calculerCout(p_nEnergieKwh: number): number {
    return this.m_nMontantFixe;
  }
}```

```typescript
// --- Fichier : src/domain/SessionRecharge.ts

import { Tarif } from '@/src/domaine/Tarif';

export class SessionRecharge {

  constructor(
    public readonly idSession: string,
    public readonly energieKwh: number,
    private m_oStrategyTarif: Tarif
  ) {
    //
  }

  public get StrategyTarif() {
    return m_oStrategyTarif;
  }

  public obtenirCout(): number {
    return this.StrategyTarif.calculerCout(this.energieKwh);
  }
}
```

```typescript
// --- Fichier : src/interfaces/repositories/ISessionRepository.ts
import { SessionRecharge } from '@/src/domain/SessionRecharge';

export interface ISessionRepository {
  sauvegarder(p_oSession: SessionRecharge): Promise<boolean>;
  rechercherParId(p_sIdSession: string): Promise<SessionRecharge | null>;
}
```

### 1.2 — Localisation du Pattern Strategy
Le pattern **Strategy** s'articule ainsi :
*   L'interface **`Tarif`** incarne l'abstraction de la **stratégie interchangeable**.
*   La classe **`SessionRecharge`** joue le rôle de contexte : elle « possède » la stratégie via sa propriété privée `m_oStrategyTarif`.

### 1.3 — Script de test et d'exécution (`src/index.ts`)

```typescript
import { SessionRecharge } from './domain/SessionRecharge';
import { TarifAuKwh, TarifForfait } from './domain/Tarif';

const l_oSessionAuKwh = new SessionRecharge('S001', 30, new TarifAuKwh(0.25));
console.log(`Coût avec Tarif au kWh : ${l_oSessionAuKwh.obtenirCout()} €`); // Sortie : 7.5 €

const l_oSessionForfait = new SessionRecharge('S001', 30, new TarifForfait(5.00));
console.log(`Coût avec Tarif Forfait  : ${l_oSessionForfait.obtenirCout()} €`); // Sortie : 5 €
```
**Conclusion** : Aucune modification de la classe `SessionRecharge` n'a été requise pour commuter de stratégie tarifaire. Le couplage est lâche.

---

## 🪓 Exercice 2 — Le code qui encaisse le changement (Résilience SOLID)

### 2.1 — Évolution Heures Creuses / Heures Pleines
On crée une nouvelle stratégie sans toucher aux deux autres implémentations :

```typescript
export class TarifHeuresCreuses implements Tarif {

  constructor(
    private readonly m_nTarifCreux: number = 0.15,
    private readonly m_nTarifPlein: number = 0.25
  ) {
    //
  }

  public calculerCout(p_nEnergieKwh: number): number {
    const l_nHeureCourante = new Date().getHours();
    const l_bEstEnHeuresCreuses = l_nHeureCourante >= 22 || l_nHeureCourante < 6;
    return p_nEnergieKwh * (l_bEstEnHeuresCreuses ? this.m_nTarifCreux : this.m_nTarifPlein);
  }

}
```
**Analyse** : **ZÉRO** classe existante modifiée. Cela illustre parfaitement le principe **OCP (Open/Closed Principle)** : le code est ouvert à l'extension mais fermé à la modification.

### 2.2 — Implémentation SessionRepositoryEnMemoire
```typescript
import { ISessionRepository } from '@/src/domaine/ISessionRepository';
import { SessionRecharge } from '@/src/domain/SessionRecharge';

export type SessionsRecharge : SessionRecharge[];

export class SessionRepositoryEnMemoire implements ISessionRepository {

  private m_aoSessions: SessionsRecharge = [];

  public get Sessions(): SessionsRecharge {
    return m_aoSessions;
  }

  public set Sessions(p_aoSessions : SessionsRecharge) {
    m_aoSessions = p_aoSessions;
  }

  public async sauvegarder(p_oSession: SessionRecharge): Promise<boolean> {

    this.Sessions.push(p_oSession);
    return true;
  }

  public async rechercherParId(p_sIdSession: string): Promise<SessionRecharge | null> {

    return this.m_aoSessions.find(s => s.idSession === p_sIdSession) ?? null;
  }

}

```
**Analyse** : La logique de calcul n'a pas bougé d'une seule ligne. Cela illustre le principe **DIP (Dependency Inversion Principle)** : les modules de haut niveau ne dépendent pas des détails d'infrastructure, ils dépendent d'un contrat d'interface.

### 2.3 — Bilan Comptable des Fichiers
*   **Fichiers créés** : 2 (`TarifHeuresCreuses.ts`, `SessionRepositoryEnMemoire.ts`).
*   **Fichiers modifiés** : **0, ZÉRO**.
*   **Leçon d'écurie** : Ajouter du code via de nouvelles classes d'implémentation immunise l'application contre les régressions, contrairement à la modification de structures existantes.

---

## 👁️ Exercice 3 — Le Pattern OBSERVER ( découplage évènementiel )

### 3.1 — Justification du choix du Pattern
Le pattern **Observer** résout exactement ce problème : il permet à un objet sujet (`SessionRecharge`) de notifier une liste dynamique d'abonnés (`ObservateurSession`) sans connaître la nature de leur implémentation concrète.

### 3.2 & 3.3 — Écritures des Observateurs et Extension

```typescript
export interface ObservateurSession {

  surSessionTerminee(p_oSession: SessionRecharge): void;

}


export class RecuEmail implements ObservateurSession {

  public surSessionTerminee(p_oSession: SessionRecharge): void {
    console.log(`✉️ [Email] Envoi du reçu pour la session ${p_oSession.idSession}. Total : ${p_oSession.obtenirCout()} €`);
  }
}


export class JournalConsole implements ObservateurSession {

  public surSessionTerminee(p_oSession: SessionRecharge): void {
    console.log(`📝 [Log] Session de recharge achevée : ${p_oSession.energieKwh} kWh consommés.`);
  }
}


// 3.3 - Ajout du troisième observateur sans aucune intrusion dans SessionRecharge
export class MiseAJourTableauDeBord implements ObservateurSession {

  public surSessionTerminee(p_oSession: SessionRecharge): void {
    console.log(`📊 [IHM] Mise à jour des indicateurs graphiques de la borne.`);
  }

}

```
**Principe retrouvé** : À nouveau le principe **OCP**. L'orchestrateur de notifications est ouvert à l'injection de nouveaux canaux de communication sans altérer la méthode `terminer()`.

---

## 🛂 Exercice 4 — De l'idée au code (Machine à États)

### 4.2 — Implémentation de la Borne avec Verrou de Sécurité

```typescript
export class Borne {
  private m_sEtatCourant: 'Libre' | 'Occupee' | 'HorsService' = 'Libre';

  constructor(public readonly idBorne: string) {}

  public get EtatCourant () {
    return m_sEtatCourant;
  }

  public set EtatCourant(p_sEtatCourant : string) {
    m_sEtatCourant = p_sEtatCourant;
  }

  public demarrer(): void {
    if (this.EtatCourant !== 'Libre') {
      throw new Error(`🚨 [Action Refusée] Impossible de démarrer : la borne est dans l'état '${this.m_sEtatCourant}.`);
    }
    this.EtatCourant = 'Occupee';
    console.log(`🟢 Session démarrée sur la borne ${this.idBorne}. État actuel : Occupée.`);
  }

  public terminer(): void {
    if (this.EtatCourant === 'HorsService') {
      console.log('⚠️ Borne hors service. Réparation requise.');
      return;
    }
    this.EtatCourant = 'Libre';
    console.log(`🔵 Session clôturée sur la borne ${this.idBorne}. État actuel : Libre.`);
  }

  public passerHorsService(): void {
    this.EtatCourant = 'HorsService';
  }
}

```

#### 📋 Sortie d'exécution de test console :
```text
🟢 Session démarrée sur la borne B-01. État actuel : Occupée.
🚨 [Action Refusée] Impossible de démarrer : la borne est dans l'état 'Occupee'.
```

---

## 🌐 Bonus — Même conception, trois autres langages

### B.1 — Traduction Polyglotte de l'Interface et du Calculateur

#### ☕ Variante A : Java
```java
public interface Tarif {
    double calculerCout(double energieKwh);
}

public class TarifAuKwh implements Tarif {
    private final double prixParKwh;

    public TarifAuKwh(double prixParKwh) {
        this.prixParKwh = prixParKwh;
    }

    @Override
    public double calculerCout(double energieKwh) {
        return energieKwh * this.prixParKwh;
    }
}
```

#### 🐘 Variante B : PHP
```php
<?php
interface Tarif {
    public function calculerCout(float $energieKwh): float;
}

class TarifAuKwh implements Tarif {
    private float $prixParKwh;

    public function __construct(float $prixParKwh) {
        $this->prixParKwh = $prixParKwh;
    }

    public function calculerCout(float $energieKwh): float {
        return $energieKwh * $this->prixParKwh;
    }
}
```

#### 🐍 Variante C : Python (Abstractions de structure ABC)
```python
from abc import ABC, abstractmethod

class Tarif(ABC):
    @abstractmethod
    def calculer_cout(self, energie_kwh: float) -> float:
        pass

class TarifAuKwh(Tarif):
    def __init__(self, prix_par_kwh: float):
        self._prix_par_kwh = prix_par_kwh

    def超_cout(self, energie_kwh: float) -> float:
        return energie_kwh * self._prix_par_kwh
```

### B.2 — Conclusion de Parité des Langages
Ce qui change d'un environnement à l'autre, c'est uniquement l'habillage syntaxique local et la sémantique des mots-clés (`implements`, `@Override`, `abstractmethod`). Ce qui reste absolument immuable, c'est l'**architecture conceptuelle**, la répartition des responsabilités orientées objet et le découpage algorithmique des abstractions du Domaine.

D'un langage à l'autre, seul l'habillage syntaxique (les mots-clés d'implémentation et les mécanismes de typage) fait office de variable technique. En revanche, la structure conceptuelle, la répartition sémantique des responsabilités et la topologie des abstractions orientées objet restent rigoureusement immuables.

**Conclusion générale** : L'architecture transcendera toujours le code, car le langage n'est qu'un véhicule d'exécution interchangeable. Une fois les bonnes abstractions posées en amont, la traduction structurelle devient purement mécanique, indépendamment du compilateur cible.
