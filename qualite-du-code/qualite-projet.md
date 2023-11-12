## Qualité du projet informatique
On va sortir un peu la tête hors de l'eau qu'est la technique pour revoir les objectifs à long terme qu'on doit avoir en tête lorsqu'on produit du code.

Un code de bonne qualité est central, ici on va parler d'un des facteurs qui influent sur sa production - les process du projet - ainsi que de l'environnement du développeur qui produit ce code - le projet. 

Par exemple, lorsqu'on travaille en équipe, on établit une Definition of Done qui contient une liste de tâches à exécuter dont une partie tourne autour de la qualité. Ce qui rend dan ce cas le code de qualité, c'est le process de Continuous Integration.

#### État de l'art
D'après https://fr.wikipedia.org/wiki/Qualit%C3%A9_logicielle .

Indicateurs de qualité logicielle - norme ISO 25010:
  * la capacité fonctionnelle (les fonctionnalités utilisateurs). En font partie la précision, l'interopérabilité, la conformité aux normes et la sécurité ;
  * la facilité d'utilisation. En font partie la facilité de compréhension, d'apprentissage et d'exploitation et la robustesse - une utilisation incorrecte n'entraîne pas de dysfonctionnement ;
  * la fiabilité. En font partie la tolérance aux pannes - la capacité d'un logiciel de fonctionner même en étant handicapé par la panne d'un composant (logiciel ou matériel) ;
  * la performance. En font partie le temps de réponse, le débit et l'extensibilité - capacité à maintenir la performance même en cas d'utilisation intensive ;
  * la maintenabilité, qui mesure l'effort nécessaire à corriger ou transformer le logiciel. En font partie l'extensibilité, c'est-à-dire le peu d'effort nécessaire pour y ajouter de nouvelles fonctions ;
  * la portabilité, c'est-à-dire l'aptitude d'un logiciel à fonctionner dans un environnement matériel ou logiciel différent de son environnement initial. En font partie la facilité d'installation et de configuration dans le nouvel environnement.

On peut les voir comme des objectifs haut niveau et long terme du projet. À garder dans un coin de la tête et à ressortir quand on doit prendre une décision avec impact à long terme, comme l'introduction d'une dépendance, un changement d'architecture, le choix d'un linter, introduction initiale de tests, ...

### Prise de conscience au sein des équipes de projet
Tous les indicateurs ci-dessus sont importants, on doit donc s'assurer de les adresser tous simultanément dans nos projets.

La capacité fonctionnelle et la facilité d'utilisation sont les domaines du PO et de l'ergonome (designer?).

