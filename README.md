# Solidity - Blackjack Contract

## Deploy Contract
- Go to Remix
- Copy and Paste `./truffle/contracts/Blackjack.sol` to IDE
- Go to Run
- Make sure environment is `Injected Web3` (you need metamask)
- Click `Create`
- Accept transaction

## Test Blackjack App
- `npm start`
- In `./src/App.js`, replace the address in line 12 with the address of the contract you just deployed
- You need to disable `metamask` extension and make sure your account is ready in `zero.metamask.io`
- Try playing. You need to manual wait and refresh after transaction is confirmed 

## Useful Links
[Truffle Documentation](http://truffleframework.com/docs/)
[Remix - Cloud-based Solidity IDE](https://remix.ethereum.org)
[EthJS - Utility for Ethereum based on web3.js](https://github.com/ethjs/ethjs)
[Solidity - Tutorials](https://ethereumbuilders.gitbooks.io/guide/content/en/solidity_tutorials.html)
[Solidity - Documentation](https://solidity.readthedocs.io/en/develop/)
[Metamascara - iframe proxy between dapp and metamask](https://github.com/MetaMask/mascara)
