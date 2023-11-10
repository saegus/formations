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

##### Comment couler une boite
Je connais une entreprise qui, à la fin des années 80, a développé une application très performante. Elle était très populaire et de nombreux professionnels l'ont achetée et utilisée. Mais ensuite, les cycles de sortie ont commencé à s'allonger. Les bugs n'ont pas été réparés d'une version à l'autre. Les temps de chargement ont augmenté et les crashs se sont multipliés. Je me souviens du jour où j'ai fermé le produit par frustration et ne l'ai jamais utilisé à nouveau. Peu de temps après, l'entreprise a fait faillite.

Deux décennies plus tard, j'ai rencontré l'un des premiers employés de cette entreprise et je lui ai demandé ce qui s'était passé. La réponse a confirmé mes craintes. Ils avaient précipité la mise sur le marché du produit et avaient créé un énorme chaos dans le code. À mesure qu'ils ajoutaient de plus en plus de fonctionnalités, le code devenait de plus en plus mauvais jusqu'à ce qu'ils ne puissent tout simplement plus le gérer. C'est le mauvais code qui a conduit à la chute de l'entreprise.

##### Le coût total de posséder un bordel
Si vous êtes programmeur depuis plus de deux ou trois ans, vous avez probablement été considérablement ralenti par le code désordonné de quelqu'un d'autre. Si vous êtes programmeur depuis plus de deux ou trois ans, vous avez probablement été ralenti par du code désordonné. Le degré de ralentissement peut être significatif. Sur une période d'un an ou deux, des équipes qui avançaient très rapidement au début d'un projet peuvent se retrouver à avancer à un rythme d'escargot. Chaque modification apportée au code casse deux ou trois autres parties du code. Aucun changement n'est trivial. Chaque ajout ou modification au système nécessite que les entrelacs, les torsions et les nœuds soient "compris" afin que d'autres entrelacs, torsions et nœuds puissent être ajoutés. Avec le temps, le désordre devient tellement grand, profond et élevé qu'ils ne peuvent pas le nettoyer. Il n'y a absolument aucun moyen.

À mesure que le désordre s'accumule, la productivité de l'équipe continue de diminuer, approchant asymptotiquement zéro. À mesure que la productivité diminue, le management ne peut faire qu'une chose: ajouter plus de personnel au projet dans l'espoir d'augmenter la productivité. Cependant, ce nouveau personnel n'est pas familiarisé avec la conception du système. Ils ne font pas la distinction entre un changement qui correspond à l'intention de conception et un changement qui contrecarre cette intention de conception. De plus, eux et tous les autres membres de l'équipe sont soumis à une pression horrible pour augmenter la productivité. Ainsi, ils créent de plus en plus de désordre, poussant la productivité de plus en plus vers zéro.







