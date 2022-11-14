class Rook extends Piece {
    constructor(type, position) {
        super(type, position);
    }
    validateMove(targetSquare, pieceAtTarget, board) {
        if (this.validateVertical(targetSquare, pieceAtTarget, board)) {
            return {isValidMove: true, exitCode: 1};
        }
        if (this.validateHorizontal(targetSquare, pieceAtTarget, board)) {
            return {isValidMove: true, exitCode: 2};
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
}