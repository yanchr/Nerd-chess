class King extends Piece {
    constructor(type, position) {
        super(type, position);
    }
    validateMove(targetSquare, pieceAtTarget, board) {
        if (this.validateStep(targetSquare,pieceAtTarget, board)) {
            return {isValidMove: true, exitCode: 1};
        }
        const data = this.validateCastle(targetSquare, pieceAtTarget, board);
        if (data.isValidMove) {
            return {isValidMove: true, exitCode: 2, rook: data.rook, targetSquare: data.targetSquare};
        }
        return {isValidMove: false, exitCode: 0};
    }
    moveTo(validationSignature, targetSquare, pieceAtTarget, board) {
        board.updateEnPassantTargetSquare();
        board.updateCastlingAbility(this.position);
        if (pieceAtTarget) {
            pieceAtTarget.isTaken(board);
        }
        if (validationSignature.exitCode == 2) {
            validationSignature.rook.moveTo({isValidMove: true, exitCode: 3}, validationSignature.targetSquare, false, board)
        }

        const oldPosition = Object.assign({}, this.position);

        board.squares[targetSquare.x][targetSquare.y] = this;
        board.squares[this.position.x][this.position.y] = false;

        this.position.x = targetSquare.x;
        this.position.y = targetSquare.y;

        this.updateCheckedSquares(board, false);
        board.updateCheckedSquaresByPieceFromPosition(oldPosition);
        board.updateCheckedSquaresByPieceFromPosition(this.position);
    }
    isTaken(board) {
        const checkedSquares = this.computeCheckedSquares(board, false);
        board.removeCheckedSquares(checkedSquares, this);
        board.squares[this.position.x][this.position.y] = false;
    }

    // validate Move
    validateCastle(targetSquare, pieceAtTarget, board) {
        const delta = targetSquare.x - this.position.x;
        if (
            Math.abs(delta) == 2 &&
            (this.side == "w" ? 7 : 0) == this.position.y
        ) {

            const castleType = board.getCastlingAbilityForPosition(targetSquare);
            const rookTargetSquare = {x: this.position.x + delta / 2, y: this.position.y};

            if (board.squares[rookTargetSquare.x][rookTargetSquare.y]) {return false;}

            if (
                castleType
            ) {

                const rook = board.getRookForCastle(castleType);
                if (
                    rook
                ) {

                    const rookValidationSignature = rook.validateMove(rookTargetSquare, false, board)
                    if (
                        rookValidationSignature.isValidMove
                    ) {
    
                        return {isValidMove: true, rook: rook, targetSquare: rookTargetSquare};
                    }
                }
            }
        }
        
        return {isValidMove: false};
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

    // Compute Checked Squares

    computeCheckedSquares(board, invisiblePiece) {
        const list = [];

        let position = {x: this.position.x + 1, y: this.position.y - 1}
        if (board.positionIsOnBoard(position)) {
            list.push(position)
        }
        position = {x: this.position.x + 1, y: this.position.y}
        if (board.positionIsOnBoard(position)) {
            list.push(position)
        }
        position = {x: this.position.x + 1, y: this.position.y + 1}
        if (board.positionIsOnBoard(position)) {
            list.push(position)
        }
        position = {x: this.position.x, y: this.position.y + 1}
        if (board.positionIsOnBoard(position)) {
            list.push(position)
        }
        position = {x: this.position.x, y: this.position.y - 1}
        if (board.positionIsOnBoard(position)) {
            list.push(position)
        }
        position = {x: this.position.x - 1, y: this.position.y - 1}
        if (board.positionIsOnBoard(position)) {
            list.push(position)
        }
        position = {x: this.position.x - 1, y: this.position.y}
        if (board.positionIsOnBoard(position)) {
            list.push(position)
        }
        position = {x: this.position.x - 1, y: this.position.y + 1}
        if (board.positionIsOnBoard(position)) {
            list.push(position)
        }

        return list;
    }
}