# Qualité du code et de la codebase
Qu'est-ce qu'une codebase de qualité? À quoi est-elle utile/bénéfique? À quel point est-elle profitable pour le projet, en terme de temps & délais, d'organisation, d'argent? Quels efforts l'équipe doit-elle produire (formation des collaborateurs, tâches "moins plaisantes" comme fix manuel des règles de lingting ou écriture des tests, temps supplémentaire pris par ces tâches de routine, etc)?

On va voir ici plein de concepts, dont certains se contredisent. Ne prenez rien pour acquis, mais je vous déconseille de jeter le bébé avec l'eau du bain ;-)

## C'est quoi, une codebase de qualité?
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

Un code de qualité n'est pas un code que vous avez écrit et trouvez clair, c'est un code que vous avez écrit et que les autres développeurs de votre équipe trouvent clair. Un code qui fait qu'ils risquent peu d'introduire des régressions.

### Quels causes à une baisse de qualité?
- un mauvais design: on appelle plus volontiers le design une architecture, dans notre discipline.
- les devs n'intègrent pas nativement dans leurs livrables / tâches des contrôles de la qualité du code, ni n'ont explicitement ce type de contrôles dans leur flow de réalisation d'une tâche. Il existe par exemple la code review, mais on peut songer à d'autres formes de contrôle comme une liste de points de contrôle.
- un projet ne permettant pas de lancer facilement des outils de contrôle automatisés: le linter doit s'interfacer avec l'IDE (bon le linter de vscode craint un peu, il faut installer manuellement une l'exécutable eslint, c'est pas la faute du dev), et 

