Notes pour le 23 novembre:
- Mise en place de la review de formation
- On m'a parlé à plusieurs reprises de code review. Si je n'ai pas déjà répondu en public:
  - C'est prévu de les mettre en place dès la fin de cette session de formations, car elle sert notamment à vous donner des outils utiles pour vos relectures
  - si vous êtes pressés, vous pouvez simplement me demander de relire un de vos commits sur votre ordi, pendant 1/2H
  - lire un code extrêmement éloigné des standards actuels de qualité a tendance à m'attrister, me désespérer voir me mettre en colère. Ne vous étonnez donc pas si cela transparaît dans mes notes de PR. Ne le prenez pas non plus personnellement.
- j'élis mon assistant d'aujourd'hui, qui a exactement le rôle de Jiad la semaine dernière.
- Petit addendum à la formation précédente: cf "Des process adaptés à ceux qui les utilisent".


# Qualité du consultant développeur informatique
On a vu que le code de bonne qualité dépend notamment des process et de l'environnement du projet, intéressons-nous maintenant aux producteurs directs de code, isolément.

### En général
Votre formation personnelle (à votre initiative et dans votre coin, sans compter sur une formation proposée par Saegus) est primordiale pour votre carrière professionnelle. Si vous ne vous documentez pas par vous-même, si vous ne faites pas d'expérience (par ex. sur des technos que vous ne connaissez) pas pendant votre temps de travail, comment comptez-vous monter en compétence?

Ce que vous vous auto-formez mènera à la revalorisation de votre valeur par votre manager, et très probablement de votre salaire et votre position. Si vous stagnez professionnellement, Rappelez-vous ça.
La multiplication des missions n'a que peu de sens sur votre CV si vous ne diversifiez pas leur contenu.

<!-- + -->

#### Une bonne estimation du savoir
On sait estimer ce qu'on sait (et à quel point on le sait/maîtrise), mais aussi ce que l'on ne sait pas.

On sait également estimer les connaissances de notre prochain dans les domaines professionnels qui nous concernent, pour savoir quand il vaut mieux faire valoir son point de vue, et quand il vaut mieux écouter celui qui en sait plus que nous et peut nous enrichir par la même occasion. 

<!-- ++ -->

### Proche de nous
J'ai interviewé plusieurs managers pour savoir ce qu'ils pensaient d'un bon projet d'une part et d'un bon développeur d'autre part. J'ai également interviewé un membre de Shift Acceleration, pour avoir un peu de variété.

Nommément (dans l'ordre d'interview): David Guedj, Frédéric Brajon, Charlotte Zekraoui et Théo Andre.
Voici leurs réponses.

<!-- +++ démarche hyper intéréssante même si les avis sont un peu convenus et attendus -->

### Un logiciel quali
Quelles sont les qualités & défauts du logiciel dont tu serais client / PO (ex.: foreseeds)?

#### Pendant le dev
##### ergonomie / UX
- _+_ elle réponde aux besoin fonctionnel des users (toutes les fonctionnalités demandées doivent être implémentées)
- _+_ responsive (mobile too)
- _+_ Ergonomie/intuitivité, simplicité d'utilisation
- _+_ Mieux vaut une appli moche mais fonctionnelle

##### bugs
- _+_ fiabilité: pas de bugs, ni de fonctionnalités pas stables / pas de résultats attendus
- _+_ ne pas planter lors de l'utilisation
- _-_ fonctionnalité qui buggue
- _-_ craintes les plus fortes: instabilité, surtout si aléatoire (pas reproductible)

##### Contrôle & planification
- _+_ accès à des démos/beta
- _+_ test de qualité
- _+_ ne pas foncer dans la réalisation tant que specs pas clairement définies
- _+_ qu'il fasse plus de 80% des features que j'attends
- _-_ feature ne respecte pas le design précédemment validé