La fiabilité est un point déjà considéré comme important par les chefs de projets (essayez de livrer des codes peu fiables, c'est nettement plus difficile à faire passer auprès du client que des codes peu maintenables).

La performance est un problème pas toujours bien adressé (par manque de connaissances), et source de sur-ingénierie (over-engineering). Toutefois notre marge de manoeuvre - à nous les devs - est faible dans le cadre des projets que nous livrons habituellement à Saegus, et une grande partie de ce qui doit être mis en place dans ce domine l'est déjà (en partie par les frameworks et outils que nous utilisons).

La portabilité est pour les webapps souvent divisée en une partie orientée techs (ex: serveurs tournant sour Mac, Windows, Python2 ou 3, ...) et une partie orientée utilisateurs (ex: UI sous écrans 13", 20", responsive tablette/mobile, ...).

Last but not least: la maintenabilité.

### Quels conséquences à un projet informatique de mauvaise qualité?
Vous connaissez - voir devinez aisément - les problématiques causés par l'insuffisance de la plupart des indicateurs ci-dessus; je vais me concentrer sur les deux qui me semblent les moins évidents ici.

#### La maintenabilité
Pourquoi c'est problématique, un code non maintenable, y compris dans des projets de 2 mois?

On prend en compte qu'on fait plus ou moins souvent des projets de 2 mois, et qu'on est amené à travailler à plusieurs dessus - y compris dans le cas où ça ne fait pas partie de la spec initiale du projet.

#### La portabilité
Des différences de comportement entre l'UX rapportée par les utilisateurs et l'UX sur les machines des devs. On n'arrive pas à reproduire un problème de prod sur nos machines locales.

Des différences de comportement entre les machines des devs. "Ça marche chez moi, c'est sûrement toi qui a mal fait un truc".

On n'arrive pas à déployer rapidement et efficacement la solution sur un nouvel environnement / une nouvelle instance.

### Focus sur la maintenabilité
Ce domaine-là est celui sur lequel nous, les experts de la technique, avons un entier pouvoir et maîtrisons le mieux.
Mais c'est aussi celui que nous négligeons le plus:
  * d'une part parce que nous sommes quasiment les seuls à pouvoir en comprendre les tenants et les aboutissants
  * d'autre part car cette discipline est complexe, et que le champ de recherche est pluri-disciplinaire: architecture logicielle, lisibilité du code, gestion des compétences de l'équipe et donc ressources humaines, ...

#### Quelques passages de Clean Code
Pour enfoncer le clou, résumé de l'intro de Clean Code:

![foo](https://www.osnews.com/images/comics/wtfm.jpg "title")

Cette image est humoristique (thank you captain obvious), mais elle illustre un indicateur simple et efficace - mais terriblement triste si vous vous êtes retrouvés dans ce rôle - de la qualité du code: l'incompréhension du lecteur (généralement en code review) à laquelle mène un mauvais code. 

##### Comment couler une boite
Ce qui suit est une traduction de l'intro de Clean Code.

Je connais une entreprise qui, à la fin des années 80, a développé une application très performante. Elle était très populaire et de nombreux professionnels l'ont achetée et utilisée. Mais ensuite, les cycles de sortie ont commencé à s'allonger. Les bugs n'ont pas été réparés d'une version à l'autre. Les temps de chargement ont augmenté et les crashs se sont multipliés. Je me souviens du jour où j'ai fermé le produit par frustration et ne l'ai jamais utilisé à nouveau. Peu de temps après, l'entreprise a fait faillite.

Deux décennies plus tard, j'ai rencontré l'un des premiers employés de cette entreprise et je lui ai demandé ce qui s'était passé. La réponse a confirmé mes craintes. Ils avaient précipité la mise sur le marché du produit et avaient créé un énorme chaos dans le code. À mesure qu'ils ajoutaient de plus en plus de fonctionnalités, le code devenait de plus en plus mauvais jusqu'à ce qu'ils ne puissent tout simplement plus le gérer. C'est le mauvais code qui a conduit à la chute de l'entreprise.

##### Le coût total de posséder un bordel
Ce qui suit est une traduction de l'intro de Clean Code.

Si vous êtes programmeur depuis plus de deux ou trois ans, vous avez probablement été considérablement ralenti par le code désordonné de quelqu'un d'autre. Si vous êtes programmeur depuis plus de deux ou trois ans, vous avez probablement été ralenti par du code désordonné. Le degré de ralentissement peut être significatif. Sur une période d'un an ou deux, des équipes qui avançaient très rapidement au début d'un projet peuvent se retrouver à avancer à un rythme d'escargot. Chaque modification apportée au code casse deux ou trois autres parties du code. Aucun changement n'est trivial. Chaque ajout ou modification au système nécessite que les entrelacs, les torsions et les nœuds soient "compris" afin que d'autres entrelacs, torsions et nœuds puissent être ajoutés. Avec le temps, le désordre devient tellement grand, profond et élevé qu'ils ne peuvent pas le nettoyer. Il n'y a absolument aucun moyen.

À mesure que le désordre s'accumule, la productivité de l'équipe continue de diminuer, approchant asymptotiquement zéro. À mesure que la productivité diminue, le management ne peut faire qu'une chose: ajouter plus de personnel au projet dans l'espoir d'augmenter la productivité. Cependant, ce nouveau personnel n'est pas familiarisé avec la conception du système. Ils ne font pas la distinction entre un changement qui correspond à l'intention de conception et un changement qui contrecarre cette intention de conception. De plus, eux et tous les autres membres de l'équipe sont soumis à une pression horrible pour augmenter la productivité. Ainsi, ils créent de plus en plus de désordre, poussant la productivité de plus en plus vers zéro.

##### La règle du boy scout
Ce qui suit est une traduction d'une section du premier chapitre de Clean Code.

Il ne suffit pas d'écrire un code de manière efficace. Le code doit rester propre au fil du temps. Nous avons tous vu le code se dégrader au fil du temps. Nous devons donc jouer un rôle actif pour prévenir cette dégradation.

Les Boy Scouts of America ont une règle simple que nous pouvons appliquer à notre profession.
> Laissez le terrain de camping plus propre que vous ne l'avez trouvé.<sup>5</sup>

Si nous remettions tous notre code un peu plus propre que lorsque nous l'avons récupéré, le code ne pourrait tout simplement pas se détériorer. Le nettoyage ne doit pas être quelque chose d'énorme. Changez un nom de variable pour le mieux, divisez une fonction un peu trop grande, éliminez un petit morceau de redondance, corrigez une déclaration conditionnelle composite.

Pouvez-vous imaginer travailler sur un projet où le code s'améliore simplement avec le temps ? Croyez-vous qu'une autre option soit professionnelle ? En effet, l'amélioration continue ne fait-elle pas partie intrinsèque du professionnalisme ?

<sup>5. Cela a été adapté du message d'adieu de Robert Stephenson Smyth Baden-Powell aux scouts : "Essayez de laisser ce monde un peu meilleur que vous ne l'avez trouvé..."</sup>

Note Anis: je connais relativement mal Lord Baden-Powell, mais il a créé le scoutisme et a été anobli par la reine d'Angleterre. C'est pas un rigolo quoi. Et ne crachez pas sur les scouts SVP, j'ai fait partie du scoutisme laïque.

##### La règle du boy scout revisitée
Il s'agit d'appliquer cette règle du boy scout de manière agressive: dès qu'on rencontre un bout de code peu clair au sein d'une de nos lecture (analyse de code servant à établir la stratégie d'écriture d'une US, code review, ...), on refactor.

Lorsqu'on rencontre un tel code, on évalue le coût (nombre de lignes à changer, difficulté de compréhension) et le risque (de régression) d'un refactor de cette partie; si les deux sont faibles, on refactor direct. Dans les autres cas, on demande conseil au rédacteur du code si c'est possible, sinon on en parle à toute l'équipe (sur un channel Teams par exemple). Si le refactor est trop complexe, on peut le décaler dans le temps par exemple en en faisant une US à part entière.

Le temps passé à refactor, si il n'y a pas d'US dédié à ce refactor, est à compter sur les autres US, en augmentant par exemple les points de complexité et en mettant une note sous la tâche.

Le côté individuel de cette règle est responsabilisant, et son côté "légèreté administrative" en fait un champion de l'agilité - sans compter sa qualité "à la demande". Ses principaux challenges:
- elle nécessite un état d'esprit volontariste, à l'image des scouts
- il faut au possible des US à peu de points: ajouter un refactor à une US déjà complexe est parfois contre-productif en terme de temps et de fatigue développeur
- il semble un peu plus facile de mettre ça en place alors que la DoD ne contient que peu d'items.

##### Conclusion
Ces bouts d'histoires vécues par l'auteur, les lead devs seniors ayant travaillé sur des projets longs (> 1 an) s'y retrouvent tous; à différents degrés certes, mais tous.

Un développeur formé aux techniques d'architecture, outils et technologies mises en place dans le code (je pense par exemple à de l'event driven, relativement peu maîtrisé dans notre BU) doit pouvoir comprendre ce que fait le code qu'il lit en une lecture et en minimisant les allers-retours entre les différentes fonctions et les différents fichiers, et sans se demander trop souvent "quel est cette structure algorithmique?" "Que veut dire cette variable?" etc. 

D'autre part, le désordre appelle le désordre, et on n'a pas envie d'écrire un code propre au sein d'un désordre - parfois on ne le peut juste pas sans une grosse réécriture de ce qu'il y a autour; il vaut mieux commencer à gérer l'ordre dans un projet dès le début de celui-ci.

Une technique assez souvent utilisée dans les équipes de dev est de faire des "sprints de refactors". C'est mieux que rien, mais ce n'est pas assez à mon sens: la règle du boy scout est plus optimale.

## Mise en place et conservation des process de qualité
### Communication d'équipe
Une communication d'équipe fluide et efficace est à la base d'une partie des process de qualité, comme par exemple le fait de discuter des détails fonctionnels de la tâche qu'un dev va commencer, pour s'assurer qu'il n'ait pas de choix fonctionnels/ergonomique à faire (sinon ça occasionne des réflexions parfoir épineuses voir décourageantes du côté du dev, une insatisfaction côté recettage, ...).

On peut tenter de rendre le daily scrum agréable, voir désirable: amener des pâtisseries (croissants, ...) et/ou la boisson (café/jus d'orange/...) le matin au daily, le faire plus tôt ou plus tard (perso je suis un lève tard: 9H ça me prend la tête, 10H ça me va bien), etc. C'est certes un travail du scrum master, mais vous devez vous creuser la tête pour imaginer ce qui vous ferait apprécier ce moment et lui en parler.

D'autre part, une bonne entente humaine est nécessaire; pour cela faites attention à votre prochain et écoutez-le lorsqu'il souhaite vous parler de ce qui lui tient à coeur. L'intérêt de ça va au-delà des simples affinités des uns et des autres, car il influe sur le moral de chacun et donc indirectement sa productivité.

### Process de travail
Il est important que l'ensemble de l'équipe comprenne (j'insiste sur ce mot, qui est différent de "obéir au chef") chacune des règles de qualité. Cela inclut comment les mettre en place, leur intérêt, mais aussi ce qui arrive lorsqu'on ne les suit pas: pas seulement dans la théorie, mais de préférence des exemples réels, si possibles tirés de précédents liés au projet / à l'équipe actuel(le), avec des chiffres comme l'évolution du nombre hebdo de tickets d'incidents.
Il faut potentiellement le rappeler régulièrement (à chaque fin de sprint ou de rétro).

Ces process peuvent s'appuyer sur une Definition of Done (DoD) spécifique aux devs, qui doit être simple à mettre en place par un développeur au sein de son process de développement d'US. Par exemple: 
* une colonne pour chaque point à valider dans le kanban
* un fichier `dod.md` commited dans le repo
* une extention VSCode avec un système de cases à cocher qu'on aurait paramétré pour n'autoriser le push qu'ne fois toutes les cases commited, et qui se remet à zéro à chaque push
* dans un système de pull requests, un bot qui au sein d'une PR vérifie automatiuement les points qui peuvent l'être (linting dans la CI, ...) et demande au développeur de cocher les cases restantes
* utiliser husky pour faire des pré-commit hooks permet d'automatiser une partie des checks

Également, il est important que ces process soient d'une part normés, c'est-à-dire qu'on ait tous la même définition de ce qui doit être fait: c'est le rôle de la DoD "étendue", le complément de la DoD "résumée" qui doit être une référence qu'on peut consulter rapidement. Et d'autre part, ces process doivent être aussi peu contraignants pour chaque développeut que possible. On peut pr exemple observer les règles suivantes:
- les outils doivent remonter de l'information pertinente. Une commande testant ou lintant un fichier en particulier et qui se relance au rafraîchissement de celui-ci a tout à fait sa place dans les npm scripts. Pour eslint, des packages comme `lint-staged` et des commandes comme `eslint --fix $(git diff --name-only HEAD | xargs)` ne lintent qu'un sous-ensemble des fichiers souvent pertinents.
- les outils doivent pouvoir être lancés rapidement. Utiliser le cache d'un programme comme ESLint pour l'accélérer s'envisage aussi: `eslint --cache --cache-strategy metadata .`. Les tests avec Jest doivent aussi pouvoir se lancer sur un seul fichier de test.
- les outils doivent être peu contraignants pour le dev, ils ne doivent pas dégouter celui-ci de les lancer. Le linter doit contenir autant que faire se peut uniquement des rêgles autofixables; l'ajout d'autres règles doit être limité au strict nécessaire pour la qualité du projet. Un dev peut vouloir rajouter des règles sur son code (des règles d'auto-fix par exemple), si c'est possible le projet doit lui permettre d'exécuter ses règles personnelles en plus des règles de l'équipe.
- les règles communes doivent être comprises de tous: par exemple une règle de linting imposant les doubles quotes à la place des simple quotes a tout d'une règle stylistique subjective et rien d'une règle de qualité dans du travail d'équipe.
