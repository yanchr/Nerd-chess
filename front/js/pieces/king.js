class King extends Piece {
    constructor(type, position) {
        super(type, position);
    }
    validateMove(targetSquare, pieceAtTarget, board) {
        if (this.validateStep(targetSquare,pieceAtTarget, board)) {
            return {isValidMove: true, exitCode: 1};
        }
        if (this.validateCastle(targetSquare, pieceAtTarget, board)) {
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

    // validate Move
    validateCastle(targetSquare, pieceAtTarget, board) {
        if (board.getCastlingAbilityForPosition(targetSquare)) {
            console.log("you have castlingability")
        }
        return false;
    }

    validateStep(targetSquare, pieceAtTarget, board) {
        const deltaX = targetSquare.x - this.position.x;
        const deltaY = targetSquare.y - this.position.y;
        if (
            (deltaX != 0 || deltaY != 0) &&
            Math.abs(deltaX) <= 1 && Math.abs(deltaY) <= 1 &&
            Math.abs(deltaX) + Math.abs(deltaY) <= 2 &&
            (!pieceAtTarget || pieceAtTarget.side != this.side)
            ) {
            return true;
        }
        return false;
    }
    
}