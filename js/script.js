const CODE_CASES = document.querySelector('.code ul');
const DIV_PLAYER_CONTAINER = document.getElementById('player_container');
const COLOR_SELECTOR = document.getElementById('color-selector');
const BTN_CHECK = document.getElementById('check');
const BTN_RESTART = document.getElementById('restart');
const MESSAGE = document.getElementById('message');

const TAB_COLORS = ['yellow', 'blue', 'red', 'green', 'white', 'black'];

/**
 * Fonction qui renvoie un tableau de 4 cases avec dans chacune des cases, une valeur
 * aléatoire entre : jaune, bleu, rouge, vert, blanc et noir
 * @param { Array<string> } colors
 * @returns { Array<string> }
 */
const createRandomCode = (colors) => {
   const CODE = new Array(4);

   for (let i = 0; i < CODE.length; i++) {
      const randomIndex = Math.floor(Math.random() * colors.length);
      CODE[i] = colors[randomIndex];
      CODE_CASES.innerHTML += `<li class="${CODE[i]}"></li>`;
   }
   return CODE;
};

/**
 * Fonction qui prend en paramètre deux tableaux et renvoie le nombres d'éléments
 * similaires à la même position
 * @param { Array<string>  } codeArray
 * @param { Array<string>  } playerArray
 * @returns { number }
 */
const GOOD_POSITIONS = (codeArray, playerArray) => {
   let goodPositions = 0;
   for (let i = 0; i < codeArray.length; i++) {
      if (codeArray[i] === playerArray[i]) {
         goodPositions++;
      }
   }
   return goodPositions;
};

// tab1 = ['vert', 'jaune', 'rouge', 'noir'];
// tab2 = ['rouge', 'jaune', 'vert', 'rouge'];
// console.log(GOOD_POSITIONS(tab1, tab2));

/**
 * Fonction qui prend en paramètre deux tableaux et renvoie le nombres d'éléments
 * similaires mal placés
 * @param { Array<string> } codeArray
 * @param { Array<string> } playerArray
 * @returns { number }
 */
const BAD_POSITIONS = (codeArray, playerArray) => {
   let badPositions = 0;
   let tempArray = [];

   for (let i = 0; i < codeArray.length; i++) {
      if (playerArray[i] !== codeArray[i] && !tempArray.includes(playerArray[i]) && codeArray.includes(playerArray[i])) {
         badPositions++;
         tempArray.push(playerArray[i]);
         console.log(tempArray);
      }
   }
   return badPositions;
};

// tab1 = ['vert', 'jaune', 'rouge', 'noir'];
// tab2 = ['rouge', 'jaune', 'vert', 'rouge'];
// console.log(BAD_POSITIONS(tab1, tab2));

let activePlayRow = 0;
let colorIndex = 0;

function createMastermindElements() {
   for (let i = 1; i <= 12; i++) {
      const playerDiv = document.createElement('div');
      playerDiv.classList.add('player_try');

      const numberDiv = document.createElement('div');
      numberDiv.classList.add('number');
      numberDiv.textContent = i;

      const guessDiv = document.createElement('div');
      guessDiv.classList.add('guess');
      const guessList = document.createElement('ul');

      for (let j = 0; j < 4; j++) {
         const guessItem = document.createElement('li');
         guessItem.addEventListener('click', selectColor);
         guessList.append(guessItem);
      }
      guessDiv.append(guessList);

      const pointsDiv = document.createElement('div');
      pointsDiv.classList.add('points');
      for (let j = 0; j < 4; j++) {
         const pointsItem = document.createElement('div');
         pointsItem.classList.add('item');
         const dotDiv = document.createElement('div');
         dotDiv.classList.add('dot');
         pointsItem.append(dotDiv);
         pointsDiv.append(pointsItem);
      }

      playerDiv.append(numberDiv);
      playerDiv.append(guessDiv);
      playerDiv.append(pointsDiv);

      DIV_PLAYER_CONTAINER.append(playerDiv);
   }

   // Active l'event pointer de la première ligne avec une classe "active"
   DIV_PLAYER_CONTAINER.children[activePlayRow].classList.add('active');
}

