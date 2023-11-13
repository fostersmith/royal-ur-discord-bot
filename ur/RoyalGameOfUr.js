const ROLLING = 0, MOVING = 1;
const P1 = 0, P2 = 1;
const EMPTY = 3;

const isRosette = loc => {
    return loc == 3 || loc == 7 || loc == 13;
}

const sharedSpace = piece => {
    return piece > 3 && piece < 12;
}

const otherPlayer = player => {
    return (player + 1) % 2;
}

class RoyalGameOfUr {
    p1Spaces;
    p2Spaces;
    sharedSpaces;

    points;
    piecesAvailable;

    dice;
    moves;

    player;
    gameState;

    constructor(){
        this.p1Spaces = Array(6).fill(EMPTY);
        this.p2Spaces = Array(6).fill(EMPTY);
        this.sharedSpaces = Array(8).fill(EMPTY);

        //this.sharedSpaces[0] = P1;

        this.points = [0, 0];
        this.piecesAvailable = [7, 7];
    
        this.dice = [0, 0, 0, 0];
        this.moves = 0;
    
        this.player = P1;
        this.gameState = ROLLING;    
    }

    roll(){
        this.moves = 0;
        for(let i = 0; i < 4; ++i){
            this.dice[i] = Math.floor(Math.random() * 2);
            //this.dice[i] = 1;
            this.moves += this.dice[i];
        }

        /*if(this.player == 0)
            if(this.sharedSpaces[3] == this.player)
                this.moves = 3;
            else
                this.moves = 4;*/

        this.gameState = MOVING;

        //this.moves = 0;

        if(this.moves == 0){
            this.player = otherPlayer(this.player);
            this.gameState = ROLLING;
            return "Rolled a 0";
        }

        let hasMove = false;
        for(let i = -1; i < 14 && !hasMove; ++i){
            hasMove = hasMove || this.isValidMove(this.player, i, this.moves);
        }
        if(!hasMove){
            this.player = otherPlayer(this.player);
            this.gameState = ROLLING;
        }

        return "";
    }

    move(piece){
        if(!this.isValidMove(this.player, piece, this.moves) || this.gameState != MOVING){
            console.error("Attempted illegal move!");
            return false;
        }

        const opp = otherPlayer(this.player);

        const dest = piece + this.moves;

        if(piece == -1){
            this.piecesAvailable[this.player] -= 1;
        } else {   
            this.setVal(this.player, piece, EMPTY);
        }

        if(dest != 14){
            if(this.valAt(this.player, dest) == opp){
                this.piecesAvailable[opp] += 1;
            }
            this.setVal(this.player, dest, this.player);
        } else {
            this.points[this.player] += 1;
        }
        if( !isRosette(dest) ) {
            this.player = otherPlayer(this.player);
        }

        this.gameState = ROLLING;
    }

    // Pass -1 if moving new piece
    isValidMove(player, piece, dist){
        if(! (player == P1 || player == P2) ){
            console.error("isValidMove called with invalid player value");
            return false;
        }

        if(piece != -1){
            if(this.valAt(player, piece) != player){ return false;}
        }else {
            if(this.piecesAvailable[player] == 0) return false;
        }

        const dest = piece + dist;
        if(dest < 0 || dest > 14) return false;
        if(dest == 14) return true;

        const val = this.valAt(this.player, dest);
        if(val == player) return false;
        if(val == otherPlayer(player) && isRosette(dest)) return false;

        //console.log("c");

        return true;
    }

    valAt(player, i){
        if(i < 0 || i > 13){ 
            console.error("valAt called with invalid i value: "+i);
            return EMPTY
        }
        if(! (player == P1 || player == P2) ){
            console.error("valAt called with invalid player value: "+player);
            return EMPTY
        }


        if( sharedSpace(i) ){
            return this.sharedSpaces[i-4];
        } else if ( i <= 3 ){
            if(player == P1) return this.p1Spaces[i];
            else return this.p2Spaces[i];
        } else {
            if(player == P1) return this.p1Spaces[i - 8];
            else return this.p2Spaces[i - 8];
        }
    }

    setVal(player, i, state){
        if(i < 0 || i > 13){ 
            console.error("setVal called with invalid i value: "+i);
            return false
        }
        if(! (state == EMPTY || state == P1 || state == P2) ){
            console.error("setVal called with invalid state value: "+state);
            return false
        }
        if(! (player == P1 || player == P2) ){
            console.error("setVal called with invalid player value: "+player);
            return false
        }

        if( sharedSpace(i) ){
            this.sharedSpaces[i-4] = state;
        } else if ( i <= 3 ){
            if(player == P1) this.p1Spaces[i] = state;
            else this.p2Spaces[i] = state;
        } else {
            if(player == P1) this.p1Spaces[i - 8] = state;
            else this.p2Spaces[i - 8] = state;
        }

        return true;
    }
}

module.exports = {RoyalGameOfUr, EMPTY, P1, P2, ROLLING, MOVING};