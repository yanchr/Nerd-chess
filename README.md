# NerdChess Engine

A Chess Engine (mostly) for validating moves when playing mind-chess.

## TODO's
### Gamemechanics
- [x] Update CastlingAbility when either a Rook or a King is moved
- [x] Include castling mechanics
- [x] Add functionality to every piece so it can compute the squares where it could goto or take
- [x] Store all these squares in a board
- [x] Use this board when a King moves to see if he would be in check including during castlings
- [x] Check if a piece is pinned to its King before it moves by getting the pieces array of the enemy pieces which put the square of this piece in check, then recompute the board without the piece and see if the king would be in check.
- [ ] After a move, check wheter or not the opposing King is in check and if so if he has any moves to get out, otherwise -> Checkmate
### Graphical/Sound
- [ ] Cleanup textureloader
- [ ] add Sounds
### Chat
- [ ] Make the game controllable from the chat
