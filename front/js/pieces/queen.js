class Queen extends Piece {
    constructor(type, position) {
        super(type, position);
    }
    validateMove(targetSquare, pieceAtTarget, board) {
        if (this.validateDiagonal(targetSquare, pieceAtTarget, board)) {
            return {isValidMove: true, exitCode: 1};
        }
        if (this.validateVertical(targetSquare, pieceAtTarget, board)) {
            return {isValidMove: true, exitCode: 2};
        }
        if (this.validateHorizontal(targetSquare, pieceAtTarget, board)) {
            return {isValidMove: true, exitCode: 3};
        }
        return {isValidMove: false, exitCode: 0};
    }
    moveTo(validationSignature, targetSquare, pieceAtTarget, board) {
        board.updateEnPassantTargetSquare();
        if (pieceAtTarget) {
            pieceAtTarget.isTaken(board);
        }

        const oldPosition = Object.assign({}, this.position);

        board.squares[targetSquare.x][targetSquare.y] = this;
        board.squares[this.position.x][this.position.y] = false;

        this.position.x = targetSquare.x;
        this.position.y = targetSquare.y;

        this.updateCheckedSquares(board, false)
        board.updateCheckedSquaresByPieceFromPosition(oldPosition);
        board.updateCheckedSquaresByPieceFromPosition(this.position);
    }
    isTaken(board) {
        const checkedSquares = this.computeCheckedSquares(board, false);
        board.removeCheckedSquares(checkedSquares, this);
        board.squares[this.position.x][this.position.y] = false;
    }

    // Validations
    validateDiagonal(targetSquare, pieceAtTarget, board) {
        const deltaX = targetSquare.x - this.position.x;
        const deltaY = targetSquare.y - this.position.y;

        const nDeltaX = deltaX / Math.abs(deltaX);
        const nDeltaY = deltaY / Math.abs(deltaY);

        if (Math.abs(deltaX) == Math.abs(deltaY)) {
            for (let step = 1; step < Math.abs(deltaX); step++) {
                if (board.squares[this.position.x + step * nDeltaX][this.position.y + step * nDeltaY]) {
                    return false;
                }                
            }
            if (pieceAtTarget.side == this.side) {
                return false;
            }
            return true;
        }
        return false;
    }
    validateVertical(targetSquare, pieceAtTarget, board) {
        if (this.position.x == targetSquare.x && this.position.y != targetSquare.y) {
            const delta = (targetSquare.y - this.position.y);
            const normalizedDelta = (delta) / Math.abs(delta);
            for (let step = 1; step < Math.abs(delta); step++) {
                if (board.squares[this.position.x][this.position.y + step * normalizedDelta]) {
                    return false;
                }
            }
            if (pieceAtTarget.side == this.side) {
                return false;
            }
            return true;
        }
        return false;
    }
    validateHorizontal(targetSquare, pieceAtTarget, board) {
        if (this.position.x != targetSquare.x && this.position.y == targetSquare.y) {
            const delta = (targetSquare.x - this.position.x);
            const normalizedDelta = (delta) / Math.abs(delta);
            for (let step = 1; step < Math.abs(delta); step++) {
                if (board.squares[this.position.x + step * normalizedDelta][this.position.y]) {
                    return false;
                }
            }
            if (pieceAtTarget.side == this.side) {
                return false;
            }
            return true;
        }
        return false;
    }

    // Compute Checked Squares

    computeCheckedSquares(board, invisiblePiece) {
        const list = [];
        var isValidDirection = [true, true, true, true];
        var step = 1;

        while (isValidDirection[0] || isValidDirection[1] || isValidDirection[2] || isValidDirection[3]) {
            const position0 = {x: this.position.x + step, y: this.position.y}
            const position1 = {x: this.position.x - step, y: this.position.y}
            const position2 = {x: this.position.x, y: this.position.y + step}
            const position3 = {x: this.position.x, y: this.position.y - step}
            if (isValidDirection[0]) {
                if (board.positionIsOnBoard(position0)) {
                    if (board.squares[position0.x][position0.y]) {
                        list.push(position0)
                        isValidDirection[0] = false;
                    } else {list.push(position0)} 
                } else {isValidDirection[0] = false;}
            }
            if (isValidDirection[1]) {
                if (board.positionIsOnBoard(position1)) {
                    if (board.squares[position1.x][position1.y]) {
                        list.push(position1)
                        isValidDirection[1] = false;
                    } else {list.push(position1)} 
                } else {isValidDirection[1] = false;}
            }
            if (isValidDirection[2]) {
                if (board.positionIsOnBoard(position2)) {
                    if (board.squares[position2.x][position2.y]) {
                        list.push(position2)
                        isValidDirection[2] = false;
                    } else {list.push(position2)} 
                } else {isValidDirection[2] = false;}
            }
            if (isValidDirection[3]) {
                if (board.positionIsOnBoard(position3)) {
                    if (board.squares[position3.x][position3.y]) {
                        list.push(position3)
                        isValidDirection[3] = false;
                    } else {list.push(position3)} 
                } else {isValidDirection[3] = false;}
            }
            step++;
        }



        isValidDirection = [true, true, true, true];
        step = 1;

        while (isValidDirection[0] || isValidDirection[1] || isValidDirection[2] || isValidDirection[3]) {
            const position0 = {x: this.position.x + step, y: this.position.y + step}
            const position1 = {x: this.position.x - step, y: this.position.y + step}
            const position2 = {x: this.position.x + step, y: this.position.y - step}
            const position3 = {x: this.position.x - step, y: this.position.y - step}
            if (isValidDirection[0]) {
                if (board.positionIsOnBoard(position0)) {
                    if (board.squares[position0.x][position0.y]) {
                        list.push(position0)
                        isValidDirection[0] = false;
                    } else {list.push(position0)} 
                } else {isValidDirection[0] = false;}
            }
            if (isValidDirection[1]) {
                if (board.positionIsOnBoard(position1)) {
                    if (board.squares[position1.x][position1.y]) {
                        list.push(position1)
                        isValidDirection[1] = false;
                    } else {list.push(position1)} 
                } else {isValidDirection[1] = false;}
            }
            if (isValidDirection[2]) {
                if (board.positionIsOnBoard(position2)) {
                    if (board.squares[position2.x][position2.y]) {
                        list.push(position2)
                        isValidDirection[2] = false;
                    } else {list.push(position2)} 
                } else {isValidDirection[2] = false;}
            }
            if (isValidDirection[3]) {
                if (board.positionIsOnBoard(position3)) {
                    if (board.squares[position3.x][position3.y]) {
                        list.push(position3)
                        isValidDirection[3] = false;
                    } else {list.push(position3)} 
                } else {isValidDirection[3] = false;}
            }
            step++;
        }
        return list;
    }
}