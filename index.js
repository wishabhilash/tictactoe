/**
 * This program is a boliler plate code for the famous tic tac toe game
 * Here box represents one placeholder for either X or a 0
 * We have a 2D array to represent the arrangement of X or O is a grid
 * 0 -> empty box
 * 1 -> box with X
 * 2 -> box with O
 * 
 * Below are the tasks which needs to be completed
 * Imagine you are playing with Computer so every alternate move should be by Computer
 * X -> player
 * O -> Computer
 * 
 * Winner has to be decided and has to be flashed
 * 
 * Extra points will be given for the Creativity
 * 
 * Use of Google is not encouraged
 * 
 */
let grid = [];
const GRID_LENGTH = 3;
let resultStatement = "";
let aiGrid = []
symbolToUser = {
    1: 'user',
    2: 'ai'
}

userToSymbol = {
    'user': 1,
    'ai': 2
}

/*
    1 -> your turn
    2 -> computer's turn
*/
let currentTurn = null;


function changeTurn() {
    if (currentTurn != 1 && currentTurn != 2) {
        currentTurn = Math.trunc(Math.random()) + 1;
    }
    if (currentTurn == 2) {
        currentTurn = 1;
    } else {
        currentTurn = 2;
    }
}

function initializeGrid() {
    for (let colIdx = 0;colIdx < GRID_LENGTH; colIdx++) {
        const tempArray = [];
        for (let rowidx = 0; rowidx < GRID_LENGTH;rowidx++) {
            tempArray.push(0);
        }
        grid.push(tempArray);
    }
}

function getRowBoxes(colIdx) {
    let rowDivs = '';
    
    for(let rowIdx=0; rowIdx < GRID_LENGTH ; rowIdx++ ) {
        let additionalClass = 'darkBackground';
        let content = '';
        const sum = colIdx + rowIdx;
        if (sum%2 === 0) {
            additionalClass = 'lightBackground'
        }
        const gridValue = grid[colIdx][rowIdx];
        if(gridValue === 1) {
            content = '<span class="cross">X</span>';
        }
        else if (gridValue === 2) {
            content = '<span class="cross">O</span>';
        }
        rowDivs = rowDivs + '<div colIdx="'+ colIdx +'" rowIdx="' + rowIdx + '" class="box ' +
            additionalClass + '">' + content + '</div>';
    }
    return rowDivs;
}

function getColumns() {
    let columnDivs = '';
    for(let colIdx=0; colIdx < GRID_LENGTH; colIdx++) {
        let coldiv = getRowBoxes(colIdx);
        coldiv = '<div class="rowStyle">' + coldiv + '</div>';
        columnDivs = columnDivs + coldiv;
    }
    return columnDivs;
}

function renderMainGrid() {
    const parent = document.getElementById("grid");
    const columnDivs = getColumns();
    parent.innerHTML = '<div class="columnsStyle">' + columnDivs + '</div>';
}

function onBoxClick() {
    var rowIdx = this.getAttribute("rowIdx");
    var colIdx = this.getAttribute("colIdx");
    processMove(rowIdx, colIdx);
}

function processMove(rowIdx, colIdx) {
    grid[colIdx][rowIdx] = currentTurn;

    let result = validateGameCompletion();
    renderMainGrid();
    if (result != null) {
        declareWinner(result);
        return;
    }
    addClickHandlers();
    
    removeFromAiGrid(colIdx, rowIdx);
    changeTurn();
    if (currentTurn == 2) {
        aiMove();
    }
}

function declareWinner(winner) {
    resultStatement = "";
    if(winner == 'draw')
        resultStatement = "Draw!!!";
    else
        resultStatement = winner + " won!!!";

    let resultStatementBox = document.querySelector('.resultStatement');
    resultStatementBox.textContent = resultStatement;
    let overlay = document.getElementsByClassName('overlay');
    let attributes = overlay[0].setAttribute("class", "overlay show");
    
}

function validateGameCompletion() {
    let diagonal = checkDiagonal()
    let horizontal = checkHorizontal()
    let vertical = checkVertical()
    let completed = checkCompletion()

    if(diagonal["result"] != null)
        return diagonal["result"];

    else if(horizontal["result"] != null)
        return horizontal["result"];

    else if(vertical["result"] != null)
        return vertical["result"];

    else if(completed)
        return 'draw';
    else
        return null;
}

function checkDiagonal() {
    let diagonal1 = new Set([grid[0][0], grid[1][1], grid[2][2]]);
    let diagonal2 = new Set([grid[0][2], grid[1][1], grid[2][0]]);
    if (diagonal1.size == 1 || diagonal2.size == 1){
        if(grid[1][1] != 0) {
            return {
                "result": symbolToUser[grid[1][1]]
            }
        }
    }

    return {
        "result": null
    }
}

function checkHorizontal() {
    for(let row=0; row < grid.length; row++) {
        let rowArr = grid[row];
        let rowSet = new Set(rowArr);
        if (rowSet.size == 1 && rowArr[0] != 0)
            return {
                "result": symbolToUser[rowArr[0]]
            }
    }
    return {
        "result": null
    }
}

function checkVertical() {
    for(let column=0; column < GRID_LENGTH; column++) {
        let columnArr = [grid[0][column], grid[1][column], grid[2][column]];
        let columnSet = new Set(columnArr);
        if (columnSet.size == 1 && columnArr[0] != 0) {
            return {
                "result": symbolToUser[grid[0][column]]
            }
        }
    }
    return {
        "result": null
    }
}

function checkCompletion() {
    for(let i=0; i < GRID_LENGTH; i++){
        for(let j = 0; j < GRID_LENGTH; j++){
            if(grid[i][j] != 1 || grid[i][j] != 2){
                return false;
            }
        }
    }
    return true;
}

function addClickHandlers() {
    var boxes = document.getElementsByClassName("box");
    for (var idx = 0; idx < boxes.length; idx++) {
        boxes[idx].addEventListener('click', onBoxClick, false);
    }
}

function initializeAi(argument) {
    aiGrid = [];
    for(let i = 0; i < GRID_LENGTH; i++) {
        for(let j = 0; j < GRID_LENGTH; j++) {
            aiGrid.push([i,j]);
        }
    }
}

function resetGame() {
    let overlay = document.getElementsByClassName('overlay');
    let attributes = overlay[0].setAttribute("class", "overlay hide");

    grid = [];
    initializeGrid();
    initializeAi();
    renderMainGrid();
    addClickHandlers();
}

function aiMove() {
    if (aiGrid.length == 0) return;
    let selectedIndex = Math.floor(Math.random()*aiGrid.length)
    let selectedCell = aiGrid[selectedIndex];
    grid[selectedCell[0]][selectedCell[1]] = 2;
    processMove(selectedCell[1], selectedCell[0])
    // removeFromAiGrid(selectedCell[0], selectedCell[1]);
    // renderMainGrid();
    // addClickHandlers();
    // changeTurn();
}

function removeFromAiGrid(x, y) {
    let selectedIndex = null;
    for(let i = 0; i < aiGrid.length; i++) {
        let cell = aiGrid[i];
        if(cell[0] == x && cell[1] == y) {
            selectedIndex = i;
        }
    }
    
    aiGrid.splice(selectedIndex, 1);
}

function main() {
    changeTurn();
    resetGame();
    if (currentTurn == 2) {
        aiMove();
    }
}


main();