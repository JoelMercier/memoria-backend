```MERMAID
classDiagram
    class INotificationChannel {
        <<interface>>
        +envoyer(message) void
    }
    class EmailChannel { +envoyer(message) void }
    class SmsChannel { +envoyer(message) void }
    class PushChannel { +envoyer(message) void }
    INotificationChannel <|.. EmailChannel
    INotificationChannel <|.. SmsChannel
    INotificationChannel <|.. PushChannel

    class CentralNotificateur {
        -List~INotificationChannel~ m_aCanaux
        +enregistrerCanal(INotificationChannel) void
        +emettreAlerteGlobal(message) void
    }
    CentralNotificateur --> INotificationChannel
```