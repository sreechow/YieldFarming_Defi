import React, {Component} from 'react'
import Web3 from 'web3';
import stether from '../tether.png'

class Main extends Component {
    render() {
        return (
         <div id='content' className='mt-3'>
            <table className='table text-muted text-center'>
                <thead>
                <tr style={{color:'black'}}>
                    <th scope='col'>Staking Balance</th>
                    <th scope='col'>Reward Balance</th>
                </tr>
                </thead>
                <tbody>
                    <tr style={{color:'black'}}>
                        <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} TSGD</td>
                        <td>{window.web3.utils.fromWei(this.props.rwdBalance, 'Ether')} RWD</td>
                    </tr>
                </tbody>
            </table>
            <div className='card mb-2' style={{opacity:'.9'}}>
                <form 
                onSubmit={(event) =>{
                    event.preventDefault()
                    let amount
                    amount = this.input.value.toString()
                    amount = window.web3.utils.toWei(amount, 'Ether')
                    this.props.stakeTokens(amount)
                }}
                className='mb-3'>
                    <div style={{borderSpacing:'0 1em'}}>
                        <label className='float-left' style={{marginLeft:'15px'}}>Stake Tokens</label>
                        <span className='float-right' style={{marginRight:'8px'}}>
                         Balance:  {window.web3.utils.fromWei(this.props.stetherBalance, 'Ether')}
                        </span>
                        <div className='input-group mb-4'>
                            <input ref={(x) => {this.input = x }} type='text'  placeholder='0' required />
                            <div className='input-group-open'>
                                <div className='input-group-text'>
                                    <img alt='stether' height='32' src={stether} />
                                    &nbsp;&nbsp;&nbsp; USDT
                                </div>
                            </div>
                        </div>
                        <button type='submit' className='btn btn-primary btn-lg btn-block' >DEPOSIT</button>
                    </div>
                </form>
                <button type='submit' onClick={(event) => {
                    event.preventDefault(
                        this.props.unstakeTokens()
                    )
                }}  className='btn btn-primary btn-lg btn-block'>WITHDRAW</button>
                <div className='card-body text-center' style={{color:'blue'}}>AIRDROOP</div>
            </div>
         </div>
        )
    }
}

export default Main;