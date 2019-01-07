#Projet

Réalisation d'un "pseudo" éditeur d'images dans le cadre d'un projet universitaire pour le module "Développement Web"


AYADI Emna 
BOUDJEMAÏ Yasmine 


                                                        Rapport 

I. Introduction 

  Dans le cadre d’un projet universitaire, nous devions faire l’implémentation d’un éditeur d’images basique. 
Il doit comporter les quatre outils élémentaires à savoir: crayon, pipette, tampon, pot de peinture. 
  Pour l'élaboration de ces derniers et pour une bonne organisation, nous avons établi un ordre à suivre pour l’implémentation de chacun: crayon, pipette, pot de peinture et tampon. Cependant, au cours de notre implémentation nous avons changé l’ordre préétabli. En effet, nous avons préféré commencer par faire le tampon avant le pot de peinture car nous nous sommes rendues compte que tampon allait être plus rapide et plus simple à implémenter que le pot de peinture. 
  Nous avons bien évidemment penser à créer une palette avec un nombre limité de couleurs. 
  Dans un premier temps, nous expliquerons brièvement les implémentations qui ont été faites. Ensuite, nous citerons les quelques options que nous aurions souhaité réaliser pour ce projet.


II- Brèves explications de l’implémentation des outils 

  Nous avons tout d’abord codé l’outil « crayon » qui nous semblait être l’outil le plus simple à réaliser. Il consiste à dessiner dans le canvas. 
  Ensuite, nous avons fait la palette de couleurs qui va permettre à l’utilisateur de choisir la couleur qu’il souhaite. Ainsi, la couleur du contour du canvas change lors du choix de la couleur afin d’avoir une précision sur la couleur choisie. 
Par la suite, nous sommes passées à l’outil « pipette » qui consiste à extraire la couleur d’un pixel de l’image dans le canvas. Ainsi, la couleur est mise à jour. 
  Après, nous avons entamé l’outil «tampon » qui se charge de sélectionner une zone du canvas. Puis, c’est à l’utilisateur de choisir l’endroit dans le canvas où il veut appliquer le tampon. 
Et enfin, nous avons terminé avec le pot de peinture. Dans un premier temps, nous avons implémenté une méthode intuitive pour le remplissage qui est récursive, celle-ci s’est avérée être extrêmement lente. 
  Nous avons donc décidé d’effectuer des recherches et nous avons trouvé divers algorithmes de remplissage. Nous nous sommes penchées sur un algorithme qui utilise une pile. Ce dernier, consiste à chercher les deux extrémités Ouest et Est du pixel courant. Pour chaque pixel présent sur cet intervalle ]Ouest, Est - 1], on colorie le pixel courant et on empile le(s) pixel(s) au Nord et au Sud à condition qu'ils correspondent à la couleur du pixel de départ. Nous avons ainsi constaté qu’il était beaucoup plus performant que le premier. Ainsi, nous avons pensé à une autre optimisation de cet algorithme en terme de taille de la pile. En effet, nous empilons plus tous les pixels au Nord et au Sud mais uniquement l’extrémité la plus au Nord et l’extrémité la plus au Sud (pour chaque pixel compris dans l’intervalle ]Ouest, Est - 1] ). 
  Si ce dernier a pour effet d’alléger la pile, il n’est cependant pas plus rapide que l’algorithme précédent. 
Par conséquent, nous avons décidé de rester sur le second algorithme. 


II- Difficultés rencontrés: 

  Outil crayon: Quand la taille de la pointe du crayon est inférieure à 5, les lignes paraissent fluides mais lorsqu’elle dépasse 5, une certaine discontinuité dans les lignes tracées apparaît. 
  Outil tampon: Celui-ci a tendance à sauvegarder les anciennes copies (ou clones).Nous avons pensé à ajouter des modèles de tampons mais nous n’avons pas pu le faire par manque de temps. 
  Outil pot de peinture: Le remplissage reste toujours un peu lent surtout lorsque nous choisissons de remplir avec une couleur tout le canvas. 

III- Ajout des options: 

  Les options supplémentaires qui ont pu être ajoutées au projet sont les suivantes; la taille de la pointe du crayon, la forme de la pointe (carré ou cercle). Une autre que nous avons appelée 'undo' qui ne sert qu'à effacer le canvas. Autre option que nous avons souhaitée réaliser est l'ajout de modèles pour le tampon (ie: En étoile ou sous une autre forme). Pour ce projet , nous nous sommes contentées d'appliquer une forme rectangulaire pour la sélection de la zone à cloner. 


Conclusion:

  Finalement, nous avons constatés que les outils demandés ont été implémentés, mais la plupart d'entre eux comportent des défauts qui ont été cités plus haut dans le README. 
  Ce projet nous a permis d'étendre les connaissances en javascript acquises en ayant suivi le module de développement Web. De plus, nous avons appris différentes méthodes pouvant être utilisées pour le remplissage avec une couleur. 

Sources: 

https://fr.wikipedia.org/wiki/ Algorithme_de_remplissage_par_diffusion#Optimisations 
https://www.w3schools.com 
https://developer.mozilla.org/fr/docs/Web/JavaScript 
https://stackoverflow.com/questions/14976495/get-selected-option-text-with- javascrip 
https://stackoverflow.com/questions/34980574/how-to-extract-color-values-from- rgb-string-in-javascript

https://codepen.io/Geeyoam/pen/vLGZzG 
https://labs.eleks.com/2012/11/html5-canvas-performance-and.html 
https://bl.ocks.org/jon-hall/2fc30039629ef22bc95c 
https://ben.akrin.com/?p=7888 
