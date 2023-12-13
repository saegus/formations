# Clean code
## Préambule
La dernière fois, on a fait un atelier d'introduction à Clean Code. Vous avez notamment pu constater que vous aviez mal compris le code non cleané (vs le code cleané par moi), ce qu signifie que si vous aviez eu à interagir avec vous auriez quasi-fatalement introduit une régression (et on parle de 50 lignes, pas d'un projet entier).

Tout comme dans l'atelier, on va se concentrer sur le portage en Javascript des principes du clean code, initialement illustré en (et pour) Java. Mais ce qui est beau avec cette méthodologie, c'est qu'une grande partie de ses principes transcende les langages de programmation (à quelques exception, comme la concurrence qui n'est pas vraiment un sujet en JS)

## Introduction
Clean code est un ensemble de règles établies empiriquement par Robert C. Martins dans le livre éponyme. L'homme est également connu sous le pseudonyme "Uncle Bob", et est le père de la méthodologie SOLID (orientée objets, mais très intéressante dans d'autres perspectives), et de "Clean Architecture", et co-auteur du "Manifeste Agile".

On parle probablement de la personne la plus célèbre dans la programmation informatique. Personnellement je n'aime pas la POO (le côté stateful des classes me donne des boutons), mais ses réalisations, son apport à un code de qualité à travers le monde et sa popularité forcent le respect.

Les excellents développeurs que j'ai connu connaissent son surnom par coeur, et SOLID est un acronyme dont ils connaissaient l'existence avant leur remise de diplôme; être développeur et ne pas connaître ces deux termes, c'est comme être biologiste et ne pas connaître Darwin et la théorie de l'évolution: vous n'irez pas loin.

Le livre Clean Code s'articule autour de 4 grandes phases:
1. Bases théoriques: pourquoi parler de code propre (le danger du code bordélique), comment donner un sens à ce qu'on va voir par la suite (Intro et 1e chapitre)
2. Règles (chapitres 2 à 8)
3. Architecture et techniques de refactoring (chapitres 9 à 16)
4. Indicateurs de problèmes dans le code (et conseils précis d'amélioration de la qualité) (chapitre 17)

On a déjà parlé d'une partie des bases théoriques dans `qualite-codebase.md`.

## Le besoin derrière Clean Code
Je vous en ai parlé précédemment lorsque j'ai parlé de ce qui arrivait lorsqu'on a du mauvais code, je ne reviens donc pas dessus :-)

## Les règles
Comme pour l'atelier, on va se référer à https://github.com/ryanmcdermott/clean-code-javascript et https://github.com/ryanmcdermott/clean-code-javascript.

Je réitère ici les avertissements faits précédemment:
Les principes issus de cette page Github sont pour partie des interprétations claires du livre de Clean Code original, et d'autres sont un peu plus sujettes à concurrence, ou sont mal adaptables au contraintes de nos environnement de développement (JS, NodeJS, ...). 

Un conseil tout personnel: choisissez des limites de règles (tailles de fonctions, de lignes) qui vous sortent (au moins un peu) de votre zone de confort. Pour bien les calibrer: ces règles ne vous servent pas à votre lecture et à votre analyse au moment où vous êtes frais et votre cerveau tourne à plein régime, mais au moment où vous avez longuement travaillé, avez bien bu et/ou fait une nuit blanche la veille, vous êtes malade, etc. C'est dans ces moments où on a le cerveau le plus embué qu'on perd les réflexes (parfois inconscients) d'écriture de qualité qu'on avait avant ainsi que nos capacités à détecter les problèmes potentiels - et donc à les corriger. Lorsque vous pensez les règles de Clean Code, choisissez celles qui limitent les erreurs que vous feriez dans cet état-là, à la lecture du code comme à son écriture.

## En complément
Sur internet il fleurit également des déclinaisons de clean code pour des technos. L'avertissement est toujours de mise ici, surtout que je suis en incapacité de juger les conseils spécifiques au technos que je connais pas, ou mal.
- Angular.js:
  - https://github.com/lubkoKuzenko/angular-clean-code
  - https://itnext.io/clean-code-checklist-in-angular-%EF%B8%8F-10d4db877f74
  - https://www.adservio.fr/post/clean-code-angular-tips-suggestions
  - https://www.freecodecamp.org/news/best-practices-for-a-clean-and-performant-angular-application-288e7b39eb6f/
- React.js:
  - https://www.turing.com/kb/writing-clean-react-code
  - https://itnext.io/7-react-clean-code-tips-you-should-know-846b8108fc46
  - (pas vraiment du clean code mais bon) https://dev.to/sathishskdev/part-4-writing-clean-and-efficient-react-code-best-practices-and-optimization-techniques-423d
  - (moitié clean code mais bon) https://www.freecodecamp.org/news/how-to-write-cleaner-react-code/

## Mise en place
Objectif: passer Clean Code de cette formation à votre travail de tous les jours.

### Process
Je pars du cas d'un projet existant et d'un travail en équipe, et vos coequipiers n'appliquent pas (encore) les principes du clean code.

1. Commencez, à votre échelle personnelle, à appliquer ces principes sur le code que vous écrivez, pour vous donner les réflexes en pratiquant. Pour commencer doucement:
   - https://github.com/ryanmcdermott/clean-code-javascript#use-meaningful-and-pronounceable-variable-names
   - remove magic numbers https://github.com/ryanmcdermott/clean-code-javascript#use-searchable-names
   - https://github.com/ryanmcdermott/clean-code-javascript#use-explanatory-variables
   - https://github.com/ryanmcdermott/clean-code-javascript#avoid-mental-mapping
   - https://github.com/ryanmcdermott/clean-code-javascript#dont-add-unneeded-context
   - https://github.com/ryanmcdermott/clean-code-javascript#functions-should-do-one-thing
   - https://github.com/ryanmcdermott/clean-code-javascript#functions-should-only-be-one-level-of-abstraction
   - https://github.com/ryanmcdermott/clean-code-javascript#dont-use-flags-as-function-parameters
   - https://github.com/ryanmcdermott/clean-code-javascript#single-responsibility-principle-srp
   - https://github.com/ryanmcdermott/clean-code-javascript#asyncawait-are-even-cleaner-than-promises

