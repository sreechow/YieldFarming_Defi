const STether = artifacts.require('STether')
const RWD = artifacts.require('RWD')
const DecentralBank = artifacts.require('DecentralBank')

module.exports = async function(deployer, network, accounts) 
{
    await deployer.deploy(STether)
    const stether =await STether.deployed()

    await deployer.deploy(RWD)
    const rwd = await RWD.deployed()

    await deployer.deploy(DecentralBank, rwd.address, stether.address)
    const decentralbank = await DecentralBank.deployed()

    //Transfer all the RWD toekns to Decentral bank
    await rwd.transfer(decentralbank.address,   '1000000000000000000000000')

    //Distribute 100 STether tokens to investor
    await stether.transfer(accounts[1], '100000000000000000000') //accounts[1] represents 2nd account of setup
    
};