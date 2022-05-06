import axios from 'axios';

/**
 * Url de l'api pour le user 1
 */
let url1 = document.getElementById("AiURLJoueur1").value

/**
 * Url de l'api pour le user 2
 */
let url2 = document.getElementById("AiURLJoueur2").value

/**
 * Token du Joueur 1
 */
let tokenJoueur1 = document.getElementById("AiJetonJoueur1").value

/**
 * Token du Joueur 1
 */
let tokenJoueur2 = document.getElementById("AiJetonJoueur2").value

/**
 * Nom de l'adversaire 1
 */
let adversaire1 = document.getElementById("AiNomJoueur2").value
/**
 * Nom de l'adversaire 1
 */
let adversaire2 = document.getElementById("AiNomJoueur1").value

/**
 * Instance axios pour les call du joueur 1
 * @type {AxiosInstance}
 */
const instanceAxios1 = axios.create({
    baseURL: url1, headers: {Authorization: `Bearer ${tokenJoueur1}`}
});

/**
 * Instance axios pour les call du joueur 1
 * @type {AxiosInstance}
 */
const instanceAxios2 = axios.create({
    baseURL: url2, headers: {Authorization: `Bearer ${tokenJoueur2}`}
});

/**
 * variable permettant de manipuler le bouton start
 * @type {HTMLElement}
 */
const btnStart = document.getElementById('ai-form-submit')

/**
 * variable permettant de manipuler le bouton stop
 * @type {HTMLElement}
 */
const btnStop = document.getElementById('end-game')

/**
 * variable permettant de manipuler le bouton pause
 * @type {HTMLElement}
 */
const btnPause = document.getElementById('pause-game')

/**
 * variable permettant de manipuler le bouton Continue
 * @type {HTMLElement}
 */
const btnContinue = document.getElementById('continue-game')

/**
 * Variable permettant de stoker chaque case de la Grid 1
 * @type {*[]}
 */
const gridAi1 = document.getElementById("ai1-grid");

/**
 * Variable permettant de manipuler le html de la section Grid 2
 * @type {HTMLElement}
 */
const gridAi2 = document.getElementById("ai2-grid");

/**
 * variable permettant de manipuler le form
 * @type {HTMLElement}
 */
const form = document.getElementById('form')

/**
 * Listener pour gerer le comportement du bouton start lors de son click
 */
btnStart.addEventListener("click", playGame)

/**
 * Listener pour gerer le comportement du bouton stop lors de son click
 */
btnStop.addEventListener("click", stopGame)

/**
 * Listener pour gerer le comportement du bouton pause lors de son click
 */
btnPause.addEventListener("click", pauseGame)

/**
 * Listener pour gerer le comportement du bouton continue lors de son click
 */
btnContinue.addEventListener("click", continueGame)

/**
 * Variable permettant de connaitre le tour du joueur
 * @type {boolean}
 */
let tourJoeur1 = Math.random() < 0.5;

/**
 * Nombre de point du joueur 1
 * @type {number}
 */
let pointJoueur1 = 0

/**
 * Nombre de point du joueur 1
 * @type {number}
 */
let pointJoueur2 = 0

/**
 * Variable permettant de stoker chaque case de la Grid 2
 * @type {*[]}
 */
let squaresGridAi1 = [];

/**
 * Variable permettant de stoker chaque case de la Grid 2
 * @type {*[]}
 */
let squaresGridAi2 = [];

/**
 * Variable permettant de stoker les positions des bateaux de la grid 1
 * @type {*[]}
 */
let listeCaseBateaux1 = []

/**
 * Variable permettant de stoker les positions des bateaux de la grid 2
 * @type {*[]}
 */
let listeCaseBateaux2 = []
/**
 * Variable permettant de stoker les informations par rapport au status des bateaux de la grid 1
 * @type {*[]}
 */
let listeVieParBateaux1 = []

/**
 * Variable permettant de stoker les informations par rapport au status des bateaux de la grid 2
 * @type {*[]}
 */
let listeVieParBateaux2 = []

/**
 * Liste des lettres des grids
 * @type {string[]}
 */
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
/**
 * numero de la grid 1
 * @type {null}
 */
let idGrid1 = null

/**
 * numero de la grid 2
 * @type {null}
 */
