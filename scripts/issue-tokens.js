const DBank = artifacts.require('DecentralBank');

module.exports = async function issueRewards(callback) {
    let dencentralBank =await DBank.deployed()
    await dencentralBank.issueTokens() 
    console.log('Tokens have been issued successfully')
    callback()
}