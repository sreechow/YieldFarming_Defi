pragma solidity ^0.8.0;
import './RWD.sol';
import './STether.sol';

contract DecentralBank {
    string public name = 'Decentral Bank';
    address public owner;
    STether public stether;
    RWD public rwd;
    
    address[] public stakers;

    mapping(address => uint256) public stakingBanlance;
    mapping (address => bool) public hasStaked;
    mapping (address => bool) public isStaking;

    constructor(RWD _rwd, STether _stether) public {
        rwd = _rwd;
        stether = _stether;
        owner = msg.sender;
    }

    //staking function, depositting tokesn to bank contract 
    function depositTokens(uint256 _amount) public {

        //reqire staking amout should be more than zero
        require(_amount > 0, 'amount cannot be 0');
        //tranfer STether tokens to this contract address for staking
        stether.transferfrom(msg.sender, address(this), _amount);

        //update staking balance in the bank
        stakingBanlance[msg.sender] += _amount;

        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        //update staking details
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    //unstake tokens
    function unstakeTokens() public {
        uint balance = stakingBanlance[msg.sender];
        require(balance > 0, 'staking balance shold be more than zero');

        //transfer the tokens to the specified contract address from our bank
        stether.transfer(msg.sender, balance);

        //reset staking balance
        stakingBanlance[msg.sender] = 0;

        //update staking status
        isStaking[msg.sender] = false;
    }

    //issue rewards
    function issueTokens() public {
        require(msg.sender == owner, 'the caller must be the owner');
        for (uint i=0; i<stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBanlance[recipient] /9 ; // reward 1/9 of tokens of the amout. Note,  rewards are given based on staking amount and may not be one-to-one  
            if(balance > 0) {
                rwd.transfer(recipient, balance);
            }
        }

    }
}