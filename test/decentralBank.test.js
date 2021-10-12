//implementing test frameworks

const { assert } = require('chai')

const STether = artifacts.require('STether')
const RWD = artifacts.require('RWD')
const DecentralBank = artifacts.require('DecentralBank')

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', ([owner, customer]) => {
 let stether, rwd, decentralbank
  
 function tokens(number) {
     return web3.utils.toWei(number, 'ether')
     
 }

 before(async ()=> {
    stether = await STether.new()
    rwd = await RWD.new()
    decentralbank = await DecentralBank.new(rwd.address, stether.address)

    //Transfer all tokens to Decentral Bank
    await rwd.transfer(decentralbank.address, tokens('1000000'))

    //Trasnfer 100 mock STethers to customer
    await stether.transfer(customer, tokens('100'), {from: owner})
 })
 
 describe('Mock STether Deploymnet', async () => {
     it('matches name successfully', async() =>
     {
        const name =await stether.name()
        assert.equal(name, 'Mock STether Token')
     })
 })

 describe('Reward Token Deployment', async () => {
     it('matches name successfully', async() =>{
        const name =await rwd.name()
        assert.equal(name, 'Reward Token')
     })
 })

 describe('Decentral Bank Deployment', async () => {
    it('matches name successfully', async() =>{
       const name =await decentralbank.name()
       assert.equal(name, 'Decentral Bank')
    })

    it('contracts has tokens', async() =>{
        let balance = await rwd.balanceof(decentralbank.address)
        assert.equal(balance, tokens('1000000'))

    })
 })

 describe('Staking', async() => {
    it('rewards tokens for staking', async() =>{

        //check investor balance
        let result = await stether.balanceof(customer)
        assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance before 100 staking')
       
        // check staking for customer
        await stether.approve(decentralbank.address, tokens('100'), {from:customer})
        await decentralbank.depositTokens(tokens('100'), {from:customer})


        //check updated balance of customer
        result = await stether.balanceof(customer)
        assert.equal(result.toString(), tokens('0'), 'customer bank mock wallet balance after staking 100 ')

        //check the updated balance of bank
        result = await stether.balanceof(decentralbank.address)
        assert.equal(result.toString(), tokens('100'), 'decentral bank mock wallet balance ')

        //is staking balance
        result = await decentralbank.isStaking(customer)
        assert.equal(result.toString(), 'true', 'Customer is staking status after staking')

        //issues tokens
        await decentralbank.issueTokens({from:owner})

        //Ensure only the owner can issue tokens
        await decentralbank.issueTokens({from:customer}).should.be.rejected;

        //unstake tokens
        await decentralbank.unstakeTokens({from:customer})

        //check customer balance after unstake
        
        //check updated balance of customer
        result = await stether.balanceof(customer)
        assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance after un-stake of 100 ') //this test is trickey if customer have already have  balance

        //check the updated balance of bank
        result = await stether.balanceof(decentralbank.address)
        assert.equal(result.toString(), tokens('0'), 'decentral bank mock wallet balance after un-stake ') //this test is trickey when there are multiple inversrs as it's bank total amount

        //is staking balance
        result = await decentralbank.isStaking(customer)
        assert.equal(result.toString(), 'false', 'Customer staking status after un -stake')

    })
    
  })

})

