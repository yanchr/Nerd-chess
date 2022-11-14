class Bishop extends Piece {
    constructor(type, position) {
        super(type, position);
    }
    validateMove(targetSquare, pieceAtTarget, board) {
        if (this.validateDiagonal(targetSquare, pieceAtTarget, board)) {
            return {isValidMove: true, exitCode: 1};
        }
        return {isValidMove: false, exitCode: 0};
    }
    moveTo(validationSignature, targetSquare, pieceAtTarget, board) {
        board.updateEnPassantTargetSquare();
        if (pieceAtTarget) {
            pieceAtTarget.isTaken(board);
        }
        board.squares[targetSquare.x][targetSquare.y] = this;
        board.squares[this.position.x][this.position.y] = false;

        this.position.x = targetSquare.x;
        this.position.y = targetSquare.y;
    }
    isTaken(board) {
        board.squares[this.position.x][this.position.y] = false;
    }

    // Validations
    validateDiagonal(targetSquare, pieceAtTarget, board) {
        const deltaX = targetSquare.x - this.position.x;
        const deltaY = targetSquare.y - this.position.y;

        const nDeltaX = deltaX / Math.abs(deltaX);
        const nDeltaY = deltaY / Math.abs(deltaY);

        console.log(deltaX, deltaY, nDeltaX, nDeltaY)

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
}