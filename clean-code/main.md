====== Clean Code ======

==== Préambule ====
Cette formation est la concaténation d'un atelier et d'une expérience.

L'atelier est une forme d'introduction au Clean Code par la pratique, et vise à démystifier ce concept et en montrer la portée concrète dans le travail d'un développeur.

Là où l'atelier vise à en montrer la portée concrète, l'expérience vise à mettre en évidence (et même évaluer et mesurer) l'utilité et le gain de performance qu'on obtient en suivant ses principes.

Cette formation ne rentre pas du tout dans le détail de Clean Code, et se veut plus comme une vitrine, publicité et vulgarisation pour des néophytes, afin de les inciter à se renseigner plus en détail sur les bienfaits de ce mouvement.

===== Introduction =====
==== Quoi? ====
Une série de bonnes pratiques pour rendre son code lisible, devenues populaires vers 2015.
Ça part du livre éponyme de Martin C. Flowers, devenu une bible avec le développement du mouvement (éponyme lui aussi).

La plupart de ces pratiques ne sont pas liées à un paradigme de programmation en particulier, et sont adaptables à tous les langages.

==== Contexte ====
Il y a plusieurs autres bonnes pratiques qui agissent également au niveau des fonctions et des variables: SOLID, DRY, WET, YAGNI, twelve-factors methodology, Separation of concerns, etc.

Par contraste, les méthodes agiles (SCRUM, Kanban, XP, Software Craftsmanship, etc) sont plus proche des intéractions entre acteurs d'un projet. 
Au passage, même si XP et le Software Craftsmanship ne sont par nature pas comparables au Clean Code, ils possèdent tout de même des références (assumées ou pas) vers celui-ci.

Également, des méthodes structurant le code à des niveaux architecturaux plus hauts: Single source of truth, TDD, BDD, DevOps, Event Sourcing, etc.

On note enfin des méthodes ouvertement architecturales: DDD, Yelling Architecture, Onion Architecture, Hexagonal Architecture, MVC, etc.

D'autre part, il existe des (design) patterns et anti-patterns également au niveau de chaque langage. En Javascript on a par exemple l'utilisation d'eval(), ou la modification du prototype de Object.

Au final, ces méthodologies ont (dans leur grande majorité) des domaines de définition disjoints: chaque méthodologie est pour faire simple la meilleure de son domaine. Les exceptions à cette règle se résolvent facilement, pour peu qu'on prenne 1/2H pour comparer 2 méthodologies aux domaines similaires.

Petite note spécialement aux devs un peu sceptiques face au Clean Code, mais fans des principes SOLID: les deux viennent du même auteur, Uncle Bob... Donnez-leur leur chance plutôt que de les préjuger :-)

==== Plan ====
Ces bonnes pratiques ont des effets directement mesurables sur notre produtivité.
On va d'abord constater un de ces effets, en testant notre rapidité à comprendre du code "plutôt propre" et du code "plutôt pas propre".

Ensuite on va voir sur un exemple particulier en javascript comment appliquer une partie des règles de Clean Code.

===== Expérience / Atelier: rapidité de compréhension =====
==== Principe ====
On va avoir besoin de deux développeurs (au moins).

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

Les sujets peuvent contenir une question bonus, spécifique.

=== Phase 2 ===
On répète la phase 1 avec un autre exemple, sauf que le dev ayant précédemment eu la version non cleanée se retrouve avec la version cleanée, et vice versa.

=== Phase 3 ===
On récupère les résultats, et on les compare au modèle.
Le modèle stipule:
- chacun des deux développeurs a une vitesse moyenne de compréhension du code: v1 et v2
- les devs devraient être un peu plus rapide à la 2e phase qu'à la première d'un facteur d'habitude h (avec h > 1)
- la facilité de compréhension d'un code cleané vs un code non cleané devrait être d'un facteur f (avec f > 1)
- chaque sujet est d'une complexité de compréhension "de base" (hors code cleané donc) c1 et c2
- chaque dev a une expertise/aisance relative avec la techno d'un sujet. Ici on va supposer que ces aisances sont complètement indépendantes du fait que le sujet soit cleané ou pas (ie qu'on peut les représenter par un coeff `a<dev><techno>` qui permet de garder l'équation linéaire).