/**
 * Fonction qui change la couleur d'un élément cliqué en passant à la couleur suivante
 * dans le tableau TAB_COLORS.
 * L'index revient à 0 quand on arrive à la fin du tableau, reprend à la première couleur
 * Retire la classe représentant la couleur actuelle à chaque click
 *
 * @param {Event}
 */
function selectColor(e) {
   const guessItem = e.target;

   // Retire toutes les classes de couleur sinon ça bug !
   // guessItem.classList.remove(TAB_COLORS[colorIndex - 1]); // Fonctionne jusqu'à la fin du tableau --> il faut une boucle
   TAB_COLORS.forEach((color) => {
      guessItem.classList.remove(color);
   });

   // Ajoute la classe de couleur
   guessItem.classList.add(TAB_COLORS[colorIndex]);

   // Passer à la couleur suivante
   colorIndex++;
   if (colorIndex >= TAB_COLORS.length) {
      colorIndex = 0;
   }
}

/**
 * Fonction qui relance la partie
 */
function resetGame() {
   window.location.reload();
}

// ! 1) Créer les éléments du jeu
createMastermindElements();

// ! 2) Créer le code aléatoire
const CODE = createRandomCode(TAB_COLORS);

// ! 3) Récupérer les couleurs du joueur
const getPlayerTry = (activeRow) => {
   const guessItems = activeRow.querySelectorAll('.guess ul li');
   let playerGuess = [];

   guessItems.forEach((item) => {
      playerGuess.push(item.classList[0]);
      // console.log(item.classList[0]);
   });
   return playerGuess;
};

// ! 4) Afficher le nombre d'éléments bien placés et mal placés
const showPoints = (goodPositions, badPositions, points) => {
   const activeRowPoints = points.querySelectorAll('.item');
   // Ajouter la classe "good" (white) à la classe "dot" pour chaque élément à la bonne position
   for (let i = 0; i < goodPositions; i++) {
      // plus petit parce que i commence à 0
      activeRowPoints[i].querySelector('.dot').classList.add('good');
   }
   // Ajouter la classe "bad" (red) à la classe dot pour chaque élément à la mauvaise position
   /* On démarre à goodPositions qui est l'index du tableau .items pour placer les pions rouges après les blancs */
   for (let i = goodPositions; i < goodPositions + badPositions; i++) {
      activeRowPoints[i].querySelector('.dot').classList.add('bad');
   }
};

// ! 5) Bouton Valider
BTN_CHECK.addEventListener('click', () => {
   // Récupère la ligne active
   const activeRow = DIV_PLAYER_CONTAINER.children[activePlayRow];
   // console.log(activeRow);

   // Récupère les couleurs du joueur
   const playerGuess = getPlayerTry(activeRow);
   // console.log(playerGuess);

   // Vérifier que le joueur ait bien sélectionné 4 couleurs avant de continuer
   if (playerGuess.every((color) => TAB_COLORS.includes(color))) {
      // Comparer les tableaux
      const goodPositions = GOOD_POSITIONS(CODE, playerGuess);
      const badPositions = BAD_POSITIONS(CODE, playerGuess);
      // console.log(goodPositions, badPositions);

      // Afficher les points
      const points = activeRow.querySelector('.points');
      showPoints(goodPositions, badPositions, points);

      // Passer à la ligne suivante
      if (activePlayRow < 11) {
         // Active l'event pointer de la première ligne avec une classe "active"
         activeRow.classList.remove('active');
         activePlayRow++;
         DIV_PLAYER_CONTAINER.children[activePlayRow].classList.add('active');
      } else {
         /* Soit le joueur n'a pas la bonne combinaison à la 12ème ligne */
         CODE_CASES.classList.toggle('show');
         MESSAGE.classList.toggle('show');
         MESSAGE.textContent = 'Perdu 😩 Faudra faire mieux la prochaine fois !';
      }

      // Gérer la fin de la partie
      /* Soit le joueur trouve la bonne combinaison, c'est-à-dire que goodPositions === 4 */
      if (goodPositions === 4) {
         CODE_CASES.classList.toggle('show');
         MESSAGE.classList.toggle('show');
         MESSAGE.textContent = 'Bravo 👏 Vous avez gagné 🥳';
      }
   }
});

// ! 6) Bouton Rejouer
BTN_RESTART.addEventListener('click', resetGame);
