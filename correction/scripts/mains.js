//? 1) Créer une fonction qui renvoie un tableau de 4 cases avec dans chacune des cases une valeur aléatoire entre : "jaune", "bleu", "rouge, "vert", "blanc" et "noir"
const randomColor = () => {
    const colors = ["yellow", "blue", "red", "green", "white", "black"];
    const randomIndex = Math.floor(Math.random() * colors.length );
    return colors[randomIndex];
}

const genComputerChoice = () => {
    const computerGame = [];
    for(let i = 0; i < 4; i ++){
        computerGame.push(randomColor());
    }
    return computerGame;
}

//? 2) Créer une fonction qui prend en paramètre deux tableaux et renvoie le nombres d'éléments similaires à la même position
// ex : ["vert", "jaune", "rouge", "noir"] 
// comparé à ["rouge", "jaune", "vert", "rouge"] 
// donnera 1  (jaune)
const goodElements = (pTab, cTab) => {
    let nbGoods = 0;
    pTab.forEach( (pColor, indice) => {
        //Si l'élément actuellement parcouru est égal à l'élément dans l'autre tableau au même indice, on le compte bon
        if(pColor === cTab[indice]) {
            nbGoods++;
        }
    });
    return nbGoods;
}


//? 3) Créer une fonction qui prend en paramètre deux tableaux et renvoie le nombres d'éléments similaires mal placés
// ex : ["vert", "jaune", "rouge", "noir"] 
// comparé à ["rouge", "jaune", "vert", "rouge"] 
// donnera 2 (vert et rouge)
const almostGoodElements = (pTab, cTab) => {
    let almostGood = 0;

    pTab.forEach((pColor, i) => {
        let nbCurrentColorInPTab = pTab.filter(p => p == pColor).length;
        let nbCurrentColorInCTab = cTab.filter(c => c == pColor).length == 0 ? nbCurrentColorInPTab : cTab.filter(c => c == pColor).length;
        
        //S'il y a plus d'éléments de la couleur parcourue dans le tableau du joueur que celui du computer 
        // Et que c'est la première occurence qu'on rencontre
        if(nbCurrentColorInPTab > nbCurrentColorInCTab && i == pTab.indexOf(pColor) ) {
            //On retire ce qui va être compté en double dans le prochaine if, c'est à dire le nombre d'éléments en trop entre les deux
            almostGood -= nbCurrentColorInPTab - nbCurrentColorInCTab;
        }

        //Si la couleur est contenue dans le tableau du computer mais pas au même indice
        if(cTab.includes(pColor) && pColor !== cTab[i]) {
            almostGood++;
        }
    })

    return almostGood;
}
//______________________________________________________________________________________________

// 4) Et voilà, vous avez toutes les bases pour créer un mastermind :)
// A) "L'ordi" génère un tableau aléatoire ( voir 1)
// B) Le joueur peut générer une combinaison (méthode de votre choix, des select + bouton valider, click sur un button pour le changer de couleurs + valider etc) (il créé un tableau de 4 cases avec les couleurs de son choix)
// C) On affiche autant de rond rouge que d'éléments bien placés et autant de rond blancs que d'éléments mal placés
// D) Le joueur à droit à 12 propositions
// E) Si tous les éléments sont bien placés c'est qu'il a trouvé :)

// ----------------------------------------------------------------------
// Récupération des éléments
// ----------------------------------------------------------------------
const DIV_PROPALS = document.querySelectorAll("tfoot td div");
const MODAL_PROPAL = document.querySelector(".propal");
const COLORS = document.querySelectorAll(".propal div");
const BTN_PLAY = document.getElementById("play");
const PLAYED_ROWS = document.querySelectorAll("tbody tr");
const BTN_REPLAY = document.getElementById("replay");
const MODAL = document.querySelector(".modal-result");

// ----------------------------------------------------------------------
// Mise en place du jeu
// ----------------------------------------------------------------------
let computerGame;
let tries;
let currentSlot;

const initGame = () => {
    computerGame = genComputerChoice();
    console.log(computerGame);
    tries = 0;
    BTN_PLAY.disabled = true;
    PLAYED_ROWS.forEach(row => {
        for(let i = 1; i< row.children.length; i++){
            row.children[i].innerHTML = "";
        }
    });
}
initGame();

BTN_REPLAY.addEventListener("click", () => {
    MODAL.classList.add("hidden");
    initGame();
})

// ----------------------------------------------------------------------
// GESTION PROPOSITION + MODAL COULEURS
// ----------------------------------------------------------------------

