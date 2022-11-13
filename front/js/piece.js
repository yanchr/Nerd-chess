class Piece {
    constructor(type, position) {
        this.type = type;
        if (this.type == this.type.toUpperCase()) {
            this.side = "w";
            this.facingDirection = -1; // will be useful for pawns to know in which direction they are allowed to move; negative = down the board and positive = up the board
        } else {
            this.side = "b";
            this.facingDirection = 1;
        }
        this.position = {
            x: position.x,
            y: position.y,
        }
        this.textures = new Textures()
    }
    render(ctx, squareSize) {
        ctx.fillStyle = this.side == "w" ? 'rgb(255,255,255)' : 'rgb(0,0,0)';
        ctx.strokeStyle = this.side == "w" ? 'rgb(255,255,255)' : 'rgb(0,0,0)';
        
        const img = new Image()
        const positionX = this.position.x * squareSize
        const positionY = this.position.y * squareSize
        img.onload = (() => {
            console.log(squareSize)
            ctx.drawImage(img, positionX, positionY, squareSize, squareSize)
        })

        img.src = this.textures.getSvgScr(this.type, this.side)

        ctx.beginPath();
        ctx.arc(this.position.x * squareSize + squareSize/2, this.position.y * squareSize + squareSize/2, squareSize/3, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.fillText(this.type.toUpperCase(), this.position.x * squareSize + squareSize/2, this.position.y * squareSize + squareSize/2)
    }
    computeIsOnBoard() {
        
    }
    animate() {
        // a function that is same for all pieces that shows a linear interpolation of the old to the new position (optional)
    }

}