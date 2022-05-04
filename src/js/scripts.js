import axios from 'axios';

let tokenAdversaire1 = "1|GKQhogqXjhdulkGjZufGtEhmaViopS8W44eedNzR"
let tokenAdversaire2 = "2|XxLYZWrl0Ujlcm720fkkkNuag7aZdJjhndVoeiL0"

let adversaire1 = 'jacob'
let adversaire2 = 'hakim'

const instanceAxios1 = axios.create({
    baseURL: 'http://localhost/battleship-ia/', headers: {Authorization: `Bearer ${tokenAdversaire1}`}
});
const instanceAxios2 = axios.create({
    baseURL: 'http://localhost/battleship-ia/', headers: {Authorization: `Bearer ${tokenAdversaire2}`}
});


window.onload = function () {
    let tourJour1 = true;
    const gridAi1 = document.getElementById("ai1-grid");
    const gridAi2 = document.getElementById("ai2-grid");
    const squaresGridAi1 = [];
    const squaresGridAi2 = [];
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let verificationVictoire = false
    let idGrid1 = null;
    let idGrid2 = null;

    function createSquaresGrid(grid, squares, numero) {
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
        await instanceAxios.post('parties', {adversaire: adversaire})
            .then(response => {
                let data = response.data.data.bateaux;
                if (numero === "1") {
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

                            }
                        }
                    }
                }

            }).catch(error => console.error(error))
        if (idGrid2 !== null) {
            while (verificationVictoire === false) {
                receiveHitCoord(idGrid1, idGrid2)
            }

        }
    }


    async function receiveHitCoord(idGrid1, idGrid2) {
        let coordonne = null;

        if (tourJour1 === true) {
            await instanceAxios1.post(`parties/${idGrid1}/missiles`)
                .then(response => {
                    coordonne = response.data.data.coordonnee
                    var idPosition = "1" + coordonne
                    document.getElementById(idPosition).className = "squareHit"
                }).catch(error => console.error(error));
        } else {
            await instanceAxios2.post(`parties/${idGrid2}/missiles`)
                .then(response => {
                    coordonne = response.data.data.coordonnee
                    var idPosition = "2" + coordonne
                    document.getElementById(idPosition).className = "squareHit"
                }).catch(error => console.error(error));
        }
        tourJour1 = tourJour1 !== true;
        console.log(coordonne)
        await new Promise(r => setTimeout(r, 3000));
        await putreceivehit(coordonne)

    }

    async function putreceivehit(coordonne) {
        if (tourJour1 === true) {
            instanceAxios1.put(`parties/${idGrid2}/missiles/${coordonne}`, {resultat:0})
        } else {
            instanceAxios2.put(`parties/${idGrid1}/missiles/${coordonne}`, {resultat: 1})
        }

    }

    createSquaresGrid(gridAi1, squaresGridAi1, 1);
    createSquaresGrid(gridAi2, squaresGridAi2, 2);
    generateGame(gridAi1, squaresGridAi1, adversaire1, instanceAxios1, "1")
    generateGame(gridAi2, squaresGridAi2, adversaire2, instanceAxios2, "2")


}