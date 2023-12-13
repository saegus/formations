
# La Separation Of Concerns (SoC)
## Introduction
### C'est quoi la SoC?
Separation Of Concerns = Séparation des préoccupations / responsabilités

D'après Wikipédia: principe de conception visant à segmenter un programme informatique en plusieurs parties, afin que chacune d’entre elles isole et gère un aspect précis de la problématique générale.

<img src="./soc.jpeg" width="60%">

On se rend compte rapidement que ça peut s'appliquer à plusieurs - voir à tous les "grains" architecturaux vu précédemment.

Il s'agit plus ou moins de la même chose que le SRP (Single Responsability Principle, principe de responsabilité unique) de SOLID; les nuances existeraient - a priori la SoC pourrait plus concerner un niveau fonctionnel&logique alors que le SRP s'adresserait plus à la technique - mais ils parlent dans leur essence de la même idée de séparation.

On se rend aussi compte qu'une grande partie des principes architecturaux à la maille de l'(intra-)exécutable consitent en l'organisation de fichiers en leur assignant à chacun un objectif / une préoccupation. On peut même revenir à la définition de l'architecture donnée précédemment ("Principe d'organisation d'une structure") et se rendre compte que l'organisation se fait selon... des objectifs / préoccupations. Le SRP/SoC/whatever est au coeur de nos techniques de mise à l'echelle. On pourrait s'avancer et inférer qu'il est nécessaire à n'importe quelle mise à l'échelle d'une codebase, mais est-il suffisant?

### Le nerf de la guerre
Le code c'est come la maison: les couverts et les tasses sont dans la cuisine, les chaussures à la buanderie, les produits ménagers sous l'évier, les chaussettes dans l'armoire de la chambre, etc. Le code, c'est la même chose: on rassemble les bouts de code avec des objectifs similaires aux mêmes endroits.

Et ça marche bien: si un collègue doit "aller me chercher un maillot" de dev, il se dirigera directement vers le fichier "armoire de la chambre", plutôt que de chercher dans "toutes les pièces" de l'exécutable.

Personne ne se lancerait dans la recherche d'un objet en particulier (clés, ...) dans une maison dont il ne comprend pas l'organisation. Faites en sorte que votre maison logicielle soit au moins un peu organisée: architecturez vos projets et vos fichiers.

## Théorie et échauffement
### Une conceptualisation de la SoC: la méthode "domain-glue"
On part du concept de "Domain" du DDD. Si on peut faire émerger différents domaines métier au sein d'une même app, on doit pouvoir faire émerger des "domaines techniques" avec une méthode similaire. Et ces domaines techniques peuvent être peu comme hautement réutilisables, au sein de l'app comme entre différents projets.

Parmi les domaines courants:
- génération de HTML
- autre HTML
- génération de JSX (non, ce n'est pas la génération de HTML, mais le JSX génère du HTML)
- transformation/manipulation de data de <domaine métier>
- routing (front comme back)
- logging
- authentification
- récupération des inputs d'entrée
- récupération - et éventuellement légère transformation pour augmenter l'utilisabilité technique - des variables d'environnement
- nettoyage (sanitization) des inputs user: validation
- interaction avec une technologie (Material UI, data grid, gestionnaire de persistence / data layer, etc)
- échanges avec le réseau (network layer), et plus précisément avec telle ou telle API (domaine de l'API en question, en utilisant ses concepts et son langage ubiquitaire)

Ensuite, imaginez votre codebase comme un ensemble de ces domaines, reliés entre eux par des codes-"glue".

### Mise en pratique de "domain-glue"
Vous commencez un nouveau service back (au sein d'un nouveau projet ou d'un projet existant, cela n'a pas d'importance), avec le code suivant (une bonne trentaine de lignes):
```
const express = require("express");
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'dbuser',
  password : 's3kreee7'
});

connection.connect();

const app = express();
const PORT = 3000;

app.get("/questions/:id", (req, res) => {
  const {id} = req.params;
  if (isNaN(id)) {
    return res.sendStatus(400);
  }

  connection.query(`SELECT 'QUESTION', commentaire FROM t_question WHERE id_question = ${id}`, function(err, db_result, fields) {
    if (err) throw err;

    const {QUESTION, commentaire} = db_result;
    const question_formatted = {
      label: QUESTION,
      comment: commentaire,
    };

    res.json(question_formatted);
  });
});

app.listen(port, () => {
  console.log(`Application exemple à l'écoute sur le port ${port}!`);
});
```

Pour l'instant il est modeste, car c'est un Proof Of Concept. Vous allez dans peu de temps avoir à y ajouter plus de 150 lignes, il faut le découper efficacement le plus tôt possible.

Dans un premier temps, séparez-en les concerns (objectifs) suivants les objectifs suivants d'une part:
- modèle (data layer)
- controlleurs (en posant qu'un contrôleur ne fait appel qu'à un unique service)
- services
- routage & assimilé

Réponse possible:
```
// Concern: data layer
var mysql      = require('mysql');
var connection = mysql.createConnection(config.db);

