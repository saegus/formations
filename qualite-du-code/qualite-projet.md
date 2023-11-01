## Qualité du projet informatique
Une introduction nous permettant d'évoquer quelques valeurs importantes à garder en tête pour ce qui suit.

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

On prend en compte qu'on fait souvent des projets de 2 mois, et qu'on est amené à travailler à plusieurs dessus - y compris dans le cas où ça ne fait pas partie de la spec initiale du projet.

TODO cf intro de Clean code

#### La portabilité
TODO

### Focus sur la maintenabilité
Ce domaine-là est celui sur lequel nous, les experts de la technique, avons un entier pouvoir et maîtrisons le mieux.
Mais c'est aussi celui que nous négligeons le plus:
  * d'une part parce que nous sommes quasiment les seuls à pouvoir en comprendre les tenants et les aboutissants
  * d'autre part car cette discipline est complexe, et que le champ de recherche est pluri-disciplinaire: architecture logicielle, lisibilité du code, gestion des compétences de l'équipe et donc ressources humaines, ...

En bref, un domaine de techs pour les techs. Et c'est ce point sur lequel on va mettre l'accent dans la suite.

TODO
