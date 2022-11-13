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
    validateVertical(targetSquare, pieceAtTarget, board) {
        if (this.position.x == targetSquare.x && this.position.y != targetSquare.y) {
            let normalizedDirection = (targetSquare.y - this.position.y) / Math.abs(targetSquare.y - this.position.y);
            console.log(normalizedDirection)
            for (let step = this.position.y + normalizedDirection; step < targetSquare.y - normalizedDirection; step += normalizedDirection) {
                console.log(step)
                if (board.squares[this.position.x][step]) {
                    console.log("isInWay")
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