Vous relisez vos commits de la semaine prochaine peu avant (environ 1/2H-1H) avoir pushé votre travail, en ayant cette checklist en tête. Prévoyez 5 min à 30 min par 200 lignes, suivant votre familiarité actuelle avec ces règles.
Si vous êtes plus près de 30 minutes, ne vous inquiétez pas: vous arriverez graduellement à 5 minutes avec l'entraînement, puis appliquerez ces règles alors même que nous êtes en train d'écrire votre brouillon de solution.
Vous pouvez faire ça pendant 1 semaine, avant de passer à l'étape suivante.

2. Installez un linter, qui va vous signaler automatiquement certaines règles. Déclenchez-le une ou 2 fois manuellement puis, si vous ne pensez pas pouvoir vous donner cette discipline sur le long terme, utilisez husky (ou équivalent) pour en faire un hook pré-commit.

Vous pouvez mettre le linter en place dès maintenant avec un set de règles minimum (juste pour vous assurer qu'il marche). Mettez ensuite en place un set de règles "Clean Code"; je vous passe le mien avec plaisir, demandez-le-moi sur Teams.

Vous pouvez faire tourner le linter et corriger les erreurs qu'il vous renvoie pendant 1 semaine, avant de passer à l'étape suivante.

Astuce: Si vous partez d'une codebase conséquente et peu "Clean code", le linter risque de vous renvoyer tellement d'erreurs que ça va vous décourager. Pour contrebalancer ça, vous pouvez d'une part utiliser des astuces qui limitent la couverture de code - comme lint-staged, et d'autre part configurer certaines règles pour être plus permissives dans un premier temps. Dans ce dernier cas, attention: une fois qu'on a configuré les règles en "plus permissif", la tentation est grande de ne plus y toucher, et c'est autant de qualité de code en moins.

3. Cette formation n'est qu'un erzatz de ce que le livre original a à vous proposer en terme de règles: Renseignez-vous sur l'ensemble des règles pertinentes pour Javascript (à vous de juger), puis appliquez-les.

Prenez 3 semaines pour vous documenter sur l'ensemble des règles pertinentes (le livre papier est à Saegus, demandez-moi le PDF si vous préférez), 1 semaine pour les mettre en place et les expérimenter, et 3 autres semaines pour les appliquer.

Ces 3 dernières semaines sont aussi l'occasion de vous permettre autant que possible au détour d'une US d'intéragir avec du code que vous avez cleané, pour vous permettre de sentir la différence avec du code non cleané.

Les 3 premières semaines ne sont pas un temps de repos: la charge de travail est conséquente et, pour qu'elle ne vous surcharge pas plus d'1H/jour (en moyenne, ie 15H en tout), vous avez intérêt à vous y prendre dès le début de la période. Ah, au cas où: n'imaginez pas torcher ça en 1 ou 2 nuits blanches ou en un WE, sous la pression: une fois que vous aurez lu clean code, il vous faudra quelques jours (au moins 1) de repos pour digérer ce que vous avez lu, et encore 1H pour vous poser et faire une synthèse de ce que vous avez lu.

4. Vous avez appliqué pas mal de règles, félicitations!

Vous avez pu observer là où certaines d'entre elles vous ont déjà donné de sacrés coups de main, et là où d'autres n'avaient pas vraiment d'utilité dans un contexte particulier; notez que je ne parle pas de votre flemme d'appliquer telle ou telle règle mais je pars bien du prérequis que vous êtes motivés à apprendre clean code, quels que soient les efforts ;-)
Servez-vous de votre expérience pour concentrez vos efforts là où vous pensez qu'il y a le plus de valeur à apporter.

Avertissement: je vous déconseille vivement d'aller à cette étape avant d'avoir l'expérience de la qualité que vous donne l'étape précédente. Ça serait faire les choses à moitié; pas top, en terme de qualité...

5. Parlez de Clean code à votre équipe. Maintenant que vous avez ressenti tout ce que le clean code apporte et surtout que ça vous rend petit à petit allergiques au code "non cleané", ainsi qu'une expérience sur les pain points de sa mise en place, vous pouvez proposer à votre équipe de basculer dessus, en vous engageant à l'accompagnement de vos coéquipiers.

6. Bonus: si vous en travaillez en solo ou partez d'un projet nouveau, vous pouvez compacter une partie de ces étapes, et vous organiser de manière nettement plus souple; l'échéancier n'est là essentiellement que pour vous donner plus facilement la "big picture".

### Variations
#### Nouveau projet en équipe
Je vous suggère de parler de clean code dès le début, avant que chaque dev ne prenne ses habitudes sur le projet, et de mettre les règles de linting de lisibilité en place dès que possible. Vous verrez ensuite en retrospective (SCRUM) à quel point c'était une bonne idée et ce que vous pouvez améliorer.

#### Dev solo
C'est un cas bien plus confortable pour vous, dans la mesure où vous n'avez pas à "subir" le "mauvais code" des autres. Ça vous permet aussi d'organiser plus librement votre emploi du temps, et donc d'aller plus vite (à rigueur constante) sur les étapes du process précédent. 
