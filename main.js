const startButton = document.querySelector('.start-button');
const board = document.querySelector('.matrix');
const boardArray = [];
let id = 1;
const pieces = [
    {
        name: 'i',
        shape: 0,
        id: 0,
        shapes: [
            [
                [1,1,1,1]
            ],
            [
                [1],
                [1],
                [1],
                [1]
            ]    
        ],
        color: 'cyan'
    },{
        name: 'o',
        shape: 0,
        id: 0,
        shapes: [
            [
                [1,1],
                [1,1]
            ]
        ],
        color: 'yellow'
    },{
        name: 'z',
        shape: 0,
        id: 0,
        shapes: [
            [
                [1,1,0],
                [0,1,1]
            ],
            [
                [0,1],
                [1,1],
                [1,0]
            ]
        ],
        color: 'red'
    },{
        name: 't',
        id: 0,
        shape: 1,
        shapes: [
            [
                [0,1,0],
                [1,1,1]
            ],
            [
                [1,0],
                [1,1],
                [1,0]
            ],
            [
                [1,1,1],
                [0,1,0]
            ],
            [
                [0,1],
                [1,1],
                [0,1]
            ]
        ],
        color: 'violet'
    },{
        name: 'l',
        shape: 0,
        id: 0,
        shapes: [
            [
                [1,0],
                [1,0],
                [1,1]
            ],
            [
                [1,1,1],
                [1,0,0]
            ],
            [
                [1,1],
                [0,1],
                [0,1]
            ],
            [
                [0,0,1],
                [1,1,1]
            ]
        ],
        color: 'orange'
    },{
        name: 's',
        shape: 0,
        id: 0,
        shapes: [
            [
                [0,1,1],
                [1,1,0]
            ],
            [
                [1,0],
                [1,1],
                [0,1]
            ],
        ],
        color: 'green'
    },{
        name: 'j',
        shape: 0,
        id: 0,
        shapes: [
            [
                [0,1],
                [0,1],
                [1,1]
            ],
            [
                [1,0,0],
                [1,1,1]
            ],
            [
                [1,1],
                [1,0],
                [1,0]
            ],
            [
                [1,1,1],
                [0,0,1]
            ]
        ],
        color: 'blue'
    }
];

const randomPiece = (pieces) => {
    return pieces[Math.trunc(Math.random()*pieces.length)]
}

const inversedIndex = (arr,index) => {
    let transformIndex = 0;
    for (let i = arr.length-1; i >= 0; i--) {
        if (arr[index] == arr[i]) {
            return transformIndex;
        }
        transformIndex += 1;
    }
}

const checkNextRow = (actualPiece,actualRow,actualColumn) => {
    let pieceArray = actualPiece.shapes[actualPiece.shape];
    if (boardArray[(actualRow+pieceArray.length)*10]) {
        if (pieceArray[pieceArray.length-1].includes(0)) {
            let indexZeros = [];
            for (let i in pieceArray[pieceArray.length-1]) {
                if (pieceArray[pieceArray.length-1][i] == 0) {
                    indexZeros.push([i,pieceArray.length-1]);
                }
            }
            for (let i in pieceArray[pieceArray.length-2]) {
                if (pieceArray[pieceArray.length-2][i] == 0 && pieceArray[pieceArray.length-1][i] == 0) {
                    for (let d in indexZeros) {
                        if (indexZeros[d][0] == i) {
                            indexZeros[d] = [i,pieceArray.length-2]
                        }
                    }
                }
            }
            for (let i in indexZeros) { 
                if (boardArray[(actualRow+indexZeros[i][1])*10 + parseInt(indexZeros[i][0]) + actualColumn][0] == 1) {
                    return false;
                }
            }
            for (let i in pieceArray[pieceArray.length-1]) {
                if (boardArray[(actualRow+pieceArray.length)*10 + parseInt(i) + actualColumn][0] == 1 &&
                    pieceArray[pieceArray.length-1][i] == 1) {
                    return false;
                }
            }
            return true;
        } else {
            for (let i in pieceArray[pieceArray.length-1]) {
                if (boardArray[(actualRow+pieceArray.length)*10 + parseInt(i) + actualColumn][0] == 1) {
                    return false;
                }
            }
            return true;
        }
    } else {
        return false;
    }   
}

const deleteRows = () => {
    let rowsToDelete = [];
    for (let i = 0; i < boardArray.length; i += 10) {
        let thereAreZeros = false;
        for (let d = 0; d < 10; d++) {
            if (boardArray[i+d][0] == 0) {
                thereAreZeros = true;
                break;
            }
        }
        if (!thereAreZeros) {
            rowsToDelete.push(i/10);
        }
    }
    if (rowsToDelete.length == 0) {
        return 0;
    }
    for (let i in rowsToDelete) {
        for (let d = rowsToDelete[i]*10; d < rowsToDelete[i]*10 + 10; d++) {
            boardArray[d][0] = 0;
            boardArray[d][2] = 'black';
            boardArray[d][3] = 0;
        }
        for (let n = rowsToDelete[i]*10 + 9; n >= 0; n--) {
            if (boardArray[n-10]) {
                boardArray[n][0] = boardArray[n-10][0];
                boardArray[n][2] = boardArray[n-10][2];
                boardArray[n][3] = boardArray[n-10][3];
            }
        }
    }
    return rowsToDelete.length * 100;
}

