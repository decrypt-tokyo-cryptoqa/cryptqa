import React, { Component } from "react";
import Contract from "./cryptoQA.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = { storageValue: 0, web3: null, accounts: null, contract: null };
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Contract.networks[networkId];
      const instance = new web3.eth.Contract(
        Contract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <header>
          <h1>Crypto QA</h1>
        </header>
        <div className="ask">
        <h2>質問内容を入力して下さい</h2>
        <h3>Please enter your question</h3>
        </div>
       <div className="quest"> 
         <textarea name="name" rows="8" cols="80" onChange={this.handleChange('q1')}></textarea>
         </div>
       <div className="quest"> 
         <textarea name="name" rows="8" cols="80" onChange={this.handleChange('q2')}></textarea>
       </div>
       <div className="quest"> 
         <textarea name="name" rows="8" cols="80" onChange={this.handleChange('q3')}></textarea>
       </div>

       <div className="add"> 
         <i className="far fa-plus-square"></i>
       </div>

       <div className="btn"> 
         <a href="#" className="btn-square">OK</a>
       </div>
      </div>
    );
  }
}

export default App;
