/*
 * Objet principal
 */
var bubbler = {
  /*
   * Chargement du DOM
   */
  init: function() {
    // 1. écouter le click sur le body et appeler createBubble
    // this, dans la fonction init, représente le document (l'élément à qui est arrivé l'évènement 'DOMContentLoaded')
    $(this).on('click', bubbler.createBubble);

    // si on essaie de détecter le clic sur body, ça ne marche pas (parce que le body est vide et donc sans hauteur), sauf si on lui applique une hauteur explicite ex: 100vh
    // $('body').on('click', app.createBubble);

  },

  createBubble: function( event ) {
    // 2. créer une div
    // possibilité 1. j'ajoute la div, puis je la cible pour la modifier
    // $('body').append('<div id="bub"></div>');
    // $('#bub')....

    // possibilité 2.
    // Je crée la div avec ses caractéristiques et je l'ajoute au body, dans la même instruction
    // soit (body).append(création de ma div)
    // soit création de ma div.ajout au body, avec
    // .appendTo($(document.body));

    // PIMPANT
    // une taille aléatoire entre 10 et 200
    var size = bubbler.getRandom(10, 200);
    var color = bubbler.getRandomColor();
    console.log('create Bubble : ' + size + 'px , color: ' + color);

    $(document.body).append(
      $('<div>')
        .addClass('bubble')
        // lui assigner
        // width, height, backgroundcolor, borderradius
        // ? position par rapport de la curseur de la souris
        .css({
          'width': size + 'px',
          'height': size + 'px',
          'backgroundColor': color,
          'top': event.pageY - size/2,
          'left': event.pageX - size/2,
        })
    );

    // A la 20è bulle ==> Toutes les 20 bulles
    // On peut toujours continuer à créer des bulles, et à 20 bulles, ça retombe à nouveau.
    if($('.bubble').length % 10 === 0) {
      // on a 20 bulles dans notre page =>  déclencher la chute
      bubbler.skyfall();
    }
  },

  getRandomColor: function() {
    // une couleur aléatoire : 3 nombres entre 0 et 255
    var r = bubbler.getRandom(0, 255);
    var g = bubbler.getRandom(0, 255);
    var b = bubbler.getRandom(0, 255);
    // avec un alpha aléatoire aussi : un flottant entre 0.25 et 0.75
    var a = bubbler.getRandom(25, 75)/100;

    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  },

  getRandom: function(min, max) {
    // un random entre 0 et max-min + min
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  skyfall: function() {
    console.log('go skyfall');
    // hauteur de la fenêtre : même pour toutes les bulles, je la calcule 1 fois
    // '100vh' contient une unité qui est interprété EN CSS comme "viewport height"
    // mais qui ne permet pas de faire des calculs en javascript
    var windowHeight = $(window).height();

    // toutes les bulles doivent tomber doucement tout en bas de la fenêtre.
    // pour chaque bulle, je veux lancer une animation de sa position
    $('.bubble').each(function() {
      // attention, on a fixé top, donc si on essaie d'animer nos bulles vers bottom : 0, rien ne se passe
      // "tout en bas de la fenêtre" <=> top = hauteur de fenêtre - taille de la bulle
      // "la bulle que je suis en train de traiter" <=> this
      // $(this) <=> la bulle en traitement, "jquerysée"
      var bubbleHeight = $(this).height();
      $(this)
        .animate({
          'top': windowHeight - bubbleHeight,// hauteur de fenêtre - taille de la bulle
        }, 3000, 'easeOutBounce')
        // Une fois arrivée en bas, les bulles disparaissent en opacité.
        .fadeOut(500, function() {
          // quand fadeOut est terminée, cette fonction est éxécutée
          // la bulle est supprimée du DOM
          $(this).remove();
        });
    });
    // SUPER BONUS : faites en sorte que les bulles rebondissent quand elles tombent en bas de la fenêtre.
  },
};


/*
 * Chargement du DOM
 */
$(bubbler.init);

/*
Rebonds = effet d'animation faisable en utilisant une fonction d'easing particulière
Pour étendre les fonctions d'Easing de jquery, vous pouvez utiliser le plugin "jQuery UI" https://jqueryui.com/

Ici, on va se servir d'un seul "petit bout" du module.
On peut donc "piquer" seulement le bout qui nous intéresse pour "étendre les possibilités de jQuery"
: http://gsgd.co.uk/sandbox/jquery/easing/jquery.easing.1.3.js
Contient la partie "easing" de jquery, on y a repéré la fonction d'easing qui nous intéresse, et on va l'ajouter à notre objet jQuery local, pour pouvoir utiliser ce composant dans nos animations
*/
$.extend($.easing, {
  easeOutBounce: function (x, t, b, c, d) {
    if ((t/=d) < (1/2.75)) {
      return c*(7.5625*t*t) + b;
    } else if (t < (2/2.75)) {
      return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
    } else if (t < (2.5/2.75)) {
      return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
    }
    return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
  },
});
