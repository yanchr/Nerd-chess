# NerdChess Engine

A Chess Engine (mostly) for validating moves when playing mind-chess.

## TODO's
### Gamemechanics
- Update CastlingAbility when either a Rook or a King is moved
- Add functionality to every piece so it can compute the squares where it could goto or take
- Store all these squares in a board
- Use this board when a King moves to see if he would be in check
- Check if a piece is pinned to its King before it moves by getting the pieces array of the enemy pieces which put the square of this piece in check, then recompute the board without the piece and see if the king would be in check.
### Graphical/Sound
- Cleanup textureloader
- add Sounds
### Chat
- Make the game controllable from the chat