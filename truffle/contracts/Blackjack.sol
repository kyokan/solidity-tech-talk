pragma solidity ^0.4.0;

contract Poker {
    enum GameStatus { NotStarted, InProgress, GameWon, GameLost }
    struct GameState {
        uint[] cards;
        uint[] dealer;
        mapping (uint => bool) usedCards;
        GameStatus status;
    }

    address public gameMaster;
    mapping (address => GameState) games;

    function Poker() {
        gameMaster = msg.sender;
    }
  
    function rand(uint offset) private returns (uint){
        uint256 lastBlockNumber = block.number - block.timestamp % 100 - offset;
        uint256 hashVal = uint256(block.blockhash(lastBlockNumber));
        // This turns the input data into a 100-sided die
        // by dividing by ceil(2 ^ 256 / 100).
        uint256 FACTOR = 1157920892373161954235709850086879078532699846656405640394575840079131296399;
        
        return uint256(uint256(hashVal) / FACTOR) % 52 + 1;
    }
  
    function rng(uint offset) private returns (uint random) {
      GameState storage gs = games[msg.sender];
      uint number = rand(offset);
      
      if (gs.usedCards[number]) {
        return rng(offset + 1);
      }
      
      gs.usedCards[number] = true;
      return number;
    }

    function start() returns (bool success, uint[] cards, uint[] dealers) {
        GameState storage gs = games[msg.sender];
        
        if (gs.cards.length > 0 && gs.status == GameStatus.InProgress) {
            return (false, gs.cards, gs.dealer);
        }
        
        gs.cards = new uint[](0);
        gs.dealer = new uint[](0);
        gs.status = GameStatus.InProgress;
        
        for (uint i = 1; i<53; i++) {
            gs.usedCards[i] = false;
        }

        uint num1 = rng(1);
        uint num2 = rng(2);
        uint num3 = rng(3);
        uint num4 = rng(4);
    
        gs.cards.push(num1);
        gs.cards.push(num2);
        gs.dealer.push(num3);
        gs.dealer.push(num4);

        return (true, gs.cards, gs.dealer);
    }

    function getMyCards() constant returns (uint[] cards) {
        return games[msg.sender].cards;
    }
  
    function hit() returns (bool success, uint[] cards, uint[] dealer) {
        GameState storage gs = games[msg.sender];
        
        if (gs.status != GameStatus.InProgress) {
            return (false, gs.cards, gs.dealer);
        }

        uint num1 = rng(1);
        gs.cards.push(num1);
        
        if (sum(gs.cards) > 21) {
            gs.status = GameStatus.GameLost;
        }
        
        return (true, gs.cards, gs.dealer);
    }
  
    function sum(uint[] cards) returns (uint totalScore) {
        uint total = 0;
        for (uint i = 0; i < cards.length; i++) {
            uint card = cards[i] % 13 + 1;
            if (card > 10) {
                total = total + 10;
            } else {
                total = total + card;
            }
        }
        return total;
    }

    function getGameStatus() private returns (GameStatus gameStatus) {
        GameState storage gs = games[msg.sender];
        uint total = sum(gs.cards);
        uint dealerTotal = sum(gs.dealer);
        
        if (dealerTotal > 21) {
            return GameStatus.GameWon;
        }
        
        if (total > dealerTotal) {
            return GameStatus.GameWon;
        }
        
        return GameStatus.GameLost;
    }
    
    function dealerPlay() {
        GameState storage gs = games[msg.sender];
        uint total = sum(gs.dealer);
        
        if (total < 17) {
            uint num1 = rng(1);
            gs.dealer.push(num1);
            dealerPlay();
        }
    }
    
    function hold() returns (bool success, uint[] cards, uint[] dealer, GameStatus gameStatus, uint playerTotal, uint dealerTotal) {
        GameState storage gs = games[msg.sender];
        dealerPlay();
        GameStatus status = getGameStatus();
        gs.status = status;
        return (true, gs.cards, gs.dealer, status, sum(gs.cards), sum(gs.dealer));
    }
}
