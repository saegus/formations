====== Clean code ======

===== Introduction =====
==== Quoi? ====
Une série de bonnes pratiques pour rendre son code lisible, devenues populaires vers 2015.
Ça part du livre éponyme de Martin C. Flowers, devenu une bible avec le développement du mouvement (éponyme lui aussi).

La plupart de ces pratiques ne sont pas liées à un paradigme de programmation en particulier, et sont adaptables à tous les langages.

==== Contexte ====
Il y a plusieurs autres bonnes pratiques qui agissent également au niveau des fonctions et des variables: SOLID, DRY, WET, YAGNI, twelve-factors methodology, Separation of concerns, etc.

Par contraste, les méthodes agiles (SCRUM, Kanban, XP, Software Craftsmanship, etc) sont plus proche des intéractions entre acteurs d'un projet. 
Au passage, même si XP et le Software Craftsmanship ne sont par nature pas comparables au clean code, ils possèdent tout de même des références (assumées ou pas) vers celui-ci.

Également, des méthodes structurant le code à des niveaux architecturaux plus hauts: Single source of truth, TDD, BDD, DevOps, Event Sourcing, etc.

On note enfin des méthodes ouvertement architecturales: DDD, Yelling Architecture, Onion Architecture, Hexagonal Architecture, MVC, etc.

D'autre part, il existe des (design) patterns et anti-patterns également au niveau de chaque langage. En Javascript on a par exemple l'utilisation d'eval(), ou la modification du prototype de Object.

Au final, ces méthodologies ont (dans leur grande majorité) des domaines de définition disjoints: chaque méthodologie est pour faire simple la meilleure de son domaine. Les exceptions à cette règle se résolvent facilement, pour peu qu'on prenne 1/2H pour comparer 2 méthodologies aux domaines similaires.

==== Plan ====
Ces bonnes pratiques ont des effets directement mesurables sur notre produtivité.
On va d'abord constater un de ces effets, en testant notre rapidité à comprendre du code "plutôt propre" et du code "plutôt pas propre".

Ensuite on va voir sur un exemple particulier en javascript comment appliquer une partie des règles de clean code.

===== Expérience / Atelier: rapidité de compréhension =====
==== Principe ====
On va avoir besoin de deux développeurs.

