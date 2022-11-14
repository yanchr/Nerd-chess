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
        board.squares[targetSquare.x][targetSquare.y] = this;
        board.squares[this.position.x][this.position.y] = false;

        this.position.x = targetSquare.x;
        this.position.y = targetSquare.y;
    }
    isTaken(board) {
        board.squares[this.position.x][this.position.y] = false;
    }

}