## Code de qualité et valeurs de Seagus
Si vous voulez relier le code de qualité aux valeurs de Saegus, un code de qualité:
- c'est agréable ("fun") à lire, et on est à l'aise sur un projet qui en a
- c'est l'excellence, presque par définition (en vrai c'est une bonne qualité et pas une excellente, mais je ne vais pas chipoter ^^)

Notez que si vous produisez de l'excellence, parfois elle ne se voit pas du premier coup d'oeil (un client qui est PO et donc souvent non tech va avoir du mal à comprendre la qualité de la codebase et des process d'équipe), c'est à vous de prendre le temps d'expliquer les tenants et aboutissants, de lui donner des métriques (régressions hebdo now VS il y a 2 mois) pour qu'il puisse mesurer la pertinence du clean code, et comment par exemple ça lui permet de mieux planifier le projet (moins de régressions = agenda plus prévisible), rendre ses utilisateurs heureux (les MEP contiennent moins de mauvaises surprises donc les users ouvrent moins de tickets), rendre ses développeurs heureux - car c'est rarement agréable de travailler au milieu d'un code spaghetti dont les noms des objets informatiques (fonctions, variables) n'ont que peu de sens.

## Axes d'amélioration
Grandes familles de pistes à explorer:
- communication d'équipe: cf plus loin dans la formation
- process de travail normés: cf plus loin dans la formation
- une architecture à chaque niveau de granularité: projet (multi-composants), composant (un exécutable donné), fichier, fonction, ligne

### Exemples pratiques
Les technos / frameworks / etc listés ici n'y sont qu'à titre d'exemples, et on chacun au moins une alternative dans leur domaine. À vous de chercher!

#### Linting
##### ESLint
On en a déjà parlé avant comme un outil de règles communes d'équipe, ici on va le voir comme un moyen d'augmenter la qualité à l'échelle individuelle.

Les règles ESlint peuvent être classées de différentes manière:
- celles qui sont auto-fixables et celles qui ne le sont pas
- celles qui sont essentiellement stylistiques (ex.: quotes, comma-dangle), celles qui augmentent la lisibilité (ex.: max-lines-per-function) et celles qui permettent d'éviter des bugs (ex. no-undef)
- celles qui retournent souvent des endroits où la qualité du code peut être améliorée et celles qui retournent plus de "faux positifs"

Il est important de savoir pourquoi - et vous justifier si on vous demande quand - vous ajoutez chaque règle! Évitez dont de bêtement prendre le premier set de règles venu, ce qui peut être contraignant pour vos collègues voir contre-productif (en terme de lisibilité)!

#### Typescript
L'écosystème typescript peut être vu aussi bien comme un linter type ESLint (mais non paramétrable) que comme un langage à part entière.

##### REx eCSAR
Sur eCSAR, j'ai dû développer deux nanoservices, l'un scrappant les données de différentes APIs internes, et l'autre assemblant les données de ces différents API - avec notamment des jointures sur des champs.

Nous nous sommes retrouvés à régulièrement (plusieurs fois par mois) changer les APIS pour d'autres APIs ou d'autres versions. Les APIs renvoyaient des réponses aux schémas complexes, dont je n'avais pas de typage fourni a priori. Réécrire des types à chaque changement aurait été coûteux en temps, et l'expérience a montré que le peu de régressions qui a existé a été résolu assez rapidement. On a gagné du temps en n'utilisant que des maquettes & un healthcheck (une forme de test d'intégration) plutôt que typescript. 

D'autre part, le projet est centré sur de la data avec des règles métier complexes. Une partie de ces règles n'était tout simplement pas représentable avec Typescript, comme par exemple le fait que telle API ne nous renvoie que les FIL codes publiés, et pas l'ensemble des FIL codes qu'on lui a demandé en input.

Si typescript n'avait pas sa place sur ces composants logiciels, il a toutefois plus de pertinences à d'autres endroits; un autre composant logiciel, en charge d'appliquer des règles de validation et de transformation du formulaire NMPA précédemment généré, est composé d'un orchestrateur et de règles. En typant les deux et en prévoyant une structure modulaire, on a ajouté une documentation automatique à un code dont on a prévu préalablement les points fixes (l'orchestrateur ne devrait a priori plus être touché) et les points amenés à changer souvent (les règles elles-mêmes) dans le code.

Est-ce que TS est très utile ici? Je n'en sais pas grand-chose - après tout, le code des règles existantes sans TS (en JS pur) est une excellente base pour écrire une nouvelle règle par mimétisme; en tout cas TS ici ne devrait pas freiner le développeur avec des types trop rigides / incompréhensibles (par rapport à l'expérience du retrieve et du transform).

En bref, Typescript n'est pas adapté à tous les projets, et notamment pas à ceux dont des types peuvent évoluer régulièrement et dont on n'a pas la main dessus.

##### Avantages
- permet (souvent) d'éviter les erreurs d'inattention de typage
- interfaçage avec l'IDE (intellisense), au plus proche du moment de l'écriture du code (et pas en phase de déploiement/CI par ex.)
- permet de documenter efficacement (et en partie automatiquement, dépendant de l'usage qu'on en fait) des types pouvant être complexes sur des grosses application telles que celles qu'on écrit plus ou moins souvent. Pratique notamment pour le travail en équipe 
- maintenabilité: tendance à fixer le code / le rendre moins aisément réécrivable: pratique quand on est en train d'écrire une lib de fonctions/composants réutilisables, qui devraient peu/pas bouger dans le temps
- interfaçage avec des outils populaires comme swagger

##### Inconvénients
- norme beaucoup le style d'écriture du JS
- non paramétrable sur les règles de linting (contrairement à un linter classique)
- Configuration difficile: on aimerait par exemple avoir un mode qui transpile en JS en enlevant juste les annotations TS, sans réécrire le JS. On ne comprend pas pourquoi une fonction de transpilation de version de JS à été ajoutée obligatoirement au type checker et au transpiler TS->JS - qui auraient juste bien fait le job.
- potentiel de rendre le JS moins lisible V1: les annotations s'intriquant profondément dans le JS et, si on ne fait pas attention à son écriture, rend l'algorithmie difficile à lire
- potentiel de rendre le JS moins lisible V2: les @ts-ignore peuvent vite devenir envahissants si on n'y fait pas gaffe - ai même titre que les annotations d'ignorance des linters.
- maintenabilité: tendance à fixer le code / le rendre moins aisément réécrivable: c'est gênant lorsqu'on doit faire évoluer des composants
- Des devs ont tendance à s'appuyer uniquement dessus pour la qualité de peur code, en négligeant les autres outils / leviers qui permettent d'avoir un code de qualité. Typescript est un outil parmi d'autres, ce n'est pas l'alpha et l'oméga
- Des devs ont tendance à mettre TS partout sans vraiment réfléchir à si il est pertinent de l'ajouter. Cf REx d'eCSAR.
- plus value diminuée (mais aps annulée) si on utilise des tests

#### Automatisation de la CI
Des flows populaires:
- Git flow: préfixage de branches avec automatisations de commandes git: https://docs.github.com/en/get-started/quickstart/github-flow
- One flow, une spin-off de Git flow
- Github flow: il s'agit d'un flow à features requests: https://docs.github.com/en/get-started/quickstart/github-flow
- Gitlab flow: ressemble un peu au Github flow
- Trunk-based development: on travaille sur une branche commune, avec parfois des feature branches: https://www.toptal.com/software/trunk-based-development-git-flow
- dev-based branch: ce flow est facile à mettre en place, et présente des avantages certains (responsabilisation du dev sur sa branche), mais présente aussi des inconvénients; suffisamment d'inconvénients pour qu'il ne soit pas conseillé à l'utilsation en équipe.

Queslaues comparatifs:
- https://medium.com/@patrickporto/4-branching-workflows-for-git-30d0aaee7bf
- https://www.nicoespeon.com/fr/2013/08/quel-git-workflow-pour-mon-projet/

##### Un flow personnel
Je travaille souvent directement sur la branche de développement (`dev` chez moi). J'utilise rebase (plutôt que "squash", le mode par défaut). Je fais plein de petits commits, plutôt qu'un gros. Je stash plutôt que de faire des feature branches (même si j'en fais parfois). Avantages & inconvénients:
- en travaillant directement sur dev, mon code est plus facilement - et donc plus souvent - synchronisé (dans un sens ou dans l'autre) avec le code commun distant. Mes merge conflicts sont donc moins gros. Si utilisé avec des petits commits, mes merges conflicts sont souvent plus simples à gérer.
- le rebase rend certains merge conflicts plus longs à résoudre, d'autres moins.
- le rebase met en valeur les commits aux messages bien rédigés.
- le rebase vient avec plus de commandes git. Par exemple des stashs systématiquement avant les pulls. Pour contrebalancer cette charge supplémentaire, on peut créer des scripts (disons des scripts bash, normalement compatibles avec tous les OS), qui vont lancer ces commandes pour nous (checkout/pull/checkout/(merge/rebase)/checkout/rebase/push par exemple). On peut en profiter pour leur donner un peu d'intelligence afin qu'ils automatisent toujours plus le flow.

#### Automatisation de la CD
Outils populaires: Github Actions, Azure devops / pipelines, Jenkins

#### Docker
Docker est un peu hors scope, donc on va passer rapidement dessus.

C'est un compagnon idéal pour la portabilité (compatibilité), avec son bonus devops: environnements d'exécution uniformes pour tout les devs ainsi que pour les environnements déployés, ce qui permet d'éviter les classiques problèmes de différences d'environnements.

Pour un tuto sur docker, cf la dormation que j'ai donné en début d'année.

### Architecture
Définition (https://www.cnrtl.fr/definition/architecture): Principe d'organisation d'un ensemble, agencement, structure.

On peut inférer que l'architecture informatique est la manière de structurer un système informatique, mais aussi le code qui leui sert de base.

L'architecture informatique est comme l'architecture classique ou l'architecture d'intérieur. Il s'agit de décider de la disposition des pièces et meubles les uns par rapport aux autres, car chaque chose a une place: les chaussettes propres et sèches vont a priori dans la chambre, les couverts à la cuisine, etc. Et ceci car nos chaussettes servent à nous habiller, nos couverts à manger, etc. Dans notre codebase aussi, les bouts de code dont l'objectif, l'environnement (dont domaine technique/métier) et/ou les dépendances sont communes iront à des endroits similaires.

Toujours par analogie avec l'architecture classique, l'architecture informatique doit être adaptée aux besoins / spécificités du projet. Inutile "d'over-enigeer-er".

#### Quelques méthodologies et architectures connues
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
- CQRS
- Event Sourcing
- Microservices
- MVVM
- TDD, BDD
- Flux
- LAMP

Pour une liste plus complète: https://fr.wikipedia.org/wiki/Cat%C3%A9gorie:Architecture_logicielle

#### Système de classement des normes architecturales
Dans le domaine du développeur comme dans celui des métiers de la maison, il y a plusieurs niveaux / grains d'action des règles d'architectures:
- gros grain: l'urbanisme (ça s'appelle aussi comme ça en informatique). Cette discipline est plutôt orientée designers et administrateurs systèmes.
- moyen-gros grain: l'architecture inter-composants (logiciels), comparable à l'architecture d'un complexe (hôtelier), d'un quartier résidentiel ou d'un immeuble. Un composant logiciel d'un projet est un exécutable prévu en fonctionnement dans la phase d'exploitation nominale du projet.
- moyen grain: l'architecture intra-composants (logiciels), tel que l'architecture des pièces de l'appartement: l'emplacement des fenêtres, du garage, de l'atelier, du balcon, etc. En informatique, il s'agit de l'arborescence de fichiers, de ce qu'on pet dans chaque fichier et de comment on le nomme.
- grain fin: l'architecture intra-fichier, qu'on peut comparer à l'architecture d'interieur (mais aussi aux placements de sculptures et bas-reliefs sur une façade extérieure). On y parle notamment de nommage des fonctions et agencement de celles-ci entre elles. 
- grain très fin: l'architecture intra-fonction: nommage des variables, algorithmie, aération du code, taille des fonctions, ...

Ce moyen de classer les règles/normes d'architecture n'est bien sûr pas le seul, mais c'est celui que je vous propose d'utiliser ici. Une architecture va être un ensemble de ces règles, à un ou plusieurs niveaux. Par exemple, la méthodologie 12FA agit (au moins) aux granularités projet et composant.

##### Entre les composants logiciels
TODO

###### REx
On parle souvent de microservices: c'est loin d'être systématiquement une bonne idée, par rapport à du monolithique... Attention à la lourdeur des interfaces de communication entre les différents composants (y compris au niveau de la gestion des erreurs, sérialisation d'éléments supplémentaires, toussa). L'expérience eCSAR me fait estimer à environ 3 semaines sur 34 le temps perdu par le fait d'avoir choisi une architecture microservices plutôt que monolithique (le choix n'est pas de moi), soit environ 9% du temps du projet.

De l'event-driven pour la communication entre les composants est aussi possible et assez scalable (kafka, RabbitMQ, ...), même si ça nécessite des connaissances / une expérience spécifique(s) pour éviter de faire du code spaghetti - et donc une équipe formée à cette manière de faire.

##### À l'intérieur du composant logiciel
Comme je l'ai dit à plusieurs d'entre vous à une formation précédente, une fonction de 100+ lignes ça n'existe juste pas, et une fonction de 60+ lignes c'est rare et spécifique au JSX; pour le JS, la moyenne devrait être à 20-30 lignes, et le max à 40. Aller au-delà de cette ligne, c'est très probablement intriquer différents objectifs, et c'est le début d'un code spaghetti, ou d'un God Object.

TODO

###### Clean Code
TODO
- noms des variables (dont fonctions) (chap. 2)
- fonctions (chap. 3)
- commentaires (chap. 4)
- formatage: taille de fichier & aération du code (chap. 5)
- itérations courtes (dont tâches) et refactoring régulier (chap. 14)

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
- Pour le nommage de mes variables et noms de fonctions, j'utilise notamment (mais pas que) le language ubuquitaire tel que défini par le DDD - disons plus simplement le "langage métier". Ils doivent révéler l'intention du développeur; par exemple, ça permet à celui qui passera ensuite de déterminer si il doit plutôt modifier cette fonction (et de quelle manière) ou en créer une nouvelle.
- loi de demeter: une fonction ne dépend pas des implémentations des autres fonctions qu'elle appelle. Uniquement de la processe du résultat délivré, qu'on infère via le nom de la fonction. 
- fonctions pures: mes fonctions sont au possible sans effets de bords. Une bonne partie des fonctions d'un dev junior peuvent s'inspirer des différents tutos sur l'immutabilité en JS pour voir comment faire.
- CQRS revisité V1: mes fonctions sont au possible immutables, car les effets de bords ne sont pas très compatibles avec la qualité.
  * soit des fonctions "de haut niveau", orchestratrices d'autres fonctions, 
  * soit des fonctions qui agissent sur un objet et un objectif défini (utilisant directement ou indirectement au plus un import ou une famille d'imports - comme les modèles)
- CQRS revisité V2 + bonus fonctions pures: au possible, mes fonctions agissent sur des variables:
  * internes, en les créant, les accédant et les modifiant 
  * passées en argument, mais ne les modifient pas et retournent une valeur ("Query").
  * passées en argument, les modifient mais ne retournent pas de valeur ("Command"). Cette dernière catégorie doit être restreinte au minimum, cf fonctions pures.

Bref, je mange - sans complexe - à tous les rateliers (de l'architecture logicielle) ^^'

### Patterns & anti-patterns
Il s'agit d'une sélection minimaliste de divers motifs architecturaux que j'ai régulièrement croisé dans mes lectures de code, et/ou qui sont particulièrement connus.
Ces motifs ont également une importance supérieure à beaucoup d'autres de même niveau (sans vouloir rabaisser les autres), et sont relativement faciles à corriger.

Attention: même si cette liste est un bon point de départ, elle est insuffisante pour écrire du bon code. Je vous suggère dès votre compréhension de ces motifs de:
- Apprenez le JS. Tout le monde n'a pas l'air de connaître Array.reduce().map().filter() dans la team, et c'est chaud si vous faites du JS depuis plus d'un an - on parle d'ES2015 hein, il y a 8 ans. Pour les méthodes d'Array: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Array; et pour Object: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
- nommez correctement vos variables (dont fonctions)
- lisez Clean Code

##### Patterns
- SoC / SRP (le "S" de SOLID) / etc: on sépare le code en objectifs différents. Sûrement le principe le plus important pour la mise à l'échelle d'une codebase.
- Open/Closed principle, ou "principe des plugins" (le "O" de SOLID): quand on branche un plugin à un logiciel, le plugin en change pas le code interne du logiciel, mais change quand même sa manière de fonctionner: il peut faire ça en donnant au logiciel des inputs différents, et notamment des hooks. C'est excellent pour la modularité du code, et donc son évolutivité.

##### Code smells
- god object / code spaghetti: le contraire du SoC
- magic numbers https://dev.to/producthackers/code-smell-magic-numbers-3ngc et https://haridy29.medium.com/magic-numbers-2df3ae9dec94
- cf Clean Code, chapitre 17: Smells and Heuristics

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

