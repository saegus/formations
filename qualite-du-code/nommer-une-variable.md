# Nommer une variable
## Préambule
On peut décomposer le nom d'une variable comme on décompose un mot en français: avec un radical (une base) d'une part, et des préfixes et suffixes "modificateurs" d'autre part.
Appliquer des modificateurs à un radical est plutôt aisé dès lors qu'on a appris du vocabulaire; trouver le (bon) radical, c'est une autre paire de manches, qui nécessite certaines formes de créativité.

## Quelques méthodes
Il vous sera plus facile de trouver des noms de variable si vous connaissez:
- le "bounded context" (au sens du DDD)
- du vocabulaire de designer UX/UI: "popup", "navbar", "header principal", ...
- du vocabulaire technique: "reducer", "factory", ... cf ce qui suit.

## Nommage des fonctions
### Astuce: la destination plutôt que le chemin
Nommer ses fonctions par le résultat qu'elles rendent plutôt que par l'algo qu'elles appliquent est souvent plus facile à se représenter et plus concis à écrire. Redux nomme notamment ses actions reducers par l'état de l'app après exécution du reducer.

Par exemple, `const points = updateStatusAndReprocessPoints({status})` se transforme en `const points = updatedPoints({status})`.

À utiliser quand on manque d'inspiration.

### Les cas particuliers
#### Bonnes pratiques
- Une fonction sensée renvoyer un booléen sera plus volontiers préfixée de "is", "should", "can", "must", "check", etc. Exemple: `isEven`, `canHandleAzertySpecialObjs`.
- Les contrôleurs seront préfixés du verbe HTTP utilisé pour les appeler: `postUser`, `getAttachedBooster`, etc.
- Les vues sont suffixées par `view`, `panel`, etc.
- Les layouts sont suffixées par `layout`.
- Les fonctions appliquant le pattern "factory" sont suffixées par "Factory". Pour des exemples d'utilisation de ce pattern, cf le code d'eCSAR.
- Les reducers (de Array.reduce, de Redux, de useState(), etc) sont suffixées par "Reducer". Pour des exemples, cf le code d'eCSAR.
- Les fonctions qui ont pour but d'être un callback à une autre fonction se fait suffixer par "Callback" (tant qu'on ne peut pas lui touver un nom plus sémantiquement significatif)
- on utilise le pluriel (`extractRawMaterials` plutôt que `extractRawMaterial`) quand on retourne une collection d'éléments (tableau, objet composé de plus d'un attribut "important", etc); et vice versa.

#### Mauvaises pratiques
Un qualificatif, si il est utiliseé trop souvent, perd son atout principal, qui est de faire la différence avec d'autres codes, de rendre la fonction unique et son sens particulier simple à saisir (en effet si 2 fonctions font la même chose, pourquoi ne pas garder la première et l'importer à l'endroit où on veut utiliser la 2e?). C'est valable également pour les qualificatifs vus ci-dessus.

Au-delà de ce principe, il y a des noms/prefixes/suffixes/etc qui sont sur-utilisés ou polysémiques (plusieurs sens possibles; autre formulation: chacun y voit midi à sa porte), et donc à éviter d'utiliser pour la clarté de votre code. On a notamment:
- "service": Est-ce un wervice au sens de la SOA (et donc un exécutable/conteneur)? Au sens du DDD? Au sens d'un simple module chargé par un framework d'injection de dépendances, comme j'ai déjà pu le voir? etc.
- "handler" & "listener": si votre code base plus d'une partie de son architecture (et en EDA il y en a beaucoup) sur ces concepts, il vaut mieux oublier ces suffixes pour adopter des mots qui les différencient des autres utilisations.

#### Clean Code: rappels
Meaningful names:
- Use Intention-Revealing Names
- Avoid Disinformation
- Make Meaningful Distinctions
- Use Pronounceable Names
- Use Searchable Names
- Avoid Encodings

Code Smells:
- G19: Use Explanatory Variables
- G20: Function Names Should Say What They Do

## Problème
Clean Code - ainsi que la section "Nommage des fonctions" ci-dessus - nous dit comment ne pas mal nommer une variable - et nous aide à ajouter des préfixes/sufixes pour moduler le sens d'une variable, mais nous donne assez peu d'indications pour booster notre inspiration à trouver des noms.