const checkRightSpace = (column,actualPiece,actualRow) => {
    if (column > 9) {
        return false;
    }
    let pieceArray = actualPiece.shapes[actualPiece.shape];
    let thereAreZeros = false;
    for (let i of pieceArray) {
        if (i[pieceArray[0].length-1] == 0) {
            thereAreZeros = true;
            break;
        }
    }
    if (thereAreZeros) {
        let indexZeros = [];
        for (let i in pieceArray) {
            if (boardArray[(actualRow + parseInt(i))*10 + column][0] == 1 &&
                pieceArray[i][pieceArray[0].length-1] != 0) {
                return false;
            }
        }
        for (let i in pieceArray) {
            for (let d = pieceArray[i].length-1; d >= 0; d--) {
                if (pieceArray[i][d] == 0 && pieceArray[i][d+1] != 1) {
                    indexZeros.push([i,inversedIndex(pieceArray[i],d)]);
                }
            }
        }
        for (let i = indexZeros.length-1; i >= 0; i--) {
            if (i < indexZeros.length-1) {
                if (indexZeros[i][0] == indexZeros[i+1][0]) {
                    indexZeros.splice(i+1,1);
                } 
            }
        }
        for (let i of indexZeros) {
            if (boardArray[(actualRow + parseInt(i[0])*10) + column - parseInt(i[1]) - 1][0] == 1) {
                return false;
            }
        }
        return true;
    } else {
        for (let i in pieceArray) {
            if (boardArray[(actualRow + parseInt(i))*10 + column][0] == 1) {
                return false;
            }
        }
        return true;
    }
}

const checkLeftSpace = (column,actualPiece,actualRow) => {
    if (column <= -1) {
        return false;
    }
    let pieceArray = actualPiece.shapes[actualPiece.shape];
    let thereAreZeros = false;
    for (let i of pieceArray) {
        if (i[0] == 0) {
            thereAreZeros = true;
            break;
        }
    }
    if (thereAreZeros) {
        let indexZeros = [];
        for (let i in pieceArray) {
            if (boardArray[(actualRow + parseInt(i))*10 + column][0] == 1 && pieceArray[i][0] != 0) {
                return false;
            }
        }
        for (let i in pieceArray) {
            for (let d in pieceArray[i]) {
                if (pieceArray[i][d] == 0 && pieceArray[i][d-1] != 1) {
                    indexZeros.push([i,d]);
                }
            }
        }
        for (let i in indexZeros) {
            if (i > 0) {
                if (indexZeros[i][0] == indexZeros[i-1][0]) {
                    indexZeros.splice(i-1,1);
                }
            }
        }
        for (let i of indexZeros) {
            if (boardArray[(parseInt(i[0]) + actualRow)*10 + column + parseInt(i[1]) + 1][0] == 1) {
                return false;
            }
        }
        return true;
    } else {
        for (let i in pieceArray) {
            if (boardArray[(actualRow + parseInt(i))*10 + column][0] == 1) {
                return false;
            }
        }
        return true;
    }
}

const createBoardArray = () => {
    for (let i in board.children) {
        if (i < 200) {
            boardArray[i] = [0,board.children[i],'black',0];
        } else {
            break;
        }
    }
}

const drawPiece = (actualPiece,actualRow,actualColumn) => {
    let pieceArray = actualPiece.shapes[actualPiece.shape];
    for (let i in pieceArray) {
        for (let d in pieceArray[i]) {
            if (pieceArray[i][d] == 1) {
                boardArray[actualRow*10+actualColumn+i*10+parseInt(d)][0] = 1;
                boardArray[actualRow*10+actualColumn+i*10+parseInt(d)][2] = actualPiece.color;
                boardArray[actualRow*10+actualColumn+i*10+parseInt(d)][3] = id;
            }
        }
    }
    for (let i of boardArray) {
        i[1].style.backgroundColor = i[2];
    }
}

const deletePreviousPiece = (actualPiece,row,column) => {
    if (row + 1 > 0) {
        let pieceArray = actualPiece.shapes[actualPiece.shape];
        for (let i in pieceArray) {
            for (let d in pieceArray[i]) {
                if (boardArray[(row)*10+column+i*10+parseInt(d)][0] == 1 && 
                    boardArray[(row)*10+column+i*10+parseInt(d)][3] == id &&
                    boardArray[(row)*10+column+i*10+parseInt(d)][2] == actualPiece.color) {
                        boardArray[(row)*10+column+i*10+parseInt(d)][0] = 0;
                        boardArray[(row)*10+column+i*10+parseInt(d)][2] = 'black';
                        boardArray[(row)*10+column+i*10+parseInt(d)][3] = 0;
                }
            }
        }
    }
}

