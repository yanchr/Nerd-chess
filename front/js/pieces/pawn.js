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
            let square = {x: targetSquare.x, y: this.position.y}
            if (target) {
                target.isTaken(board);
                const aimingPieces = board.checkedSquares[square.x][square.y];
                for (let i = 0; i < aimingPieces.length; i++) {
                    aimingPieces[i].updateCheckedSquares(board, false);
                }
            } else {
                console.error('En Passant Piece not Found')
            }
        }

        const oldPosition = Object.assign({}, this.position);

        board.squares[targetSquare.x][targetSquare.y] = this;
        board.squares[this.position.x][this.position.y] = false;

        this.position.x = targetSquare.x;
        this.position.y = targetSquare.y;

        this.updateCheckedSquares(board, false);
        board.updateCheckedSquaresByPieceFromPosition(oldPosition);
        board.updateCheckedSquaresByPieceFromPosition(this.position);
        this.checkPromotion(board);
    }
    isTaken(board) {
        const checkedSquares = this.computeCheckedSquares(board, false);
        board.removeCheckedSquares(checkedSquares, this);
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
        if (
            (
                (
                    this.position.x+1 == targetSquare.x && !board.getPieceAtSquare({x: this.position.x+1, y: this.position.y + this.facingDirection})
                ) || (
                    this.position.x-1 == targetSquare.x && !board.getPieceAtSquare({x: this.position.x-1, y: this.position.y + this.facingDirection})
                )
            ) && this.position.y + this.facingDirection == targetSquare.y && !pieceAtTarget && board.states.enPassantTargetSquare == board.convertPositionToStrLocation(targetSquare)
        ) {
            const square = {x: targetSquare.x, y: targetSquare.y - this.facingDirection}
            const aimingPieces = board.checkedSquares[square.x][square.y]
            for (let i = 0; i < aimingPieces.length; i++) {
                if (aimingPieces[i].side != this.side) {
                    const list = aimingPieces[i].computeCheckedSquares(board, this.position, targetSquare, square)
                    const kingsSquare = list.find(s => s.x == (this.side == "w" ? board.wK.position.x : board.bK.position.x) && s.y == (this.side == "w" ? board.wK.position.y : board.bK.position.y))
                    if (kingsSquare) {
                        return false;
                    }
                }
            }

            return true;
        }
        return false;
    }

    // Compute Checked Squares

    computeCheckedSquares(board, invisibleSquare, occupiedSquare) {
        const list = [];

        let position = {x: this.position.x + 1, y: this.position.y + this.facingDirection}
        if (board.positionIsOnBoard(position)) {
            list.push(position)
        }
        position = {x: this.position.x - 1, y: this.position.y + this.facingDirection}
        if (board.positionIsOnBoard(position)) {
            list.push(position)
        }

        return list;
    }

    // check promotion
    checkPromotion(board) {
        const promotionRank = (this.side == "w" ? 0 : 7);
        if (this.position.y == promotionRank) {
            const position = this.position;
            board.squares[position.x][position.y] = new Queen((this.side == "w" ? "Q" : "q"), position)
            board.squares[position.x][position.y].updateCheckedSquares(board)
        }
    }
}