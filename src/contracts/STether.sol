pragma solidity ^0.8.0;

contract STether{
    string public name = 'Mock STether Token';
    string public symbol = 'SGDT';
    uint256 private sgdtdenominaiton = 1000000000000000000000000; //equal to one sgd like wei in ether
    uint256 public totalSupply = 1 * sgdtdenominaiton; //so no need to provide many zeros
    uint8 public decimals = 18;

    //define events Transfer and Approval
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _individual, uint256 _value);

    // global variables with balanceof and allowance
    mapping(address => uint256) public balanceof;
    mapping (address => mapping(address => uint256)) public allowance;

    //constructor to assign total supply to sender
    constructor () public {
        balanceof[msg.sender] = totalSupply;
    }

    // transfer from owner to others
    function transfer(address _to, uint256 _value) public returns (bool success){
        require(balanceof[msg.sender] >= _value);
        balanceof[_to] += _value;
        balanceof[msg.sender] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    } 

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    //tranfer anyone to anyone with approval 
    function transferfrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(balanceof[_from] >= _value);
        require(allowance[_from][msg.sender] >= _value);
        
        balanceof[_to] += _value;
        balanceof[_from] -= _value;
        emit Transfer(_from, _to, _value);

        return true;
    }

}