const checkIfGameIsOver = (piece) => {
    let pieceArray = piece.shapes[piece.shape];
    for (let i in pieceArray) {
        for (let d in pieceArray[i]) {
            if (boardArray[i*10 + parseInt(d)][0] == 1) {
                return false;
            }
        }
    }
    return true;
}

const rotatePiece = (actualPiece,actualRow,actualColumn) => {
    if (actualPiece.shapes.length == 1) {
        return null;
    }
    let nextPieceArray = actualPiece.shapes[actualPiece.shape + 1] || actualPiece.shapes[0];
    let actualPieceArray = actualPiece.shapes[actualPiece.shape];
    for (let i in nextPieceArray) {
        for (let d in nextPieceArray[i]) {
            if (nextPieceArray[i][d] == 1 && boardArray[(actualRow+parseInt(i))*10 + actualColumn + parseInt(d)][0] == 1 
            && boardArray[(actualRow+parseInt(i))*10 + actualColumn + parseInt(d)][3] != id) {
                return null;
            }
        }
        for (let d in nextPieceArray[i]) {
            if (actualColumn > 0 && ((actualRow+parseInt(i))*10 + actualColumn + parseInt(d)) % 10 == 0) {
                return null;
            }
        }
    }
    for (let i in actualPieceArray) {
        for (let d in actualPieceArray[i]) {
            if (actualPieceArray[i][d] == 1) {
                boardArray[(actualRow+parseInt(i))*10 + actualColumn + parseInt(d)][3] = 0;
                boardArray[(actualRow+parseInt(i))*10 + actualColumn + parseInt(d)][0] = 0;
                boardArray[(actualRow+parseInt(i))*10 + actualColumn + parseInt(d)][2] = 'black';
            } 
        }
    }
    deletePreviousPiece(actualPiece,actualRow-1,actualColumn)
    if (actualPiece.shapes[actualPiece.shape+1]) {
        actualPiece.shape += 1;
    } else {
        actualPiece.shape = 0;
    }
    drawPiece(actualPiece,actualRow,actualColumn);
}


const play = () => {
    let points = 0;
    let actualPiece = randomPiece(pieces);
    let actualRow = -1;
    let actualColumn = 3;
    const onKeyDown = (e)=>{
        switch (e.key) {
            case 'a':
                let canMoveLeft = checkLeftSpace(actualColumn-1,actualPiece,actualRow);
                if (canMoveLeft) {
                    actualColumn -= 1;
                    deletePreviousPiece(actualPiece,actualRow-1,actualColumn+1);
                    deletePreviousPiece(actualPiece,actualRow,actualColumn+1);
                    drawPiece(actualPiece,actualRow,actualColumn);
                }
                break;
            case 'd':
                let canMoveRigth = checkRightSpace(actualColumn+actualPiece.shapes[actualPiece.shape][0].length,actualPiece,actualRow)
                if (canMoveRigth) {
                    actualColumn += 1;
                    deletePreviousPiece(actualPiece,actualRow-1,actualColumn-1);
                    deletePreviousPiece(actualPiece,actualRow,actualColumn-1);
                    drawPiece(actualPiece,actualRow,actualColumn);
                }
                break;
            case 'w':
                rotatePiece(actualPiece,actualRow,actualColumn);
                break;
        }
    }
    addEventListener('keydown',onKeyDown);
    const game = setInterval(()=>{
            if (checkNextRow(actualPiece,actualRow,actualColumn)) {
                actualRow += 1;
                deletePreviousPiece(actualPiece,actualRow-1,actualColumn);
                drawPiece(actualPiece,actualRow,actualColumn);
            } else {
                points += deleteRows();
                actualPiece = randomPiece(pieces);
                actualPiece.shape = 0;
                id += 1;
                actualRow = 0;
                actualColumn = 3;
                if (!checkNextRow(actualPiece,actualRow,actualColumn)) {
                    removeEventListener('keydown',onKeyDown);
                    createBoardArray();
                    for (let i of boardArray) {
                        i[1].style.backgroundColor = i[2];
                    }
                    clearTimeout(game);
                    startButton.style.display = 'block';
                    alert(`Has obtenido ${points} puntos`);
                } else {
                    deletePreviousPiece(actualPiece,actualRow-1,actualColumn);
                    drawPiece(actualPiece,actualRow,actualColumn);
                }
            }
    },250)
}


startButton.addEventListener('click',(e)=>{
    e.target.style.display = 'none';
    play();
})

createBoardArray();

