# Qualité du code
## Introduction
On va voir ici plein de concepts, dont certains se contredisent. Ne prenez rien pour acquis, mais je vous déconseille de jeter le bébé avec l'eau du bain ;-)

## C'est quoi, une codebase de qualité?

### Proche de nous
TODO interviews

### De manière générale
#### État de l'art
D'après https://fr.wikipedia.org/wiki/Qualit%C3%A9_logicielle .

Indicateurs de qualité logicielle - norme ISO 25010:
  * la capacité fonctionnelle (les fonctionnalités utilisateurs). En font partie la précision, l'interopérabilité, la conformité aux normes et la sécurité ;
  * la facilité d'utilisation. En font partie la facilité de compréhension, d'apprentissage et d'exploitation et la robustesse - une utilisation incorrecte n'entraîne pas de dysfonctionnement ;
  * la fiabilité. En font partie la tolérance aux pannes - la capacité d'un logiciel de fonctionner même en étant handicapé par la panne d'un composant (logiciel ou matériel) ;
  * la performance. En font partie le temps de réponse, le débit et l'extensibilité - capacité à maintenir la performance même en cas d'utilisation intensive ;
  * la maintenabilité, qui mesure l'effort nécessaire à corriger ou transformer le logiciel. En font partie l'extensibilité, c'est-à-dire le peu d'effort nécessaire pour y ajouter de nouvelles fonctions ;
  * la portabilité, c'est-à-dire l'aptitude d'un logiciel à fonctionner dans un environnement matériel ou logiciel différent de son environnement initial. En font partie la facilité d'installation et de configuration dans le nouvel environnement.

Parallèlement à ces indicateurs, on note dans la "Gestion de la qualité logicielle" des ensembles de pages dédiés à:
- Compréhension et contrôle du code source
- Remaniements (refactors)
- Principes de programmation
- Mauvaises pratiques

### Prise de conscience au sein des équipes de projet
Tous les indicateurs ci-dessus sont importants, on doit donc s'assurer de les adresser tous simultanément dans nos projets.

La capacité fonctionnelle et la facilité d'utilisation sont les domaines du PO et de l'ergonome (designer?).