On va répondre ici à la problématique: comment trouver le bon radical, quand on n'a pas la créativité d'une boite de comm' (après tout, on est developpeurs informatique, hé!) ?

Pour remédier à ce problème, on va commencer par se rapprocher de la description fonctionnelle de votre US comme du langage métier associé à votre application.

## Présentation de cas
Pour parler concrètement, on va repartir du cas du synthétiseur et de l'Exécuteur de Tâches Complexes (ETC).

## Travail conceptuel initial: interfaces
Tout d'abord, on va définir clairement nos points d'interface et le rôle qu'on leur donne. Ce travail de conception nécessite plus ou moins souvent de lire la description de son US et de s'éloigner du clavier quelques dizaines de secondes (ou de minutes) pour se retrouver avec nos réflexions et définir précisément ce qu'on veut obtenir.

...

Après réflexion, j'ai déterminé qu'on aurait des interfaces (avec le code environnant) de ce genre:
```
class NomdeClasse {
  methodeRecuperationDateDebut () {}
  methodeRecuperationDateFin () {}
  methodeRecuperationMatieresPremières () {}
  methodeRecuperationReferencesCommerciales () {}
  methodePourAvoirLeRecapitulatif () {}
}
```

## Début du naming: noms des interfaces
### Méthodes d'ordre d'écriture inter-fonction
#### Méthode par fonctions
On va nommer la fonction puis en écrire le corps, puis nommer une 2e fonction, puis en écrire le corps, etc.

#### Méthode par batch de sous-éléments (noms, corps et prototypes) de fonction
On va nommer toutes les noms d'interfaces (et de fonctions "coeur de métier"?), puis on va écrire tous les corps de fonctions en fonction du nom de la fonction.

L'ordre d'exécution des couches est défini par la méthode intra-fonctions choisie. On pourrait donc avoir à la place: on commence par écrire les corps de fonctions, et on finit par leurs noms.

#### Exemple
Je cherche à avoir des noms d'interfaces liés au métier - pour être consistant avec les noms de variables dans le code appelant qui sont un peu plus liés au métier qu'à la technique, et que les fonctions internes / "coeur de fonctionnalité" puissent avoir un nom indifféremment métier ou technique. Toutefois je préfère le nom technique pour les fonctions qui ne font pas référence dans leur algo / corps de fonction à des spécificités métier.

Je vais m'entraîner sur `methodeRecuperationMatieresPremières`. On va se mettre à la place de la fonction appellante, et écrire l'interface la plus élégante possible - quel que soit ce qu'on met derrière:

```
const log = Logger.get("load-formula-compo");
...
export const loadFormulaCompositionDataFromAPIs = async ({
  formula_number,
  fil_code,
}) => {
  log("Start retrieve module");
  const recap_builder = new RecapBuilder();
  recap_builder.addStartDate();
  log("Start retrieving endpoints");
  const scrapped_with_warnings = await endpointsResponses({formula_number, fil_code});
  log("End retrieving endpoints");
  recap_builder.addEndDate();

  const scrapped = scrappedWithoutWarnings(scrapped_with_warnings);

  const rms = scrapped[ENDPOINTS.FILV3.GENERAL_INFO].RawMaterials;
  recap_builder.addNbRMs(rms.length);
  const refcoms = scrapped[ENDPOINTS.FILV3.GENERAL_INFO].RawMaterials.flatMap(({RawMaterials}) => RawMaterials.commercial_references);
  recap_builder.addNbRefcoms(refcoms.length);
  const recap = recap_builder.getRecap();

  const warnings = getWarnings(scrapped_with_warnings);
  const result = {
    scrapped,
    warnings,
    recap,
  };

  log("End retrieve module");
  return result;
}
```

Voici ce qu'on peut déduire quant à nos interfaces via cette méthode:
```
class RecapBuilder {
  addStartDate () {}
  addEndDate () {}
  addNbRMs () {}
  addNbRefcoms () {}
  getRecap () {}
}
```

#### Note
On observe que toutes les méthodes sont appelées au sein de la même fonction, et qu'on aurait pu simplifier notre classe en un simple appel à une fonction stateless type:
```
const recap = recapMsg({
  nb_raw_materials,
  nb_refcoms,
  duration_ms,
});
```

