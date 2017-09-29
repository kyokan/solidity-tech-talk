pragma solidity ^0.4.0;

contract MintableCoin {
    string public constant symbol = "KY";
    string public constant name = "Kyo-Yen";
    uint8 public constant decimals = 4;
    uint256 _totalSupply = 9999990000;
    address public minter;

    mapping (address => uint) balances;
    mapping (address => mapping (address => uint256)) allowed;
    
        // Triggered when tokens are transferred.
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    // Triggered whenever approve(address _spender, uint256 _value) is called.
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    function MintableCoin() {
        minter = msg.sender;
        balances[minter] = _totalSupply;
    }

    function mint(address owner, uint amount) {
        if (msg.sender != minter) return;
        balances[owner] += amount;
        _totalSupply += amount;
    }
    
    function totalSupply() constant returns (uint256 supply) {
        return _totalSupply;
    }

    function transfer(address receiver, uint amount) returns (bool success) {
        if (balances[msg.sender] < amount) {
            return false;
        } else {
            balances[msg.sender] -= amount;
            balances[receiver] += amount;
            Transfer(msg.sender, receiver, amount);
            return true;
        }
    }

    function transferMulitples(address[] addresses, uint[] amounts) returns (bool success) {
        if (addresses.length != amounts.length) {
            return false;
        }
        
        if (balances[msg.sender] < sum(amounts)) {
            return false;
        }

        for (uint i = 0; i < addresses.length; i++) {
            transfer(addresses[i], amounts[i]);
        }
        return true;
    }
    
    function transferFrom(
      address _from,
      address _to,
      uint256 _amount
    ) returns (bool success) {
      if (balances[_from] >= _amount
        && allowed[_from][msg.sender] >= _amount
        && _amount > 0
        && balances[_to] + _amount > balances[_to]) {
        balances[_from] -= _amount;
        allowed[_from][msg.sender] -= _amount;
        balances[_to] += _amount;
        Transfer(_from, _to, _amount);
        return true;
      } else {
        return false;
      }
    }

    function balanceOf(address addr) constant returns (uint balance) {
        return balances[addr];
    }
    
    // Allow _spender to withdraw from your account, multiple times, up to the _value amount.
    // If this function is called again it overwrites the current allowance with _value.
    function approve(address _spender, uint256 _amount) returns (bool success) {
        allowed[msg.sender][_spender] = _amount;
        Approval(msg.sender, _spender, _amount);
        return true;
    }
    
    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
}