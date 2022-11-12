class Pawn extends Piece {
    constructor(type, position) {
        super(type, position);
    }
    validateMove(targetSquare, pieceAtTarget, board) {
        // one straight ahead
        if (this.position.x == targetSquare.x && this.position.y + this.facingDirection == targetSquare.y && !pieceAtTarget) {
            console.log(1)
            return true;
        }
        // two on first
        if (this.position.x == targetSquare.x && this.position.y + 2*this.facingDirection == targetSquare.y && !pieceAtTarget && (this.facingDirection == -1 ? 6 : 1 == this.position.y)) {
            console.log(2)
            return true;
        }
        // one forward + one left or right if enemy piece exists
        console.log(
            this.position.x+1 == targetSquare.x, 
            board.getPieceAtSquare({x: this.position.x+1, y: this.position.y}),
            this.position.x-1 == targetSquare.x, 
            board.getPieceAtSquare({x: this.position.x-1, y: this.position.y}),
            this.position.y + this.facingDirection == targetSquare.y,
            pieceAtTarget
            )
        if (((this.position.x+1 == targetSquare.x && board.getPieceAtSquare({x: this.position.x+1, y: this.position.y + this.facingDirection})) || (this.position.x-1 == targetSquare.x && board.getPieceAtSquare({x: this.position.x-1, y: this.position.y + this.facingDirection}))) && this.position.y + this.facingDirection == targetSquare.y && pieceAtTarget) {
            console.log(3)
            return true;
        }
        return false;
    }
    moveTo(targetSquare, pieceAtTarget, board) {
        if (pieceAtTarget) {
            pieceAtTarget.isTaken(board);
        }
        board.squares[targetSquare.x][targetSquare.y] = this;
        board.squares[this.position.x][this.position.y] = false;

        this.position.x = targetSquare.x;
        this.position.y = targetSquare.y;
        console.log("execute move")
    }
    isTaken(board) {
        board.squares[this.position.x][this.position.y] = false;
    }
}