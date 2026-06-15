```MERMAID
classDiagram
    class Film {
        +UUID flIdFilm
        +String flTitre
        +String flGenre
        +int flDureeMinutes
    }

    class Salle {
        +int saNumero
        +int saCapacite
        +String saEquipement
        +obtenirPlacesLibres(seanceId) int
    }

    class Place {
        +UUID plIdPlace
        +String plRangee
        +int plNumero
    }

    class Seance {
        +UUID seIdSeance
        +DateTime seDateHeure
        +String seLangue
        +estCommencee() boolean
    }

    class Reservation {
        +UUID reIdReservation
        +DateTime reCreatedAt
        +String reStatut
        +calculerMontantTotal() float
        +annuler() boolean
    }

    %% Associations et Multiplicités de soute
    Film "1" --> "0..*" Seance : Concerne
    Salle "1" *-- "1..*" Place : Contient (Composition)
    Salle "1" --> "0..*" Seance : Accueille
    Seance "1" <-- "0..*" Reservation : Cible
    Reservation "0..1" <-- "1..*" Place : Réserve (À un instant t)
```