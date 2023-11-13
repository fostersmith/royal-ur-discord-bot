const { ButtonBuilder } = require("discord.js");
const {EMPTY, P1, P2, ROLLING, MOVING} = require("./RoyalGameOfUr")

const setButtonState = (button, player, i, game) => {
    let state;
    if(i >= 0)
        state = game.valAt(player, i);
    else
        state = (game.player == player && game.gameState == MOVING && game.isValidMove(player, -1, game.moves)) ? player : EMPTY;

    if(state == EMPTY){
        button.setEmoji("▪️").setDisabled(true);
    } else if (state == P1){
        button.setEmoji("\u{1F315}");
    } else if (state == P2){
        button.setEmoji("\u{1F311}");
    }

    const show = game.gameState == MOVING && game.player == state && game.isValidMove(game.player, i, game.moves);

    if(show)
        button.setDisabled(false);
    else
        button.setDisabled(true);


}

module.exports = (game, rows) => {
    
    // set shared spaces
    for(let i = 0; i < 8; ++i){
        setButtonState(rows[i].components[1], P1, i+4, game);
    }
    // set player spaces
    for(let i = 0; i < 4; ++i){
        setButtonState(rows[3-i].components[0], P1, i, game);
        setButtonState(rows[3-i].components[2], P2, i, game);
    }
    for(let i = 12; i < 14; ++i){
        setButtonState(rows[19-i].components[0], P1, i, game);
        setButtonState(rows[19-i].components[2], P2, i, game);
    }

    if(game.piecesAvailable[0] > 0){
        setButtonState(rows[4].components[0], P1, -1, game);
    } else {
        setButtonState(rows[4].components[0], P1, -1, game);
    }
    if(game.piecesAvailable[1] > 0){
        setButtonState(rows[4].components[2], P2, -1, game);
    } else {
        setButtonState(rows[4].components[2], P2, -1, game);
    }

}