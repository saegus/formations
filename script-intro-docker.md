# Formation - atelier Docker: from zero to hero
## Préambule
Ce document est une formation par l'exemple, sous forme de cas d'usages posés comme des problématiques concrètes et vécues, qu'on va résoudre ensemble. C'est une sorte de script détaillé du storytelling donné par le formateur.

Le public visé a déjà approché l'outil Docker via problématique ponctuelle qu'il a dû résoudre dessus, mais n'a pas appris à s'en servir au-delà. Cette formation lui donne les clés des utilisations courantes de Docker, de débutant à intermédiaire (et début d'avancé). 

## Introduction
Docker est une solution qui permet de concevoir, tester, partager et déployer rapidement des applications à l'aide de conteneurs sans contrainte d'environnement (OS, hardware, etc).

Docker permet d'envoyer du code plus rapidement, de standardiser les opérations de vos applications, de migrer aisément du code, et donc de délivrer rapidement et de manière standardisée une application.

Docker est un projet open source (il est devenu de fait un standard multiplateforme incontournable, qui a marginalisé l'utilisation des VMs traditionnelles)

### Ce n'est pas
Docker n'est pas un gestionnaire de VMs: les conteneurs qu'il manipule sont très légers, et se basent sur l'OS hôte pour tourner.

Docker n'est pas Kubernetes: Docker n'a pas de vocation à gérer un espace multi-machines (sauf éventuellement Docker swarm), alors que Kubernetes si, ce qui en fait un outil idéal pour la gestion d'un cloud. Kubernetes est compatible avec les conteneurs Docker, mais aussi avec d'autres technologies.

### Concepts
Docker manipule en premier lieu les concepts de containers, images, volumes, network, DockerFile.
On peut retrouver dans l'ensemble des concepts également: Registry (dont Docker Hub), Compose, Daemon, Engine, Swarm.

## Approche initiale (use case 1): lancer un conteneur connu avec docker run
### Le commencement
Je veux faire tourner un app téléchargée depuis internet, par un conteneur "jetable" plutôt qu'un package à installer sur mon PC.
L'heureux élu est MySQL, dont les tags d'image et la doc sont là: https://hub.docker.com/_/mysql

On commence par lancer le conteneur de la manière la plus simple possible - `docker run mysql`:
```
2023-01-11 13:55:19+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.0.31-1.el8 started.
2023-01-11 13:55:19+00:00 [Note] [Entrypoint]: Switching to dedicated user 'mysql'
2023-01-11 13:55:19+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.0.31-1.el8 started.
2023-01-11 13:55:19+00:00 [ERROR] [Entrypoint]: Database is uninitialized and password option is not specified
    You need to specify one of the following as an environment variable:
    - MYSQL_ROOT_PASSWORD
    - MYSQL_ALLOW_EMPTY_PASSWORD
    - MYSQL_RANDOM_ROOT_PASSWORD
```
Ceci ressemble fortement à une erreur d'exécution. En allant voir la doc du container, on constate qu'il a effectivement besoin d'une de ces variables pour tourner, et que donc cette "erreur" était totalement prévisible.

Le container m'a redonné la main, tourne-t-il toujours? Allons voir dans `docker ps` pour comprendre ce qu'il se passe:
```
$ docker ps
CONTAINER ID   IMAGE                    COMMAND                  CREATED       STATUS       PORTS                    NAMES
```

Le conteneur n'est pas en activité. On a besoin de plus d'info. A-t-on au moins une trace de sa présence passée?
```
$ docker ps -a
CONTAINER ID   IMAGE   COMMAND                  CREATED          STATUS                      PORTS   NAMES
f8f443270a71   mysql   "docker-entrypoint.s…"   39 seconds ago   Exited (1) 38 seconds ago           naughty_brahmagupta
```
Oui! Il s'est bien lancé, puis s'est arrêté.

### Écriture alternative
La plupart des commandes qu'on va voir dans cette section ont une syntaxe alternative, qui consiste à les préfixer par `image` ou `container`. Bien que plus longue, je vous recommande dans un premier temps de l'utiliser, car elle donne un namespace indiquant l'bjet Docker qu'on gère (conteneurs ou images ici). Ceci est valable depuis longtemps (les "management commands" datent de Docker 1.13.0, ie 2017), toutefois les commandes raccourcies sont en partie restées dans les usages, notamment de par leur antériorité mais aussi leur facilité d'usage.

Les commandes suivantes manipulent des conteneurs, et se retrouvent préfixées par `container`: `docker run/start/stop/restart/rm/exec`. Par exemple, `docker start` exécute le même algorithme que `docker container start`.

Les commandes suivantes manipulent des images, et se retrouvent préfixées par `image`: `docker pull`. Par exemple, `docker pull` exécute le même algorithme que `docker image pull`.

On a également quelques alias moins réguliers:
- `docker container ls` est un alias de `docker container ps / docker ps`
- `docker image rm` est un alias de `docker rmi`

### Variables d'environnement
Bon maintenant, on va appliquer ce qui nous a été proposé dans le container, à savoir ajouter une des variables proposées. Pour ajouter une variable d'environnement à notre conteneur, on utilise `-e NOM_VARIABLE="valeur de ma variable"` ou `-e NOM_VARIABLE=valeur-de_ma.variable`. On peut mettre plusieurs `-e ...` dans un même `docker run` pour préciser plusieurs variables d'environnement.

Il existe évalement un argument `--env-file`, qui permet de préciser un fichier contenant une ou plusieurs variables d'environnement, au format Dotenv.

Pour notre cas, on va donc lancer la commande: `docker run -e MYSQL_ROOT_PASSWORD=my-secret-pw mysql`.

Il se passe pas mal de logs, puis la dernière ligne se fixe à:
```
2023-01-11T14:40:10.592984Z 0 [System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections. Version: '8.0.31'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server - GPL.
```

### Port binding
Fort bien, notre container tourne! Il est plus que temps d'interagir avec cette base de données!

Pour ça je vais utiliser le client MySQL en ligne de commande, mais un MySQL Workbench aurait aussi pu faire l'affaire.
... Mais au fait, qu'est-ce que je mets dans les info de connexion?
Autant pour l'utilisateur (root) et le mot de passe (my-secret-pw) je vois la chose, autant pour l'host et le port il va falloir deviner. `localhost` et `3306`?

Testons:
```
$ /opt/homebrew/opt/mysql-client/bin/mysql --user=root --password=my-secret-pw --host=127.0.0.1 --port=3306
mysql: [Warning] Using a password on the command line interface can be insecure.
ERROR 2003 (HY000): Can't connect to MySQL server on '127.0.0.1:3306' (61)
```
Bon, c'est pas ça.
Il y a un problème avec le container: on ne lui a pas dit comment interagir avec l'hôte, et notamment sur quel(s) port(s) faire circuler de l'info.

On peut à notre niveau considérer notre container docker fonctionnellement comme une VM (même si c'est beaucoup plus rapide et plus léger), en particulier sur le volet de l'isolation avec l'hôte. Et donc si on veut que l'hôte et le conteneur communiquent - ici via un host et un port, il faut leur créer un pont.
Dans Docker, on créé un tel pont par exemple avec `docker run -e MYSQL_ROOT_PASSWORD=my-secret-pw -p 3307:3306 mysql`.

Mais d'où sort ce `3307` ? Eh bien figurez-vos qu'on n'est pas obligé de faire correspondre le port 3306 du conteneur avec le port 3306 de l'hôte. J'ai donc demandé à Docker de connecter le port 3306 du conteneur au port 3307 de mon hôte. On peut donc lire ce binding de port comme `-p <port de l'hôte>:<port du conteneur>`.

> Cette image décrit par exemple le résultat de `docker run -p 8089:80 wordpress`:
![](https://www.code4it.dev/static/7e983e27425fb44d41cf3189d3835b92/84f4d/Docker-ports.png)
> Vous pouvez accéder à l'assistant d'installation Wordpress sur votre machine sur http://localhost:8089 (sous réserve que le port 8089 ne soit pas occupé par une autre application).

Re-lançons notre conteneur et notre client avec les modifs qui vont bien; on attend environ 30s après le "docker run" précédent, pour que le serveur soit prêt à recevoir des connexions, puis on lance le client (avec le port mis à jour):
```
$ /opt/homebrew/opt/mysql-client/bin/mysql --user=root --password=my-secret-pw --host=127.0.0.1 --port=3307
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
...
mysql>
```
Looks nice! 

De mémoire, on avait une colonne `PORTS` vide dans le précédent résultat de `docker ps`, regardons si elle est modifiée par ce -p:
```
$ docker ps
CONTAINER ID   IMAGE   COMMAND                  CREATED         STATUS         PORTS                               NAMES
bd5523306df5   mysql   "docker-entrypoint.s…"   9 seconds ago   Up 9 seconds   33060/tcp, 0.0.0.0:3307->3306/tcp   romantic_keldysh
```
Bingo! grâce à ça, on peut garder une trace de nos bindings de ports.
L'argument `-p` est bien plus puissant que le bind de port entre l'hôte et le container, la doc officielle est votre amie :-)

### Gestion du cycle de vie des conteneurs
Par curiosité, faisons un `docker ps -a`:
```
$ docker ps -a
CONTAINER ID   IMAGE   COMMAND                  CREATED          STATUS                      PORTS                               NAMES
bd5523306df5   mysql   "docker-entrypoint.s…"   7 minutes ago    Up 7 minutes                33060/tcp, 0.0.0.0:3307->3306/tcp   romantic_keldysh
c55a2edc4887   mysql   "docker-entrypoint.s…"   23 minutes ago   Exited (0) 23 minutes ago                                       frosty_fermi
ef3b9316b02b   mysql   "docker-entrypoint.s…"   26 minutes ago   Exited (0) 24 minutes ago                                       elegant_archimedes
c45f491fbfa5   mysql   "docker-entrypoint.s…"   28 minutes ago   Exited (0) 27 minutes ago                                       wonderful_elbakyan
9830ffa5116e   mysql   "docker-entrypoint.s…"   50 minutes ago   Exited (0) 28 minutes ago                                       flamboyant_cerf
f8f443270a71   mysql   "docker-entrypoint.s…"   2 hours ago      Exited (1) 2 hours ago                                          naughty_brahmagupta
```

What?!? Mais pourquoi autant de containers stoppés (Exited) mais qui apparaissent / existent encore?
Quand un conteneur s'arrête, docker n'en supprime pas les données, par exemple pour qu'on puisse le relancer pour l'auditer (un tuto rapide ici: https://stackoverflow.com/questions/32353055/how-to-start-a-stopped-docker-container-with-a-different-command).

Sauf que ça commence à prendre de la place, et c'est bien de s'en débarasser ;-)
Pour ça:
```
$ docker rm bd5523306df5 c55a2edc4887 ef3b9316b02b c45f491fbfa5 9830ffa5116e f8f443270a71 # les containers ids du dernier "docker ps -a"
c55a2edc4887
ef3b9316b02b
c45f491fbfa5
9830ffa5116e
f8f443270a71
Error response from daemon: You cannot remove a running container bd5523306df517584bbf37662ce5827b0ea2d2ed8168cc55f2f06ac56ddd5c9d. Stop the container before attempting removal or force remove
```

Bon, tous les containers sauf 1 ont pu être supprimés, c'est déjà ça.
Pour le dernier:
```
$ docker stop bd5523306df5; docker rm bd5523306df5
bd5523306df5
bd5523306df5
```
Il faut d'abord stopper un container pour pouvoir le supprimer.

Ça serait quand même cool si un container lancé par `docker run` se supprimait automatiquement une fois qu'il était stoppé non?
Mais c'est carrément possible, avec l'option `--rm` :-)
Avec la commande précédente, ça donne:  `docker run --rm -e MYSQL_ROOT_PASSWORD=my-secret-pw -p 3307:3306 mysql`.
Si vous testez avec `docker stop ...; docker ps -a`, vous verrez que le conteneur disparaît automatiquement. C'est valable aussi pour un conteneur qui exécute autre chose qu'un démon (par ex. une commande de container qui prend quelques secondes ou même milisecondes pour s'exécuter, comme `docker run --rm --entrypoint "ls" mysql`)

### Noms des conteneurs, tags d'images et daemonization
Jetons un coup d'oeil à la doc (toujours https://hub.docker.com/_/mysql), et plus précisément à la commande proposée "par défaut": `docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag`
On voit 2 nouvelles options apparaître: `-d` et `--name`. On observe également `:tag` suffixé à `mysql`.

Commençons d'abord par `-d`, en exécutant un conteneur avec une des commandes précédentes et cette option:
```
$ docker run -e MYSQL_ROOT_PASSWORD=my-secret-pw --name conteneur-tuto -d mysql
bd5523306df517584bbf37662ce5827b0ea2d2ed8168cc55f2f06ac56ddd5c9d
$
```
Le shell nous redonne la main immédiatement après avoir lancé la commande, et aucun log n'apparaît (excepté la 1e ligne, qui est l'id complet du conteneur). Le conteneur a été lancé en tant que daemon, un peu comme le serveur mysql qui tourne sur le port 3306 de mon hôte mais qui n'a pas besoin de monopoliser un shell ou une fenêtre pour tourner.

On continue avec `--name`; regardons le résultat des commandes suivantes:
```
$ docker run --rm -e MYSQL_ROOT_PASSWORD=my-secret-pw --name conteneur-tuto -d mysql
b652e859f2acda176f4d64d7f757fe88d9aeffa9ceaacd21d610e78429e59dc0
$ docker ps
CONTAINER ID   IMAGE   COMMAND                  CREATED          STATUS          PORTS                 NAMES
b652e859f2ac   mysql   "docker-entrypoint.s…"   3 minutes ago    Up 3 minutes    3306/tcp, 33060/tcp   conteneur-tuto
$ docker stop conteneur-tuto
conteneur-tuto
$ docker rm conteneur-tuto
conteneur-tuto
$ docker ps
CONTAINER ID   IMAGE   COMMAND                  CREATED          STATUS          PORTS                 NAMES
```
On peut donc nommer un conteneur, et les commandes vues précédemment savent uiliser ce nom plutôt que l'id du conteneur pour identifier celui-ci.

Et on finit sur le `:tag`!
Une image est un ensemble de fichiers qui permet d'instancier un conteneur, un peu comme une définition de classe permet d'instancier un objet de cette classe. Une image est un objet Docker qui est identifié par un "repository" et un "tag".
De plus, une image est composée de couches et se base souvent sur d'autres images, comme une branche git est composée de commits et se base souvent sur d'autres branches. La comparaison ne s'arrête pas là, car on peut pull et push une image depuis et vers un Docker registry.

Le "repository" peut être l'identifiant d'un repository github (comme `matthewfeickert/intro-to-docker` qui provient de `https://github.com/matthewfeickert/intro-to-docker`) comme le nom d'un repo dans le Docker public registry (https://hub.docker.com/) ou même le nom d'un repo dans un registre privé si on en utilise un. Par exemple, le `mysql` précédent provient du Docker public registry.

Le "tag" permet de packager l'application représentée par le repository repository de différentes manières / avec différentes "flavors": par exemple la page de doc de mysql (pour rappel https://hub.docker.com/_/mysql) nous liste entre autres les suivants:
- 8.0.31, latest
- 8.0.31-debian, debian
- 5.7.40, 5-oracle
- 5.7.40-debian, 5-debian

Si des tags sont sur la même ligne, ils représentent la même image (le même packaging). 
On remarque:
- `latest` est un tag qui bouge très probablement au fur et à mesure des nouvelles versions de mysql.
- les versions 8 et 5 de mysql: on a donc plusieurs versions de l'application qui nous sont proposées
- les versions `oracle` et `debian`; il s'agit d'images sur laquelle est installée l'app actuelle. Debian est une image Linux très utilisée et dont les outils sont bien connus; Oracle est une version "customisée" d'une autre image Linux (je parierais sur Red Hat / CentOs), avec des additions de l'éditeur du logiciel (Oracle).

On peut récupérer localement une image avec `docker pull <repo>:<tag>` (`docker pull mysql:latest`) ou `docker pull <repo>`.

## Use case 2: Je veux faire tourner une app front (un angular, un react ou même juste du PHP en template) dans un container docker, pour avoir un environnement réutilisable.
Note préliminaire: je pars du principe que vous connaissez `ls`, `echo`, `pwd` et les autres commandes "de base" utilisées par exemple lors d'un `ssh` à un serveur distant. Si ce n'est pas le cas, vous allez avoir du mal à comprendre ce qui suit.
Je vais également utiliser les "here documents" (https://fr.wikipedia.org/wiki/Here_document) pour vous vous montrer des exemples minimaux reproductibles (https://en.wikipedia.org/wiki/Minimal_reproducible_example, ou équivalent comme les SSCCE ou les MCVE) en shell.

On va finalement jeter notre dévolu sur une app NodeJS, un serveur express. On peut supposer qu'on part d'un projet fraîchement généré via `npx express-generator --ejs`.
L'app se lance via un `npm start`. Le serveur sert la page templatée `index.html.ejs` sur http://localhost:3000/

L'arborescence de cette app:
- mon-front
  - package.json
  - app.js
  - bin
    - www
  - views
    - index.html.ejs

Note: le 18 janvier, la formation en était à environ 45 min ici, et on a fait un peu plus d'1H en tout.

### Gérer les images 
Tout d'abord, la commande pour créer un conteneur NodeJS sur lequel va tourner notre serveur: `docker run --rm -p 3000 node:18-alpine`

On observe 2 changements par rapport aux commandes précédentes:
- `-p` n'a qu'un seul port comme valeur. C'est un raccourci permis par l'option, qui signifie `-p 3000:3000`
- `node:18-alpine` est une nouvelle image. Au-delà du fait qu'on comprenne qu'on va exécuter node (version 18), on voit "alpine" dans le tag. Il s'agit d'une distribution sur laquelle se base la construction du conteneur node, qui est l'une des deux distributions populaires optimisées pour Docker, avec notamment une taille d'image significativement inférieure à celles des images par défaut. Par exemple, l'image `node:18` est 5.6 fois plus volumineuse que `node:18-alpine`.

On en profite pour introduire la commande qui nous donne cette dernière info:
```
$ docker image ls
REPOSITORY   TAG         IMAGE ID       CREATED       SIZE
node         18-alpine   8a6b96edfa16   4 weeks ago   167MB
node         18          14b53699cf24   5 weeks ago   942MB
``` 

`docker image` est la commande pour gérer les images docker. Si besoin d'une doc minimaliste (l'usage quoi), il suffit de l'exécuter tel quel, sans argument. On y voit notamment `pull`, dont on a parlé au début.

L'équivalent de `docker ps` pour les images:
```
$ docker image ls
REPOSITORY               TAG         IMAGE ID       CREATED       SIZE
node                     18          b0cef62e0901   7 days ago    945MB
node                     18-alpine   48dc5bf9cf8c   8 days ago    171MB
odyssee-backend          latest      b56cf8a65212   2 weeks ago   1.09GB
odyssee-frontend         latest      984ed41bfb53   3 weeks ago   1.62GB
mysql                    latest      7b6f3978ca29   6 weeks ago   550MB
node                     <none>      14b53699cf24   6 weeks ago   942MB
```
On note `docker image rm`, l'équivalent de `docker rm`.

Une commande utile (puissante donc dangereuse) quand on manque de place sur le PC: `docker image prune`. Elle supprime toutes les images qui n'ont pas de conteneurs en cours ni stoppés.

Il existe une déclinaison de `prune` ("supprime ce qui n'est pas actuellement utilisé") pour quasiment tous les objets Docker, et il y a même une commande pour les rassembler toutes: `docker system prune`. Elle est parfaite pour faire le ménage, mais réfléchissez à deux fois avant de l'utiliser: vous pourriez bien perdre définitivement des données...

### Les volumes
Docker produit des conteneurs stateless par défaut, un volume sert à rendre le conteneur stateful (précisément "stateful across container reboots", un peu comme le disque dur sert à rendre votre ordinateur "stateful across reboots"). Les volumes se divisent en 2 types: le bind mount et le volume interne.

#### Bind mounts
On va incorporer / lier notre répertoire actuel à notre conteneur avec la commande suivante: `docker run --rm -d -p 3000 -v $(pwd):/usr/src/app node:18-alpine`. La nouvelle option ajoutée ici nous permet de lier un fichier ou un dossier entre l'hôte et le conteneur, la syntaxe est `-v <path du fichier ou du directory dans l'hôte>:<path du fichier ou du directory dans le container>`

Attention:
- le chemin dépend de votre current working directory (vous pouvez le consulter avec `pwd`)
- si le fichier n'existe pas d'un côté ni de l'autre, Docker créé (récursivement) un dossier vide à la place. La fonctionnalité est pratique, mais si vous voyez un dossier vide à la place du fichier/dossier que vous attendiez, vérifiez vos chemins d'accès.

#### Volumes internes
Dans certains cas, on va vouloir attacher un volume à votre conteneur, mais en déléguer la gestion à Docker (plutôt que de la confier au système de fichiers hôte). 

On garde ici la fonction de persistance de la donnée, mais on se sépare de celle de partage entre conteneur et hôte. Ça peut servir à éviter qu'on ne modifie par erreur les données du volume, ou parce qu'accéder au volume depuis l'extérieur n'a que peu d'importance.

Par exemple, une base de données conteneurisée a besoin de stocker ses données dans un volume (sinon elles sont perdues dès que le conteneur redémarre). Si l'utilisateur n'a pas envie d'un accès au fichiers de données mysql et qu'intéragir via les process habituels de l'app (mysql, mysqldump) lui suffit, il va chercher à définir un volume interne pour ce conteneur.

On note que le volume interne présente de meilleures performances que le bind mount.

Pour créer un volume géré par Docker, on utilise par exemple `docker volume create <nom du volume>`. Une fois qu'on a créé un tel volume, on peut l'utiliser au sein d'un conteneur avec `docker run -v <nom du volume>:<point de montage> <image>`.

Par exemple: 
```
$ docker volume create mon-volume;
mon-volume
$ docker run -d --name mon-conteneur -v mon-volume:/point/de/montage wordpress
fe4bf48ce0bda9e227eafcb544e48e80a6e036045e671fd859b0acc3cc79bd4c
$ docker exec mon-conteneur touch /point/de/montage/fichier-persistent
$ docker stop mon-conteneur;
$ docker run -v mon-volume:/point/de/montage2 --entrypoint ls wordpress /point/de/montage2
fichier-persistent
```
On observe bien la persistance du fichier dans le volume alors que le conteneur est détruit puis recréé - et le point de montage changé.

#### Gestion des volumes
`docker volume` est aux volumes ce que `docker image` est aux images (et ce que docker ps/run/stop/rm est aux containers): un manager de volumes. On va d'ailleurs y retrouver les mêmes commandes de management; par exemple:
```
$ docker volume ls
DRIVER    VOLUME NAME
local     0c4019bc77cc500cda8794460ad11f14d3c6f017f3aa84d46f8a899e0384387c
local     odyssee_node_modules_back
local     odyssee_mon_volume
```

On note qu'on peut supprimer les volumes liés à un conteneur en même temps que celui-ci: `docker rm --volumes <container>`.

### Changer la commande lancée ou le dossier courant
#### Changer la commande lancée: docker run --entrypoint
On peut changer dans le container la commande d'entrée par défaut donnée par l'image (dans l'exemple précédent qqc comme `npm run start`) avec `--entrypoint`.
En pratique, ça donne par exemple: `docker run --rm --entrypoint ls node:18-alpine -l`, ou encore `docker run --rm --entrypoint npm node:18-alpine install --save axios debug dotenv`.

On peut voir dans `docker ps` la commande lancée par le conteneur, dans la colonne COMMAND. En lançant la commande suivante dans un terminal `bash` et en attendant environ 10s, on a par exemple:
```
$ docker run --rm --entrypoint /bin/sh node:18-alpine -c "echo 'start'; sleep 10; echo 'elapsed: 10s'" & sleep 2; docker ps
[1] 88082
start
CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS         PORTS   NAMES
e8f21c92d451   node:18-alpine   "/bin/sh -c 'echo 's…"   2 seconds ago   Up 1 second            peaceful_vaughan
$ elapsed: 10s
```
Cette commande un peu longue lance une commande bash dans un conteneur mis en arrière-plan du terminal, attends 2 secondes et lance un `docker ps`. La commande lancée dans le terminal du conteneur affiche immédiatement "start", attends 10 secondes puis affiche "elapsed: 10s"; après ça, le terminal interromp son exécution, et le conteneur s'arrête (et vu qu'on a passé --rm, se supprime). on voit donc dans le `docker ps` le conteneur en activité, avec son entrypoint  qui commence bien par notre commande (/bin/sh) et ses arguments (-c "echo 'start'; sleep 10; echo 'elapsed: 10s'"): "/bin/sh -c 'echo 's…".

En particulier, une commande pratique pour voir ce qu'il y a dans une image: `docker run -it --entrypoint /bin/bash <image>` (ou `docker run -it --entrypoint /bin/sh <image>` si la précédente échoue): on peut ouvrir un shell à l'intérieur d'un container grâce à ça. `-i` et `-t` sont des options permettant d'ouvrir un shell bash interactif, de la même manière qu'un ssh sur un serveur distant.
```
$ docker run --rm -it --entrypoint /bin/sh node:18-alpine
/ # ls
bin    dev    etc    home   lib    media  mnt    opt    proc   root   run    sbin   srv    sys    tmp    usr    var
/ # echo "Dans le conteneur" > temp.txt; cat temp.txt
Dans le conteneur
/ # exit
$ docker ps
CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS         PORTS   NAMES
```

#### Lancer une commande en plus de celle en cours: docker exec
Pouvoir lancer une image avec une commande de notre choix qui nous permet d'intéragir avec (`docker run --entrypoint ...`) c'est puissant, mais ce qui va plus souvent nous occuper, c'est d'intéragir avec un conteneur dans lequel est déjà lancé sa commande "originale".

De la même manière qu'on a utilisé `docker run --entrypoint`, on peut utiliser `docker exec -it <container> <commande>`, cette fois sur un container déjà lancé (dont le run a potentiellement modifié la composition interne).
En pratique, on lance par exemple un shell (`/bin/sh` ici) interactif (`-it`) dans le conteneur nommé "node-container" avec: `docker exec -it node-container /bin/sh`.
```
$ docker run --rm --name mon-sql mysql
$ docker exec -it mon-sql /bin/sh
/ # ls
bin    dev    etc    home   lib    media  mnt    opt    proc   root   run    sbin   srv    sys    tmp    usr    var
```

Pour une commande non interactive, on va préférer omettre `-it`. Par exemple: `docker exec node-container echo hello` .

#### Changer le dossier courant
Le working directory d'un conteneur est l'endroit où l'entrypoint va être lancé. Étant donné que pas mal de commandes dépendent de ce working directory et des paths où nous avons monté nos volumes (bind mounts ou volumes internes), le connaître et le changer sont deux choses à savoir.

On peut obtenir le working directory d'une image notamment en l'instanciant avec `docker run <image> pwd` .

Pour choisir le volume d'un conteneur, on va utiliser `-w`:
```
$ docker run --rm -w /mon/dossier --entrypoint pwd node:18-alpine
/mon/dossier
```
On remarque au passage que si le working directory demandé n'existe pas, Docker le créé pour nous, évitant à `pwd` de planter.

Pour docker exec il s'agit de la même option `-w`, mais un dossier qui n'existe pas génèrera une erreur.

### Créer une image: Dockerfile et docker build
On veut installer automatiquement les dépendances npm du projet, pour ne pas qu'un dev ait à saisir manuellement la commande à chaque nouvelle installation.

Avec Docker, on peut créer facilement des conteneurs où ces commandes ont été préalablement exécutées. Les modèles de ces conteneurs sont des images, et on va en construire une.

Une image est construite à partir d'un fichier `Dockerfile`, avec la commande `docker build`.

#### Dockerfile
La référence des Dockerfiles: https://docs.docker.com/engine/reference/builder/

Le Dockerfile est un fichier de configuration, qui permet de centraliser les données nécessaires à la création d'une image.

L'image a comme base une autre image, qui est ensuite configurée et/ou provisionnée.
Il s'agit de fonctionnalités similaires à Vagrant ou Ansible.

Le Dockerfile est un fichier constitué d'une suite d'instructions, avec une instruction prenant au minimum une ligne. Chaque instruction commence par une commande Docker, suivie de ses paramètres.

Voici un Dockerfile simple:
```
FROM node:18
ENTRYPOINT [ "npm", "run", "dev" ]
```
La première ligne utilise la commande `FROM`, qui spécifie l'image sur laquelle se base celle qu'on est en train de créer; il y en a exactement une par fichier pour les builds mono-stage. Il s'agit souvent sur les projets simples de la première ligne du fichier.

La seconde spécifie la commande à lancer, et est la version persistente de l'option ` --entrypoint npm <image> run dev` d'un `docker run`. sans ce `CMD`, le conteneur exécute le CMD de l'image sous-jacente (node:18), qui est `npm start`.

`docker build .` va par défaut chercher le Dockerfile à `./Dockerfile`; toutefois on peut préciser à `docker build` d'aller le chercher ailleurs avec `docker build -f mon-conteneur/mon.Dockerfile .`

##### Commandes
Une partie des fonctionnalités qu'on a vu précédemment avec `docker run` ont une transposition dans le Dockerfile. Voici une liste (non exhaustive):

| `docker run`  | Dockerfile  |
| ----------- | ----------- |
| node:18-alpine | FROM node:18-alpine |
| -e ma_variable="ma valeur" | ENV ma_variable=ma valeur |
| -v /var/lib/postgresql/data | VOLUME /var/lib/postgresql/data |
| -v $(pwd):/usr/src/app | COPY . /usr/src/app (voir aussi ADD) |
| -w /mon/dossier | WORKDIR /mon/dossier |
| --entrypoint npm <image> run dev | ENTRYPOINT ["npm", "run", "dev"] (voir aussi CMD) |

Attention toutefois: il s'agit de transpositions; et donc, même si le comportement est semblable, la fonctionnalité n'est pas exactement identique.

Certaines instructions peuvent dépendre d'un directory de l'hôte. Par exemple: `COPY . /usr/src/app`, où `.` est le working directory du contexte de build (côté hôte). On va en parler au moment du build.

Lors du run d'une image générée par un Dockerfile, si il y a concurrence entre une commande du Dockerfile et une option de `docker run` , les options de `docker run` seront généralement prioritaires. Plus concrètement, `-w` aura la priorité sur `WORKDIR` et `-v` aura la proiorité sur `COPY` et `VOLUME`.

On a également d'autres commandes; voici les plus couramment utilisées:
###### RUN
C'est l'équivalent de `docker exec <container> command args`: `RUN command args`
Permet de lancer une commmande dont les modifications vont persister dans l'image. L'affichage `stdin` de la commande apparaît pour sa part au moment du build.

###### USER
Avec USER, on peut changer l'utilisateur qui exécute les commandes ultérieures.

L'user par défaut étant root, c'est utile lorsqu'on veut dé-privilégier les commandes du conteneur, pour des raisons de sécurité par exemple.
USER est l'équivalent de `--user="mon.user"` (ou `--user="<uid>:<gid>"`) de `docker run`, que nous n'avons pas vu jusque-là.

###### EXPOSE
EXPOSE / --expose (pour `docker run`) est différent de -p / --publish: il sert plus ou moins de documentation pour que le lecteur sache sur quel port l'app écoute, Docker lui-même n'en fait rien de particulier.

#### docker build
Une fois qu'on a notre Dockerfile, on va construire une image à partir de celui-ci.
Docker va construire ("build") l'image en en empilant des couches successives (sous forme d'images temporaires), une couche par instruction (certaines instruction comme FROM ne génèrent pas de couche).

Pour construire une image à partir de données locales, on utilise souvent `docker build .` dans le dossier contenant le Dockerfile. L'argument `.` est le contexte (de build) - ici le répertoire courant, et le Dockerfile doit par défaut se trouver dedans. Le contexte sert par exemple à fixer le répertoire courant de l'hôte utilisé lors d'un COPY, ou pour prendre en compte un fichier `.dockerignore`, on en parle plus bas.

La manière la plus simple de construire une image est donc:
```
cat << EOF > Dockerfile
FROM node:18
echo Hello
ENTRYPOINT [ "npm", "run", "dev" ]
EOF

docker build .;
```

Une fois que l'image a fini d'être construite, apparait une ligne ressemblant à: 
```=> => writing image sha256:c955961a3d9a48e6f98808f3682bc5e74bd011b5a65ed1ed3c36096a0167e307```
Si on liste les images locales, on voit que notre image est bien présente avec son hash raccourci:
```
$ docker images
REPOSITORY               TAG          IMAGE ID       CREATED        SIZE
<none>                   <none>       c955961a3d9a   26 seconds ago   945MB
```
C'est bien beau, mais ça paraît un peu fastidieux de devoir exécuter une image via son id, ça serait plus simple si elle avait un nom. Utilisons l'option `--tag` pour ça: `docker build . --tag test-img`.
Si on regarde encore une fois les images locales:
```
$ docker images
REPOSITORY               TAG          IMAGE ID       CREATED          SIZE
test-img                 latest       c955961a3d9a   14 minutes ago   945MB
```
Notre image non-nommée a été remplacée par `test-img`!

#### Contexte
Comme dit plus haut, le contexte de build va servir à `docker build` à savoir depuis quel répertoire récupérer les données demandées par ses différentes commandes.

Par exemple, `COPY . /` copie les données du répertoire de contexte de l'hôte (`.`) à la racine du conteneur.

On change le contexte de build en changeant `.` dans `docker build .`; voici un script shell auto-suffisant montrant le principe:
```
mkdir mon-conteneur;
echo "Contexte du conteneur" > mon-conteneur/msg.txt
cat << EOF > Dockerfile
FROM node:18
COPY . .
ENTRYPOINT echo msg.txt
EOF

docker build -f Dockerfile ./mon-conteneur --tag example;

docker run example;
# Contexte du conteneur
```

#### Pour notre cas d'usage
Rappel de notre besoin: On veut installer automatiquement les dépendances npm du projet, pour ne pas qu'un dev ait à saisir manuellement la commande à chaque nouvelle installation.

Pour ça, notre Dockerfile va:
- importer le package.json du projet dans le layer d'image en création, avec COPY
- lancer un `npm install` avec RUN

Voici un script shell auto-suffisant pour générer notre image:
```
cat << EOF > package.json
{
  "name": "test",
  "version": "0.0.1",
  "dependencies": {
    "express": "*"
  }
}
EOF

cat << EOF > Dockerfile
FROM node:18-alpine
WORKDIR /usr/src/app
COPY ./mon-front/package.json . # Note: on peut ajouter package-lock.json ici, si il existe.
RUN npm install
EOF

docker build . --tag node-installed;

docker run --entrypoint head node-installed -n4 node_modules/express/package.json
# {
#   "name": "express",
#   "description": "Fast, unopinionated, minimalist web framework",
#   "version": "4.18.2",
```

Et voilà, plus besoin de lancer `npm install` à chaque nouvelle installation de notre projet!

Au point où on en est, rien qu'avec ce Dockerfile on a un environnement de travail reproductible - et donc par exemple utilisable pour du devops, ou à se partager entre devs. Il suffit d'ajouter ce fichier au repository Git.

Il y a toutefois une chose qu'on a oublié de vérifier: est-ce que le point de montage interfère avec `node_modules`?
```
docker run --rm \
-v $(pwd)/mon-front:/usr/src/app \
-w /usr/src/app \
--entrypoint ls \
node-installed
# app.js
# bin
# package.json
# views
```
Catastrophe, `node_modules` a disparu, il faut tout refaire!
Plusieurs possibilités pour contourner ce problème épineux:
- les volumes internes (comme ce qui existait sur l'Odyssée avant mon arrivée).
- node_modules dans l'hôte (mais du coup on ne l'installe plus dans l'image)
- installer les nodes_modules dans un dossier accessible à node pour le projet, mais qui n'est pas overrided par nos bind mounts.

Je ne détaille pas ici les tenants et les aboutissants, mais l'approche que je vous conseille (pas ma préférée mais facile à mettre en place) est celle des volumes internes:
```
# Note: on peut ajouter package-lock.json à côté de package.json, si il existe.
cat << EOF > Dockerfile
FROM node:18-alpine
WORKDIR /usr/src/app
COPY ./mon-front/package.json .
RUN npm install
VOLUME /usr/src/app/node_modules
EOF

docker build . --tag node-installed;

docker run --rm \
-v $(pwd)/mon-front:/usr/src/app \
-w /usr/src/app \
--entrypoint ls \
node-installed
# app.js
# bin
# node_modules
# package.json
# views
```
Bingo!
Notez toutefois le principas inconvénient de cette méthode: il faut penser à détruire puis re-générer le volume à chaque fois que vous changez package.json .

## Use case 3: Je veux faire tourner à la fois l'app node et mysql

### Faire communiquer les conteneurs entre eux (le réseau dans Docker)
Référence: https://docs.docker.com/engine/reference/commandline/network/

On a vu précédemment qu'on pouvait faire des environnements de travail pour chacun de nos process, ce qui est très puissant. Il arrive régulièrement qu'une application soit composée de plusieurs processus; on a besoin qu'ils puissent communiquer entre eux. Toutefois, on n'a pas forcément envie que tous les conteneurs communiquent entre eux en passant pas une interface "publique" comme notre localhost.

En l'occurence ici, on veut que l'application en Node.JS ait accès à une base de données MySQL, mais pas que MySQL soit exposée.

Docker permet de créer un réseau virtuel sur une machine, sur lequel on peut brancher des conteneurs. Le hostname d'un conteneur, son identifiant réseau, est tout simplement son nom de conteneur (celui qu'on voit avec un `docker ps`).

Pour créer un tel réseau, on utilise `docker network create <nom du réseau>`. Et pour y brancher un conteneur: `docker network connect <nom du réseau> <nom du conteneur>`.
On peut également spécifier le réseau à rejoindre avec `docker run`: `docker run --network=<nom du réseau> <image>`.

Par exemple:
```
$ docker network create mon-reseau;
$ docker run -d --rm --name hello-world-container -p 8001:8000 crccheck/hello-world
$ curl localhost:8001
<pre>
Hello World
...
</pre>
$ docker network connect mon-reseau hello-world-container
$ docker run --rm --network=mon-reseau curlimages/curl hello-world-container:8000 # curl depuis l'intérieur du réseau
Hello World
...
</pre>
```

On note qu'il y a différents types de réseaux docker, et que nous n'utilisons ici que celui par défaut.

Les réseaux permettent d'expliquer les résultats parfois surprenants du port binding et de l'exposition de ports, mais c'est un peu long pour être décrit en détail ici.

Voici un article expliquant précisément le networking (y compris comprendre comment communiquer entre conteneurs): https://www.learnitguide.net/2018/09/understanding-docker-port-mapping-to.html

Une autre ressource utile pour comprendre le réseau, officielle cette fois: https://docs.docker.com/config/containers/container-networking/

### De docker à docker-compose
Jusque-là on a utilisé `docker run` pour lancer nos conteneurs, mais on commence à avoir un certain nombre d'options d'options à préciser, ça surcharge pas mal la ligne de commande et la rend difficile à lire et modifier. De plus, on veut lancer non pas un conteneur, mais un ensemble de conteneurs, et les faire communiquer entre eux; `docker network` va également être nécessaire.

Il exsite un autre programme faisant partie de la suite Docker: `docker-compose`. Comme son nom l'indique, il permet de composer différentes commandes docker, et est tout indiqué pour gérer un projet multi-conteneurs. `docker-compose` exécute différentes commandes d'orchestration des conteneurs, réseaux et volumes en se basant sur un docker-compose file (que nous appelleront de manière raccourcie DCF dans la suite).

#### De "docker-compose" à "docker compose"
Par facilité pédagogique, je vais séparer dans ce qui suit `docker` et `docker-compose`. Toutefois, `docker compose` existe depuis plusieurs années avec le même objectif d'orchestrer les ressources Docker d'un projet; et il a signé l'arrêt de mort de `docker-compose`, qui ne sera plus distribué dès juin 2023. Les arguments de `docker-compose` sont tous compatibles avec `docker compose`, qui vient également avec des fonctionnalités supplémentaires (que nous ne verront pas ici, la formation étant déjà assez longue ^^').

#### docker-compose
La commande standard pour lancer un projet paramétré via un DCF est `docker-compose up`.

Une grande partie des fonctionnalités vues précédemment peuvent être invoquées avec docker-compose; en se basant sur le DCF précédent:
- `docker-compose up mon_service_node` est équivalent à `docker run node-installed` (on peut rajouter des options comme `-d`des deux côtés ici).
- `docker-compose start mon_service_node` est équivalent à `docker start node-installed`, idem pour `stop` et `restart`.
- `docker-compose build mon_service_node` est équivalent à `docker build .` (l'image est automatiquement taggée en se basant sur le nom du projet et le nom du service)

Les commandes précédentes nous montrent notamment qu'on peut gérer le cycle de vie de la même manière qu'avec `docker`. Toutefois il en existe d'autres plus puissantes agissant sur tous les conteneurs d'un coup:
- `docker-compose up` sans précision de nom de service s'execute sur l'ensemble des services. Il créé également les volumes si ils n'existent pas encore, et fait de même pour les réseaux.
- `docker-compose down` appelle `docker-compose stop <container>; docker-compose rm <container>` sur tous les conteneurs. Il supprime également les réseaux. Mais il peut aller encore plus loin:
  - Si on lui rajoute l'option `--volumes`, il exécute également `docker volume rm <volume>` sur tout les volumes créés.
  - L'option `--remove-orphans` permet quant à elle de supprimer les conteneurs qui ne sont liés à aucun DCF; pratique lorsqu'on renomme/déplace le projet, ou qu'on modifie en profondeur le DCF - ce qui a tendance à créer des conteneurs orphelins et donc hors de contrôle du DCF si on ne fait pas attention.
- `docker-compose build` sans précision de nom de service s'execute sur l'ensemble des services.

#### Docker-Compose File / DCF
Le DCF permet de définir de manière déclarative et centralisée la grande majorité des fonctionnalités (et leurs paramètres) qu'on a vu précédemment avec `docker`, c'est lui qui va contenir les directives permettant à `docker-compose` de gérer notre projet.

Au niveau de sa structure, le DCF possède:
- une version qui définit la version du langage à utiliser à l'intérieur (la différence entre 2 versions est du même ordre que la différence entre les versions de python)
- une section pour les services (intégrant une grande partie des fonctionnalités de `docker run`)
- une section pour les volumes (intégrant une grande partie des fonctionnalités de `docker volume`)
- une section pour le réseau (intégrant une grande partie des fonctionnalités de `docker network`)

Passons en revue les fonctions d'un DCF qu'on a vu précédemment dans `docker run`, `docker volume` et `docker network`:
```
version: "3.7"

services:
  mon_service_node:
    container_name: node-installed  # docker run --name
    build: .                        # docker build
    working_dir: /usr/src/app       # docker run -w
    user: root                      # docker run --user
    environment:                    # docker run -e
      MA_VARIABLE: MA_VALEUR
    ports:                          # docker run -p
      - "3000:3000"
    volumes:
      - ./mon-front:/usr/src/app    # bind mount
                                    # volume interne:
      - node_modules_volume:/usr/src/app/node_modules
    command: ["npm", "run", "dev"]  # docker run --entrypoint / --command
    expose:
      - 3000                        # docker run --expose
    networks:
      - reseau_dedie                # docker run --network / docker network connect
  db:
    image: mysql                    # docker run mysql
    container_name: ma-base-de-donnees
    env_file: .env                  # docker run --env-file
    volumes:
      - base_de_donnees_volume:/var/lib/mysql
    ports:
      - "5434:5432"
    networks:
      - reseau_dedie

volumes:
  node_modules_volume:              # docker volume create
  base_de_donnees_volume:

networks:
  reseau_dedie:                     # docker network create
```
Quelques notes:
- le DCF est un fichier YAML. Son nom est libre, mais il est plus pratique de le nommer `docker-compose.yml` ou `docker-compose.yaml`.
- on commence par en préciser la version, car la syntaxe change avec la version. La syntaxe que nous utilisaons ici est la 3.8 (la dernière à l'heure de l'écriture de ces lignes), nous ne nous avançons pas sur les versions ultérieures. A priori, l'ensemble des options que nous montrons dans ce DCF existent depuis la version 2.0 .
- docker-compose build: le build sera lancé automatiquement si le conteneur n'existe pas. De plus, existe une écriture alternative de `build` dissociant le Dockerfile du contexte de build:
```
build:
  context: .
  dockerfile: ./Dockerfile
```
- docker run --user: j'ai précisé l'utilisateur `root`; mais vu qu'il s'agit de l'utilisateur par défaut, il n'y a pas besoin de le préciser. Je l'ai fait pour les besoins pédagogiques.
- bind mount: Attention ici, "." dans le path hôte fait référence au working directory, pas à l'emplacement du DCF.
- docker run --entrypoint: le directive ENTRYPOINT existe également, et est similaire à CMD
- docker run --env-file: Petit avertissement de sécurité: ça n'est pas une bonne pratique de sécurité de partager un env_file entre plusisuers conteneurs, ou entre un conteneur et le DCF: par exemple le front n'est pas sensé avoir accès aux variables spécifiques au back.
- volume interne de mon_service_node: il s'agit d'une astuce pour que les node_modules construits lors du builds ne soient pas écrasés par le bind mount.
- docker network: docker-compose créé par défaut un réseau auquel il connecte tous les conteneurs. Les directives `network` mentionnées précédemment ne sont donc pas obligatoires pour les besoins réseau les plus basiques, je les ai mentionné pour montrer la correspondance avec les commandes vues précédemment. Également: les conteneurs ne sont plus connectés au réseau hôte par défaut comme avec `docker run`; pour qu'ils soient accessibles depuis le navigateur local, il faut utiliser le port binding.

Il existe d'autres directives dédiées au DCF couramment utilisées:
- `restart`: permet de définir à quel point on doit redémarrer le conteneur lorqu'il se termine. Par exemple `restart:always` permet de redémarrer le conteneur au redémarrage de l'ordinateur
- `depends_on`: déclarer que ce service dépend d'autres services, et sera lancé (une à plusieurs secondes) après les services listés
- `healthcheck`: configure une routine que docker va exécuter régulièrement pour s'assurer que le conteneur est "healthy" / en bonne santé. Il s'agit d'un monitoring minimaliste, répondant aux besoins les plus basiques en la matière.

Comme dit plus haut, le nom du DCF est libre; toutefois si il n'est pas précisé `docker-compose` utilise `docker-compose.y(a)ml`. Pour le préciser et choisir un autre nom/emplacement, on utilise `docker-compose -f chemin/d'accès/du/DCF`.

##### Let the magic be
Enregistrons le DCF précédent sous `docker-compose.yml`.
Pour coller à une petite modification (pédagogique) du DCF précédent, ajoutons les lignes suivantes au package.json:
```
  "scripts": {
    "dev": "node ./bin/www"
  },
```
On peut maintenant exécuter:
```
$ cat << EOF > .env
> MYSQL_ROOT_PASSWORD=mot-de-passe
> EOF
$ docker-compose up
```
Et là la magie opère: nos conteneurs sont lancés, leurs volumes et leur réseau sont paramétrés! Ne manque plus qu'à renseigner les bonnes options dans le connecteur MySQL sur le conteneur NodeJS pour permettre la connexion entre les conteneurs.
#### envfile
Si un fichier envfile (par défaut `.env`) est dans le même dossier que le DCF, il peut venir paramétrer celui-ci au-delà de `env_file`, par exemple:
```
version: '3.5'
services:
  db:
    image: mysql:5.7
    container_name: ${DB__HOST}
    volumes:
      - ${ROOT_PATH}/database:/var/lib/mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${DB__ROOT_PASSWORD}
      MYSQL_USER: ${DB__USER}
      MYSQL_PASSWORD: ${DB__PASSWORD}
      MYSQL_DATABASE: ${DB__NAME}
  node:
    build:
      context: ${ROOT_PATH}
      dockerfile: frontend/Dockerfile
    environment:
      DB_HOST: ${DB_HOST}
      DB_USER: ${DB__USER}
      DB_PASSWORD: ${DB__PASSWORD}
      DB_DATABASE: ${DB__NAME}
    volumes:
      - ${ROOT_PATH}/config:/src/config
    entrypoint:
      - "npm"
      - "run"
      - ${ENV}
    ports:
      - "3000:3000"
```
Ici, toutes les variables entre `${}` proviennent d'un tel fichier `.env`.

L'utilité peut être (comme ici avec le .env) d'avoir une single source of truth pour les variables de la DB, qui sont dupliquées entre 2 conteneurs et le DCF lui-même. Ou même plus simplement d'avoir une SSoT pour l'ensemble des variables d'environnement (les constantes d'application pouvant rester dans les conteneurs).

Il est possible de dire à `docker-compose` d'aller chercher le envfile ailleurs avec l'argument `docker-compose --env-file ./chemin/vers/le/.env/choisi`.

## Troubleshooting: Et quand ca va mal?
Il arrive que des conteneurs aient du mal à se lancer ou s'arrêter. On utilise intensivement `docker logs`, `docker run --rm --entrypoint`, `docker kill`, `docker stop`, `docker rm`, etc.

Et quand même ces commandes ne suffisent pas?

Sous Mac, le démon docker tourne quand même moins bien que sous Ubuntu: les containers ne veulent parfois plus s'arrêter, même à l'aide des commandes précédentes.

Dans ce cas, on redémarre le démon docker (la procédure diffère selon l'OS hôte, sous mac on ferme et ré-ouvre l'app Docker Desktop), puis ça devrait remarcher. Notez qu'en temps normal, c'est assez peu utile pour stopper ces containers, et peut causer des problèmes si il y a des containers auxquels vous tenez en même temps que ceux qui posent problème.

### Un conteneur du même nom existe déjà
```
$ docker-compose up
[+] Running 3/3
 ⠿ Network test_default      Created                           0.1s
 ⠿ Container node-installed  Creating                          0.0s
 ⠿ Container mysql           Creating                          0.0s
Error response from daemon: Conflict. The container name "/mysql" is already in use by container "0d58a786fecb9110a12dc916d20dea49dcd35696a06fb8016417ca000c3f45da". You have to remove (or rename) that container to be able to reuse that name.
```
`docker ps -a | grep <nom du conteneur>` vous donne approximativement le conteneur avec ce nom. Si vous le trouvez ici, utilisez `docker stop` et `docker rm` pour libérer le nom, ou alors `docker compose down` dans le dossier du projet.
```
$ docker ps -a | grep mysql
CONTAINER ID   IMAGE     COMMAND                  CREATED        STATUS                     PORTS                    NAMES
fe0dd68b9276   mysql     "docker-entrypoint.s…"   24 hours ago   Exited (255) 3 hours ago   0.0.0.0:3306->3306/tcp   mysql
```

### Le port hôte auquel se branche le conteneur est déjà utilisé
```
$ docker-compose up
[+] Running 3/3
 ⠿ Network test_default      Created                           0.0s
 ⠿ Container node-installed  Created                           0.1s
 ⠿ Container mysql           Created                           0.1s
Attaching to node-installed, mysql
Error response from daemon: driver failed programming external connectivity on endpoint node-installed (3238055cca24767c68fb707e05a76f19a742be7be49748280d397a982505f35f): Bind for 0.0.0.0:3000 failed: port is already allocated
```

`docker ps -a | grep <port>` vous donne approximativement la liste des conteneurs utilisant le port demandé. Si vous le trouvez ici, utilisez `docker stop` et `docker rm` pour libérer le port, ou alors `docker compose down` dans le dossier du projet.
```
$ docker ps -a | grep 3000
CONTAINER ID   IMAGE              COMMAND                  CREATED        STATUS                     PORTS                    NAMES
fe0dd68b9276   node-installed     "docker-entrypoint.s…"   24 hours ago   Exited (255) 3 hours ago   0.0.0.0:3000->3000/tcp   node-installed
```

Si ce n'est pas suffisant, il faut regarder quels programmes utilisent les ports sur l'hôte.
Sous Linux et Mac, `lsof -i :<port>` vous donne la liste des programmes utilisant le port TCP et/ou UDP demandé. Faites en sorte que le process n'utilise plus le port que cous demandez, ou changez le port binding de votre conteneur pour pointer sur un port libre de l'hôte.

### Différences entre plateformes hôtes
TODO Des choses sont possibles sous windows qui ne le sont pas sous linux, par exemple.

### J'ai oublié une commande
Je sais ce que je veux faire avec Docker, mais j'ai oublié la commande pour le faire...

Pas de quoi paniquer, retenez en priorité cette commande: `docker --help`. Elle vous donne une liste des "management commands" (contenant `container`, `image`, etc) ainsi que des commandes raccourcies (`ps` qui donne `docker ps`, `stop`, `restart`, etc).

Une fois que vous avez votre management command (ou que vous savez quel objet Docker vous voulez manipuler), faites `docker <management command> --help` et vous aurez la liste des commandes que rassemble cette management command.

Par exemple, `docker compose --help` nous liste (notamment) `build`, `down`, `exec`, `logs`, `restart` et `up`.

## Pour aller plus loin
### Réseaux
Il existe différents modes de mise en réseau de conteneurs Docker - 7 à l'écriture de ces lignes. On va se limiter aux plus connus/utilisés ici.

Celui utilisé par défaut (lorsqu'on créé un réseau sans en préciser) est le `bridge`. Les containers sur un réseau de type bridge peuvent communiquer entre eux, tandis que ceux qui ne sont pas dessus ne peuvent pas joindre les containers en question.

Tous les containers dont aucun network n'est précisé explicitement (typiquement dans un `docker run mon-image` ou dans un DCF sans instructions de network) sont automatiquement raccordés au réseau par défaut de Docker, lui aussi en bridge. Attention toutefois: contrairement aux réseaux bridge définis manuellement ("user-defined networks"), les conteneurs sur le réseau par défaut ne peuvent communiquer que par leurs IPs, ils n'ont pas de hostname.
```
$ docker run -d --rm -p 8000 crccheck/hello-world
$ # Un serveur minimaliste écoute sur le port 8000 de ce conteneur.
$ curl localhost:8000
<pre>
Hello World
...
</pre>
```

Le second type de réseau assez connu est `none`, et vous comprenez normalement comment l'utiliser d'après ce qui précède. Au cas où: il coupe entièrement le container de faire des requêtes sur internet.
```
$ docker run -d --rm --network none -p 8000 crccheck/hello-world
$ curl localhost:8000
curl: (7) Failed to connect to localhost port 8000 after 5 ms: Connection refused
```

Le troisième et dernier type dont on va parler ici est `host`. Dans ce mode, le conteneur est directement mis sur le port de l'hôte. C'est-à-dire qu'il n'a pas besoin de `-p` pour que les ports sur lesquels il écoute soient accessibles via `localhost`. Attention à ce que les ports sur lesquels se branche le conteneur soient bien libres sur l'hôte.
```
$ docker run -d --rm --network host crccheck/hello-world
$ curl localhost:8000
<pre>
Hello World
...
</pre>
```

### Volumes internes: MàJ sur les drapeaux (flags)
`cached`, `delegated` et `ro`: ces flags ne sont plus officiellement documentés et n'ont notamment plus d'effet sur Mac (https://github.com/docker/for-mac/issues/5402).

### DCF
#### Interpolation de variables
TODO on peut mettre des variables par défaut dans les DCF
https://docs.docker.com/compose/compose-file/#interpolation

#### Fragments de configuration
TODO il est possible de réutiliser des morceaux de configuration
https://docs.docker.com/compose/compose-file/#fragments

#### Debugguer un DCF
Commande pour voir un DCF avec ses valeurs réelles/calculées juste avant son utilisation par le Docker Engine: `docker compose config`.
https://docs.docker.com/engine/reference/commandline/compose_config/

### Swarm et secrets
Docker Swarm est un concurrent direct de Kubernetes. Je n'ai pas pris le temps de m'intéresser à Swarm, cette section est juste pour mentionner/rappeler son existance.

Les secrets Docker sont utiles à Swarm, un peu de la même manière que la section https://github.com/<user>/<repo>/settings/secrets/actions permet de stocker des secrets utiles opur vos github actions.

## DevOps
Docker est l'un des fer de lance du mouvement DevOps, car il est actuellement (et depuis plus d'une décennie) l'outil de prédilection pour uniformiser les environnements de développement et de production d'une application type webapp ou headless.

Il est utilisé assez souvent avec Kubernetes, notamment car une DCF se convertit très facilement en fichier de configuration Kubernetes. Kubernetes est un concurrent direct de Docker Swarm. Cette formation portant uniquement sur Docker, on ne creusera pas le sujet de Kubernetes plus loin ici.
