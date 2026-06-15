```MERMAID
sequenceDiagram
    autonumber
    actor Client as 👤 Client
    participant UI as 🌐 Interface Web
    participant Seance as ⚙️ Composant Séance
    participant Pay as 🔌 Passerelle Paiement

    Client->>UI: Sélectionne 2 places & clique sur "Acheter"
    UI->>Seance: Vérifie la disponibilité des places
    activate Seance
    Seance-->>UI: Places libres verrouillées temporairement (Token)
    deactivate Seance
    UI->>Pay: Initialise la transaction financière (Montant)
    activate Pay
    Pay-->>UI: Confirmation du débit (Succès 200 OK)
    deactivate Pay
    UI-->>Client: Affiche le billet avec QR-Code de soute
```