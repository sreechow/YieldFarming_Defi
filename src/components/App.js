import React, {Component} from "react";
import './App.css'
import Navbar from "./Navbar";
import Web3  from   'web3';
import STether from '../truffle_abis/STether.json'
import RWD from '../truffle_abis/RWD.json'
import DecentralBank from '../truffle_abis/DecentralBank.json'
import Main from './Main.js'

class App extends Component {

    //connecte with ethereum before rendering the page
    async UNSAFE_componentWillMount(){
        await this.loadweb3()
        await this.loadBlockchainData()
    }

    // Loading Metamask into the web applicaiton
    async loadweb3(){
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if(window.web3){
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else{
            window.alert('No ethereum browser detected, please check Metamask')
        }
    }

    async loadBlockchainData(){
        const web3 = window.web3
        const act = await web3.eth.getAccounts()
        this.setState({account: act[0]})
        //console.log(act[0])
        const networkId = await web3.eth.net.getId()
        //console.log(networkId, 'network id')

        //Load STether contract
        const stetherData = STether.networks[networkId]

        if(stetherData){
            //console.log(stetherData)
            const stether =new web3.eth.Contract(STether.abi, stetherData.address) //contracts never change hence defined as const
            this.setState({stether})
            let stetherBalance = await stether.methods.balanceof(this.state.account).call() //web3 syntax to call methods of contracts

            this.setState({stetherBalance:stetherBalance.toString()})
            //console.log({balance:stetherBalance})
        } 
        else{
            window.alert('Error! STether contract not deployed - no network network')
        }
       
        //load RWD 
        const rwdData = RWD.networks[networkId]
        //console.log(rwdData)
        if(rwdData){
            const rwd = new web3.eth.Contract(RWD.abi, rwdData.address)
            this.setState({rwd:rwd})
            let rwdBalance = await rwd.methods.balanceof(this.state.account).call() //to get RWD balance of which user??
            this.setState({rwdBalance:rwdBalance.toString()})
            //console.log({rwdBalance:rwdBalance})

        }
        else{
            window.alert('Error! RWD contract not deployed - no network network')
        }

        //load Decentral Bank
        const decentralBankData = DecentralBank.networks[networkId]
        //console.log(decentralBankData)
        if(decentralBankData){
            const decentrabank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)
            this.setState({decentralBank:decentrabank})
            let stakingBalance = await decentrabank.methods.stakingBanlance(this.state.account).call()
            this.setState({stakingBalance:stakingBalance.toString()})
            console.log({stakingBalance:stakingBalance})
        }
        else{
            window.alert('Error! DecentralBank contract not deployed - no network network')
        }
        this.setState({loading: false})
    }

    //Staking tokens

    stakeTokens = (amount) => {
        this.setState({loading: true})
        this.state.stether.methods.approve(this.state.decentralBank._address, amount).send({from:this.state.account}).on('transactionHash', (hash) => {
        this.state.decentralBank.methods.depositTokens(amount).send({from:this.state.account}).on('transactionHash', (hash) => {
            this.setState({loading: false})
        }) // 
        })
    }

    //Unstaking tokens
    unstakeTokens = (amount) => {
        this.setState({loading: true})
        this.state.decentralBank.methods.unstakeTokens().send({from:this.state.account}).on('transactionHash', (hash) => {
            this.setState({loading: false})
        }) // 
    
    }

    constructor(props){
        super(props)
        this.state = {
            account: '0x0',
            stether: {},
            rwd: {},
            decentralBank: {},
            stetherBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true

        }
    }

    render(){
        let content 
        {this.state.loading ? content =
        <p id='loader' className='text-center' style={{margin:'30px'}}>
            Loading plz..</p>: content=
             <Main 
              stetherBalance = {this.state.stetherBalance}
              rwdBalance = {this.state.rwdBalance}
              stakingBalance = {this.state.stakingBalance}
              stakeTokens = {this.stakeTokens}
              unstakeTokens = {this.unstakeTokens}
             />}
        return (
            <div>
                <div>
                <Navbar account={this.state.account}/>
                </div>
                <div className='container-fluid mt-5'>
                    <div>
                        <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth: '600px', minHeight:'100vm'}}>
                            <div>
                                {content}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;