let idGrid2 = null

/**
 * variable permetant de savoir si la partie se fini en victoire
 * @type {boolean}
 */
let verificationVictoire = false

/**
 * variable permetant de savoir si la partie est en Pause
 * @type {boolean}
 */
let verificationPause = false

/**
 * variable permetant de savoir si la partie est en completé
 * @type {boolean}
 */
let victoireTotal = false

/**
 * variable permetant de savoir si une manche est en completé
 * @type {boolean}
 */
let finManche = false

/**
 * variable permetant de savoir si un bateau est en coulé
 * @type {boolean}
 */
let isSinked = false

/**
 * Variable permettant de manipuler le textarea
 * @type {HTMLElement}
 */
const textarea = document.getElementById('history')

/**
 * Méthode permettant de démarrer une partie
 * @returns {Promise<void>}
 */
async function playGame() {
    form.style.display = "none"
    btnStart.style.display = "none"
    const x = document.getElementById("grids");
    x.style.display = "flex"
    createSquaresGrid(gridAi1, squaresGridAi1, 1);
    createSquaresGrid(gridAi2, squaresGridAi2, 2);
    await generateGame(gridAi1, squaresGridAi1, adversaire1, instanceAxios1, "1")
    await generateGame(gridAi2, squaresGridAi2, adversaire2, instanceAxios2, "2")
}

/**
 * Méthode permettant de renitialiser la partie ci celle-ci continue
 * @returns {Promise<void>}
 */
async function continueGame() {
    btnContinue.style.display = "none"
    btnPause.style.display = "flex"
    gridAi1.innerHTML = ""
    gridAi2.innerHTML = ""
    tourJoeur1 = Math.random() < 0.5
    textarea.value = ""
    squaresGridAi1 = []
    squaresGridAi2 = []
    listeVieParBateaux1 = []
    listeVieParBateaux2 = []
    listeCaseBateaux1 = []
    listeCaseBateaux2 = []
    idGrid1 = null
    idGrid2 = null
    verificationVictoire = false
    verificationPause = false
    victoireTotal = false
    finManche = false
    isSinked = false
    resetStatus()
    playGame()
}

/**
 * Methode qui permet de remettre à l'état initial le status des bateaux
 */
function resetStatus() {
    document.getElementById("porte-avions1").innerText = "Porte Avions : En Vie"
    document.getElementById("cuirasse1").innerText = "Cuirasse : En Vie"
    document.getElementById("destroyer1").innerText = "Destroyer : En Vie"
    document.getElementById("sous-marin1").innerText = "Sousmarin : En Vie"
    document.getElementById("patrouilleur1").innerText = ""

    document.getElementById("porte-avions2").innerText = "Porte Avions : En Vie"
    document.getElementById("cuirasse2").innerText = "Cuirasse : En Vie"
    document.getElementById("destroyer2").innerText = "Destroyer : En Vie"
    document.getElementById("sous-marin2").innerText = "Sousmarin : En Vie"
    document.getElementById("patrouilleur2").innerText = "Patrouilleur : En Vie"
}

/**
 * Méthode permettant de d'arreter une partie
 * @returns {Promise<void>}
 */
async function stopGame() {
    await instanceAxios1.delete(`parties/${idGrid1}/`)
        .catch(error => console.error(error));
    await instanceAxios2.delete(`parties/${idGrid2}/`)
        .then(response => {
            location.reload();
        }).catch(error => console.error(error));
}

/**
 * Méthode permettant de pause une partie
 * @returns {Promise<void>}
 */
async function pauseGame() {
    verificationPause = verificationPause === false;
}

/**
 * Méthode permettant la generation des grids
 * @param grid Grid sur lequelle les case seront placer
 * @param squares liste des cases de la grid
 * @param numero numero de la grid
 */
function createSquaresGrid(grid, squares, numero) {
    textarea.value = ""
    for (let i = 0; i < 10; i++) {
        for (let j = 1; j < 11; j++) {
            const square = document.createElement("div");
            square.classList.add("square");
            square.id = numero + letters[i] + "-" + j;
            grid.appendChild(square);
            squares.push(square);
        }
    }
}