=== Phase 1 ===
Les deux devs reçoivent simultanément deux versions différentes d'un même code, qui visent à effectuer les mêmes fonctionnalités.
Un chronomètre est lancé au début de leur lecture, et l'animateur notera le temps écoulé pour chacun au moment où ils penseront avoir compris le fonctionnement et l'utilité du code.
Dès que leur temps est noté, ils écrivent sur leur ordinateur (pour ne pas que le voisin se contente de dire "même chose" lors d'une restitution orale) leurs conclusions.
On compare ensuite les conclusions, pour estimer leurs qualités respectives.

Les conclusions doivent répondre directement ou indirectement aux questions suivantes:
- pourquoi ce bout de code plutôt que rien? Comment la vue se comporterait (en terme de rendu visuel et/ou d'interactivité) avec ce bout de code ou avec un placeholder ("placeholder" est là pour dire "rien, mis à part le strict minimum pour ne pas faire planter les autres fonctionnalités")?
- le code a-t-il plusieurs objectifs / fonctionnalités (techniques comme métier)? Lesquel(le)s?
- comment et où est sensé être utilisé de code?
  * Est-ce un code qui transforme une partie de l'état (le state de l'app) en un texte, un nombre ou toute chose directement affichable dans la vue?
  * Est-ce qu'il permet de valider une saisie utilisateur? Est-ce qu'il fait une requête au backend, et si oui, permet-elle de créer / lire / mettre à jour / supprimer une ressource?
  * Est-ce le listener d'un évènement HTML (onclick, onfocus, onhover, onpaste, etc)?
  * Est-ce un simple helper, ie une fonction sans objectif métier précis qui résout un problème simple et/ou réccurent?
  * etc.

=== Phase 2 ===
On répète la phase 1 avec un autre exemple, sauf que le dev ayant précédemment eu la version non cleanée se retrouve avec la version cleanée, et vice versa.

=== Phase 3 ===
On récupère les résultats, et on les compare au modèle.
Le modèle stipule:
- chacun des deux développeurs a une vitesse moyenne de compréhension du code: v1 et v2
- les devs devraient être un peu plus rapide à la 2e phase qu'à la première d'un facteur d'habitude h (avec h > 1)
- la facilité de compréhension d'un code cleané vs un code non cleané devrait être d'un facteur f (avec f > 1)
- chaque sujet est d'une complexité de compréhension "de base" (hors code cleané donc) c1 et c2

On cherche à déterminer f.
Soient les temps théoriques de compréhension pour chaque couple dev/sujet:
- phase 1, dev 1, code non cleané: t_1_1_nc = c1 / v1
- phase 1, dev 2, code cleané: t_1_2_c = c1 / (v2.f)
- phase 2, dev 1, code cleané: t_2_1_c = c2 / (v1.h.f)
- phase 2, dev 2, code non cleané: t_2_2_nc = c2 / (v2.h)

En résolvant le système, on a:
t_1_1_nc / t_1_2_c = f.(v2/v1)
t_2_2_nc / t_2_1_c = f.(v1/v2)

=> f = sqrt(t_1_1_nc.t_2_2_nc / (t_1_2_c.t_2_1_c))

==== Exemple 1: un composant ReactJS ====
Il faut savoir ici que l'état interne du composant (l'équivalent de l'attribut d'une instance issu d'une classe) est géré un peu différemment des classes:
- il est initialisé et lu via `this.state` (et pas simplement `this`, car `this.state` est une propriété spéciale au sein d'un composant de classe React)
- il est mis à jour avec `this.setState()`

Également, la méthode `render()`, qui n'est pas montrée ici, va consommer tous les éléments du state pour produire le code HTML attendu.

=== Sujet non cleané ===
Le développeur désigné par l'animateur va utiliser le sujet `./exemple_1_original.js`.

=== Sujet cleané ===
Le développeur désigné par l'animateur va utiliser le sujet `./exemple_1_clean.js`.
TODO

=== Barème technique et fonctionnel ===
- Basiquement, le code ressemble au listener TODO

TODO


==== Exemple 2: TODO ====
TODO

=== Sujet non cleané ===
TODO

=== Sujet cleané ===
TODO

=== Barème technique et fonctionnel ===
TODO


===== Étude de cas =====
Note: On part d'un composant react existant réel, qui provient du code de l'Odyssée

On va suivre uniquement un sous-ensemble des principes du clean code, listés ici:
https://github.com/ryanmcdermott/clean-code-javascript

Les principes issus de cette page Github sont pour partie des interprétations claires du livre de clean code original, et d'autres sont un peu plus sujettes à concurrence, ou sont mal adaptables au contraintes de nos environnement de développement (JS, NodeJS, ...). 

Plus concrètement, voici une liste numérotée (à dessein) des règles qui vont nous intéresser dans cet exemple:
#1 https://github.com/ryanmcdermott/clean-code-javascript#use-meaningful-and-pronounceable-variable-names
#2 remove magic numbers https://github.com/ryanmcdermott/clean-code-javascript#use-searchable-names
#3 https://github.com/ryanmcdermott/clean-code-javascript#use-explanatory-variables
#4 https://github.com/ryanmcdermott/clean-code-javascript#avoid-mental-mapping
#5 https://github.com/ryanmcdermott/clean-code-javascript#dont-add-unneeded-context
#6 https://github.com/ryanmcdermott/clean-code-javascript#functions-should-do-one-thing
#7 https://github.com/ryanmcdermott/clean-code-javascript#functions-should-only-be-one-level-of-abstraction
#8 https://github.com/ryanmcdermott/clean-code-javascript#dont-use-flags-as-function-parameters
#9 https://github.com/ryanmcdermott/clean-code-javascript#single-responsibility-principle-srp
#10 https://github.com/ryanmcdermott/clean-code-javascript#asyncawait-are-even-cleaner-than-promises

On s'intéresse plus particulièrement à la fonction (originalement) _loadDataClassement(),
qu'on va d'abord commenter, puis réécrire.

==== Fonction originale, avec son contexte ====
```
const ClassementAPI = require("...");

class Classement extends Component {
  constructor(props /* IClassementProps */) {
    super(props);
    this.state = {
      listUser: [],
      currentView: "point",
      viewMonde: false,
    };
  }

  componentDidMount() {
    this._loadDataClassement();
  }

  _setCurrentView = (view) => {} // https://medium.com/@charpeni/arrow-functions-in-class-properties-might-not-be-as-great-as-we-think-3b3551c440b1

  _calculMauvaiseReponse = (item) => {};

  _renderPoint(item) {}

  _renderPodiumElement(user) {}

  render() {}


  _loadDataClassement = () => {
    let tabBatch = [
      ClassementAPI.getClassement(i18n.language, this.state.currentView, {
        monde: this.state.viewMonde ? 1 : 0,
      }),
    ];
    let isAdmin = false;
    switch (this.props.currentUser.id_role) {
      case 2: //admin
        isAdmin = true;
        tabBatch.push(
          ClassementAPI.getIndicateur()
        );
        break;
      default:
        tabBatch.push(
          ClassementAPI.getClassement(i18n.language, this.state.currentView, {
            monde: this.state.viewMonde ? 1 : 0,
            user: 1,
          })
        );
        break;
    }
    Promise.all(tabBatch)
      .then((data) => {
        this.setState({
          listUser: data[0] ? data[0] : [],
          classementCurrentUser: !isAdmin ? data[1] : null,
          listIndicateur: isAdmin ? data[1] : null,
        });
      });
  };
}
```

==== Fonction originale, avec les problèmes commentés ====
```
class Classement extends Component {
  componentDidMount() {
    this._loadDataClassement();
  }

  ...
  // #5 Le nom de la classe dit qu'il s'agit d'un composant de classement. On "load" rarement autre chose que des data. Ces deux mots ("data" et "classement") peuvent sauter. à la place, on peut par exemple dire qu'il s'agit de l'ensemble des appels API fait dans ce composant (loadAll), ou alors que cette fonction est appelée à l'initialisation du composant (initialLoad).
  // #6 Cette fonction charge le classement de l'entreprise (ça correspond à son nom), mais charge aussi des statistiques sur ledit classement
  _loadDataClassement = () => {
    // #1 #3 pourquoi "tab" dans "tabBatch"? Pourquoi pas un nom en rapport avec ce quis est asynchrone, comme les jobs en bash, ou alors plus généralement les tasks?
    let tabBatch = [ // "const" plutôt que "let"
      ClassementAPI.getClassement(i18n.language, this.state.currentView, { // #7 cet appel à getClassement pourrait être wrappé, afin de diminuer le nombre de variables / symboles utilisés dans notre fonction
        monde: this.state.viewMonde ? 1 : 0, // #2: que veulent dire ce 1 et ce 0? => en regardant la backend, un booléen suffit
      }),
    ];
    let isAdmin = false; // ça se transforme carrément en: const isAdmin = this.props.currentUser.id_role == 2; On peut ensuite utiliser isAdmin dans le switch
    // #8 #9 Ce switch fait faire 2 choses différentes à notre fonction, seule l'une d'elle transparaît correctement dans le nom de la fonction
    switch (this.props.currentUser.id_role) {
      case 2: //admin
        isAdmin = true;
        tabBatch.push(
          ClassementAPI.getIndicateur()
        );
        break;
      default:
        tabBatch.push(
          ClassementAPI.getClassement(i18n.language, this.state.currentView, {
            monde: this.state.viewMonde ? 1 : 0, // #2: que veulent dire ce 1 et ce 0?
            user: 1, // En fouillant dans le backend, on se rend compte que cet argument n'a pas d'utilité. cet appel est une copie de celui qui est fait un peu plus haut.
          })
        );
        break;
    }
    Promise.all(tabBatch) // #10
      .then((data) => { // #4 data / data[0] / data[1] peuvent par exemple devenir [listUser, classement_ou_indicateurs]
        this.setState({
          listUser: data[0] ? data[0] : [],
          classementCurrentUser: !isAdmin ? data[1] : null,
          listIndicateur: isAdmin ? data[1] : null,
        });
      });
  };
}
```

==== Fonction réécrite en suivant les principes du clean code ====
```
class Classement extends Component {
  ...
  componentDidMount() {
    this._initialLoad();
  }

  ADMIN_ID_ROLE = 2;
  async _initialLoad() {
    const isAdmin = this.props.currentUser.id_role == ADMIN_ID_ROLE;
    if (isAdmin) this._loadForAdmin();
    else this._loadForUser();
  };

  async _loadForUser() {
    const [listUser, listIndicateur] = await Promise.all([
      this._load(),
      ClassementAPI.getIndicateur(),
    ]);

    this.setState({
      listUser,
      classementCurrentUser: null,
      listIndicateur,
    });
  };

  async _loadForAdmin() {
    const [listUser, classementCurrentUser] = await Promise.all([
      this._load(),
      this._load({user: 1}),
    ]);

    this.setState({
      listUser,
      classementCurrentUser,
      listIndicateur: null,
    });
  };

  _load(options = {}) {
    return ClassementAPI.getClassement(i18n.language, this.state.currentView, {
      ...options,
      monde: this.state.viewMonde,
    });
  };
}
```

===== Conclusion =====
42 lignes pour la réécriture, vs 30 lignes pour l'original => on a 50% de lignes en plus
820 chars pour la réécriture, 820 pour l'original (surprise!): on a le même nombre de chars.
1 fonction pour l'original vs 4 fonctions et 1 constante pour la réécriture.
Taille max des fonctions: 30l pour l'original, 12l pour la réécriture
Taille max des blocs de code: le code n'est pas aéré vs 5l pour la réécriture
Temps de compréhension du code à la première lecture: ???


