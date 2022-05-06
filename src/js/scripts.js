import axios from 'axios';

let tokenJoueur1 = "1|8eGqqbVpaGqcBLoz682kwqSiX1TAwyw2KRiFyzyu"
let tokenJoueur2 = "2|u7UoT2T1DyOQRhlPBJdkUjNkuVwKxRhIm2tOUw9c"

let adversaire1 = 'jacob'
let adversaire2 = 'hakim'

const instanceAxios1 = axios.create({
    baseURL: 'http://localhost/battleship-ia/', headers: {Authorization: `Bearer ${tokenJoueur1}`}
});
const instanceAxios2 = axios.create({
    baseURL: 'http://localhost/battleship-ia/', headers: {Authorization: `Bearer ${tokenJoueur2}`}
});
const btnStart = document.getElementById('ai-form-submit')
const btnStop = document.getElementById('end-game')
const btnPause = document.getElementById('pause-game')

btnStart.addEventListener("click", playGame)
btnStop.addEventListener("click", stopGame)
btnPause.addEventListener("click", pauseGame)

let tourJoeur1 = true;
const gridAi1 = document.getElementById("ai1-grid");
const gridAi2 = document.getElementById("ai2-grid");
let squaresGridAi1 = [];
let squaresGridAi2 = [];
let listeCaseBateaux1 = []
let listeCaseBateaux2 = []
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
let idGrid1 = null
let idGrid2 = null
let verificationVictoire = false
let verificationPause = false
const textarea = document.getElementById('history')

function saveOrReplaceData(){
    if (localStorage.length === 0){
        localStorage.setItem("Joueur1",adversaire2)
        localStorage.setItem("Joueur2",adversaire1)
        localStorage.setItem("Token1",tokenJoueur1)
        localStorage.setItem("token2",tokenJoueur2)
    }
    else{
        localStorage.setItem("Joueur1",adversaire2)
        localStorage.setItem("Joueur2",adversaire1)
        localStorage.setItem("Token1",tokenJoueur1)
        localStorage.setItem("token2",tokenJoueur2)
    }

}
async function playGame() {
    saveOrReplaceData()
    btnStart.style.display = "none"
    const x = document.getElementById("grids");
    x.style.display = "flex"
    createSquaresGrid(gridAi1, squaresGridAi1, 1);
    createSquaresGrid(gridAi2, squaresGridAi2, 2);
    generateGame(gridAi1, squaresGridAi1, adversaire1, instanceAxios1, "1")
    generateGame(gridAi2, squaresGridAi2, adversaire2, instanceAxios2, "2")
}

async function stopGame() {
    await instanceAxios1.delete(`parties/${idGrid1}/`)
        .then(response => {
        }).catch(error => console.error(error));
    await instanceAxios2.delete(`parties/${idGrid2}/`)
        .then(response => {
            location.reload();
        }).catch(error => console.error(error));

    /*squaresGridAi1 = [];
    squaresGridAi2 = [];
    gridAi1.innerHTML = ""
    gridAi2.innerHTML = ""
    btnStart.style.display = "block"
    const x = document.getElementById("grids");
    x.style.display = "none"*/
}

async function pauseGame() {
   verificationPause = verificationPause === false;
}

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

async function generateGame(grid, squares, adversaire, instanceAxios, numero) {
    const response = await instanceAxios.post('parties', {adversaire: adversaire})

    let data = response.data.data.bateaux;

    if (idGrid1 === null) {
        idGrid1 = response.data.data.id
    } else {
        idGrid2 = response.data.data.id
    }
    for (let key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            var positions = data[key];
            for (let position in positions) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    var idPosition = numero + positions[position]
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
            else{
                textarea.value += ' Le jeu est en pause...\n'
                await new Promise(r => setTimeout(r, 2000));
            }
        }

    }
}


async function receiveHitCoord(idGrid1, idGrid2) {
    var coordonne = null;
    if (tourJoeur1 === true) {
        await instanceAxios2.post(`parties/${idGrid2}/missiles`)
            .then(response => {
                coordonne = response.data.data.coordonnee
                var idPosition = "2" + coordonne
                document.getElementById(idPosition).className = "squareHit"
            }).catch(error => console.error(error));

    } else {
        await instanceAxios1.post(`parties/${idGrid1}/missiles`)
            .then(response => {
                coordonne = response.data.data.coordonnee
                var idPosition = "1" + coordonne
                document.getElementById(idPosition).className = "squareHit"
            }).catch(error => console.error(error));
    }
    tourJoeur1 = tourJoeur1 !== true;
    await putreceivehit(coordonne)
    await new Promise(r => setTimeout(r, 1000));
}

async function putreceivehit(coordonne) {
    if (tourJoeur1 === true) {
        if (listeCaseBateaux2.includes(coordonne)) {
            await instanceAxios1.put(`parties/${idGrid1}/missiles/${coordonne}`, {resultat: "1"})
            textarea.value += adversaire1 + ' Touche un bateau à la position : ' + coordonne + '\n'
        } else {
            await instanceAxios1.put(`parties/${idGrid1}/missiles/${coordonne}`, {resultat: "0"})
            textarea.value += adversaire1 + ' Rate un bateau à la position : ' + coordonne + '\n'
        }

    } else {
        if (listeCaseBateaux1.includes(coordonne)) {
            await instanceAxios2.put(`parties/${idGrid2}/missiles/${coordonne}`, {resultat: "1"})
            textarea.value += adversaire2 + ' Touche un bateau à la position : ' + coordonne + '\n'
        } else {
            await instanceAxios2.put(`parties/${idGrid2}/missiles/${coordonne}`, {resultat: "0"})
            textarea.value += adversaire2 + ' Rate un bateau à la position : ' + coordonne + '\n'
        }
    }
}