/**
 * Méthode permettant l'initialisation des bateaux
 * @param grid Grid sur laqelle les bateaux seront placés
 * @param squares liste de case sur laqelle les bateaux seront attribué
 * @param adversaire adversaire du joueur
 * @param instanceAxios instance qui seras influencé par l'adversaire
 * @param numero numero de la grid
 * @returns {Promise<void>}
 */
async function generateGame(grid, squares, adversaire, instanceAxios, numero) {
    textarea.scrollTop = textarea.scrollHeight;
    textarea.value = ""
    const response = await instanceAxios.post('parties', {adversaire: adversaire})

    let data = response.data.data.bateaux;

    if (idGrid1 === null) {
        idGrid1 = response.data.data.id
    } else {
        idGrid2 = response.data.data.id
    }
    for (let key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            let positions = data[key];
            if (numero === "1") {
                listeVieParBateaux1.push({bateau: key, coordonnees: positions, vie: positions.length})
            } else {
                listeVieParBateaux2.push({bateau: key, coordonnees: positions, vie: positions.length})
            }
            for (let position in positions) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    let idPosition = numero + positions[position]
                    document.getElementById(idPosition).className = "squareShip"
                    if (numero === "1") {
                        listeCaseBateaux1.push(positions[position])

                    } else {
                        listeCaseBateaux2.push(positions[position])
                    }
                }
            }
        }
    }
    if (idGrid2 !== null) {
        while (verificationVictoire !== true) {
            if (verificationPause === false) {
                await receiveHitCoord(idGrid1, idGrid2)
            }
            if (verificationPause === true && finManche === false) {
                textarea.value += ' Le jeu est en pause...\n'
                await new Promise(r => setTimeout(r, 2000));
            }
            if (verificationPause === true && finManche === true && victoireTotal === false) {
                textarea.value += 'La partie est terminée \n'
                textarea.value += 'Le score est de ' + pointJoueur1 + '-' + pointJoueur2 + '\n'
                textarea.value += 'Veuillez appuyez sur le bouton continuer ... \n'
                await new Promise(r => setTimeout(r, 2700000));
            }
            if (verificationPause === true && finManche === true && victoireTotal === true) {
                textarea.value += 'La partie est terminée \n'
                textarea.value += 'Le score est de ' + pointJoueur1 + '-' + pointJoueur2 + '\n'
                await new Promise(r => setTimeout(r, 2700000));
            }
        }
    }

}

/**
 * Méthode permettant d'afficher un coup dans l'interface des grids
 * @param idGrid1  numéro de la grid 1
 * @param idGrid2 numéro de la grid 1
 * @returns {Promise<void>}
 */
async function receiveHitCoord(idGrid1, idGrid2) {
    let coordonne = null;
    if (tourJoeur1 === true) {
        await instanceAxios2.post(`parties/${idGrid2}/missiles`)
            .then(response => {
                coordonne = response.data.data.coordonnee
                let idPosition = "2" + coordonne
                if (listeCaseBateaux2.includes(coordonne)) {
                    document.getElementById(idPosition).className = "squareHit"
                } else {
                    document.getElementById(idPosition).className = "squareMiss"
                }

            }).catch(error => console.error(error));

    } else {
        await instanceAxios1.post(`parties/${idGrid1}/missiles`)
            .then(response => {
                coordonne = response.data.data.coordonnee
                let idPosition = "1" + coordonne
                if (listeCaseBateaux1.includes(coordonne)) {
                    document.getElementById(idPosition).className = "squareHit"
                } else {
                    document.getElementById(idPosition).className = "squareMiss"
                }
            }).catch(error => console.error(error));
    }
    tourJoeur1 = tourJoeur1 !== true;
    await putreceivehit(coordonne)
    await new Promise(r => setTimeout(r, 1000));
}

/**
 * Méthode permettant l'envoye du résultat du coup vers l'api
 * @param coordonne coordonnée recu par l'api et placer dans la grid
 * @returns {Promise<void>}
 */
