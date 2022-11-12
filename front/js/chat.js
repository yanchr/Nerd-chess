class Chat {
    constructor() {
        this.ui = {
            ref_chatContainer: document.getElementById("chat-container"),
            ref_input: document.getElementById("chat-input"),
        }
    }
    onInput() {
        // would in the future maybe validate input and then send it as e.g. 'e4' or 'Nc3' to game.board.chatInput(location)
        // maybe its also better if the chat class only handles ui and input and Board class does validation idk
        game.board.chatInput(this.ui.ref_input.value)
    }
}