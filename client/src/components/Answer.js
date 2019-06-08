import React, { Component } from "react";
import Contract from "../cryptoQA.json";
import getWeb3 from "../utils/getWeb3";

import "../App.css";

class App extends Component {
  constructor() {
    super();
    this.state = { storageValue: 0, web3: null, accounts: null, contract: null,
        maker_address: '', questionId: null, item : null }
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
      setTimeout(() => {this.answerQuestion()}, 10000);
      await this.getInformation();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  comnponentWillMount = async() => {
    await this.answerQuestion();
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  getInformation = async() => {
    const { params } = this.props.match;
    const maker_address = params.address;
    const questionId = parseInt(params.id);
    this.setState({ maker_address, questionId })
  }

  answerQuestion = async() => {
    //   const { contract, accounts, questionId, answer} = this.state;
      this.setState({ item: {"q1": "名前は?", "q2": "何歳?"}})
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
        {/* {this.state.item.map((r, i) => (
            <div className="qa" key={i}>
                <p>{r.q1}</p>
                <textarea name="name" rows="8" cols="80"></textarea>
            </div>
        ))} */}
        <p>{console.log(this.state.item)}</p>
        </div>
        <div className="btn" > 
            <a href="#" className="btn-square">OK</a>
        </div>

      </div>
    );
  }
}

export default App;
