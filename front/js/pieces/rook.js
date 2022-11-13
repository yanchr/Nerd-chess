class Rook extends Piece {
    constructor(type, position) {
        super(type, position);
    }
    validateMove(targetSquare, pieceAtTarget, board) {
        if (this.validateVertical(targetSquare, pieceAtTarget, board)) {
            return {isValidMove: true, exitCode: 1};
        }
        return {isValidMove: false, exitCode: 0};
    }
    moveTo(targetSquare, pieceAtTarget, board) {
        board.updateEnPassantTargetSquare();
        
    }
    isTaken(board) {
        board.squares[this.position.x][this.position.y] = false;
    }

    // Validations
    validateVertical(targetSquare, pieceAtTarget, board) {
        if (this.position.x == targetSquare.x) {
            for (let step = this.position.y; step < targetSquare.y; step++) {
                const element = array[step];
                
            }
        }
        return false;
    }
}