class Piece {
    constructor(type) {
        this.type = type;
        if (this.type == this.type.toUpperCase()) {
            this.side = "w";
            this.facingDirection = -1; // will be useful for pawns to know in which direction they are allowed to move; negative = down the board and positive = up the board
        } else {
            this.side = "b";
            this.facingDirection = 1;
        }
    }
    computeIsOnBoard() {
        
    }
    animate() {
        // a function that is same for all pieces that shows a linear interpolation of the old to the new position (optional)
    }
}