La fiabilité est un point déjà considéré comme important par les chefs de projets (essayez de livrer des codes peu fiables, c'est nettement plus difficile à faire passer auprès du client que des codes peu maintenables).

La performance est un problème pas toujours bien adressé (par manque de connaissances), et source de sur-ingénierie (over-engineering). Toutefois notre marge de manoeuvre - à nous les devs - est faible dans le cadre des projets que nous livrons habituellement à Saegus, et une grande partie de ce qui doit être mis en place dans ce domine l'est déjà (en partie par les frameworks et outils que nous utilisons).

La portabilité est pour les webapps souvent divisée en une partie orientée techs (ex: serveurs tournant sour Mac, Windows, Python2 ou 3, ...) et une partie orientée utilisateurs (ex: UI sous écrans 13", 20", responsive tablette/mobile, ...).

Last but not least: la maintenabilité.

#### Focus sur la maintenabilité
Ce domaine-là est celui sur lequel nous, les experts de la technique, avons un entier pouvoir et maîtrisons le mieux.
Mais c'est aussi celui que nous négligeons le plus:
  * d'une part parce que nous sommes quasiment les seuls à pouvoir en comprendre les tenants et les aboutissants
  * d'autre part car cette discipline est complexe, et que le champ de recherche est pluri-disciplinaire: architecture logicielle, lisibilité du code, gestion des compétences de l'équipe et donc ressources humaines, ...

En bref, un domaine de techs pour les techs. Et c'est spécifiquement sur celui-ci qu'on va se concentrer dans la suite.

## La maintenabilité
### Pourquoi c'est problématique, un code non maintenable, y compris dans des projets de 2 mois?
On prend en compte qu'on fait souvent des projets de 2 mois, et qu'on est amené à travailler à plusieurs dessus - y compris dans le cas où ça ne fait pas partie de la spec initiale du projet.

TODO cf intro de Clean code

### Techniques générales/théoriques d'amélioration de la maintenabilité
TODO
Exemples:
- une communication d'équipe fluide
- des process de travail normés (tout en étant aussi peu contraignants que possible)
- une architecture à différentes granularités:
  * au niveau du projet (multi-composants)
  * du composant (un exécutable donné)
  * du fichier
  * de la fonction
  * de la ligne

### Exemples pratiques
Les technos / frameworks / etc listés ici n'y sont qu'à titre d'exemples, et on chacun au moins une alternative dans leur domaine. À vous de chercher!

#### Linting
##### ESLint
TODO eslint: règles paramétrables.
Important: vous devez savoir pourquoi - et vous justifier si on vous demande quand - vous ajoutez chaque règle! Évitez dont de bêtement prendre le premier set de règles venu, ce qui peut être contraignant!

##### Typescript
TODO Typescript
Aussi bien un linter type ESLint (mais non paramétrable) qu'un langage à part entière.

##### Automatisation de la CI
TODO github flows et scripts shell

##### Automatisation de la CD
Outils populaires: Github Actions, Azure devops / pipelines, Jenkins

##### Docker
TODO
Un peu hors scope, donc on va passer rapidement dessus
Un compagnon idéal pour la portabilité (compatibilité), avec son bonus devops

### Une bonne architecture
L'architecture doit être adaptée aux besoins / spécificités du projet. Inutile "d'over-enigeer-er".

#### Entre les composants
On parle souvent de microservices: c'est loin d'être systématiquement une bonne idée, par rapport à du monolithique... Gaffe à la lourdeur des interfaces de communication entre les différents composants (y compris au niveau de la gestion des erreurs, sérialisation d'éléments supplémentaires, toussa).

De l'event-driven pour la communication entre les composants est aussi possible et assez scalable (kafka, RabbitMQ, ...), même si ça nécessite des connaissances / une expérience spécifique(s) pour éviter de faire du code spaghetti - et donc une équipe formée à cette manière de faire.

#### Au niveau du composant
Ex: si différentes temporalités, de l'event-driven est intéressant.

Ex: Pour des cas de traçabilité, penser à l'event sourcing.

Ex: Au cas où le domaine métier (plus précisément les objets à faire persister) est complexe, on peut utiliser du DDD

De manière générale, faire du SoC au niveau des fichiers (1 objectif max par fichier) c'est bien. Également, une architecture de fichier parlante c'est bien également, la screaming architecture en est un très bon principe (que le DDD met en place d'ailleurs).

À mon niveau, tant qu'il n'y a pas de besoins spécifiques, pour un back par exemple j'utilise:
- un dérivé de MVC (Modèle-Contrôleurs-Services)
- en séparant différents modules non-métier assez communs dans des dossiers dédiés: routage, authentification, scripts d'initialisation, gestion des erreurs, éventuels appels réseau, ...
- L'idée de séparer le code métier du code "technique" est inspirée de Clean Architecture(d'autres archis le font également), qui veut séparer le code "d'infrastructure" du code "métier"
- Au coeur de la réflexion également: une architecture connue est plus à même d'être maîtrisée par toute l'équipe / les nouveaux arrivants, et donc moins de risque de la casser.
- j'évite au possible le code stateful - et donc les classes. Il y en a uniquement aux endroits où elles sont significativement plus adaptées que du code non-objet, comme par exemple une API nécessitant des credentials, que je vais appeler un certain nombre de fois, potentiellement éloignés de là où je lui passe ses credentials.
- Pour le nommage de mes variables et noms de fonctions, j'utilise notamment (mais pas que) le language ubuquitaire tel que défini par le DDD - disons plus simplement le "langage métier".

Bref, je mange - sans complexe - à tous les rateliers (de l'archirecture logicielle) ^^'

#### Manuellement
Comme je l'ai dit à plusieurs d'entre vous à une formation précédente, une fonction de 100+ lignes ça n'existe juste pas, et une fcontion de 60+ lignes c'est rare et spécifique au JSX; pour le JS, la moyenne devrait être à 20-30 lignes, et le max à 40. Aller au-delà de cette ligne, c'est très probablement intriquer diférents objectifs, et c'est le début d'un code spaghetti, ou d'un God Object.

##### Clean Code
TODO

## Autre qualités du consultant développeur
TODO c'est cool un code de bonne qualité, mais ça n'est pas la seule métrique du succès d'un projet informatique.

### Des process adaptés à ceux qui les utilisent
TODO
On se rapproche un peu du "software craftsmanship", cf leur manifeste: https://manifesto.softwarecraftsmanship.org/

### Une bonne estimation du savoir
On sait estimer ce qu'on sait (et à quel point on le sait/maîtrise), mais aussi ce que l'on ne sait pas.

On sait également estimer les connaissances de notre prochain dans les domaines professionnels qui nous concernent, pour savoir quand il vaut mieux faire valoir son point de vue, et quand il vaut mieux écouter celui qui en sait plus que nous et peut nous enrichir par la même occasion. 

## Techniques spécifiques
### Guidelines de dev
TODO: cf les guidelines de contribution sur github de technos populaires: Angular, React, Next.js, Mongoose, Prisma, Sequelize.

### Signaler un bug / un comportement étrange à un dev
TODO: cf les formulaires d'ouvertures de github issues de technos populaires: Angular, React, Next.js, Mongoose, Prisma, Sequelize.

### Le boy scout
On laisse le code dans un aussi bon état - voir meilleur - que celui dans lequel on l'a trouvé. Par exemple, si on trouve un comportement suspect:
- on essaie de reproduire, comprendre et faire cesser ce comportement, si c'est à notre portée
- on signale ce comportement à l'équipe, avec laquelle on collabore potentiellement en tant que lanceur de l'alerte initiale.

### Le SoC pendant le dev d'une nouvelle feature
#### L'exemple du JSON imbriqué à représenter en table HTML
Objectif:

Passer de:
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

En pensant que le HTML en question devra être extensible / customisable (style + rendering + listeners), au niveau de la table, des headers, des lignes et des cellules, car on va très probablement vouloir customiser cette table par la suite.

Spoiler: les maquettes livrées 1 ou 2 mois après prévoyaient effectivement d'utiliser intensivement ces possibilités d'extensivité... Autant y penser maintenant, vu le morceau, c'est une bonne idée de ne pas avois à y toucher trop souvent, pour éviter les régressions ^^

##### État des lieux
On possède une très jeune application React, en react-admin. L'architecture est légère: tous les composants sont dans un dossier "composants/". On n'a pas de tests en place (encore).

Notre code n'aura aucune dépendance (un bouton déjà existant, un composant créateur de table déjà existant, ...). Tout est à faire, mais on a de la liberté, et peu de chance que l'évolution d'une dépendance casse le code de la fonctionnalité (maintenant ou dans le futur).

On a cherché des libs sur NPM qui visent à repésenter des cellules fusionnées/aggrégées de JSON imbriqué dans une table HTML, sans succès. Il va falloir développer la notre. 

Au niveau de l'architecture, on a déjà sur d'autres fonctionnalités un composant "glue" qui fait le lien entre des composants génériques de rendu et du code react-admin (c'est ce code qui va passer l'objet "data" à notre composant de rendu), lui-même appelé par une (sous-)vue, elle-même appelée par un layout, etc.

##### Conception initiale
On pressent pas mal de lignes de code. Par simplicité, on va garder dans un premier temps le code de la feature (le composant "glue" + le composant "générique") dans le fichier qui l'appelle (la sous-vue).

On songe aussi par la suite à appliquer le pattern container/presenter, assez connu en react. Au-delà de faire du SoC et d'introduire des points de contrôle supplémentaires, ce pattern va nous permettre de pouvoir changer rapidement de composant de rendu pur si besoin (de <table><tbody><tr><td> à <div><div><div><div> notamment, mais on peut aussi penser à du d3.js).

Au niveau de la philosophie, on va créer ce composant (logiciel, pas "React") comme une bibliothèque qu'on aurait utilisé si elle avait existé.
Par exemple, si Datatables permettait une telle fonctionnalité et qu'on l'avait utilisé. On va d'ailleurs s'inspirer de l'interface de datatables pour la définition des colonnes, "définitions de colonnes" qui servira à la fois à générer les en-têtes et les données du corps de notre table.

S'inspirer pour l'interface de ses composants réutilisables de celles des libs externes populaires est d'ailleurs un moyen à la fois peu risqué et peu couteux cognitivement d'arriver à un résultat durable. On peut aussi s'inspirer d'autres éléments, comme par exemple l'ontologie d'un module manipulant des objets similaires à ceux de notre fonctionnalité.

##### Réalisation initiale
On fait un PoC dans un fichier existant. Certaines de nos fonctions font jusqu'à 60 lignes, on a ajouté en tout 140 lignes; l'ensemble des spécifications n'est pas encore présente, mais on a un "coeur de fonctionnalité".

##### Premier refactor
On voit maintenant plus clairement ce qu'on entrevoyait avant d'entammer le premier jet. On applique donc plus strictement:
- la séparation "react-admin" / reste
- la séparation React (JSX + hooks) / pure JS (une manière de mettre en place container/presenter)

On sépare aussi nos grosses fonctions en plus petites, généralement en les groupant par utilisation simultanées de différentes variables.

##### Re-conception
On commence à créer une ontologie, pour mettre un vocabulaire plus explicite à nos variables: on créer un champ lexical de "lignes aggrégées / ventilées", "DOM virtuel" (du JSON facilement transformable en table HTML), etc.

Le virtual DOM en question ressemble par exemple à:
```
const data = [{
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

##### Seconde phase de réalisation
On réalise les spécifications (sous-fonctionnalités) manquantes. Cela rajoute environ 40 lignes de code, à différents endroits.

On prend conscience que le coeur de l'intelligence de notre code n'est pas dans le présenteur, mais celui-ci est une documentation idéale pour monter l'utilisation et les possibilités de notre virtual DOM de rows aggrégés.

##### Dernière conception
La précédente étape nous a permis de tester si on doit encore séparer différents objectifs, on se sert du résultat ici. 

Elle a fait ressortir que deux de nos "plus petites fonctions" ont beaucoup grossi avec l'arrivée des "fonctionnalités secondaires". Elles représentent a priori les points privilégiés pour l'extensivité de l'ensemble du module, on aménage donc leurs arguments - ainsi que ceux de la fonction d'entrée / d'administration pour accueillir cette extensivité. Parties concernées: rendering des cellules, génération des attributs du vDOM, présenteur par défaut.

Également, on a mis du code lié à notre virtual dom dans le présenteur (pour permettre à l'utilisateur de numéroter les sous-rows et de repérer le dernier, via des classes CSS), on va le transformer en génération d'attributs dans le vDOM à la place.

##### Réalisation finale: nettoyage
On transforme le PoC en quelque chose de propre.

Le code va dans plusieurs fichiers séparés:
- le composant "glue" va dans le fichier dédié à ce type de composants. On en profite pour lui ajouter une finctionnalité qu'on retrouve sur d'autres comosant de ce fichier: le shimmering.
- le présenteur et le code de génération du vDOM () vont pour l'instant tous les deux dans GroupedRows.jsx . On fait en sorte le maximiser l'extensibilité, pour optimiser l'utilisation du principe open/closed (le "O" des principes SOLID)

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

##### Rétrospective
Le compromis entre noms explicites et noms simples n'est pas forcément optimal, pour le coeur de fonctionnalité. Les noms ne sont pas tous explicites sur ce qu'ils font ou ce qu'ils retournent. Quand on lit leur noms, on ne voit pas une histoire claire se dégager.

On voit tout de même un lien de parenté entre degroupedRow et degroupedRowVirtualDOM, ainsi qu'entre degroupedRowVirtualDOM et generateVirtualDOM.

Également, du code de GroupedRows devrait être placé dans une fonction dédiée en pur JS, et se faire instancier par le conteneur react.

##### Addendum
Une autre manière d'architecturer un composant est la "méthode des couches/layers".

Lorsqu'on clique sur un lien dans une page HTML vers un domaine externe, cela déclenche toute une série d'évènements, qui va notamment passer par les couches OSI. Pour visualiser: https://fr.wikipedia.org/wiki/Mod%C3%A8le_OSI .

Ce qu'on observe, c'est que chaque couche a son propre objectif, et a un exécutable/périphérique (ou plusieurs) dédié à la réalisation de cet objectif. Puisque chaque objectif est finement défini, l'exécutable en charge de l'appliquer n'est pas énorme, et sa maintenance rendue aisée par sa petite taille.

Une couche OSI n'est pas qu'un objectif, c'est aussi un ensemble de sous-fonctionnalités ainsi qu'un langage / monde spécifique (protocoles et services). La sortie de chaque couche est une enveloppe (élargissons à une transformation) de son entrée, et l'entrée et la sortie de chaque couche sont clairement définis (par des datagrammes dans le modèle OSI)

On va s'inspirer de ce "découpage mental" dans nos fonctionnalités complexes et imaginer le cheminement de notre transformation (du JSON imbriqué initial au JSX final) au travers de nos propres couches. Par exemple pour un composant JSX de lignes aggrégées (qui affiche du JSON imbriqué dans une table HTML), on imagine:
- une couche de dégroupage du JSON (degroupedRow), qui nous ressort un tableau de lignes dégroupées.
- une couche de rendu du DOM virtuel (generateVirtualDOM), qui est notamment chargé de créer les cellules du DOM virtuel à partir de la définition des colonnes.
- une couche d'enrichissement des lignes dégroupées (degroupedRowVirtualDOM + la partie JS de GroupedRows)
- une couche de rendu HTML/JSX (GroupedRowsPresenter), qui va transformer le virtual DOM en une table HTML

##### Conclusion
Plus on a d'outils (mentaux/architecturaux ici), plus on peut choisir le meilleur.

On ne fait pas parfait du premier coup - ni même du 2e, cf la rétrospective; mais on peut quand même faire quelque chose de plutôt lisible et durable sans y passer trop de temps.

Cet exercice est inspiré de l'exercice de refactor de Robert C Martins, dans "Clean Code", chapitre "Refactoring serialdate", qui lui adopte une approche très différente, plus simple mentalement que les deux présentées ci-dessus mais tout aussi instructive.
TODO


### l'exemple de l'export excel sur eCSAR
TODO
