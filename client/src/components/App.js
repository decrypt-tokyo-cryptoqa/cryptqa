import React, { Component } from "react";
import Contract from "../cryptoQA.json";
import getWeb3 from "../utils/getWeb3";
import axios from 'axios';

import "../App.css";

const ROOT_ENDPOINT = 'http://3.217.5.142:3000'

class App extends Component {
  constructor() {
    super();
    this.state = { storageValue: 0, web3: null, accounts: null, contract: null, items: ["1", "2", "3"],
            answers: [], latest_qa_id: null};
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

  addTextarea = async() => {
    const { items } = this.state;
    const number = items.length + 1;
    items.push(`${number}`)
    this.setState({ items });
  }

  getLatestId = async() => {
    const { accounts } = this.state;
    const result = await axios({
      method: 'get',
      url: ROOT_ENDPOINT + `/query/${accounts[0]}`,
    });
    this.setState({ latest_qa_id: result.data.qa_id })
  }

  postData = async() => {
    const { web3, accounts, answers, items} = this.state;
    for(var i = 0; i < items.length; i ++) {
      answers.push(this.state[`${i + 1}`]);
    }

    await this.getLatestId();
    const questionId = parseInt(this.state.latest_qa_id) + 1;
    const qa_url = 'http://localhost:3000/answer' + `/${accounts[0]}/${questionId}`;

    const data =  {
      qa_id: questionId,
      qa_url: qa_url,
      ethereum_address: accounts[0],
      qa: this.state.answers
    }
    
    const result = await axios({
      method: 'post',
      url: ROOT_ENDPOINT + '/create/',
      data: data
    })

    console.log(result);

    if(result.statusText === 'OK') {
      alert(qa_url);
    } else {
      alert('送信に失敗しました');
    }
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
        <h2>質問内容を入力して下さい</h2>
        <h3>Please enter your question</h3>
        </div>

       <ul>
          {this.state.items.map( (item, i) => {
            return <div className="quest" key={i}><textarea name="name" rows="8" cols="80" onChange={this.handleChange(`${item}`)}></textarea></div>
          })}
        </ul>
       <div className="add" onClick={this.addTextarea}> 
         <i className="far fa-plus-square"></i>
       </div>
       <div className="btn" onClick={this.postData}> 
         <i className="btn-square">OK</i>
       </div>
      </div>
    );
  }
}

export default App;
