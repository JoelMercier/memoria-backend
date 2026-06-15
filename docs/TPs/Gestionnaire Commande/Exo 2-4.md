```MERMAID
classDiagram
    class ICalculRemise {
        <<interface>>
        +calculerRemise(commande) float
    }
    class RemiseStandard { +calculerRemise(commande) float }
    class RemiseFidele { +calculerRemise(commande) float }
    class RemiseVip { +calculerRemise(commande) float }
    ICalculRemise <|.. RemiseStandard
    ICalculRemise <|.. RemiseFidele
    ICalculRemise <|.. RemiseVip

    class ICommandeRepository {
        <<interface>>
        +sauvegarder(commande, total) boolean
    }
    class PgCommandeRepository { +sauvegarder(commande, total) boolean }
    ICommandeRepository <|.. PgCommandeRepository

    class INotificateur {
        <<interface>>
        +notifier(client, message) void
    }
    class SmsNotificateur { +notifier(client, message) void }
    INotificateur <|.. SmsNotificateur

    class GestionnaireCommande {
        -ICalculRemise m_oStrategy
        -ICommandeRepository m_oRepo
        -INotificateur m_oNotif
        +GestionnaireCommande(ICalculRemise, ICommandeRepository, INotificateur)
        +enregistrer(commande) void
    }
    GestionnaireCommande --> ICalculRemise
    GestionnaireCommande --> ICommandeRepository
    GestionnaireCommande --> INotificateur
```MERMAID