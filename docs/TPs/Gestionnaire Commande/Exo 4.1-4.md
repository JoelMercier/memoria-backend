```MERMAID
classDiagram
    class LoggerSingleton {
        -LoggerSingleton instance$
        -LoggerSingleton()
        +getInstance() LoggerSingleton$
        +log(message) void
    }
```