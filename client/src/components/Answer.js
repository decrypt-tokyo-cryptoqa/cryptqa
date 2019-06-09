import React, { Component } from "react";
import Contract from "../cryptoQA.json";
import getWeb3 from "../utils/getWeb3";
import axios from 'axios';

import "../App.css";

const ROOT_ENDPOINT = 'http://3.217.5.142:3000';

class App extends Component {

  constructor() {
    super();
    this.state = { storageValue: 0, web3: null, accounts: null, contract: null,
        maker_address: '', questionId: null, items : [], qa_id: null}
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
      const data = await this.getInformation();
      await this.setState({ items: data })
      console.log(this.state.items);
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

  getInformation = async() => {
    const { params } = this.props.match;
    const ethereum_address = params.address;
    const qa_id = parseInt(params.id);
    this.setState({ qa_id: qa_id, maker_address: ethereum_address })
    const result = await axios({
        method: 'get',
        url: ROOT_ENDPOINT + `/answer/${ethereum_address}/${qa_id}`,
    });

    return result.data;
  }

  answerQuestion = async() => {
    const { contract, accounts, qa_id, items, maker_address} = this.state;
    const answers = [];
    for(var i = 0; i < items.length; i ++) {
        answers.push(this.state[`q${i + 1}`]);
    }

    const result = await contract.methods.answerQuestion(maker_address, qa_id, answers).send({
        from: accounts[0]
    });
  }

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
            <h2>質問内容に回答してください</h2>
            <h3>Please answer your question</h3>
        </div>
        <div>
        <ul>
        
                {this.state.items.map((item, i) => {
                    return <div className="quest" key={i}><p>{item}</p>
                      <textarea name="name" rows="8" cols="80" onChange={this.handleChange(`q${i + 1}`)}></textarea>
                    </div>
                })}
    
        </ul>
        </div>
        <div className="btn" onClick={this.answerQuestion}> 
            <i className="btn-square">送信</i>
        </div>
      </div>
    );
  }
}

export default App;
