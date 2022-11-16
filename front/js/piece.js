class Piece {
    constructor(type, position) {
        this.type = type;
        this.checkedSquares = [];
        if (this.type == this.type.toUpperCase()) {
            this.side = "w";
            this.facingDirection = -1; // will be useful for pawns to know in which direction they are allowed to move; negative = down the board and positive = up the board
        } else {
            this.side = "b";
            this.facingDirection = 1;
        }
        this.position = {
            x: position.x,
            y: position.y,
        }
        this.textures = new Textures()
        this.ui = {};
    }
    render(ctx, squareSize) {
        ctx.fillStyle = this.side == "w" ? 'rgb(255,255,255)' : 'rgb(0,0,0)';
        ctx.strokeStyle = this.side == "w" ? 'rgb(255,255,255)' : 'rgb(0,0,0)';

        this.ui.size = 0.8;
        this.ui.offset = (1-this.ui.size)/2;
        
        this.ui.positionX = this.position.x * squareSize
        this.ui.positionY = this.position.y * squareSize
        if (this.ui.img) {
            ctx.drawImage(this.ui.img, this.ui.positionX + squareSize * this.ui.offset, this.ui.positionY + squareSize * this.ui.offset, squareSize * this.ui.size, squareSize * this.ui.size)
        } else {
            this.ui.img = new Image()
            this.ui.img.onload = (() => {
                ctx.drawImage(this.ui.img, this.ui.positionX + squareSize * this.ui.offset, this.ui.positionY + squareSize * this.ui.offset, squareSize * this.ui.size, squareSize * this.ui.size)
            })
        }

        this.ui.img.src = this.textures.getSvgScr(this.type, this.side)

        // ctx.beginPath();
        // ctx.arc(this.position.x * squareSize + squareSize/2, this.position.y * squareSize + squareSize/2, squareSize/3, 0, 2 * Math.PI);
        // ctx.stroke();

        // ctx.fillText(this.type.toUpperCase(), this.position.x * squareSize + squareSize/2, this.position.y * squareSize + squareSize/2)
    }
    animate() {
        // a function that is same for all pieces that shows a linear interpolation of the old to the new position (optional)
    }
    updateCheckedSquares(board, invisiblePiece = false) {
        const oldCheckedSquares = [...this.checkedSquares];
        const newCheckedSquares = [];
        const checkedSquares = this.computeCheckedSquares(board, invisiblePiece);
        for (let i = 0; i < checkedSquares.length; i++) {
            let foundNewSquare = false;
            for (let j = 0; j < oldCheckedSquares.length; j++) {
                if (checkedSquares[i].x == oldCheckedSquares[j].x && checkedSquares[i].y == oldCheckedSquares[j].y) {
                    oldCheckedSquares.splice(j, 1);
                    j = oldCheckedSquares.length;
                    foundNewSquare = true;
                }
            }
            if (!foundNewSquare) {
                newCheckedSquares.push(checkedSquares[i])
            }
        }

        board.removeCheckedSquares(oldCheckedSquares, this);
        board.addNewCheckedSquares(newCheckedSquares, this);

        this.checkedSquares = checkedSquares;

    }
    checkPin(targetSquare, board) {
        let aimingPieces = board.checkedSquares[this.position.x][this.position.y];

        for (let i = 0; i < aimingPieces.length; i++) {
            if ("brqBRQ".includes(aimingPieces[i].type) && this.side != aimingPieces[i].side) {
                let potentialCheckedSquares = aimingPieces[i].computeCheckedSquares(board, this.position, targetSquare)
                
                if (!(this.type == "k" || this.type == "K")) {
                    if (aimingPieces[i].position.x == targetSquare.x && aimingPieces[i].position.y == targetSquare.y) {
                        return false;
                    }
    
                    if (potentialCheckedSquares.find(s => s.x == (this.side == "w" ? board.wK.position.x : board.bK.position.x) && s.y == (this.side == "w" ? board.wK.position.y : board.bK.position.y))) {
                        return true;
                    }
                } else {
                    if (aimingPieces[i].position.x == targetSquare.x && aimingPieces[i].position.y == targetSquare.y &&
                        !(board.checkedSquares[aimingPieces[i].position.x][aimingPieces[i].position.y].find(p => p.side == this.side))) {
                        return false;
                    }
                    if (potentialCheckedSquares.find(s => s.x == targetSquare.x && s.y == targetSquare.y)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
    skipSquareLogic(board, position, invisibleSquare, occupiedSquare, enPassantSquare = false) {
        if ((invisibleSquare && invisibleSquare.x == position.x && invisibleSquare.y == position.y) ||
        (enPassantSquare && enPassantSquare.x == position.x && enPassantSquare.y == position.y)) {
            return false;
        } 
        if (occupiedSquare && occupiedSquare.x == position.x && occupiedSquare.y == position.y) {
            return true;
        }
        if (board.squares[position.x][position.y]) {
            return true;
        }
        return false
    }

    protectsKing(targetSquare, board) {
        const king = (this.side == "w" ? board.wK : board.bK)
        
        if (this == king) {
            const aimAtTarget = board.checkedSquares[targetSquare.x][targetSquare.y];
            const enemy = aimAtTarget.find(p => p.side != this.side)
            if (enemy) {
                return false;
            }
            return true;
        }
        
        const aimingPieces = board.checkedSquares[king.position.x][king.position.y];
        for (let i = 0; i < aimingPieces.length; i++) {
            if (aimingPieces[i].side != this.side) {
                const potentialCheckedSquares = aimingPieces[i].computeCheckedSquares(board, this.position, targetSquare);
                const square = potentialCheckedSquares.find(s => s.x == king.position.x && s.y == king.position.y);
                
                if (targetSquare.x == aimingPieces[i].position.x && targetSquare.y == aimingPieces[i].position.y) {

                } else if (square) {
                    return false;
                }
                
            }
        }
        return true;
    }
}

// board.list with [pieces] per square
// each piece has own list with checked fields
// can recompute and tell board.list to remove or add some