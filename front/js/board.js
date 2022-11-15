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
        this.checkedSquares = []; // becomes 2d array through this.initiateSquares();
        this.states = {}; // holds additional states like who's turn it is etc.

        this.initiateSquares();

        this.buildFromFEN();
        // this.buildFromFEN("8/1K6/8/4p3/8/8/8/8 w KQkq - 0 1");
        // this.buildFromFEN("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"); // test for after move e4
        // this.buildFromFEN("r3k2r/pp4pp/8/8/8/8/PP4PP/R3K2R w KQkq - 0 1");

        // to store things like what square is selected when client uses mouse input (cringe)
        this.utility = {
            selected: false,
        }
        this.debug = {
            showCheckedSquares: true,
            showSquareLocations: false,
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
                    this.ui.ref_ctx.fillRect(x * this.ui.squareSize, y * this.ui.squareSize, this.ui.squareSize, this.ui.squareSize);
                }
                // draw square names
                if (this.debug.showSquareLocations) {
                    this.ui.ref_ctx.fillStyle = 'rgb(0,0,255)';
                    this.ui.ref_ctx.fillText(this.convertPositionToStrLocation({x: x, y: y}), x * this.ui.squareSize, y * this.ui.squareSize+10)
                }
                // draw checkedSquares
                if (this.debug.showCheckedSquares ) {
                    this.ui.ref_ctx.fillStyle = 'rgb(100,100,255)';
                    var pieces = "";
                    for (let index = 0; index < this.checkedSquares[x][y].length; index++) {
                        pieces += this.checkedSquares[x][y][index].type;
                    }
                    this.ui.ref_ctx.fillText(pieces, x * this.ui.squareSize, y * this.ui.squareSize+10)
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
            const isUnpinned = true; 

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

    buildFromFEN(FENString = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
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
        this.computeCheckedSquares();
    }
    getFEN() {
        let board = "";

        for (let y = 0; y < this.squares.length; y++) {
            let counter = 0;
            for (let x = 0; x < this.squares.length; x++) {
                switch (this.squares[x][y]) {
                    case false:
                        counter++;
                        break;
                
                    default:
                        if (counter > 0) {
                            board += counter.toString();
                            counter = 0;
                        }
                        board += this.squares[x][y].type;
                        break;
                }
            }
            if (counter > 0) {
                board += counter.toString();
                counter = 0;
            }
            if (y < this.squares.length-1) {
                board += "/"
            }
        }

        return `${board} ${this.states.activeSide} ${this.states.castlingAbility} ${this.states.enPassantTargetSquare} ${this.states.halfMoveClock} ${this.states.fullMoveNumber}`;
    }

    /* CheckedSquares */

    computeCheckedSquares() {
        for (let x = 0; x < this.squares.length; x++) {
            for (let y = 0; y < this.squares[x].length; y++) {
                if (this.squares[x][y]) {
                    this.squares[x][y].updateCheckedSquares(this);
                }
            }
        }
        console.log(this.checkedSquares)
    }
    removeCheckedSquares(list, piece) {
        for (let i = 0; i < list.length; i++) {
            let index = this.checkedSquares[list[i].x][list[i].y].findIndex(p => p === piece);
            if (index >= 0) {
                this.checkedSquares[list[i].x][list[i].y].splice(index, 1);
            } else {
                console.error("A piece was not found in a checkedSquares array")
            }
        }
    }
    addNewCheckedSquares(list, piece) {
        for (let i = 0; i < list.length; i++) {
            this.checkedSquares[list[i].x][list[i].y].push(piece);
        }
    }
    updateCheckedSquaresByPieceFromPosition(position) {
        for (let i = 0; i < this.checkedSquares[position.x][position.y].length; i++) {
            this.checkedSquares[position.x][position.y][i].updateCheckedSquares(this);
        }
    }

    /* InputHandlers */

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
    positionIsOnBoard(position) {
        if (position.x >= 0 && position.x < 8 && position.y >= 0 && position.y < 8) {
            return true;
        }
        return false;
    }

    /* StateUpdators */

    updateEnPassantTargetSquare(strLocation = "-") {
        this.states.enPassantTargetSquare = strLocation;
    }

    getCastlingAbilityForPosition(position) {
        if (position.x == 2 && position.y == 7 && this.states.castlingAbility.includes("Q")) {
            return "Q";
        } else if (position.x == 6 && position.y == 7 && this.states.castlingAbility.includes("K")) {
            return "K";
        } else if (position.x == 2 && position.y == 0 && this.states.castlingAbility.includes("k")) {
            return "k";
        } else if (position.x == 6 && position.y == 0 && this.states.castlingAbility.includes("q")) {
            return "q";
        }
        return false;
    }
    updateCastlingAbility(position) {
        if (position.x == 4 && position.y == 0) { // b King
            this.removeCastlingAbility("k")
            this.removeCastlingAbility("q")
        } else if (position.x == 4 && position.y == 7) { // w King
            this.removeCastlingAbility("K")
            this.removeCastlingAbility("Q")
        } else if (position.x == 0 && position.y == 7) {
            this.removeCastlingAbility("Q")
        } else if (position.x == 7 && position.y == 7) {
            this.removeCastlingAbility("K")
        } else if (position.x == 0 && position.y == 0) {
            this.removeCastlingAbility("q")
        } else if (position.x == 7 && position.y == 0) {
            this.removeCastlingAbility("k")
        }
    }
    removeCastlingAbility(type) {
        this.states.castlingAbility = this.states.castlingAbility.replace(type,'');
    }
    getRookForCastle(castleType) {
        if (castleType == "Q") {
            return this.squares[0][7]
        } else if (castleType == "K") {
            return this.squares[7][7]
        } else if (castleType == "q") {
            return this.squares[7][0]
        } else if (castleType == "k") {
            return this.squares[0][0]
        }
        return undefined;
    }

    /* InitiationMethods */

    initiateSquares() {
        // creates a two dimensional array with the 64 squares which have a default value of false (meaning nothing is there)
        this.squares = [];
        this.checkedSquares = [];
        for (let x = 0; x < 8; x++) {
            this.squares.push([]);
            this.checkedSquares.push([]);
            for (let y = 0; y < 8; y++) {
                this.squares[x][y] = false;
                this.checkedSquares[x][y] = [];
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