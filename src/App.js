import React, { Component } from 'react';
import metamascara from 'metamascara';
import EthJs from 'ethjs';
import abi from 'ethereumjs-abi';
import abiDecoder from 'abi-decoder';
import './App.css';

const ethereumProvider = metamascara.createDefaultProvider();
const eth = new EthJs(ethereumProvider);

const contractAbi = [{"constant":false,"inputs":[],"name":"hold","outputs":[{"name":"success","type":"bool"},{"name":"cards","type":"uint256[]"},{"name":"dealer","type":"uint256[]"},{"name":"gameStatus","type":"uint8"},{"name":"playerTotal","type":"uint256"},{"name":"dealerTotal","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"cards","type":"uint256[]"}],"name":"sum","outputs":[{"name":"totalScore","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"hit","outputs":[{"name":"success","type":"bool"},{"name":"cards","type":"uint256[]"},{"name":"dealer","type":"uint256[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"query","outputs":[{"name":"success","type":"bool"},{"name":"cards","type":"uint256[]"},{"name":"dealer","type":"uint256[]"},{"name":"gameStatus","type":"uint8"},{"name":"playerTotal","type":"uint256"},{"name":"dealerTotal","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"gameMaster","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"start","outputs":[{"name":"success","type":"bool"},{"name":"cards","type":"uint256[]"},{"name":"dealers","type":"uint256[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"dealerPlay","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
const contract = eth.contract(contractAbi).at('0xd7caD200E6cB8b1EAb75302c88e5376dE8fb6c0c');
abiDecoder.addABI(contractAbi);

console.log({ contract, abi, abiDecoder })

class App extends Component {

  constructor(props) {
    super(props);
    this.pullGameStatus = this.pullGameStatus.bind(this);
  }

  state = {
    isFetching: false,
  };

  async componentWillMount() {
    this.pullGameStatus();
    setInterval(this.pullGameStatus, 5000);
  }

  async pullGameStatus () {
    this.setState({ isFetching: true });
    const [account] = await eth.accounts();
    const game = await contract.query({ from: account });
    const { words = []} = game || {};
    const [status] = words;

    this.setState({
      cards: game.cards,
      dealer: game.dealer,
      dealerTotal: game.dealerTotal,
      gameStatus: game.gameStatus,
      playerTotal: game.playerTotal,
      isFetching: false,
    });
  }

  getCard(bn) {
    const {words = []} = bn || {};
    const value = words[0] % 13 + 1;

    return {
      value: value <= 10
        ? value
        : {11: 'J', 12: 'Q', 13: 'K'}[value],
      point: value > 10
        ? 10
        : value,
    }
  }

  renderStartGame() {
    return (
      <div>
        <button
          onClick={async e => {
            this.setState({ isFetching: true });
            e.persist();

            const [account] = await eth.accounts();

            contract.start({ from: account })

            window.dispatchEvent(e.nativeEvent);
          }}
        >
          Start Game
        </button>
      </div>
    );
  }

  renderDealers() {
    const {
      dealer = [],
      gameStatus,
    } = this.state;
    const status = gameStatus && gameStatus.words[0];

    return (
      <div style={{
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          fontSize: '1.4em',
          color: 'white',
          padding: '8px',
        }}>Dealer</div>
        <div style={{
          display: 'flex',
          flexFlow: 'row nowrap',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {dealer.map((card, i) => (
            <div key={i} style={{
              fontSize: '2.4em',
              color: 'black',
              padding: '1.5em 1em',
              backgroundColor: 'white',
              border: '2px solid rgba(0, 0, 0, 0.3)',
              borderRadius: '3px',
              display: 'inline-block',
              lineHeight: '2.4rem',
              width: '40px',
              height: '2.4rem',
              marginRight: '4px',
              background: !i || status > 1
                ? 'white'
                : 'repeating-linear-gradient(45deg, #2b2b2b 0%, #2b2b2b 10%, #222222 0%, #222222 50%) 0 / 15px 15px'
            }}>
              {!i || status > 1 ? this.getCard(card).value : ' '}
            </div>
          ))}
        </div>
      </div>
    )
  }

  renderPlayers() {
    const {
      cards = [],
    } = this.state;


    return (
      <div style={{
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '12px',
      }}>
        <div style={{
          fontSize: '1.4em',
          color: 'white',
          padding: '8px',
        }}>Player</div>
        <div style={{
          display: 'flex',
          flexFlow: 'row nowrap',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {cards.map((card, i) => (
            <div key={i} style={{
              fontSize: '2.4em',
              color: 'black',
              padding: '1.5em 1em',
              backgroundColor: 'white',
              border: '2px solid rgba(0, 0, 0, 0.3)',
              borderRadius: '3px',
              display: 'inline-block',
              lineHeight: '2.4rem',
              width: '40px',
              height: '2.4rem',
              marginRight: '4px',
            }}>
              {this.getCard(card).value}
            </div>
          ))}
        </div>
      </div>
    )
  }

  renderGame() {
    return (
      <div>
        {this.renderDealers()}
        <div style={{ margin: '12px 0'}}>
          <button
            onClick={async e => {
              this.setState({ isFetching: true });
              e.persist();

              const [account] = await eth.accounts();

              contract
                .hit({ from: account })

              window.dispatchEvent(e.nativeEvent);
            }}
          >
            Hit
          </button>
          <button
            onClick={async e => {
              this.setState({ isFetching: true });
              e.persist();

              const [account] = await eth.accounts();

              contract
                .hold({ from: account })

              window.dispatchEvent(e.nativeEvent);
            }}
          >
            Hold
          </button>
        </div>
        {this.renderPlayers()}
      </div>
    );
  }

  render() {
    const { gameStatus, isFetching } = this.state;
    const { words = []} = gameStatus || {};
    const [status] = words;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Blackjack</h1>
        </header>
        <div className="App-intro">
          {isFetching && (
            <div style={{
              'display': 'inline-flex',
              'flex-flow': 'column nowrap',
              'background-color': 'rgba(0, 0, 0, 0.7)',
              'color': 'white',
              'position': 'fixed',
              'top': '0',
              'bottom': '0',
              'margin': 'auto',
              'left': '0',
              'right': '0',
              'align-items': 'center',
              'justify-content': 'center',
            }}>
              Loading...
            </div>
          )}
          {status === 0 ? this.renderStartGame() : this.renderGame()}
          {status > 1 && !isFetching && (
            <div style={{
              'display': 'inline-flex',
              'flex-flow': 'column nowrap',
              'background-color': 'rgba(0, 0, 0, 0.7)',
              'color': 'white',
              'position': 'fixed',
              'top': '0',
              'bottom': '0',
              'margin': 'auto',
              'left': '0',
              'right': '0',
              'align-items': 'center',
              'justify-content': 'center',
            }}>
              {status === 2 && 'You Win!'}
              {status === 3 && 'You Lost!'}
              <button
                onClick={async e => {
                  this.setState({ isFetching: true });

                  e.persist();

                  const [account] = await eth.accounts();

                  contract.start({ from: account })

                  window.dispatchEvent(e.nativeEvent);
                }}
              >
                Start Game
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;

