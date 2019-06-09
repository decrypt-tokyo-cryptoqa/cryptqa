import React, { Component } from "react";
import Contract from "../cryptoQA.json";
import getWeb3 from "../utils/getWeb3";
import axios from 'axios';
import "../App.css";

const ROOT_ENDPOINT = 'http://3.217.5.142:3000';

class List extends Component {
  constructor() {
    super();
    this.state = { storageValue: 0, web3: null, accounts: null, contract: null, items: ["1", "2", "3"],
            answers: [], questions: [1, 2, 3], qa_id: null, id: null, sample: []};
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
      await this.getNumberOfQuestions();
      if(this.state.id !== null) {
          await this.getAnswers();
          await this.getItems();
          console.log(this.state.answers);
      }
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

  getItems = async() => {
    const { accounts, id } = this.state;
    const result = await axios({
        method: 'get',
        url: ROOT_ENDPOINT + `/answer/${accounts[0]}/${id}`,
    });
    return result.data;
  }

  getNumberOfQuestions = async() => {
      const { contract, accounts } = this.state;
      const questionsArray = [];
      const numberOfQuestions = await contract.methods.viewNumberOfQuestions(accounts[0]).call();
      for(var i = 0; i < numberOfQuestions; i++) {
          questionsArray.push(i + 1);
      }
      this.setState({ questions: questionsArray });
  }

  getAnswers = async() => {
      const { contract, accounts, id, answers } = this.state;
      const numberOfAnswers = await contract.methods.viewNumberOfAnswers(accounts[0], id).call();
      for(var i = 0; i < numberOfAnswers; i++) {
          const result = await contract.methods.viewQuestionToAnswer(accounts[0], id, i + 1).call();
          this.setState({ answers: answers.push(result)});
      }
  }

  test = () => {
      const items = ["何歳？", "何万？", "何億？"];
      const answers = [["a", "b", "c"], ["d", "e", "f"], ["g", "h", "i"]];
      const array = [];
      items.map((r, i) => {
          console.log(r);
          array.push([answers[i][0]]);
      })
      console.log(array);
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
        <div className="main"> 
        {(() => {
          if(this.state.questions.length !== 0) {
              return <form>
              <p>どのアンケートを選ぶ？</p>
              <select name="id" onChange={this.handleChange('id')}>
              {this.state.questions.map((r, i) => {
                return <option value={r} key={i}>{r}</option>
              })}
             </select>
             </form>
          } else {
              return <p></p>
          }
        })()}
        {/* {this.state.sample.map((r, i) => {
            return <div><p key={i}>{this.state.sample[i][0]}</p>
            <p key={i}>{this.state.sample[i][1]}</p>
            <p key={i}>{this.state.sample[i][2]}</p></div>
        })} */}
        <button onClick={this.test}>押してね</button>
        </div>
      </div>
    );
  }
}

export default List;
