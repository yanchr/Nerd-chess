class Board {
    constructor() {

        this.hasChanged = true;

        this.ui = {
            ref_boardContainer: document.getElementById("board-container"),
            ref_canvas: document.getElementById("board"),
            ref_ctx: document.getElementById("board").getContext("2d"),
            boardSize: 0,
            squareSize: 0,
        }
        this.setCanvasSizeAndResolution();

        this.squares = []; // becomes 2d array through this.initiateSquares();
        this.states = {}; // holds additional states like who's turn it is etc.

        this.initiateSquares();
        // this.buildFromFEN("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"); // test for after move e4
        this.buildFromFEN("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    }
    main() {
        if (this.hasChanged) {
            // rerender the board only if necessary
            this.render();
            this.hasChanged = false;
        }
    }
    render() {
        
        // clear the canvas
        this.ui.ref_ctx.clearRect(0, 0, this.ui.boardSize, this.ui.boardSize);

        this.ui.ref_ctx.fillStyle = 'rgb(50,50,60)';
        this.ui.ref_ctx.fillRect(0, 0, this.ui.boardSize, this.ui.boardSize)

        // draw squares
        this.ui.ref_ctx.fillStyle = 'rgb(194, 194, 194)';
        for (let x = 0; x < this.squares.length; x++) {
            for (let y = 0; y < this.squares[x].length; y++) {
                if ((x+y) % 2 == 0) { // alte wenn dä nid genius isch weiss ich au nid
                    this.ui.ref_ctx.fillRect(x * this.ui.squareSize, y * this.ui.squareSize, this.ui.squareSize, this.ui.squareSize)
                }
            }
        }
    }
    buildFromFEN(position) {
        // translate FEN string into this.squares array
        const parts = position.split(" ");

        const board = parts[0];
        this.states.activeSide = parts[1];
        this.states.castlingAbility = parts[2];
        this.states.enPassantTargetSquare = parts[3];
        this.states.halfMoveClock = parts[4];
        this.states.fullMoveNumber = parts[5];

        // insert const board into this.squares by looping?
        // default layout
        // r n b q k b n r    <- top left has coordinates 0, 0 and holds black pieces in default position
        // p p p p p p p p
        // 0 0 0 0 0 0 0 0
        // 0 0 0 0 0 0 0 0
        // 0 0 0 0 0 0 0 0
        // 0 0 0 0 0 0 0 0
        // P P P P P P P P
        // R N B Q K B N R

        const rows = board.split("/");
        
        for (let y = 0; y < rows.length; y++) {
            let x = 0;
            for (let i = 0; i < rows[y].length; i++) {
                // loops through each row and each of its characters

                switch (rows[y][i].toLowerCase()) {
                    case "p":
                        this.squares[x][y] = new Pawn(rows[y][i])
                        x++;
                        break;

                    case "r":
                        this.squares[x][y] = new Rook(rows[y][i])
                        x++;
                        break;
                    
                    case "n":
                        this.squares[x][y] = new Knight(rows[y][i])
                        x++;
                        break;

                    case "b":
                        this.squares[x][y] = new Bishop(rows[y][i])
                        x++;
                        break;
                    
                    case "q":
                        this.squares[x][y] = new Queen(rows[y][i])
                        x++;
                        break;
                    
                    case "k":
                        this.squares[x][y] = new King(rows[y][i])
                        x++;
                        break;
                
                    default:
                        const n = parseInt(rows[y][i]);
                        for (let j = 0; j < n; j++) {
                            this.squares[x+j][y] = false;
                        }
                        x += n;
                        break;
                }
            }
        }
    }
    getFEN() {

    }
    mouseInput(mouseLocation) {
        console.log(mouseLocation)
    }
    chatInput(strLocation) {

        // works only for like "e4" not "Nc3" (yet)
        const targetSquare = {
            x: parseInt(strLocation[0].toLowerCase().charCodeAt(0)) - 97,
            y: 8 - parseInt(strLocation[1]),
        }
        console.log(targetSquare)
    }
    initiateSquares() {
        // creates a two dimensional array with the 64 squares which have a default value of false (meaning nothing is there)
        this.squares = [];
        for (let x = 0; x < 8; x++) {
            this.squares.push([]);
            for (let y = 0; y < 8; y++) {
                this.squares[x][y] = false;
            }
        }
        this.states = {
            activeSide: undefined,
            castlingAbility: undefined,
            enPassantTargetSquare: undefined,
            halfMoveClock: undefined,
            fullMoveNumber: undefined,
        }
    }
    setCanvasSizeAndResolution() {
        const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.

        this.ui.ref_canvas.style.width = `${this.ui.ref_boardContainer.clientWidth}px`;
        this.ui.ref_canvas.style.height = `${this.ui.ref_boardContainer.clientHeight}px`;

        this.ui.ref_canvas.width = Math.floor(this.ui.ref_boardContainer.clientWidth * scale);
        this.ui.ref_canvas.height = Math.floor(this.ui.ref_boardContainer.clientHeight * scale);
        // Normalize coordinate system to use CSS pixels.
        this.ui.ref_ctx.scale(scale, scale);

        this.ui.boardSize = this.ui.ref_canvas.clientHeight;
        this.ui.squareSize = this.ui.boardSize / 8;
    }

}