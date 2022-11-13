class Game {
    constructor() {

        // Game object hold things that are not directly related to the mechanics of chess
        // Rather wheter or not the game is visible, handles inputs etc.

        this.isVisible = true;

        this.board = new Board();
        this.board.ui.ref_canvas.addEventListener("click", this.clickHandler);

        this.chat = new Chat();
    }
    main() {
        // Main Loop of Game
        game.board.main();

        requestAnimationFrame(game.main);
    } 
    toggleVisability() {

    }
    clickHandler(e) {
        game.board.mouseInput({x: e.clientX, y: e.clientY});
    }
    chatHandler() {
        this.chat.onInput();
    }
}