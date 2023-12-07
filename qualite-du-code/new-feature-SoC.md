

## Introduction
### Le SoC, c'est le nerf de la guerre
- le code c'est come la maison: les couverts et les tasses sont dans la cuisine, les chaussures à la buanderie, les produits ménagers sous l'évier, les chaussettes dans l'armoire de la chambre, etc. Le code, c'est la même chose: on rassemble les bouts de code avec des objectifs similaires aux mêmes endroits.

Et ça marche bien: si un collègue doit "aller me chercher un maillot" de dev, il se dirigera directement vers le fichier "armoire de la chambre", plutôt que de chercher dans "toutes les pièces" du composant logiciel.

Personne ne se lancerait dans la recherche d'un objet en particulier (clés, ...) dans une maison dont il ne comprend pas l'organisation. Faites en sorte que votre maison logicielle soit au moins un peu organisée: architecturez vos projets et vos fichiers.

### Astuce de nommage des fonctions
#### La destination plutôt que le chemin
Nommer ses fonctions par le résultat qu'elles rendent plutôt que par l'algo qu'elles appliquent est souvent plus facile à se représenter et plus concis à écrire. Redux nomme notamment ses actions reducers par l'état de l'app après exécution du reducer.

Par exemple, `const points = updateStatusAndReprocessPoints({status})` se transforme en `const points = updatedPoints({status})`.

À utiliser quand on manque d'inspiration.

### les cas particuliers
- Une fonction sensée renvoyer un booléen sera plus volontiers préfixée de "is", "should", "can", "must", etc. Exemple: `isEven`, `canHandleAzertySpecialObjs`.
- Les contrôleurs seront préfixés du verbe HTTP utilisé pour les appeler: `postUser`, `getAttachedBooster`, etc.
- Les vues sont suffixées par `view`, `panel`, etc.
- Les layouts sont suffixées par `layout`.
- Les fonctions appliquant le pattern "factory" sont suffixées par "Factory". Pour des exemples d'utilisation de ce pattern, cf le code d'eCSAR.
- Les reducers (de Array.reduce, de Redux, de useState(), etc) sont suffixées par "Reducer". Pour des exemples, cf le code d'eCSAR.

## création d'un composant générique / réutilisable
Une feature complexe: approche de la "pseudo-external-library".

### Introduction

# Le SoC pendant le dev d'une nouvelle feature
Ces exercices sont inspirés de l'exercice de refactor de Robert C Martins, dans "Clean Code", chapitre 16: "Refactoring serialdate". Uncle Bob adopte pour sa part une approche très différente, plus simple mentalement que les deux présentées ci-dessus mais tout aussi instructive.

Les exemples suivants proposent différentes approches, toutes itératives.

Objectif: représenter du JSON imbriqué dans une table HTML; passer de:
```
const data = [{
  label: "ligne 1",
  champ_ventilé: [{
    label: "sous-ligne 1"
  }, {
    label: "sous-ligne 2"
  }],
}];
```
à du HTML rendant:
```
--------------------------------------------
| label principal | label de champ ventilé |
--------------------------------------------
|                 |      sous-ligne 1      |
|     ligne 1     |------------------------|
|                 |      sous-ligne 2      |
--------------------------------------------
```

Contraintes supplémentaires: le HTML en question devra être extensible / customisable (style + rendering + listeners) au niveau de la table, des headers, des lignes et des cellules, car on va très probablement vouloir customiser cette table par la suite.

Spoiler: les maquettes livrées 1 ou 2 mois après prévoyaient effectivement d'utiliser intensivement ces possibilités d'extensivité... Autant y penser maintenant, vu le morceau, c'est une bonne idée de ne pas avoir à y toucher trop souvent, pour éviter les régressions ^^

