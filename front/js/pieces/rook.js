class Rook extends Piece {
    constructor(type, position) {
        super(type, position);
    }
    validateMove(targetSquare, pieceAtTarget, board) {
        

    }
    moveTo(targetSquare, pieceAtTarget, board) {
        board.updateEnPassantTargetSquare();
        
    }
    isTaken(board) {

    }
}