Toutefois j'ai écrit le code de cette manière pour simplifier, et diverses contraintes - comme la contrainte de gestion de persistence des données entre la collecte de celles-ci et l'obtention du récapitulatif - peuvent interdire l'utilisation d'une fonction stateless. Par exemple, que `scrapped` ne contienne qu'une partie des info dont j'ai besoin, et que l'autre partie se trouve générée à l'intérieur d'une fonction appelée par `endpointsResponses()`.

## Noms des fonctions
Il existe plusieurs manières de trouver les noms des fonctions, qui dépendent de l'ordre dans lequel on va ordonnancer les diverses sous-tâches de l'écriture de notre fonctionnalité.

### Méthodes d'écriture intra-fonction
#### Méthode analytique
On va définir l'interface dont on a besoin - en écrivant des prototypes de fonctions avec leurs noms et leurs agencements, puis on écrira le corps des fonctions.

On va (arbitrairement) commencer par `methodePourAvoirLeRecapitulatif`: définir l'output est normalement assez aisé.

Je cherche à avoir des noms d'interfaces liés au métier - pour être consistant avec les noms de variables dans le code appelant qui sont un peu plus liés au métier qu'à la technique, et que les fonctions internes / "coeur de fonctionnalité" puissent avoir un nom indifféremment métier ou technique. Toutefois je préfère le nom technique pour les fonctions qui ne font pas référence dans leur algo / corps de fonction à des spécificités métier.

D'après "Détails fonctionnels" > 2, nous souhaitons un "message récapitulatif"; on peut donc par exemple nommer notre méthode `recapMsg()`, en faisant référence à ce qu'elle doit fonctionnellement nous renvoyer.

On fait de même pour les autres endpoints d'interface (== méthodes ici) listés ci-dessus.

Ensuite, on travaille le corps de la fonction, pour qu'elle fasse ce qu'on lui demande - ie retourner un "récap de msg"; pour ça, on va l'écrire de la fin au début:
```
class NomdeClasse {
  // 4/ on finit le travail de l'étape précédente, pour que la fonction ne plante pas à l'exécution lors de nos tests alors que les autres fonctions ne sont pas encore écrites.
  duration_ms = 0;
  nb_raw_materials = 0;
  nb_refcoms = 0;

  ...

  recapMsg () {
    // 3/ récupération des info à utiliser pour la génération (cf ci-dessous)
    const {nb_raw_materials, nb_refcoms, duration_ms} = this;

    // 2/ on liste les info nécessaires à la génération, et on les passe à la fonction de génération
    const recap = fonctionDeGénérationDuRecapitulatif({
      nb_raw_materials,
      nb_refcoms,
      duration_ms,
    });

    // 1/ on retourne un récap généré à partir - a priori - d'une template string et d'informations récupérées précédemment.
    return recap;
  }
}
```

On se retrouve à présent avec `fonctionDeGénérationDuRecapitulatif` (méthode interne / privée) à écrire et à nommer.

#### Méthode synthétique
Avant de donner des noms à nos méthodes, je vais écrire leur contenu; je déciderai ensuite de quel nom leur donner, en fonction de ce contenu.

On va supposer que `fonctionDeGénérationDuRecapitulatif` provient de l'extérieur de la classe. En voici une implémentation, à base de template strings:
```
const fonctionDeGénérationDuRecapitulatif = ({
  nb_raw_materials,
  nb_refcoms,
  duration_ms,
}) => {
  const duration_s = parseInt(duration_ms / 1000);
  const recap = `La récupération des réponses des APIs externes a duré au total ${duration_s} seconde(s). ${nb_raw_materials} matières premières et ${nb_refcoms} références commerciales ont été récupérées.`;

  return recap;
}
```

Essayons de paraphraser le rôle de `fonctionDeGénérationDuRecapitulatif`, en nous mettant à sa place:
- fonctionnellement:
  - je génère - et retourne - le récapitulatif à partir de la durée, du nombre de RMs et du nombre de refcoms
  - je génère - et retourne - le récapitulatif à partir d'informations générées par l'exécution des tâches
- techniquement:
  - je rend un template (a priori une template string) en l'hydratant avec des informations

Ce mini-brainstorming nous permet d'obtenir entre autres `renderRecap`, `renderTasksExecutionSummary`, `renderSummary`, `generateRecap`, etc.