// Fonction pour vérifier si le bouton valider doit être disabled ou non
const validPlayBtn = () => {
    let valid = true;
    //Si la classe d'une des boules n'est pas remplie d'une couleur, on renvoie false
    DIV_PROPALS.forEach(p => {
        if(p.className === ''){
            console.log(p.className);
            valid = false;
        }
    })
    //Si toutes les classes étaient remplie d'une couleur, on renverra true
    return valid;
}

// Pour chaque couleur présente dans la popup de selection des couleurs, on ajoute un event au click permettant d'appliquer la couleur selectionée au bond endroit
COLORS.forEach(color => {
    color.addEventListener('click', () => {
        console.log(currentSlot);
        DIV_PROPALS[currentSlot].className = '';
        DIV_PROPALS[currentSlot].classList.add(color.className);
        MODAL_PROPAL.classList.remove("visible");      
        MODAL_PROPAL.classList.add("hidden");      
        BTN_PLAY.disabled = !validPlayBtn();  
    });
})

// Pour chaque case dans la partie proposition, on ouvrira au click la popup de sélection des billes
DIV_PROPALS.forEach( (propal, i) => {
    propal.addEventListener('click', (e) => {
        currentSlot = i;
        MODAL_PROPAL.classList.remove("hidden");
        MODAL_PROPAL.classList.add("visible");  
        //event.clientY / clientX -> vous permet de récupérer la position de la souris lors du déclenchement de l'event    
        //HTMLElement.offsetHeight -> Vous permet de récupérer la hauteur de l'élément html (incluant margin et padding)
        MODAL_PROPAL.style.top = e.clientY- MODAL_PROPAL.offsetHeight-5 + "px" ;
        MODAL_PROPAL.style.left = e.clientX+5 + "px";     
    });
} );

BTN_PLAY.addEventListener('click', () => {
    //Construction du tableau du joueur
    const playerGame = [];
    DIV_PROPALS.forEach(propal => playerGame.push(propal.className))
    //-------------------------------------

    // Affichage de la proposition dans la bonne ligne
    playerGame.forEach( (colorPlayed, i) => {
        const BALL = document.createElement("div");
        BALL.classList.add(colorPlayed);
        PLAYED_ROWS[tries].children[i+1].append(BALL);
    });

    //-------------------------------------
    // Calcul et affichage des éléments bons
    const nbGoods = goodElements(playerGame, computerGame);

    for(let i=0; i < nbGoods; i++){
        const RED_DOT = document.createElement("div");
        RED_DOT.classList.add("red-dot");
        PLAYED_ROWS[tries].children[5].append(RED_DOT);
    }
    //-------------------------------------
    // Calcul et affichage des mal placés
    const almostGoods = almostGoodElements(playerGame, computerGame);

    for(let i=0; i < almostGoods; i++){
        const WHITE_DOT = document.createElement("div");
        WHITE_DOT.classList.add("white-dot");
        PLAYED_ROWS[tries].children[5].append(WHITE_DOT);
    }
    //-------------------------------------
    //On augmente le nombre d'essais de 1
    tries ++;

    //-------------------------------------
    //On vérifie si la partie est gagnée ou perdue
    if(playerGame.toString() === computerGame.toString()){
        setTimeout(() => {
            MODAL.classList.remove("hidden");
            const MESSAGE = document.querySelector('.message');
            //Avec la fonction map, je transforme mon tableau contenant juste le nom des couleurs en un tableau contenant du html sous format text
            // ["yellow", "red", "blue", "green"] deviendra
            // [`<div class="yellow"></div>`,`<div class="red"></div>`,`<div class="blue"></div>`,`<div class="green"></div>`]
            //Le join me permet donc d'afficher le contenu de mes cases les un après les autres
             // `<div class="yellow"></div>``<div class="red"></div>``<div class="blue"></div>``<div class="green"></div>`
            MESSAGE.innerHTML = `<p>Félicitations vous avez gagné !</p> <p>La combinaison était bien</p> <div class="colors">${computerGame.map(c => `<div class="${c}"></div>`).join('')}</div>`;
        }, 1000)
    }
    else if(tries === 12) {
        setTimeout(() => {
            MODAL.classList.remove("hidden");
            const MESSAGE = document.querySelector('.message');
            MESSAGE.innerHTML = `<p>Dommage vous avez perdu !</p> <p>La combinaison était </p> <div class="colors">${computerGame.map(c => `<div class="${c}"></div>`).join('')}</div>`;
        }, 1000)
    }

    //-------------------------------------
    //Remise à 0 de l'emplacement de jeu en bas
    currentSlot = undefined;
    DIV_PROPALS.forEach((propal) => {
        propal.className = '';
    })
    BTN_PLAY.disabled = true;


})






