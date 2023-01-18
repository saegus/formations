# Formation - atelier Docker: from zero to hero
# Introduction
Docker est une solution qui permet de concevoir, tester, partager et déployer rapidement des applications à l'aide de conteneurs sans contrainte d'environnement (OS, hardware, etc).

Docker permet d'envoyer du code plus rapidement, de standardiser les opérations de vos applications, de migrer aisément du code, et donc de délivrer rapidement et de manière standardisée une application.

Docker est un projet open source (il est devenu de fait un standard multiplateforme incontournable, qui a marginalisé l'utilisation des VMs traditionnelles)

## Ce n'est pas
Docker n'est pas un gestionnaire de VMs: les conteneurs qu'il manipule sont très légers, et se basent sur l'OS hôte pour tourner.

Docker n'est pas Kubernetes: Docker n'a pas de vocation à gérer un espace multi-machines (sauf éventuellement Docker swarm), alors que Kubernetes si, ce qui en fait un outil idéal pour la gestion d'un cloud. Kubernetes est compatible avec les conteneurs Docker, mais aussi avec d'autres technologies.

## Concepts
Docker manipule en premier lieu les concepts de containers, images, volumes, network, DockerFile.
On peut retrouver dans l'ensemble des concepts également: Registry (dont Docker Hub), Compose, Daemon, Engine, Swarm.


## Approche initiale (use case 1): lancer un conteneur connu avec docker run
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

Bon maintenant, on va appliquer ce qui nous a été proposé dans le container, à savoir ajouter une des variables: `docker run -e MYSQL_ROOT_PASSWORD=my-secret-pw mysql`.
Il se passe pas mal de logs, puis la dernière ligne se fixe à:
```
2023-01-11T14:40:10.592984Z 0 [System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections. Version: '8.0.31'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server - GPL.
```

Fort bien! Il est plus que temps d'interagir avec cette base de données!
Pour ça je vais utiliser le client en ligne de commande, mais un MySQL Workbench aurait aussi pu faire l'affaire.
... Mais au fait, qu'est-ce que je mets dans les infi de connexion?
Autant pour l'utilisateur (root) et le mot de passe (my-secret-pw) je vois la chose, autant pour l'host et le port il va falloir deviner. `localhost` et `3306`?

Testons:
```
$ /opt/homebrew/opt/mysql-client/bin/mysql --user=root --password=my-secret-pw --host=127.0.0.1 --port=3306
mysql: [Warning] Using a password on the command line interface can be insecure.
ERROR 2003 (HY000): Can't connect to MySQL server on '127.0.0.1:3306' (61)
```
Bon, c'est pas ça.

On peut considérer notre container docker fonctionnellement comme une VM (même si c'est beaucoups plus rapide et plus léger), en particulier sur le volet de l'isolation avec l'hôte. Et donc si on veut que l'hôte et le conteneur communiquent - ici via un host et un port, il faut leur créer un pont.
Dans Docker, on créé un tel pont par exemple avec `docker run -e MYSQL_ROOT_PASSWORD=my-secret-pw -p 3307:3306 mysql`.

> Cette image décrit par exemple le résultat de `docker run -p 8089:80 wordpress`:
![](https://www.code4it.dev/static/7e983e27425fb44d41cf3189d3835b92/84f4d/Docker-ports.png)
> Vous pouvez accéder au résultat sur votre machine (sous réserve que le port 8089 ne soit pas occupé par une autre application) sur http://localhost:8089

Re-lançons notre conteneur et notre client avec les modifs qui vont bien; on attend environ 30s après le "docker run" précédent, pour que le serveur soit prêt à recevoir des connexions, puis on lance le client:
```
$ /opt/homebrew/opt/mysql-client/bin/mysql --user=root --password=my-secret-pw --host=127.0.0.1 --port=3307
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
...
mysql>
```
Looks nice! Mais d'où sort ce `3307` ? Eh bien figurez-vos que j'ai méjà installé mysql sur mon hôte, et cete instance utilise déjà le port 3306. J'ai donc demandé à Docker de connecter le conteneur au port 3307 de mon hôte. Le `3306` restant dit au conteneur que c'est son port 3306 à lui qu'on connecte au port 3307 de l'hôte; et donc on peut lire ce binding de port comme `-p <port de l'hôte>:<port du conteneur>`.

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
Note préliminaire: je pars du principe que vous connaissez `ls`, `echo`, `pwd` et les autres commandes "de base" utilisées par exemple lors d'un ssh à un serveur distant. Si ce n'est pas le cas, vous allez avoir du mal à comprendre ce qui suit.

On part finalement sur une app NodeJS, un serveur express. On peut supposer qu'on part d'un projet fraîchement généré via `npx express-generator --ejs`.
L'app se lance via un `npm start`. Le serveur sert la page templatée `index.html.ejs` sur http://localhost:3000/

L'arborescence de mon app:
- mon-front
  - package.json
  - app.js
  - bin
    - www
  - views
    - index.html.ejs

Note: le 18 janvier, la formation en était à environ 45 min ici, et on a fait un peu plus d'1H en tout.

### docker image
Tout d'abord, la commande pour créer un conteneur NodeJS sur lequel va tourner ce serveur: `docker run --rm -p 3000 node:18-alpine`

On observe 2 changements par rapport aux commandes précédentes:
- `-p` n'a qu'on seul port comme valeur. C'est un raccourci permis par l'option, qui signifie `-p 3000:3000`
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

### Volumes
Docker produit des conteneurs stateless par défaut, un volume sert à rendre le conteneur stateful (précisément "stateful across container reboots", un peu comme le disque dur sert à rendre votre ordinateur "stateful across reboots"). Les volumes se divisent en 2 types: le bind mount et le volume interne.

#### Bind mounts
On va incorporer / lier notre répertoire actuel à notre conteneur avec la commande suivante: `docker run --rm -d -p 3000 -v $(pwd):/usr/src/app node:18-alpine`. La nouvelle option ajoutée ici nous permet de lier un fichier ou un dossier entre l'hôte et le conteneur, la syntaxe est `-v <path du fichier ou du directory dans l'hôte>:<path du fichier ou du directory dans le container>`

Attention:
- le chemin dépend de votre current working directory (vous pouvez le consulter avec `pwd`)
- si le fichier n'existe pas d'un côté ni de l'autre, Docker créé (récursivement) un dossier vide à la place. La fonctionnalité est pratique, mais si vous voyez un dossier vide à la place du fichier/dossier que vous attendiez, vérifiez vos chemins d'accès.

#### Volumes internes
TODO on met un volume sur node_modules.

Pourquoi un volume interne plutôt qu'un bind mount? C'est plus rapide (perfs) et parfois on ne veut juste pas permettre facilement un accès à cette partie stateful (l'accès est difficile mais pas impossible si vous êtes administrateur de votre machine).

#### Gestion
`docker volume` est aux volumes ce que `docker image` est aux images (et ce que docker ps/run/stop/rm est aux containers): un manager de volumes. On va d'ailleurs y retrouver les mêmes commandes de management; par exemple:
```
$ docker volume ls
DRIVER    VOLUME NAME
local     0c4019bc77cc500cda8794460ad11f14d3c6f017f3aa84d46f8a899e0384387c
local     odyssee_node_modules_back
local     odyssee_node_modules_front
```

On note qu'on peut supprimer les volumes liés à un conteneur en même temps que celui-ci: `docker rm --volumes <container>`.

### Entrypoint et working_dir
#### docker run --entrypoint
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

#### docker exec
Pouvoir lancer une image avec une commande de notre choix qui nous permet d'intéragir avec (`docker run --entrypoint ...`) c'est puissant, mais ce qui va plus souvent nous occuper, c'est d'intéragir avec un conteneur dans lequel est déjà lancé sa commande "originale".

De la même manière qu'on a utilisé `docker run --entrypoint`, on peut utiliser `docker exec -it <container> <commande>`, cette fois sur un container déjà lancé (dont le run a potentiellement modifié la composition interne).
En pratique, on lance par exemple un shell (`/bin/sh` ici) interactif (`-it`) dans le conteneur nommé "test-container" avec: `docker exec -it /bin/sh test-container`.

#### working dir
Le working directory d'un conteneur est l'endroit où l'entrypoint va être lancé. Étant donné que pas mal de commandes dépendent de ce working directory et des paths où nous avons monté nos volumes (bind mounts ou volumes internes), le connaître et le changer sont deux choses à savoir.

On peut obtenir le working directory d'une image notamment en l'instanciant avec `docker run <image> pwd`

Pour choisir le volume d'un conteneur, on va utiliser `-w`:
```
$ docker run --rm -w /mon/dossier --entrypoint pwd node:18-alpine
/mon/dossier
```
On remarque au passage que si le working directory demandé n'existe pas, Docker le créé pour nous, évitant à `pwd` de planter.

Pour docker exec il s'agit de la même option `-w`, mais un dossier qui n'existe pas génèrera une erreur.

### Builds et Dockerfile
TODO Notre premier Dockerfile.
Utilité d'un Dockerfile: créer une image custom avec un processus d'installation (et de configuration statique), un peu comme si on provisionnait une VM avec Vagrant ou Ansible.

## Use case 3: Je veux faire tourner à la fois l'app front et mysql
### Faire communiquer les containers entre eux (le réseau dans Docker)
TODO network: (syntaxe), types de networks, communiquer même sans networks

### De docker run au Docker-compose file (DCF)
Le DCF est un fichier d'orchestration des différents containers.
Il possède une version qui définit la version du langage à utiliser à l'intérieur (la différence entre 2 versions est du même ordre que la différence entre les versions de python), puis se décompose en services, réseau et volumes.

Les services contiennent les informations sur les conteneurs.
TODO quasiment toutes les options de `docker run` vues précédemment ont un équivalent dans un DCF:
- les bind mounts: `-v devient` TODO

### .env file et builds
TODO parler de build contexts
TODO dire qu'il est possible l'injecter un env file, mais que c'est bad practice si on a plus d'un container dans le DCF: par exemple le front n'est pas sensé avoir accès aux variables spécifiques au back.

## Troubleshooting: Et quand ca va mal?
Il arrive que des conteneurs aient du mal à se lancer ou s'arrêter. On utilise intensivement `docker logs`, `docker run --rm --entrypoint`, `docker kill`, `docker stop`, `docker rm`, etc.

Et quand même ces commandes ne suffisent pas?
Sous Mac, ça tourne quand même moins bien que sous Ubuntu: les containers ne veulent parfois plus s'arrêter, même à l'aide des commandes précédentes.
Dans ce cas, on redémarre le démon docker (la procédure diffère selon l'OS hôte), puis ça devrait remarcher. Notez qu'en temps normal, c'est assez peu utile pour stopper ces containers, et peut causer des problèmes si il y a des containers auxquels vous tenez en même temps que ceux qui posent problème.