connection.connect();

const model = {
  Question: {
    findById: (id) => new Promise((resolve, reject) => {
      connection.query(`SELECT 'QUESTION', commentaire FROM t_question WHERE id_question = ${id}`, function (error, results) {
        if (error) {
          return reject(error);
        }

        resolve(results);
      });
    });
  }
}

// Concern: routing, server, config & autre
const config = { // dans un fichier JS séparé, pour éviter un deadlock d'imports
  db: {
    host: 'localhost',
    user: 'dbuser',
    password: 's3kreee7'
  },
};
const express = require("express");
const app = express();
const port = 3000;
app.get("/questions/:id", getQuestionController);

app.listen(port, () => {
  console.log(`Application exemple à l'écoute sur le port ${port}!`);
});

// Concern: controller
const getQuestionController = (req, res) => {
  (req, res) => {
    const {id} = req.params;
    if (isNaN(id)) {
      return res.sendStatus(400);
    }
  
    const question = await findQuestionService(id);
    res.json(question_formatted);
  }
};

// Concern: service / business / User Stories layer
const findQuestionService = async (id) => {
  const results = await model.Question.findById(id);

  const {QUESTION, commentaire} = results;
  const question_formatted = {
    label: QUESTION,
    comment: commentaire,
  };

  return question_formatted;
};
```

Séparez maintenant le résultat de votre découpage suivant les concerns (objectifs) suivants:
- express.js: ce qui est spécifique à Express doit être isolé par une couche de "glue" d'un code framework-agnostic, un peu comme ce que Nest propose en permettant de switch entre Express et Fastify. En particulier, le contrôleur ne doit pas avoir conscience de choses comme res.send(), res.status(), req.baseUrl, ou req.secure.
- faites en sorte que le service appelé par le contrôleur soit lui-même un orchestrateur de différentes sous-fonctionnalités, et s'occupe uniquement d'orchestrer les appels à ses fonctionnalités et le passage des résultats entre eux.
- la validation est une opération à séparer de l'extraction des données par le contrôleur
- le code d'invocation du serveur doit être réparé du routage
- le code d'initialisation des modules au démarrage doit être isolé et invoqué dans une fonction type `init()` au démarrage du serveur. Un message doit être loggé pour signifier que le serveur a effectué toutes les opérations d'initialisation. 

Réponse possible:
```
// Concern: data layer
var mysql = require('mysql');
let connection = null;
const initDb = () => {
  return new Promise((resolve, reject) => {
    connection = mysql.createConnection(config.db);
    
    connection.connect(function(err) {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

const model = {
  Question: {
    findById: (id) => new Promise((resolve, reject) => {
      connection.query(`SELECT 'QUESTION', commentaire FROM t_question WHERE id_question = ${id}`, function (error, results) {
        if (error) {
          return reject(error);
        }

        resolve(results);
      });
    });
  }
}

// Concern: infra: abstraction d'express.js
const express = require("express");

// note: code glue entre express et notre format ("déclaratif" et framework agnostic) de route
const jsonRouteToExpressRoute = (app, route) => {
  const {path, method, controller} = route;
  app[method.toLowerCase()](path, controller);
}

const runExpressServer = (port, routes, onListen) => {
  const app = express();

  routes.forEach(route => jsonRouteToExpressRoute(app, route));

  app.listen(port, onListen);
}

// Concern: invocation / initialisation du serveur
const PORT = 3000;
// note: voici notre entrypoint:
const runServer = (routes) => {
  runExpressServer({port: PORT, routes, onListen: () => {
    console.log(`Example app listening at http://localhost:${port}`)
  }});
  init();
}

// Concern: initialisation des modules
const init = async () => {
  await initDb();
  console.log("Module initialization done");
}

// Concern: routing
const route = {
  path: "/questions/:id",
  method: "GET",
  controller: getQuestionController,
}

// Concern: controller
// Note: je n'ai pas abstrait le fonctionnement d'express.js (il faudrait le faire)
// pour res.status(...)... et res.json(...) ci-dessous;
// ce contrôleur est donc pour l'instant dépendant d'une techno en particulier.
const getQuestionController = (req, res) => {
  const {ok, error_msg, status_code} = validateInput(req);
  if (!ok) {
    return res.status(status_code).send(error_msg);
  }

  const question = await findQuestionService(id);
  res.json(question_formatted);
};

// Concern: service / business / User Stories layer
const formatQuestion = (raw_question) => {
  const {QUESTION, commentaire} = raw_question;
  const question_formatted = {
    label: "Q: " + QUESTION,
    comment: commentaire,
  };

  return question_formatted;
}

// Concern: service / business / User Stories layer > orchestrateur de services (par ex. pour un point d'entrée d'une route)
const findQuestionService = async (id) => {
  const raw_question = await model.Question.findById(id);

  const question_formatted = formatQuestion(raw_question);
  return question_formatted;
};

// Concern: input validation
const validateInput = (req) => {
  const result = {
    ok: true,
    error_msg: null,
    status_code: 400,
  };

  const {id} = req.params;
  if (isNaN(id)) {
    result.ok = false;
    result.error_msg = "id must be a number";
    return result;
  }

  return result;
}
```

Voilà, avec cette SoC on est parés pour gonfler le corps de chacune de ces fonctions de nos futures 150+ lignes, et au besoin on pourra également les recouper en plus petites fonctions.

Arrivez-vous à bien repérer les différents domaines? et le code "glue" entre 2 domaines?

Note: parfois on a envie de nommer "domaine" un code glue en lui assignant un objectif précis (qui peut être simplement une conséquence d'être la glue entre ces 2 domaines): ça ne pose aucun problème :-)

## Pendant le dev d'une nouvelle feature: Création d'un composant générique / réutilisable
Cet exercice est inspiré de l'exercice de refactor de Robert C Martins, dans "Clean Code", chapitre 16: "Refactoring serialdate". Uncle Bob adopte pour sa part une approche très différente, plus simple mentalement que les deux présentées ci-dessus mais tout aussi instructive.

L'exemple suivant propose une approche également itérative. Il s'agit de développer une feature complexe, en l'approchant sous l'angle d'une "pseudo-external-library" - et non pas d'un bout de code qu'on peut aussi librement modifier qu'un formulaire à champs statiques par exemple.

### Introduction
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

On songe aussi par la suite à appliquer le pattern container/presenter, assez connu en react. Au-delà de faire de la SoC et d'introduire des points de contrôle supplémentaires, ce pattern va nous permettre de pouvoir changer rapidement de composant de rendu pur si besoin (de `<table><tbody><tr><td>` à `<div><div><div><div>` notamment, mais on peut aussi penser à du d3.js).

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
// TODO donner un snippet en exemple

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

// TODO donner un snippet en exemple

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

// TODO donner un snippet en exemple

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

# SoC, Modularité, extensibilité, isolation, couplage
Dans une application existante, quels doivent être les points de vigilance pour préserver la SoC, ne pas la perdre/diluer au fil de l'ajout de nouvelles features?

## REx / exercice d'analyse: le module de table d'eCSAR
### Contexte
Sur le front d'eCSAR, on utilise un module de data table custom.
Un module de data table est plus ou moins la même chose qu'un data grid, mais avec <table> plutôt que <div>; des grands noms de ces domaines: @mui/x-data-grid, react-data-grid, ag-grid-react/ag-grid-angular, datatables.net.

Un data table/grid (de manière générale, pas le notre précisément) s'utilise plus ou moins de cette manière:
```
const rows = [{
  sequence_number: 1,
  rm_code: "A1B2C3",
  commercial_references: {
    code: "C3B2A1",
  },
}, {
  sequence_number: 2,
  rm_code: "D4E5F6",
  commercial_references: {
    code: "F6E5D4",
  },
}]

const columns_definitions = [{
  id: "sequence_nb",
  renderer: (row) => ({
    children: row.sequence_number + ": " + row.rm_code,
  }),
}, {
  id: "refcom_code",
  selector: "commercial_references.code",
}];

const cellRenderer = (vdom) => {
  const {children = [], ...attributes} = vdom;
  return (
    <td {...attributes}>
      {children}
    </td>
  );
};

const Table = ({columns, rows, cellRenderer}) => {
  const refcom_table_head = RawMaterialsTableHeadGenerator(columns, language, headRowClassname);
  return (
    <table>
      <TableHeader />
      <DataGrid
        rows={rows}
        columns={columns}
        renderColumns={cellRenderer} 
      />
    </table>
  );
};
```

Je suis en train de refondre ce module que j'ai précédemment créé, car son interface n'était pas assez future-proof. La situation commençait à devenir urgente, j'aurais dû faire cette refonte plut tôt, au moment où n'utilisions ce module que pour une seule table dans le code; là, je multiplie la durée des tests et les risques de régression par le nombre d'utilisations (et leur diversité) dans la codebase. 

En terme d'interface / de "breaking changes", cette refonte va notamment modifier le prototype des columns renderers - qui ne sera plus `(row) => object`.

Pendant que j'étais occupé et ne pouvais faire cette refonte, Gilles a utilisé ce module pour une de ses US. Il l'a utilisé d'une manière semblable à la suivante:
```
const checkBusinessRule = (sub_row, selector, id) => {
  const value = _.get(sub_row, selector);

  const is_business_error = sub_row[BUSINESS_CHECK]?.business_error_column === id;
  const is_business_check = sub_row.ingredients[BUSINESS_CHECK]?.is_business_check;
  const is_error_ingredient = sub_row.ingredients[BUSINESS_CHECK]?.is_error_ingredient;
  const business_check_type = sub_row[BUSINESS_CHECK]?.business_check_type;

  return {
    value,
    business_check_type,
    is_business_error,
    is_business_check,
    is_error_ingredient,
    selector
  };
}

const sequence_nb_col_id = "sequence_nb";
const columns_definitions = [{
  id: sequence_nb_col_id,
  renderer: (row) => ({
    children: checkBusinessRule(row, "sequence_number", sequence_nb_col_id),
  }),
},
...
];

const businessRulesclassnameCellFactory = (cellClassname) => ({children, ...attrs}) => {
  const attributes = applyClassname({...attrs}, cellClassname);
  const {
    is_business_check,
    is_first_cell_of_line,
    business_type,
    value,
  } = extractBusinessCheckInfo(children);
  const error_text_class = determineErrorTextClass(children, business_type);

  return (
    <td {...attributes}>
      <div className={styles["business-error-cell"]}>
        <RenderBusinessErrorIcon
          is_business_check={is_business_check}
          children={children}
          business_type={business_type}
        />
        <div className={error_text_class}>
          {value}
        </div>
      </div>
      {is_first_cell_of_line &&
        <div className={styles[`cell-${business_type}`]}></div>}
    </td>
  );
};

...

const Table = ({columns, rows, cellRenderer}) => (
  <table>
    <TableHeader />
    <DataGrid
      rows={rows}
      columns={columns}
      renderColumns={businessRulesclassnameCellFactory("business-checks-table")} 
    />
  </table>
);
```

### Énoncé
Votre tâche: le code de Gilles est plutôt lisible, mais peut être amélioré avec plusieurs des concepts vu en formation jusque-là.
1. déterminez quel endroits peuvent être amélioré par une règle, ou en enfreint une autre
2. proposez une solution "haut niveau" (que vous pouvez décrire à l'oral en 10s à 1min max, sans support et notamment sans code autre que celui présenté précédemment)

### Solution
On a remarqué dans le module data grid un double mécanisme de rendering: d'une part le rendering des colonnes dans `columns_definitions[0].render` et d'autre part le rendering du JSX dans `renderColumns`.

En observant le fonctionnement du code initial, on voit qu'on se retrouve avec une sorte d'objet

Dans la première utilisation on voit que le "column definition renderer" retourner un object qui a pour attribut "children", un peu comme les props d'un composant React. En regardant le "JSX renderer" `cellRenderer`, on reconnaît le presenter du pattern container/presenter de React. En revenant sur le "column definition renderer", on voit qu'il ne retourne pas de JSX / que du JS, et est donc un bon candidat pour être appelé dans un container. La sortie du "column definition renderer" se doit d'être du même type que ce que le data grid généré à partir du `columns_definitions[1].selector`, pour que `cellRenderer` soit capable de traiter les deux indistinctement.

On a donc un système avec 2 renderers qui semble nous inciter au pattern container/presenter (avec éventuellement quelques changements du résultat de `columns_definitions[0].render` avant de le passer en argument de `renderColumns` par le data grid). Toutefois cela n'est pas explicité par le module ni une convention de naming (par ex. avec un suffixe "container" ou "presenter").

Lorsqu'on regarde les changements de Gilles, on voit que `businessRulesclassnameCellFactory` n'est clairement pas un "presenter".

La première chose qu'on peut proposer est de bouger tout ce qui retourne du calcul JS (ie non-JSX) plus haut, soit dans le "column definition renderer", soit dans les rows avant de les passer en argument de `<DataGrid/>`.

D'autre choses pourraient être amélioré je suppose, mais celle-là est probablement la plus lourde à mettre en place, et aussi celle qui aura le plus d'effets:
- la plupart de ce code ressemble à du code métier (+ du code "glue" entre le métier et les attributs JSX/HTML; on ne compte pas ici le code "glue" entre les attributs JSX/HTML et le module data-gris); le rapprocher d'un autre code métier plutôt que de la logique du `<DataGrid/>` (columns definitions comme `renderColumns`) permettrait de mieux séparer les concerns, ainsi que diminuer le couplage et donc augmenter la modularité et donc diminuer d'éventuels coûts de changements.
- la maintenance est facilitée: le code métier est rassemblé à un même endroit, et on pourrait le tester avec un seul `console.log(rows_enhanced_for_table)` juste avant l'appel à `<Table />`. Cela limite les erreurs lors des phases d'analyses du code dans les US futures (dans 2 mois par ex.). Idem pour le code spécifique au module, qui est plus facile à maintenir vu que débarrassé / isolé du code métier; avantage direct pour la refonte: elle sera simplifiée par cette amélioration et donc prendra moins longtemps.

Voici la solution proposée (pas forcément la meilleure, mais elle fera en grande partie le job):
```
const businessCheckRendererFactory = (row) => {
  // TODO do stuff here

  const ing_err_indicator_vdom = {
    is_ing_business_check_err,
    is_generation_business_check,
  };
  const cell_content_vdom = {
    className: error_className,
    children: error_label,
  };
  let rm_err_indicator_vdom = null;
  if (rm_err_className) {
    rm_err_indicator_vdom = {
      className: rm_err_className,
    }
  }

  const vdom = {
    children: [{
      children: [ing_err_indicator_vdom, cell_content_vdom];
    }, rm_err_indicator_vdom],
  };

  return vdom;
}

const sequence_nb_col_id = "sequence_nb";
const columns_definitions = [{
  id: sequence_nb_col_id,
  renderer: (row) => ({
    children: checkBusinessRule(row, "sequence_number", sequence_nb_col_id),
  }),
},
...
];

const businessRulesclassnameCellFactory = (cellClassname) => (vdom) => {
  const [cell_container, rm_err_indicator_vdom] = vdom.children;
  const [ing_err_indicator_vdom, cell_content_vdom] = cell_container.children;

  return (
    <td {...vdom.attrs}>
      <div className={styles["business-error-cell"]}>
        <RenderBusinessErrorIcon {...ing_err_indicator_vdom} />
        <div className={cell_content_vdom.className}>
          {cell_content_vdom.children}
        </div>
      </div>
      {rm_err_indicator_vdom && (
        <div className={rm_err_indicator_vdom.className}></div>
      )}
    </td>
  );
};

...

const Table = ({columns, rows, cellRenderer}) => (
  <table>
    <TableHeader />
    <DataGrid
      rows={rows}
      columns={columns}
      renderColumns={businessRulesclassnameCellFactory("business-checks-table")} 
    />
  </table>
);
```

Une dernière chose: Dans certains cas, on peut faire une entorse au SoC et laisser un peu de code métier dans le presenter; mais seulement lorsque le composant est de petite taille, ie moins de 15 lignes. Là on est sur un corps de 20+ lignes (pour un total de 30+ lignes) pour businessRulesclassnameCellFactory.
