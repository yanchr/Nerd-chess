class Pawn extends Piece {
    constructor(type, position) {
        super(type, position);
    }
    validateMove(targetSquare, pieceAtTarget, board) {
        if (this.position.x == targetSquare.x && this.position.y + this.facingDirection == targetSquare.y && !pieceAtTarget) {
            // one straight ahead
            return true;
        }
        return false;
    }
    moveTo(targetSquare, pieceAtTarget, board) {
        if (pieceAtTarget) {
            pieceAtTarget.kill();
        }
        board.squares[targetSquare.x][targetSquare.y] = this;

        this.position.x = targetSquare.x;
        this.position.y = targetSquare.y;
        console.log("execute move")
    }
}