On cherche à déterminer f.
Soient les temps théoriques de compréhension pour chaque couple dev/sujet:
- phase 1, dev 1, code non cleané: t_1_1_nc = c1 * (a11 / v1) = c1 / v1
- phase 1, dev 2, code cleané: t_1_2_c = c1 * a21 / (v2.f) = c1 / (v2.f)
- phase 2, dev 1, code cleané: t_2_1_c = c2 * a12 / (v1.h.f) = c2 / (v1.h.f)
- phase 2, dev 2, code non cleané: t_2_2_nc = c2 * a22 / (v2.h) = c2 / (v2.h)

En résolvant le système, on a:
t_1_1_nc / t_1_2_c = f.(v2/v1)
t_2_2_nc / t_2_1_c = f.(v1/v2)

=> `f = sqrt(t_1_1_nc.t_2_2_nc / (t_1_2_c.t_2_1_c))`

=== Avertissement ===
Bien que la méthode a pour objectif de mesurer une vitesse de compréhension moyenne entre les développeurs, l'expérience a besoin d'une condition supplémentaire pour que le résultat soit pleinement valide: il faut que les deux sujets portent sur la même technologie, et idéalement sur les mêmes sous-composants de cette technologie (2 routes create d'un CRUD Hapi, 2 composants de classe React JSX maniant uniquement du state local, etc.).

Sans cela, il existe un biais dans le choix de distribution lorsque les technos des sujets ne sont pas les mêmes, et si on considère que l'aisance relative n'est pas linéaire avec le fait que le code soit cleané ou pas (par exemple qu'il est beaucoup plus difficile de comprendre sans erreur un code non cleané dans une techno qu'on en connait pas plutôt que dans une techno qu'on connait).

==== Exemple 1: un composant ReactJS ====
Il faut savoir ici que l'état interne du composant (l'équivalent de l'attribut d'une instance issu d'une classe) est géré un peu différemment des classes:
- il est initialisé et lu via `this.state` (et pas simplement `this`, car `this.state` est une propriété spéciale au sein d'un composant de classe React)
- il est mis à jour avec `this.setState()`. Ainsi, `this.attr = 42` devient souvent `this.setState({...this.state, attr: 42})`.

Également, la méthode `render()`, qui a été simplifiée ici, va consommer tous les éléments du state pour produire le code HTML attendu, dans un langage proche de l'HTML (le JSX).

Le point d'entrée pour les deux sujets est la méthode `componentDidMount`, qui sera exécutée à l'initialisation de l'objet.

=== Sujet non cleané ===
Le développeur désigné par l'animateur va utiliser le sujet `./exemple_1_original.js`.

=== Sujet cleané ===
Le développeur désigné par l'animateur va utiliser le sujet `./exemple_1_clean.js`.

=== Question bonus ===
Un dev a changé le code du render() pour qu'il contienne uniquement `return (<p>Nb joueurs: {listIndicateur?.nbJoueur + (listIndicateur?.nbJoueur != 1 ? "joueurs" : "joueur")}</p>)`; qu'aurait rendu ce code avec un utilisateur non-admin?

==== Exemple 2: Une route Hapi ====
Le code présenté dans le sujet devrait être splitté dans plusieurs fichiers différents; mais pour des raisons de praticité, j'ai tout rassemblé ici.

Les commentaires indiquent dans quel fichier devrait se trouver tel ou tel code.

Concernant spécifiquement Hapi, sachez que request.state contient les cookies de la requête.

=== Sujet non cleané ===
Le développeur désigné par l'animateur va utiliser le sujet `./exemple_2_original.js`.

=== Sujet cleané ===
Le développeur désigné par l'animateur va utiliser le sujet `./exemple_2_clean.js`.

=== Question bonus ===
Vous devez répondre à David, qui après un RDV avec le client du projet vous demande (questions du client interprétées par David):
1/ que renvoie le champ "before" de la réponse?
2/ Pour quelles raisons décide-t-on de lui donner telle ou telle valeur?

==== Correction ====
Le "prototype de correction" est caché un peu plus bas dans ce doc, résistez à l'envie d'aller le voir avant la fin des mesures ou vous fausserez les résultats!

===== Étude de cas =====
Note: On part d'un composant react existant réel, qui provient du code de l'Odyssée

On va suivre uniquement un sous-ensemble des principes du Clean Code, listés ici:
https://github.com/ryanmcdermott/clean-code-javascript

Les principes issus de cette page Github sont pour partie des interprétations claires du livre de Clean Code original, et d'autres sont un peu plus sujettes à concurrence, ou sont mal adaptables au contraintes de nos environnement de développement (JS, NodeJS, ...). 

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
  // #5 Le nom de la classe dit qu'il s'agit d'un composant de classement. On "load" rarement autre chose que des data, même si on peut supposer ici qu'il s'agit de charger des données "de state" plutôt qu'une vue complète (avec du HTML et/ou du JS). Ces deux mots ("data" et "classement") peuvent sauter. À la place, on peut par exemple dire qu'il s'agit de l'ensemble des appels API fait dans ce composant (loadAll), ou alors que cette fonction est appelée à l'initialisation du composant (initialLoad).
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

==== Fonction réécrite en suivant les principes du Clean Code ====
```
class Classement extends Component {
  ADMIN_ID_ROLE = 2;

  componentDidMount() {
    const isAdmin = this.props.currentUser.id_role == this.ADMIN_ID_ROLE;
    if (isAdmin) this._loadForAdmin();
    else this._loadForUser();
  };

  async _loadForAdmin() {
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

  async _loadForUser() {
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

==== Analyse des résultats ====
- 42 lignes pour la réécriture, vs 30 lignes pour l'original => on a 50% de lignes en plus
- 820 chars pour la réécriture, 820 pour l'original => Surprise! On a le même nombre de chars. Note: c'est loin d'être la règle, on peut par exemple doubler le nombre de chars. 
- 1 fonction pour l'original vs 4 fonctions et 1 constante pour la réécriture.
- Taille max des fonctions: 30l pour l'original, 12l pour la réécriture => 2X plus petites fonctions
- Taille max des blocs de code: le code n'est pas aéré vs 5l pour la réécriture
- ratio d'efficacité par les temps de compréhension à la lecture du code: À calculer avec les données précédentes

Pas mal de choses ont changé, mais les fonctionnaliés restent les mêmes.
Les métriques du code sont quasiment toutes altérées par les changements de style, ce qui rend des codes "brouillons" et des codes "clean" peu comparables entre eux.

Reste encore quelques questions en suspens, comme par exemple:
- quel est le ratio de temps dû à l'effort supplémentaire d'écrire dès le début du Clean Code, par rapport à simplement écrire du code "brouillon"?
- le ratio des temps de compréhension avec et sans Clean Code augmente-t-il bien exponentiellement avec le nombre de lignes à comprendre avec une fonctionnalité donnée? Et le taux de bonne compréhension?
- Est-il plus facile d'ajouter une fonctionnalité au sein d'un code clean? Si oui, à quel point (métriques)?

===== Conclusion =====
On a approché le Clean code par une dizaine de ses règles, et on a vu à quel point ça changeait d'une part le style du code et d'autre part le 

Clean Code est un formidable outil pour un développeur, quel que soit son langage de prédilection. En effet, bien qu'écrit avec le Java en tête et dans un style très orienté objet, la plupart des points qu'il aborde sont valables pour la programmation de manière générale et les projets informatiques développés en équipe en particulier, quel que soient leur langage et le(s) paradigme(s) de programmation utilisé(s).

Toutefois, aussi fourni soit-il en conseils sur des "patterns" et "anti-patterns" de structuration du code au niveau le plus local (on n'est par exemple pas en train de parler de la structuration des fichiers de code, mais bien de la structuration de leur contenu), ne peut pas couvrir parfaitement l'ensemble des méthodes de développement connues (et c'est tant mieux, le livre est déjà suffisamment épais comme ça!).

On peut par exemple noter qu'il ne parle pas (ni en bien ni en mal) de l'écriture des fonctions avec des gardes ( https://en.wikipedia.org/wiki/Guard_(computer_science), https://www.codementor.io/@clintwinter/use-guard-clauses-for-cleaner-code-1rrsczgwxp ), une technique qui vise à linéariser le flot d'exécution au sein d'une fonction et ainsi limiter les scopes imbriqués.

Également, Clean Code, de par le nombre de ses conseils judicieux (et le prestige de son auteur) a su initier une réflexion de fond sur l'excellence de la profession de développeur informatique, au niveau de la communauté mondiale des développeurs. Cette réflexion n'est toujours pas terminée, mais a déjà permis de perfectionner cette collection de bonnes partiques en corrigeant celles qui en avaient besoin et en en ajoutant de nouvelles (TODO refs ici). En bref, les choses bougent et, même ci ce livre est excellent, il ne serait pas forcément pertinent de considérer les idées qu'il défend comme absolues ou de les faire passer pour telles. Néanmoins, ne pas connaître ce livre de 2008 ou au moins les propos qu'il défend a de fortes chances de freiner l'excellence professionnelle du développeur de notre ère.

===== Voir aussi =====
- "Clean Code" ("coder proprement" en français) de Robert C. Martin, livre que nous avons au bureau et que je vous encourage vivement à lire. Je me permets d'insister, LISEZ-LE: c'est 400 pages obligatoires à lire (et chacune vaut le coup, don't cherry pick dudes) pour pouvoir prétendre à être un développeur senior sur le marché du travail. Qu'on soit d'accord ou pas avec l'ensembles des points abordés est une autre histoire, mais votre compétence en tant que dev non-junior sera jugée par vos pairs notamment sur votre capacité à comprendre de quoi il est question et à défendre vos choix par rapport à ces points.
- Clean Architecture (A Craftsman's Guide to Software Structure and Design), du même auteur, qui parle d'architecture de plus haut niveau. 
- https://medium.com/@futariboy/bref-voici-comment-je-nomme-mes-variables-et-mes-fonctions-d35f31f443b2

===== Exemples de réponses aux sujets =====
==== Sujet 1 ====
On valide parmi les points suivants lesquels sont répondus (de manière correcte ou mauvaise) et lesquels ne le sont pas. Si il y a d'autres données pertinentes, on les ajoutera ci-dessous.

- Basiquement, le code sert à remplir le state interne du component (qui servira ensuite à l'affichage des données récupérées dans le HTML), en faisant des appels à une API, vraisemblablement HTTP.
- il est exécuté à l'initialisation du composant
- en pratique, il fait des appels API puis remplit le state avec de manière asynchrone, en une fois.
- suivant si l'utilisateur passé en argument est un admin ou pas, il ne charge pas les mêmes données:
  * si admin, on récupère des indicateurs
  * si pas admin, on récupère des données de classement dépendantes de l'utilisateur "1"
  * dans tous les cas, on fait appel à une fonction qui nous récupère le classement général

==== Question bonus ====
Le code aurait rendu 'undefinedjoueurs'.

==== Sujet 2 ====
On valide parmi les points suivants lesquels sont répondus (de manière correcte ou mauvaise) et lesquels ne le sont pas. Si il y a d'autres données pertinentes, on les ajoutera ci-dessous.

TODO

==== Question bonus ====
Note préliminaire: C'est David, il est intelligent (bisou David pense à mon augmentation) mais il n'a pas dev depuis un certain temps. Et surtout il est dans son rôle de commercial, avec le client. La réponse doit être particulièrement digeste, et l'accent doit probablement être mis sur le métier.

1/ le champ "before" de la réponse renvoie un nombre variable de récompenses journalières que l'utilisateur a obtenu lors de ses connexions précédentes à l'app.

2/ Le nombre de récompenses dépend du nombre de jours où l'utilisateur s'est connecté à l'app:
- le dernier jour de campagne, l'app renvoie les 3 récompenses précédentes.
- les jours précédents, il renvoie les récompenses des deux jours précédant la récompense d'aujourd'hui.

===== Et pour la suite? =====
Avez-vous envie de formation qui rentrent plus dans le détail de Clean Code (sur "comment bien nommer ses variables et ses fonctions", sur "comment bien comprendre les intentions d'un programmeur qui suit Clean Code à la lettre", sur les fonctions, les commentaires, le TDD, ...)?

Ou sur des bonnes pratiques d'un autre niveau, par exemple la twelve factors methodology (qui fait un peu de DevOps et de SaaS)?

Ou sur différentes manières d'architecturer une application (MVC, Oinion Architecture / heaxgonal / Ports & Adapters, Microservices & SOA, ...), afin de pouvoir argumenter desvant le client des différents tenants et aboutissants?
(et au delà de vous être utile professionnellement, les connaissances architecturales permettent de vous faire briller dans les conversations techniques, de la même manière que si vous sortiez de la philosophie dans un repas mondain ^^')
