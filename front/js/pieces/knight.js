class Knight extends Piece {
    constructor(type, position) {
        super(type, position);
    }
    validateMove(targetSquare, pieceAtTarget, board) {
        const deltaX = Math.abs(this.position.x - targetSquare.x);
        const deltaY = Math.abs(this.position.y - targetSquare.y);
        if (
            deltaX+deltaY == 3 && (deltaX == deltaY+1 || deltaX == deltaY-1) &&
            (!pieceAtTarget || pieceAtTarget.side != this.side)
        ) {
            return {isValidMove: true, exitCode: 1};
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

        this.updateCheckedSquares(board, false);
        board.updateCheckedSquaresByPieceFromPosition(oldPosition);
        board.updateCheckedSquaresByPieceFromPosition(this.position);
    }
    isTaken(board) {
        const checkedSquares = this.computeCheckedSquares(board, false);
        board.removeCheckedSquares(checkedSquares, this);
        board.squares[this.position.x][this.position.y] = false;
    }

    // Compute Checked Squares

    computeCheckedSquares(board, invisiblePiece) {
        const list = [];

        let position = {x: this.position.x + 1, y: this.position.y + 2}
        if (board.positionIsOnBoard(position)) {
            list.push(position)
        }
        position = {x: this.position.x + 1, y: this.position.y - 2}
        if (board.positionIsOnBoard(position)) {
            list.push(position)
        }
        position = {x: this.position.x - 1, y: this.position.y + 2}
        if (board.positionIsOnBoard(position)) {
            list.push(position)
        }
        position = {x: this.position.x - 1, y: this.position.y - 2}
        if (board.positionIsOnBoard(position)) {
            list.push(position)
        }

        position = {x: this.position.x + 2, y: this.position.y + 1}
        if (board.positionIsOnBoard(position)) {
            list.push(position)
        }
        position = {x: this.position.x + 2, y: this.position.y - 1}
        if (board.positionIsOnBoard(position)) {
            list.push(position)
        }
        position = {x: this.position.x - 2, y: this.position.y + 1}
        if (board.positionIsOnBoard(position)) {
            list.push(position)
        }
        position = {x: this.position.x - 2, y: this.position.y - 1}
        if (board.positionIsOnBoard(position)) {
            list.push(position)
        }

        return list;
    }
}