import React, {Component} from "react";
import './App.css'
import Navbar from "./Navbar";
import Web3  from   'web3';
import STether from '../truffle_abis/STether.json'

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
        const networkone = await web3.eth.net.getId()
        //console.log(networkone, 'network id')

        //Load STether contract
        const stetherData = STether.networks[networkone]
       

    }

    constructor(props){
        super(props)
        this.state = {
            account: '0x0',
            stether: {},
            rwd: {},
            decentralBanbk: {},
            stetherBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true

        }
    }

    render(){
        return (
            <div>
                <div>
                <Navbar account={this.state.account}/>
                </div>
                <div className='text-center'>
                    <h1>Hello, world</h1>
                </div>
            </div>
        )
    }
}

export default App;