##### autres
- perfs (mas c'est secondaire)

#### Après livraison (en tant que client)
##### Déploiement & documentation
- _+_ si j'arrive à connecter l'app à mon Azure AD, c'est bon
- _+_ pas d'installation chez moi: tout dans le cloud

##### ergonomie / UX
- _+_ rapidité d'installation du logiciel
- _+_ rapidité de prise en main du logiciel
- _+_ parcours UX intuitif
- _+_ fonctionnalité auxquelle je n'aurais pas pensé et qui me fait découvrir des choses
- _+_ responsive (mobile too)
- _+_ Ergonomie/intuitivité, simplicité d'utilisation
- _+_ Mieux vaut une appli moche mais fonctionnelle
- _+_ j'aime les messages d'erreurs rigolos, qui me font sourire
- _+_ application user-centric
- _+_ une bonne app est une app où j'ai envie de retourner
- _-_ ça m'énerve quand ça marche pas
- _-_ ça m'énerve quand c'est lent
- _-_ ça m'énerve quand je perd mes données récemment saisies au sein de mon parcours utilisateur

- _-_ velib: obligé de taper sur un bouton pour refresh la position, plutôt qu'un auto-refresh
- _-_ servicenow: fonctionnalités mal organisées, parcours utilisateurs non-intuitifs et excessivement complexes (changement de colonnes)
- _+_ suggestions sur spotify

### Mon dream developer
Quelles sont les qualités & défauts du dev avec lequel tu aimerais (ou pas) travailler en tant que manager / chef de projet?

#### Contrôle / recette
- quand Anis bossait sur le back, je ne voyais pas ce qui se passait (ne pouvais pas tester), ça a changé complètement avec l'arrivée du front: qui m'a certes permis de tester le front par moi-même, mais aussi le back par l'intermédiaire des features du front.

#### Reporting
- _+_ il fait du reporting spontané
- _-_ reporting: je ne sais pas où ça en est
- _-_ les pbs me sont reportés trop tard
- _+_ me donner une vision claire sur l'avancement
- _+_ une estimation correcte des charges et du reste à faire. 
Note: Sur l'IA, difficile de chiffrer les algos développés.
- _+_ il ne faut pas hésiter à communiquer, dire si il y a des difficultés le plus en amont possible

#### Rigueur
- _-_ les non-dit:
  - PO: Combien de jours as-tu pris pour développer cette feature?
  - DEV: J'ai fait ça en 3J
  - PO: Mais c'est buggé! Tu n'as pas fait les tests! La feature n'est pas terminée.
  => Besoin d'une DoD
- _-_ L'agilité sert d'excuse à des devs "peu rigoureux" à développer des features "à moitié", et à se dire qu'on fera le reste plus tard.

#### Autres
- _+_ c'est un référent (@fred ça veut dire quoi ça?)
- _+_ il est autonome
- _+_ challenger une spec d'US: Du côté des managers / PO, les expressions de besoin peuvent ne pas être assez claires.
=> le dev ne doit pas hésiter à challenger un peu le besoin d'une tâche avant de la commencer.
À ce propos, la maquette est souvent insuffisante en tant que spec d'US, notamment parce qu'elle ne décrit qu'un état graphique, mais pas les comportements ni les potentiels sous-états (cf l'histoire du ViewVolumns)
Certains PO se disent: comme c'est agile, on peut se permettre de faire des descriptions "light" des specs (contrairement au "mode projet") => on doit challenger ça
- _-_ (Principale cause d'echec en data) pas de gestion des cas particuliers de données de mauvaise qualité

#### Conclusion
On voit que ça part dans pas mal de directions différentes. Toutefois il y a un point qui fait consensus parmi les managers quant à son importance: la hantise du PO et du manager, c'est de pas maîtriser. Pas maîtriser les risques.

Ils ont besoin qu'on les rassure, que vous diminuiez le risque de retard autant que faire se peut à votre niveau.

Bonne nouvelle: Au bout d'un ou 2 ans de dev, pour pouvez normalement prévoir pas mal de choses. Mauvaise nouvelle: pour les concernés vous ne le faites pas, par fainéantise ou parce que vous pensez que c'est moins prioritaire que le dev de features - notamment parce que votre manager vous met la pression sur les features.

Organisez votre emploi du temps et votre code: vos collaborateurs doivent pouvoir s'y retrouver sans avoir à vous demander des précisions dessus trop régulièrement; rendez-leur votre travail clair pour qu'ils n'aient que peu de choses à vous demander.

Dans mon emploi du temps, le refactor est prioritaire face aux fonctionnalités, le bon code est prioritaire par rapport aux features; je le fais dès que je le repère, bien souvent pendant le dev d'une autre feature. Je répercute le temps passé dans le chiffracge de mes US (souvent 1/3 du temps). Résultat: pas de retards sur ce que je livre depuis 6 mois.

<!-- ++ démarche intéréssante mais peut être pas utile de nous raconter tout ce qu'il nous remonte surtout les plus obvious -->

### Tuto: Identifier les problèmes
Lorsque vous avez un problème dans votre US qui vous fait perdre du temps, il peut notamment s'agir de:
- Design fonctionnel: vous n'avez pas suffisamment précisément défini le comportement fonctionnel que vous vouliez
- Design technique: vous n'avez pas une idée/vision suffisamment claire de ce que vous devez écrire dans la codebase; ça n'est pas forcément un problème, sauf si c'est trop peu clair pour que vous n'ayez pas pu anticiper des points bloquants.
- Connaissance algos design: une méconnaissance des algos optimaux pour ce que vous cherchez à faire
- Connaissance langage: une méconnaissance des fonctions du langage que vous utilisez (JS)
- Connaissance outil: une méconnaissance de la techno/lib que vous utilisez. Ex: vous n'avez pas lu la documentation nécessaire de la techno que vous devez utiliser / au sein de laquelle votre code va s'inscrire, si il y en avait besoin (ex: vous allez intégrer un module de datatables)
- Environnement: vous ne maîtrisez pas suffisamment le code dans lequel le vôtre va s'inscrire.
- bug: problème ponctuel avec un outil: comportement anormal (ex: la prop "sx" d'un composant MUI en particulier n'a pas l'air d'être pris en compte par celui-ci).

Pour chacun de ces problèmes, il y a une solution.
- Design fonctionnel: discutez du comportement exact à avoir avec votre PO, et discutez éventuellement avec votre lead dev / référent tech de la complexité technique de l'implémentation de chaque scénario discuté avec votre PO
- Design technique: discutez éventuellement avec votre lead dev / référent tech de la solution technique que vous avez imaginé (quels fichiers modifiez-vous? quelles fonctions allez-vous créer/modifier? ...)
- Connaissance algos design: Google & GhatGPT vous aident dans la plupart des cas (comme pour tout le reste d'ailleurs), votre lead dev / référent tech peut aussi vous donner un coup de main - pour un peu que vous exprimiez clairement votre besoin. Si vous avez besoin d'un algo métier complexe, demandez au métier.
- Connaissance langage: Passez du temps à vous entraîner sur des sites type codingames.
- Connaissance outil: allez lire la doc de l'outil
- Environnement: demandez de l'aide à toute l'équipe en daily. Avoir un code séparé en objectifs (SoC) permet d'identifier plus rapidement ces divers endroits et ce qu'on doit y modifier exactement. Si l'environnement n'est pas clair, c'est parce que vos coequipiers - ou vous-même - n'avez pas pris le temps de le nettoyer pour qu'il le soit.
- bug: Stackoverflow et les issues Github sont vos amis. Si ça ne donne rien... OK celui-là est dur à résoudre.

<!-- +++ -->