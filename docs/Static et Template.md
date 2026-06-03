# 🏺 Mémoire de Soute : Variable Statique et Classe Template en C++

## 🧠 1. Le Grand Secret : Une Classe Template n'existe pas !
En C++, une classe template n'est pas une vraie classe aux yeux du compilateur : c'est un **moule** (un patron).
Le compilateur ne génère du vrai code machine en RAM que lorsqu'on instancie le moule avec un type précis (ex: `MonMoule<int>`).

Par conséquent : **il n'existe pas UNE variable statique globale partagée par tout le template, mais UNE variable statique unique pour chaque type d'instanciation.**

* `MonMoule<int>::maVariable` et `MonMoule<double>::maVariable` sont **deux cases mémoires totalement distinctes en RAM**. Elles n'ont aucun lien entre elles.

---

## 🛠️ 2. La Syntaxe d'Acier : Déclaration, Allocation et Accès

### 📐 Étape A : La déclaration et l'allocation (Fichier d'en-tête `.h`)
En C++, déclarer une variable statique dans le moule ne suffit pas, il faut obligatoirement lui **allouer son espace mémoire** en dehors de la classe (généralement en bas du fichier d'en-tête pour un template).

```cpp
template <typename T>
class MonMoule {
public:
    static int compteur; // 1. Déclaration de l'existence de la variable
};

// 🛑 PIÈGE DU COMPILATEUR : Réservation physique des octets en RAM
template <typename T>
int MonMoule<T>::compteur = 0; // Initialisation par défaut du moule
```

### 🎛️ Étape B : L'accès depuis le code (Cour Basse)
Pour lire ou écrire dans la variable statique sans créer d'objet, on utilise l'opérateur de résolution de portée `::` en spécifiant obligatoirement le type cible entre chevrons :

```cpp
int main() {
    // Le compilateur route les octets vers deux zones mémoires distinctes
    MonMoule<int>::compteur = 42;    // Fige le compteur des INT à 42
    MonMoule<double>::compteur = 5;  // Fige le compteur des DOUBLE à 5

    // Vérification chirurgicale :
    std::cout << MonMoule<int>::compteur;    // Crache 42 (La soute des INT n'a pas bougé)
    std::cout << MonMoule<double>::compteur; // Crache 5
}
```

---

## 🪓 3. La Ruse de Contrebande : La VRAIE Statique Globale
Si un examinateur vicieux vous demande en entretien : *« Comment faire pour que tous les moules (<int>, <double>, etc.) partagent rigoureusement la MÊME variable statique unique en mémoire ? »*

La parade d'ingénieur système est d'une élégance absolue. Il faut extraire la variable du monde des templates en la plaçant dans une **classe mère non-template passive**, dont le moule va hériter :

```cpp
// 1. La dalle de base non-template (Pures fondations physiques)
class BaseStatique {
protected:
    static int compteurCommun; // Unique en RAM pour TOUT le système
};

// Allocation nominale de l'unique compteur de soute
int BaseStatique::compteurCommun = 0;

// 2. Le moule qui hérite des fondations
template <typename T>
class MonMoule : public BaseStatique {
    // Désormais, MonMoule<int> et MonMoule<double> partagent le MÊME "compteurCommun" !
};
```
