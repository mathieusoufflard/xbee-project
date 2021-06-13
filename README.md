# xbee-project
L’objectif de ce projet a été de reprendre le concept du Simon, un célèbre jeu de société électronique datant de 1978, afin de le remettre au goût du jour. 
Nous avons donc décidé de créer le Simon Connecté, permettant plus d'interactivité ainsi qu’une dimension compétitive entre plusieurs joueurs. Le jeu est pour cela contrôlé par un maître du jeu sur une application mobile qui va envoyer la séquence de couleurs que les joueurs devront reproduire. Chaque joueur va ensuite recevoir la séquence sur sa manette, le joueur la reproduisant le plus rapidement sans erreur est le vainqueur de la manche. À chaque nouvelle manche la taille de la séquence augmente, ajoutant continuellement de la difficulté.


# Serveur Node JS
Le serveur Node est stocké dans le dossier Xbee. 
Mettez vous sur le index.js et dans le terminal faites : 
- node index.js
pour lancer le projet. 

Le dossier est composé de 2 fichiers principaux : 

- Storage.js : contient la connexion à la BDD et les requêtes
- Index.js : contient l'ensemble du code pour la partie de Simon

# App Mobile 
