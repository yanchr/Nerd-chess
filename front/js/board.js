class Board {
    constructor() {

        this.hasChanged = true;

        this.ui = {
            ref_boardContainer: document.getElementById("board-container"),
            ref_canvas: document.getElementById("board"),
            ref_ctx: document.getElementById("board").getContext("2d"),
        }
        this.ui.ref_canvas.addEventListener("click", this.clickHandler);
        this.setCanvasSizeAndResolution()

        this.squares = []; // becomes 2d array through this.initiateSquares();
        this.states = {}; // holds additional states like who's turn it is etc.

        this.initiateSquares();
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

        


    }
    getFEN() {

    }
    clickHandler(e) {
        let position = {x: e.clientX, y: clientY};
        let field = {}
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

    }

}