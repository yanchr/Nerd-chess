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
        console.log(this.squares)

        // to store things like what square is selected when client uses mouse input (cringe)
        this.utility = {
            selected: false,
        }
    }

    /* General */

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
        for (let x = 0; x < this.squares.length; x++) {
            for (let y = 0; y < this.squares[x].length; y++) {
                // squares
                if ((x+y) % 2 == 0) { // alte wenn dä nid genius isch weiss ich au nid
                    this.ui.ref_ctx.fillStyle = 'rgb(194, 194, 194)';
                    this.ui.ref_ctx.fillRect(x * this.ui.squareSize, y * this.ui.squareSize, this.ui.squareSize, this.ui.squareSize)
                }
                // piece
                if (this.squares[x][y]) {
                    this.squares[x][y].render(this.ui.ref_ctx, this.ui.squareSize);
                }
            }
        }
    }

    tryMove(sourceSquare, targetSquare) {

        // check if source has piece
        // execute validation from that piece
        // execute moving from that piece (since e.g. castling involves more that one piece)
        // if isValid -> advance movecount, change color etc.

        const piece = this.getPieceAtSquare(sourceSquare)

        if (piece && piece.side == this.states.activeSide) {
            const validationSignature = piece.validateMove(targetSquare, this.getPieceAtSquare(targetSquare), this);
            const isUnpinned = true; // no clue how to check that so problem for future us
            // a way to solve this would be to have a seperate represantation of the board that stores per square wether or not it is endagered by either/or black and white

            if (validationSignature.isValidMove && isUnpinned) {
                piece.moveTo(validationSignature, targetSquare, this.getPieceAtSquare(targetSquare), this);

                this.hasChanged = true;
                this.states.activeSide == "w" ? this.states.activeSide = "b" : this.states.activeSide = "w";
                if (this.states.activeSide == "w") {
                    this.states.fullMoveNumber++;
                }
            }
        }
    }

    /* FEN Converters */

    buildFromFEN(FENString) {
        // translate FEN string into this.squares array
        const parts = FENString.split(" ");

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
                        this.squares[x][y] = new Pawn(rows[y][i], {x: x, y: y})
                        x++;
                        break;

                    case "r":
                        this.squares[x][y] = new Rook(rows[y][i], {x: x, y: y})
                        x++;
                        break;
                    
                    case "n":
                        this.squares[x][y] = new Knight(rows[y][i], {x: x, y: y})
                        x++;
                        break;

                    case "b":
                        this.squares[x][y] = new Bishop(rows[y][i], {x: x, y: y})
                        x++;
                        break;
                    
                    case "q":
                        this.squares[x][y] = new Queen(rows[y][i], {x: x, y: y})
                        x++;
                        break;
                    
                    case "k":
                        this.squares[x][y] = new King(rows[y][i], {x: x, y: y})
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

    /* InputHanlers */

    mouseInput(mouseLocation) {
        const square = {x: Math.floor(mouseLocation.x / this.ui.squareSize), y: Math.floor(mouseLocation.y / this.ui.squareSize)}
        
        if (!this.utility.selected) {
            this.utility.selected = square;
            console.log(`Selected Square: ${JSON.stringify(square)}`)
        } else {
            this.tryMove(this.utility.selected, square);
            console.log(`Try Move: ${JSON.stringify(this.utility.selected)} to ${JSON.stringify(square)}`)
            this.utility.selected = false;
        }
    }
    chatInput(strLocation) {

        // works only for like "e4" not "Nc3" (yet)
        const targetSquare = this.convertStrLocationToPosition(strLocation)
        console.log(targetSquare)
    }

    /* BoardPosition Converters */

    convertStrLocationToPosition(strLocation) {
        return {
            x: parseInt(strLocation[0].toLowerCase().charCodeAt(0)) - 97,
            y: 8 - parseInt(strLocation[1]),
        }
    }
    convertPositionToStrLocation(position) {
        return `${String.fromCharCode(position.x+97)}${8-position.y}`;
    }

    /* StateUpdators */

    updateEnPassantTargetSquare(strLocation = "-", piece = undefined) {
        this.states.enPassantTargetSquare = strLocation;
        this.states.enPassantTargetPiece = piece;
    }

    /* InitiationMethods */

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

    /* Utility */

    getPieceAtSquare(square) {
        return this.squares[square.x][square.y];
    }
}