class Game {
    constructor() {
        this.isVisible = true;

        this.board = new Board();
        this.chat = new Chat();
    }
    main() {
        // Main Loop of Game
        game.board.main();

        requestAnimationFrame(game.main);
    }
    toggleVisability() {

    }
}