class Pawn extends Piece {
    constructor(type, position) {
        super(type, position);
    }
    validateMove(targetSquare, pieceAtTarget, board) {
        if (this.validatePushOne(targetSquare, pieceAtTarget, board)) {
            return {isValidMove: true, exitCode: 1};
        }
        if (this.validatePushTwo(targetSquare, pieceAtTarget, board)) {
            return {isValidMove: true, exitCode: 2};
        }
        if (this.validateTakes(targetSquare, pieceAtTarget, board)) {
            return {isValidMove: true, exitCode: 3};
        }
        if (this.validateEnPassant(targetSquare, pieceAtTarget, board)) {
            return {isValidMove: true, exitCode: 4};
        }
        return {isValidMove: false, exitCode: 0};
    }
    
    moveTo(validationSignature, targetSquare, pieceAtTarget, board) {
        if (validationSignature.exitCode == 2) {
            board.updateEnPassantTargetSquare(board.convertPositionToStrLocation({
                x: this.position.x,
                y: this.position.y + this.facingDirection,
            }), validationSignature.piece)
        } else {
            board.updateEnPassantTargetSquare();
        }

        if (pieceAtTarget) {
            pieceAtTarget.isTaken(board);
        }
        if (validationSignature.exitCode == 4) {
            let target = this.getEnPassantTarget(targetSquare, board)
            if (target) {
                target.isTaken(board);
            } else {
                console.error('En Passant Piece not Found')
            }
        }
        board.squares[targetSquare.x][targetSquare.y] = this;
        board.squares[this.position.x][this.position.y] = false;

        this.position.x = targetSquare.x;
        this.position.y = targetSquare.y;
    }
    isTaken(board) {
        board.squares[this.position.x][this.position.y] = false;
    }

    getEnPassantTarget(targetSquare, board) {
        return board.squares[targetSquare.x][targetSquare.y - this.facingDirection];
    }


    // MoveValidations

    validatePushOne(targetSquare, pieceAtTarget, board) {
        if (this.position.x == targetSquare.x && this.position.y + this.facingDirection == targetSquare.y && !pieceAtTarget) {
            return true;
        }
        return false;
    }
    validatePushTwo(targetSquare, pieceAtTarget, board) {
        if (this.position.x == targetSquare.x && this.position.y + 2*this.facingDirection == targetSquare.y && !pieceAtTarget && ((this.facingDirection == -1 ? 6 : 1) == (this.position.y))) {
            return true;
        }
        return false;
    }
    validateTakes(targetSquare, pieceAtTarget, board) {
        if (((this.position.x+1 == targetSquare.x && board.getPieceAtSquare({x: this.position.x+1, y: this.position.y + this.facingDirection})) || (this.position.x-1 == targetSquare.x && board.getPieceAtSquare({x: this.position.x-1, y: this.position.y + this.facingDirection}))) && this.position.y + this.facingDirection == targetSquare.y && pieceAtTarget && pieceAtTarget.side != this.side) {
            return true;
        }
        return false;
    }
    validateEnPassant(targetSquare, pieceAtTarget, board) {
        if (((this.position.x+1 == targetSquare.x && !board.getPieceAtSquare({x: this.position.x+1, y: this.position.y + this.facingDirection})) || (this.position.x-1 == targetSquare.x && !board.getPieceAtSquare({x: this.position.x-1, y: this.position.y + this.facingDirection}))) && this.position.y + this.facingDirection == targetSquare.y && !pieceAtTarget && board.states.enPassantTargetSquare == board.convertPositionToStrLocation(targetSquare)) {
            return true;
        }
        return false;
    }
}