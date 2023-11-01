## Qualité du code et de la codebase
TODO

On va voir ici plein de concepts, dont certains se contredisent. Ne prenez rien pour acquis, mais je vous déconseille de jeter le bébé avec l'eau du bain ;-)


## C'est quoi, une codebase de qualité?
Ici on tente TODO

### De manière générale
On note dans le portail de la "Gestion de la qualité logicielle" (https://fr.wikipedia.org/wiki/Qualit%C3%A9_logicielle#Voir_aussi) des ensembles de pages dédiés à:
- Compréhension et contrôle du code source
- Remaniements (refactors)
- Principes de programmation
- Mauvaises pratiques

Ce portail regorge de notions intéressantes (oui, je parle bien de wikipedia), mais faire une formation dessus ne présenterait que peu de valeur ajoutée: après tout il vous suffit de cliquer sur des liens pour avoir du contenu à lire, et les articles wikipedia sont très souvent digestes et accessibles (contrairement aux articles de recherche ou aux brevets).

### C'est quoi, une codebase de mauvaise qualité?
Plutôt que de donner une définition quelque peu abstraite ici, passons en revue des situations courantes dans le monde du développement informatique:
- le code n'est pas lisible: gros pavés non aérés, lignes trop longues, ...
- le code n'est pas compréhensible: on n'arrive pas à voir d'organisation s'en dégager (des vues, layouts, composants génériques, composants spécialisés, presenters, data transformers, routes, contrôleurs, modèles, entités, authentification, helpers, code réutilisable, etc)
- le code et bug-prone (sujet/vulnérable aux bugs): un code où des objectifs/fonctionnalités différent(e)s se mélangent risque beaucoup plus une régression sur la fonctionnalité A lorsqu'on améliore la fonctionnalité B qu'un code où les obectifs ont correctement séparés, et bien indentifiables par les noms des variables et des fonctions.
- le code ne permet pas l'intégration / l'utilisation aisée d'outils d'aide à l'amélioration de la qualité du code: il est difficile de faire des tests unitaires (pas de dependency injection), les développeurs ne connaissent pas la commande pour linter le code, ...

De manière générale, le développement initial est assez peu un problème ici: tous les devs savent développer une fonctionnalité. La qualité décrit le travail dont toute une partie des fichiers sera moins souvent réécrit, celui dans lequel on aura moins souvent de bugs & régressions; celui qui est agréable à consulter, compréhensible, maintenable et qui dure dans le temps.

#### Le code sujet aux bugs: illustration
Cette propriété est particulièrement injuste: en voici un exemple.

Imaginons les développeurs Alice et Bob: Alice produit un code clair, alors que Bob n'en n'a pas grand chose à faire (par exemple, Bob pourrait croire qu'une techno magique - au hasard typescript - est nécessaire et/ou suffisante pour faire de son code un code de grande qualité).

Bob développe les fonctionnalités A et B; les fonctionnalités sont là, lais le code est difficilement compréhensible, et très bug-prone. Alice doit intervenir sur la fonctionnalité A, et donc sur le code de Bob. Elle rencontre des difficultés à intégrer son travail (qui n'auraient pas existé si Bob avait fait quelque chose de qualité), et délivre finalement son code avec un délai de retard (par rapport à son estimation). Alice est une développeuse talentueuse (son style a déjà été mis en avant par ses collègues 'autre projets), mais son code n'est pas d'une aussi bonne qualité qu'elle aurait voulu (elle est perfectionniste): l'environnement ne le permettait pas et aurait nécessité un refactor de grande ampleur.

Quelques jours plus tard, le client se rend compte que la fonctionnalité B ne marche plus; Bob, après un rapide audit via le "git blame" intégré à VSCode pointe du doigt le travail récent d'Alice. Le client est très énervé (ça n'est pas le premier retard ni la première régression du projet, et c'est loin d'être la fin), et demande d'enlever un des deux développeurs du projet; en tant que lead dev, allez-vous essayer de préserver Alice ou Bob?

### Quels causes à une baisse de qualité?
- un mauvais design: on appelle plus volontiers le design une architecture, dans notre discipline.
- les devs n'intègrent pas nativement dans leurs livrables / tâches des contrôles de la qualité du code, ni n'ont explicitement ce type de contrôles dans leur flow de réalisation d'une tâche. Il existe par exemple la code review, mais on peut songer à d'autres formes de contrôle comme une liste de points de contrôle.
- un projet ne permettant pas de lancer facilement des outils de contrôle automatisés: le linter doit s'interfacer avec l'IDE (bon le linter de vscode craint un peu, il faut installer manuellement une l'exécutable eslint, c'est pas la faute du dev), et 

## Axes d'amélioration
TODO
Exemples:
- une communication d'équipe fluide
- des process de travail normés (tout en étant aussi peu contraignants que possible)
- une architecture à chaque niveau de granularité: projet (multi-composants), composant (un exécutable donné), fichier, fonction, ligne

### Exemples pratiques
Les technos / frameworks / etc listés ici n'y sont qu'à titre d'exemples, et on chacun au moins une alternative dans leur domaine. À vous de chercher!

#### Linting
##### ESLint
TODO eslint: règles paramétrables.
Important: vous devez savoir pourquoi - et vous justifier si on vous demande quand - vous ajoutez chaque règle! Évitez dont de bêtement prendre le premier set de règles venu, ce qui peut être contraignant!

#### Typescript
TODO Typescript
Aussi bien un linter type ESLint (mais non paramétrable) qu'un langage à part entière.

#### Automatisation de la CI
TODO github flows et scripts shell

#### Automatisation de la CD
Outils populaires: Github Actions, Azure devops / pipelines, Jenkins

#### Docker
TODO
Un peu hors scope, donc on va passer rapidement dessus
Un compagnon idéal pour la portabilité (compatibilité), avec son bonus devops

### Architecture
Définition (https://www.cnrtl.fr/definition/architecture): Principe d'organisation d'un ensemble, agencement, structure.

On peut inférer que l'architecture informatique est la manière de structurer un système informatique, mais aussi le code qui leui sert de base.

L'architecture informatique est comme l'architecture classique ou l'architecture d'intérieur. Il s'agit de décider de la disposition des pièces et meubles les uns par rapport aux autres, car chaque chose a une place: les chaussettes propres et sèches vont a priori dans la chambre, les couverts à la cuisine, etc. Et ceci car nos chaussettes servent à nous habiller, nos couverts à manger, etc. Dans notre codebase aussi, les bouts de code dont l'objectif, l'environnement (dont domaine technique/métier) et/ou les dépendances sont communes iront à des endroits similaires.

Toujours par analogie avec l'architecture classique, l'architecture informatique doit être adaptée aux besoins / spécificités du projet. Inutile "d'over-enigeer-er".

### Quelques méthodologies et architectures connues
TODO
Je n'ai pas séparé architecture et méthodologie, car la plupart des architectures sont intrinsèquement liées aux méthodologies permettant de les mettre en place. C'est valable par exemple dans le cas de la 12FA.

Note: "Pattern" (motif en français) désigne également une forme (simple) d'architecture.

- MVC
- REST
- 12FA (twelve-factors app)
- Clean Code
- Clean Architecture
- Onion Architecture
- Hexagonale / Ports & Adapters
- Domain Driven Design (DDD)
- Microservices
- MVVM
- TDD, BDD
- Flux
- LAMP

Pour une liste plus complète: https://fr.wikipedia.org/wiki/Cat%C3%A9gorie:Architecture_logicielle

### Système de classement des normes architecturales
Dans le domaine du développeur comme dans celui des métiers de la maison, il y a plusieurs niveaux / grains d'action des règles d'architectures:
- gros grain: l'urbanisme (ça s'appelle aussi comme ça en informatique). Cette discipline est plutôt orientée designers et administrateurs systèmes.
- moyen-gros grain: l'architecture inter-composants (logiciels), comparable à l'architecture d'un complexe (hôtelier), d'un quartier résidentiel ou d'un immeuble. Un composant logiciel d'un projet est un exécutable prévu en fonctionnement dans la phase d'exploitation nominale du projet.
- moyen grain: l'architecture intra-composants (logiciels), tel que l'architecture des pièces de l'appartement: l'emplacement des fenêtres, du garage, de l'atelier, du balcon, etc. En informatique, il s'agit de l'arborescence de fichiers, de ce qu'on pet dans chaque fichier et de comment on le nomme.
- grain fin: l'architecture intra-fichier, qu'on peut comparer à l'architecture d'interieur (mais aussi aux placements de sculptures et bas-reliefs sur une façade extérieure). On y parle notamment de nommage des fonctions et agencement de celles-ci entre elles. 
- grain très fin: l'architecture intra-fonction: nommage des variables, algorithmie, aération du code, taille des fonctions, ...

Ce moyen de classer les règles/normes d'architecture n'est bien sûr pas le seul, mais c'est celui que je vous propose d'utiliser ici. Une architecture va être un ensemble de ces règles, à un ou plusieurs niveaux. Par exemple, la méthodologie 12FA agit (au moins) aux granularités projet et composant.

#### Entre les composants logiciels
TODO

##### REx
On parle souvent de microservices: c'est loin d'être systématiquement une bonne idée, par rapport à du monolithique... Gaffe à la lourdeur des interfaces de communication entre les différents composants (y compris au niveau de la gestion des erreurs, sérialisation d'éléments supplémentaires, toussa).

De l'event-driven pour la communication entre les composants est aussi possible et assez scalable (kafka, RabbitMQ, ...), même si ça nécessite des connaissances / une expérience spécifique(s) pour éviter de faire du code spaghetti - et donc une équipe formée à cette manière de faire.

#### À l'intérieur du composant logiciel
Comme je l'ai dit à plusieurs d'entre vous à une formation précédente, une fonction de 100+ lignes ça n'existe juste pas, et une fcontion de 60+ lignes c'est rare et spécifique au JSX; pour le JS, la moyenne devrait être à 20-30 lignes, et le max à 40. Aller au-delà de cette ligne, c'est très probablement intriquer différents objectifs, et c'est le début d'un code spaghetti, ou d'un God Object.

TODO

##### Clean Code
TODO

##### REx
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

Bref, je mange - sans complexe - à tous les rateliers (de l'architecture logicielle) ^^'

## Techniques spécifiques
### Guidelines de dev
TODO: cf les guidelines de contribution sur github de technos populaires: Angular, React, Next.js, Mongoose, Prisma, Sequelize.

### Signaler un bug / un comportement étrange à un dev
Nous travaillons avec des systèmes complexes. À l'instar des docteurs et du corps humain, nous et notre logiciel avons besoin de différents éléments de diagnostics pour poser un diagnostic de ce qui ne va pas, avant de le résoudre: radios, analyses sanguines et ausculataion au stéthoscope deviennent logs applicatifs, `console.log()` placés ponctuellement et debuggers.

Dans ce cadre, il nous arrive régulièrement d'avoir à échanger autour de nos problèmes avec des collègues pour résoudre des problèmes.

Il est donc fondamental:
- de savoir fournir le plus de données possibles à l'établissement du diagnostic, et en premier lieu différents types de logs: logs de sortie et d'erreur d'un routeur, logs applicatifs de (node, docker, ...), sortie d'une commande (par exemple pour le build d'une image docker, le mieux est la sortie de `docker compose build <service> --progress=plain`), logs systèmes (ex.: dmesg, journalctl), etc
- de savoir parmi tous les outils qu'on a sous la main lesquels sont les plus pertinents (histoire de ne pas flooder notre interlocuteur d'informations inutiles)
- de savoir ajouter les éléments pertinents à sa demande d'aide. Votre interlocuteur n'est pas dans votre tête: à vous de lui fournir suffisamment d'éléments pour:
  1. d'une part qu'il comprenne votre objectif: "je veux ... et pour ce faire, j'ai besoin de ... mais je suis bloqué par ..."
  2. d'autre part qu'il juge si il a les connaissances nécessaires pour vous aider,
  3. également que vous êtes dans une situation suffisamment problématique pour qu'il vous accorde son temps (son temps est précieux, ne le gâchez pas sans avoir déjà sérieusement cherché des solutions de votre côté)
  4. et enfin qu'il ait un minimum (voir pas) de questions à vous poser: minimisez les allers-retours
- de savoir bien formuler sa demande d'aide:
  * par exemple commencer sa demande par "ça ne marche pas (quand je fais X)" puis attendre qu'on nous réponde, c'est pas très efficace - ni très respectueux de votre interlocuteur. C'est mieux si vous fournissez la liste exhaustive des actions faites / commandes lancées en vous étant assuré que le comportement est bien évidmment reproductible, ainsi qu'un retour exhaustif du système menant au comportement problématique: par exemple si il s'agit d'une commande, l'ensemble de la sortie de la commande depuis son lancement (et pas juste les 5 dernières lignes).
  * D'autre part, soyez polis et concis: le temps de votre interlocuteur est précieux, ne le gâchez pas. Si vous avez du mal à visualiser ce point, imaginez que vous vous adressez à David ou Frédéric.
  * la (quasi-?)totalité des projets populaires sur Github possèdent des formulaires d'ouvertures de github issues de technos populaires: Angular, React, Next.js, Mongoose, Prisma, Sequelize. On peut d'ailleurs aller y faire un tour rapide, pour voir à quoi ils ressemblent.

### Le boy scout
On laisse le code dans un aussi bon état - voir meilleur - que celui dans lequel on l'a trouvé. Par exemple, si on trouve un comportement suspect:
- on essaie de reproduire, comprendre et faire cesser ce comportement, si c'est à notre portée
- on signale ce comportement à l'équipe, avec laquelle on collabore potentiellement en tant que lanceur de l'alerte initiale.

### Le SoC pendant le dev d'une nouvelle feature
Cf `./new-feature-SoC.md`