On applique Clean Code en éliminant le contexte inutile, et donc adieu `renderTasksExecutionSummary`.

Le grand gagnant: `renderRecap` (notamment car on est sur une fonction à la fois technique et métier et qu'on utilise déjà "recap" pour parler du même objet dans `recapMsg`). On a donc:
```
const renderRecap = ({
  nb_raw_materials,
  nb_refcoms,
  duration,
}) => {
  const duration_s = parseInt(duration / 1000);
  const recap = `La récupération des réponses des APIs externes a duré au total ${duration_s} seconde(s). ${nb_raw_materials} matières premières et ${nb_refcoms} références commerciales ont été récupérées.`;

  return recap;
}
...
class NomdeClasse {
  recapMsg () {
    ...
    const recap = renderRecap({
      nb_raw_materials,
      nb_refcoms,
      duration,
    });
    ...
  }
}
```

## Et les variables non-fonctions?
### Première approche
On reprend l'exemple de "Début du naming: noms des interfaces".
Écrivons la méthode `addEndDate`, avec pour contrainte la génération de la durée comme attribut de classe et l'environnement suivant:
```
class NomdeClasse {
  start_date = new Date();
  /* TODO durée en ms entre le début et la fin de l'appel, sera utilisé par recapMsg() */;

  addStartDate () {}
  addEndDate () {
    // Doit générer la date lors de son appel, puis à partir de celle-ci et de this.start_date
    // calculer la durée d'exécution et la stocker dans un attribut de classe (cf ci-dessus).
  }
}
```

Pour l'algorithmie de `addEndDate`, on a en première approche (avec du SoC qui sépare le calcul de this.durée dans une fonction spécifique):
```
  addEndDate () {
    // je vous passe les divers checks que pourrait contenir cette fonction, allons à l'essentiel

    const date_de_fin = new Date();
    this.date_de_fin = date_de_fin;

    this.durée = this.retourneLaDuréeCalculée();
  }
```

On se dit qu'on va adopter la convention de nommage de `start_date` pour la date de fin:
```
class NomdeClasse {
  start_date = new Date();
  end_date = new Date();

  addStartDate () {}
  addEndDate () {
    const end_date = new Date();
    this.end_date = end_date;

    this.durée = retourneLaDuréeCalculée(this.start_date, end_date);
  }
}
```

Écrivons à présent l'algorithme de `retourneLaDuréeCalculée`:
```
retourneLaDuréeCalculée (start_date, end_date) {
  // je vous passe les divers checks que pourrait contenir cette fonction, allons à l'essentiel

  const durée = end_date.getTime() - start_date.getTime();

  return durée;
}
```
Par expérience de développeur, la durée est souvent exprimée en plusieurs unités dans le code (au moins secondes et millisecondes); il me semble pertinent de préciser cette unité, pour le prochain développeur qui devra manipuler cette variable. L'attribut de classe de durée peut donc s'appeler `duration_ms`.
La durée à l'intérieur de `retourneLaDuréeCalculée`, peut soit s'appeler de la même manière, soit `duration`; on peut se permettre ça car on peut lire directement au-dessus l'algorithme qui génère la durée, et déduire - car on connaît la librairie standard de JS - qu'il s'agit de millisecondes.

On obtient donc:
```
const retourneLaDuréeCalculée = (start_date, end_date) => {
  const duration = end_date.getTime() - start_date.getTime();

  return duration;
}

class NomdeClasse {
  start_date = new Date();
  end_date = new Date();
  duration_ms = 0;

  addStartDate () {}
  addEndDate () {
    const end_date = new Date();
    this.end_date = end_date;

    this.duration_ms = retourneLaDuréeCalculée(this.start_date, end_date);
  }
}
```

### Et dans un code métier?
On va utiliser le Domain-Driven Design, et plus particulièrement le langage ubiquitaire (rappel: http://referentiel.institut-agile.fr/ubiquitous.html).

Pour vous ultra-simplifier, le langage ubiquitaire est le langage parlé par le métier, que votre PO utilise très probablement pour échanger avec le porteur d'initiative et/ou des utilisateurs. C'est également le langage que nos designers UI/UX les plus chevronnés à Saegus apprennent lorsqu'ils doivent livrer des maquettes.

Vous l'apprenez en parlant à ces personnes, en vous intéressant à:
- ce qu'elles font:
  - comment elles le font
  - pourquoi c'est important de le faire
  - et de le faire de cette manière
- qu'est-ce qu'elles manipulent:
  - instruments/outils tangibles ou non
  - matières premières pour les artisans et les usines chimiques
  - structures de données
  - etc
- ce qu'elles aiment dans leurs "fonctionnement" / tâches actuel(les)
- ce qui les gênent (painpoints)
- etc.

#### Illustration
Imaginons l'API qui donne le temps d'attente avant le prochain métro affiché sur les quais. Elle:
1. récolte les positions de chaque métro lorsqu'il arrive en gare
2. applique des algorithmes d'estimation de passage en fonction de la distance (en nombre de station, éventuellement pondéré par les distances inter-stations), mais aussi de l'éventuel retard d'un métro qui ne quitte pas la gare, ou n'arrive pas à la prochaine gare à l'heure estimée.
3. retourne à l'afficheur le temps d'attente avant le prochain train

Imaginer cette API suffit normalement à imaginer les noms de variables et de méthodes tournant autour des concepts de gare, temps d'attente, distance inter-gare / entre 2 gares, retard en station, distance à une gare, etc.

C'est le fait qu'on arrive à concevoir clairement ces concepts qui fait qu'on n'a pas de mal à trouver de noms de variables.

#### Évaluer sa maîtrise du langage ubiquitaire
Pour vous assurer que vous maîtrisez les concepts de votre projet actuel. Vous pouvez juste vous entraîner à le pitcher à des personnes ayant différents degrés de connaissances de votre projet: votre manager de mission, vos collègues Saegus, vos collègues chez le client, dans des éguipes plus ou moins proches du projet, etc.

Pourquoi pitcher? Parce qui se conçoit clairement s'énonce clairement, et si vous n'arrivez pas à l'énoncer c'est un indice potentiel sur un point de vocabulaire qu'il vous manque, et qu'il vaut mieux aller demander au métier.

Un autre moyen est de profiter d'une partie des instances agiles pour challenger vos US, en les reformulant en face de votre PO avec vos mots (et pas sa description dans l'US) - dont ce que vous savez du langage ubiquitaire, et de demander au PO si ce que vous venez de dire lui semble correct.

#### Un exemple: application de l'immutabilité
On part d'une fonction métier avec une variable mutée:
```
const transformRMs = (rms, refcoms) => {
  let res = onlyRMsWithAllowedIngredients(rms);
  res = onlyRMsWithInciUs(res);
  res = mergeRefComsInRMs(res, refcoms); // sth like: [{code: "aqua", refcoms: [{name: "aqua 99%"}]}]
  res = onlyRMsWithRefComs(res);
  return res;
}
```

Revenons à notre fonction; voilà des propositions de noms de variables, imaginés à partir de ce que retourne chaque expression (en l'occurence chaque appel de fonction): 
```
const transformRMs = (rms, refcoms) => {
  const rms_allowed_ings = onlyRMsWithAllowedIngredients(rms);
  const rms_inci_us = onlyRMsWithInciUs(res);
  const enriched_rms = mergeRefComsInRMs(res, refcoms);
  const rms_with_refcoms = onlyRMsWithRefComs(res);
  return rms_with_refcoms;
}
// De cette manière, on peut ajouter ce genre de console.log() juste avant le return,
// sans avoir à changer le code juste pour ajouter notre console.log, ou avoir à en faire plusieurs:
// console.log({
//   rms_allowed_ings,
//   rms_inci_us,
//   enriched_rms,
//   rms_with_refcoms,
// });
```

## Pour compléter
Une connaissance des éléments suivants communs nous permet d'améliorer, de moduler et/ou de préciser les bases de noms obtenues via les méthodes précédentes:
- des vocabulaires utilisés dans nos bibliothèques externes (par ex. les reducers, action-reducers, actions et autre concepts Redux/Flux)
- de diverses architectures (ex. MVC nous fait utiliser les préfixes/suffixes "model" et "controller")
- des principes de Clean Code (ex. pas de contexte inutile)
- des patrons de conception (ex. singleton, factory, reducer)

## Conclusion
Nous avons vu - et pour certaines essayé - différentes méthodes pour trouver des bases de noms de fonctions et de variables. À vous de mettre ça en application dans vos projets!