async function putreceivehit(coordonne) {
    if (tourJoeur1 === true) {
        if (listeCaseBateaux1.includes(coordonne)) {
            removeLifePoint(coordonne, listeVieParBateaux1, 1, instanceAxios1, idGrid1)
            if (isSinked === false) {
                await instanceAxios1.put(`parties/${idGrid1}/missiles/${coordonne}`, {resultat: "1"})
            }
            textarea.value += adversaire1 + ' Touche un bateau à la position : ' + coordonne + '\n'
            isSinked = false
        } else {
            removeLifePoint(coordonne)
            await instanceAxios1.put(`parties/${idGrid1}/missiles/${coordonne}`, {resultat: "0"})
            textarea.value += adversaire1 + ' Rate un bateau à la position : ' + coordonne + '\n'
        }

    } else {
        if (listeCaseBateaux2.includes(coordonne)) {
            removeLifePoint(coordonne, listeVieParBateaux2, 2, instanceAxios2, idGrid2)
            if (isSinked === false) {
                await instanceAxios2.put(`parties/${idGrid2}/missiles/${coordonne}`, {resultat: "1"})
            }
            textarea.value += adversaire2 + ' Touche un bateau à la position : ' + coordonne + '\n'
            isSinked = false
        } else {
            await instanceAxios2.put(`parties/${idGrid2}/missiles/${coordonne}`, {resultat: "0"})
            textarea.value += adversaire2 + ' Rate un bateau à la position : ' + coordonne + '\n'
        }
    }
}

/**
 * Méthode permettant d'enlevé une vie d'un bateau si celui-ci est touché
 * @param coordonne coordonnée ou le hit à était produit
 * @param liste liste composé des bateau avec leurs position et le nombre de vie restant
 * @param numero numéro du joueur
 * @param instance instance axios
 * @param idGrid numéro de la grid
 */
function removeLifePoint(coordonne, liste, numero, instance, idGrid) {

    for (let element in liste) {
        let coordBateau = liste[element].coordonnees
        if (coordBateau.includes(coordonne)) {
            liste[element].vie -= 1
            if (liste[element].vie <= 0) {
                let liBateaux = document.getElementById(`${liste[element].bateau}${numero}`)
                let str = liBateaux.innerText
                liBateaux.innerText = str.replace("En Vie", "Coulé")
                isSinked = true
                shipSinked(liste[element].bateau, instance, coordonne, idGrid)
                checkIfAllSinked(liste)
            }
        }
    }

}

/**
 * Méthode permettant de gerer les bateaux couler
 * @param bateau type du bateau
 * @param instance instance axios dépendant du user
 * @param coordonne coordonné du coup
 * @param idGrid numéro de la grid
 * @returns {Promise<void>}
 */
async function shipSinked(bateau, instance, coordonne, idGrid) {
    switch (bateau) {
        case "porte-avions" :
            await instance.put(`parties/${idGrid}/missiles/${coordonne}`, {resultat: "2"})
            break
        case "cuirasse" :
            await instance.put(`parties/${idGrid}/missiles/${coordonne}`, {resultat: "3"})
            break
        case "destroyer" :
            await instance.put(`parties/${idGrid}/missiles/${coordonne}`, {resultat: "4"})
            break
        case "sous-marin" :
            await instance.put(`parties/${idGrid}/missiles/${coordonne}`, {resultat: "5"})
            break
        case "patrouilleur" :
            await instance.put(`parties/${idGrid}/missiles/${coordonne}`, {resultat: "6"})
            break
    }
}

/**
 * Permet de voir si tout les beateux sont coulés
 * @param liste
 */
function checkIfAllSinked(liste) {
    let counterDeadShip = 0

    for (let bateau in liste) {
        if (liste[bateau].vie <= 0) {
            counterDeadShip += 1;
        }
    }
    if (counterDeadShip === 5) {
        victoire()
    }
}

/**
 * Méthode permettant de gerer une victoire
 * @returns {Promise<void>}
 */
async function victoire() {
    await new Promise(r => setTimeout(r, 500));
    btnPause.style.display = "none"
    btnContinue.style.display = "flex"
    verificationPause = true
    finManche = true
    if (tourJoeur1 === false) {
        pointJoueur1 += 1
        textarea.value += "Victoire du Joueur : " + adversaire2 + "\n"
    } else {
        pointJoueur2 += 1
        textarea.value += "Victoire du Joueur : " + adversaire1 + "\n"
    }
    if (pointJoueur2 === 2 || pointJoueur1 === 2) {
        victoireTotal = true
        btnContinue.style.display = "none"
    }

}