Astuce pour penser un composant réutilisable: imaginer un cas de réutilisation "loin" (d'un point de vue fonctionnel) du cas qui nous amène à développer ce composant.

### État des lieux
On possède une très jeune application React, en react-admin. L'architecture est légère: tous les composants sont dans un dossier "composants/". On n'a pas de tests en place (encore).

### Motivations
On s'assure des motivations pour lesquelles on veut faire un composant génériue / réutilisable plutôt qu'un composant spécialisé directement:
- aura-t-on (probablement) plusieurs utilisations différentes de ce composant? Ici, ça n'est pas sûr, du moins pas sûr si on rend les colonnes customisables. Spoiler: par la suite on a réutilisé le composant pour ventiler/aggréger le même set de données sur un autre champ imbriqué (maintenant on ventile sur "ingredients" et sur "references commerciales); donc on a eu besoin de le réutiliser.
- a-t-on une fonctionnalité complexe à réaliser techniquement, qui nécessiterait un découpage en sous-composants fonctionnels pour la rendre plus clair? Oui, carrément, mais ça on s'en rendra compte à notre première ré-architecture plus bas :-)











Notre code n'aura aucune dépendance (un bouton déjà existant, un composant créateur de table déjà existant, ...). Tout est à faire, mais on a de la liberté, et peu de chance que l'évolution d'une dépendance casse le code de la fonctionnalité (maintenant ou dans le futur).

On a cherché des libs sur NPM qui visent à repésenter des cellules fusionnées/aggrégées de JSON imbriqué dans une table HTML, sans succès. Il va falloir développer la notre. 

Au niveau de l'architecture, on a déjà sur d'autres fonctionnalités un composant "glue" qui fait le lien entre des composants génériques de rendu et du code react-admin (c'est ce code qui va passer l'objet "data" à notre composant de rendu), lui-même appelé par une (sous-)vue, elle-même appelée par un layout, etc.

### Conception initiale
On pressent pas mal de lignes de code. Par simplicité, on va garder dans un premier temps le code de la feature (le composant "glue" + le composant "générique") dans le fichier qui l'appelle (la sous-vue).

On songe aussi par la suite à appliquer le pattern container/presenter, assez connu en react. Au-delà de faire du SoC et d'introduire des points de contrôle supplémentaires, ce pattern va nous permettre de pouvoir changer rapidement de composant de rendu pur si besoin (de <table><tbody><tr><td> à <div><div><div><div> notamment, mais on peut aussi penser à du d3.js).

#### Philosophie 
On va créer ce composant (logiciel, pas "React") comme une bibliothèque qu'on aurait utilisé si elle avait existé.
Par exemple, si Datatables permettait une telle fonctionnalité et qu'on l'avait utilisé. On va d'ailleurs s'inspirer de l'interface de datatables pour la définition des colonnes, "définitions de colonnes" qui servira à la fois à générer les en-têtes et les données du corps de notre table.

Cette approche est à opposer à la philosophie suivante:
```
c'est un autre bout de mon code que je peux modifier aussi librement qu'une vue, c'est pas grave si il est codé un peu en spaghetti / fait appel à des dépendances pas forcément obligatoires / etc
```

Elle a pour avantage de favoriser des composants durables car respectant le principe Open/closed (le "O" de SOLID, le "principe des plugins")

S'inspirer pour l'interface de ses composants réutilisables de celles des libs externes populaires est d'ailleurs un moyen à la fois peu risqué et peu couteux cognitivement d'arriver à un résultat durable. On peut aussi s'inspirer d'autres éléments, comme par exemple l'ontologie d'un module manipulant des objets similaires à ceux de notre fonctionnalité.

### Réalisation initiale
On fait un PoC dans un fichier existant. Certaines de nos fonctions font jusqu'à 60 lignes, on a ajouté en tout 140 lignes; l'ensemble des spécifications n'est pas encore présente, mais on a un "coeur de fonctionnalité".

### Premier refactor
On voit maintenant plus clairement ce qu'on entrevoyait avant d'entammer le premier jet. On applique donc plus strictement:
- la séparation "react-admin" / reste
- la séparation React (JSX + hooks) / pure JS (une manière de mettre en place container/presenter)

On sépare aussi nos grosses fonctions en plus petites, généralement en les groupant par utilisation simultanées de différentes variables.

### Re-conception
Après ce dev initial, on se rend compte qu'on a successivement:
  * 1. transformé notre JSON composé de "lignes racines" et "parties (enfant) imbriquées de premier niveau" en un tableau de "lignes imbriquées" enrichies des données de la "ligne parente" et de métadonnées supplémentaires (type index d'imbrication, etc).
  * 2. utilisé ce JSON enrichi et les définitions de colonnes pour créer un tableau de tableau de cellules, dont la structure est très proche du tableau bi-dimensionnel qu'on veut représenter en HTML. On va appeler cette structure notre virtual DOM.
  * 3. passé le virtual DOM à un composant JSX (de présentation), qui en a fait une table HTML

On commence à créer une ontologie, pour mettre un vocabulaire plus explicite à nos variables: on créer un champ lexical de "lignes aggrégées / ventilées", "DOM virtuel" (du JSON facilement transformable en table HTML), etc. On va directement utiliser cette ontologie pour le découpage du code en fonctions et le nommage des variables.

Le virtual DOM en question ressemble par exemple à:
```
const vdom = [{
  data: {
    "label": "ligne 1",
    "champ_ventilé.label": "sous-ligne 1",
  },
  numéro_ligne: 1,
  numéro_sous_ligne: 1,
  nombre_sous_lignes: 2,
}, {
  data: {
    "label": "ligne 1",
    "champ_ventilé.label": "sous-ligne 2",
  },
  numéro_ligne: 1,
  numéro_sous_ligne: 2,
  nombre_sous_lignes: 2,
}];
```

On va trouver des noms à nos "plus petites fonctions": des noms en rapport avec les (sous-)objectifs que représentent ces différents bouts de code. Cela nous amène parfois à re-fusionner des fonctions qu'on vient de découper à l'étape précédente.

### Seconde phase de réalisation
On réalise les spécifications (sous-fonctionnalités) manquantes. Cela rajoute environ 40 lignes de code, à différents endroits.

On prend conscience que le coeur de l'intelligence de notre code n'est pas dans le présenteur, mais celui-ci est une documentation idéale pour monter l'utilisation et les possibilités de notre virtual DOM de rows aggrégés.

### Dernière conception
La précédente étape nous a permis de tester si on doit encore séparer différents objectifs, on se sert du résultat ici. 

Elle a fait ressortir que deux de nos "plus petites fonctions" ont beaucoup grossi avec l'arrivée des "fonctionnalités secondaires". Elles représentent a priori les points privilégiés pour l'extensivité de l'ensemble du module, on aménage donc leurs arguments - ainsi que ceux de la fonction d'entrée / d'administration pour accueillir cette extensivité. Parties concernées: rendering des cellules, génération des attributs du vDOM, présenteur par défaut.

Également, on a mis du code lié à notre virtual dom dans le présenteur (pour permettre à l'utilisateur de numéroter les sous-rows et de repérer le dernier, via des classes CSS), on va le transformer en génération d'attributs dans le vDOM à la place.

### Réalisation finale: nettoyage
On transforme le PoC en quelque chose de propre.

Le code va dans plusieurs fichiers séparés:
- le composant "glue" va dans le fichier dédié à ce type de composants. On en profite pour lui ajouter une finctionnalité qu'on retrouve sur d'autres comosant de ce fichier: le shimmering.
- le présenteur et le code de génération du vDOM () vont pour l'instant tous les deux dans GroupedRows.jsx . On fait en sorte le maximiser l'extensibilité, pour optimiser l'utilisation du principe open/closed (le "O" des principes SOLID, le "principe des plugins")

Les fonctions se décomposent au final en:
- coeur de métier:
  * degroupedRow
  * generateVirtualDOM
  * degroupedRowVirtualDOM
  * dont auxiliaires:
    - isChildPath
    - isCommonPart
- exports de composants facilement utilisables (et à valeur de documentation pour notre coeur de fonctionnalité):
  * GroupedRowsPresenter
  * GroupedRows
  * GroupedBodyRows
  * dont auxiliaires:
    - GroupedRowsError
    - classnameCellFactory
    - defaultRenderer
    - DefaultCell

### Rétrospective
Le compromis entre noms explicites et noms simples n'est pas forcément optimal, pour le coeur de fonctionnalité. Les noms ne sont pas tous explicites sur ce qu'ils font ou ce qu'ils retournent. Quand on lit leur noms, on ne voit pas une histoire claire se dégager.

On voit tout de même un lien de parenté entre degroupedRow et degroupedRowVirtualDOM, ainsi qu'entre degroupedRowVirtualDOM et generateVirtualDOM.

Également, du code de GroupedRows devrait être placé dans une fonction dédiée en pur JS, et se faire instancier par le conteneur react.

Enfin: on peut potentiellement remplacer generateVirtualDOM par le module NPM DataTables, et réduire le module à un mapper JSON: degroupedRow (et éventuellement une partie de degroupedRowVirtualDOM). On éviterait ainsi d'avoir à maintenir un code certes petit mais aussi complexe (et non testé).

### Addendum
Une autre manière d'architecturer un composant est la "méthode des couches/layers".

Lorsqu'on clique sur un lien dans une page HTML vers un domaine externe, cela déclenche toute une série d'évènements, qui va notamment passer par les couches OSI. Pour visualiser: https://fr.wikipedia.org/wiki/Mod%C3%A8le_OSI .

Ce qu'on observe, c'est que chaque couche a son propre objectif, et a un exécutable/périphérique (ou plusieurs) dédié à la réalisation de cet objectif. Puisque chaque objectif est finement défini, l'exécutable en charge de l'appliquer n'est pas énorme, et sa maintenance rendue aisée par sa petite taille.

Une couche OSI n'est pas qu'un objectif, c'est aussi un ensemble de sous-fonctionnalités ainsi qu'un langage / monde spécifique (protocoles et services). La sortie de chaque couche est une enveloppe (élargissons à une transformation) de son entrée, et l'entrée et la sortie de chaque couche sont clairement définis (par des datagrammes dans le modèle OSI)

On va s'inspirer de ce "découpage mental" dans nos fonctionnalités complexes et imaginer le cheminement de notre transformation (du JSON imbriqué initial au JSX final) au travers de nos propres couches. Par exemple pour un composant JSX de lignes aggrégées (qui affiche du JSON imbriqué dans une table HTML), on imagine:
- une couche de dégroupage du JSON (degroupedRow), qui nous ressort un tableau de lignes dégroupées.
- une couche de rendu du DOM virtuel (generateVirtualDOM), qui est notamment chargé de créer les cellules du DOM virtuel à partir de la définition des colonnes.
- une couche d'enrichissement des lignes dégroupées (degroupedRowVirtualDOM + la partie JS de GroupedRows)
- une couche de rendu HTML/JSX (GroupedRowsPresenter), qui va transformer le virtual DOM en une table HTML

### Conclusion
Plus on a d'outils (mentaux/architecturaux ici), plus on peut choisir le meilleur.

On ne fait pas parfait du premier coup - ni même du 2e, cf la rétrospective; mais on peut quand même faire quelque chose de plutôt lisible et durable sans y passer trop de temps. Mais si on n'essaie pas au moins les 2 premières fois, c'est à peu près certain qu'on n'aura pas un code de qualité à la troisième fois.
Autrement dit: Rome ne s'est pas faite en un jour.

TODO

# TODO exemple 3: export excel (sur eCSAR)
TODO

## Composant de vue: TODO exemple 3: 
