# 🏺 Mémoire de Soute : Scalaire vs Atomique (Discipline du Métal)

## 🎛️ 1. L'Échelle des Registres (Généalogie x86/x64)
Sur un processeur moderne, la taille du registre détermine la largeur de la brique que le CPU peut avaler en un seul cycle :
* **8 bits**  : `AL` (Low), `AH` (High) -> Les vieux ouvriers de l'Intel 8008.
* **16 bits** : `AX` -> L'époque sacrée du DR-DOS et du 8086.
* **32 bits** : `EAX` (Extended) -> L'avènement du mode protégé (80386).
* **64 bits** : `RAX` (Register) -> Le standard d'acier des architectures AMD64 / Intel 64.
* **128 bits**: `XMM` -> Les soutes vectorielles (SSE) où l'on range les UUIDv7 binaires de Mémoria.
* **256/512 bits**: `YMM` / `ZMM` -> La grosse artillerie (AVX) pour le calcul parallèle lourd.

---

## 📐 2. Le Type Scalaire : La Géométrie de l'Objet
Un type est **scalaire** s'il représente une valeur unique positionnable sur une échelle unidimensionnelle. S'il tient dans un unique registre machine (`RAX`, `EAX`), c'est un scalaire de Cour Basse.
* **Sont des scalaires** : `int`, `float`, `char`, `bool` et les pointeurs de mémoire (`void*`).
* **Ne sont pas des scalaires** : Les structures (`struct`), les tableaux (`array`) et les instances de classes composites (`Item`).
* *La sentence du C++* : Un scalaire se copie instantanément sur la pile en déplaçant le pointeur de pile (`RSP`).

---

## 🪓 3. Le Comportement Atomique : La Mécanique de l'Instruction
Le mot **atomique** ne définit pas la structure de la donnée, mais **l'indivisibilité de l'opération électrique subie par le bus matériel**. Une instruction est atomique si le processeur la mène à son terme sans jamais pouvoir être interrompu par une interruption système ou un autre thread.

### 🕵️‍♂️ Le Piège de la Non-Atometé (Le drame du 64 bits sur CPU 32 bits)
* Si vous écrivez un entier de 32 bits sur un CPU 32 bits (`EAX`) : l'opération est **scalaire** et **atomique** (un seul coup d'horloge).
* Si vous écrivez un entier de 64 bits (`long long`) sur ce même CPU 32 bits : la donnée est toujours **scalaire** (une seule valeur logique), mais l'opération n'est plus **atomique**. Le CPU doit faire deux cycles d'horloge successifs pour remplir la mémoire. Si un thread concurrent écrit au milieu, la mémoire "jardine" et la donnée est corrompue.
