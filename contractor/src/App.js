import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as Stomp from "stompjs";
import * as SockJS from "sockjs-client";

class App extends Component {
  serverUrl = "http://localhost:8888/socket";

  constructor() {
    super();
    this.state = {
      contractor: "mark",
      tasks: {}
    };

    this.handleContractorChange = this.handleContractorChange.bind(this);
  }

  componentWillMount() {
    this.initializeWebSocketConnection();
  }

  handleContractorChange(event) {
    this.setState({ contractor: event.target.value, tasks: {} });
  }

  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let self = this;
    this.stompClient.connect(
      {},
      function(frame) {
        self.stompClient.subscribe("/chat", message => {
          if (message.body) {
            let t = JSON.parse(message.body);
            if (self.state.contractor == t.contractor) {
              t.important ? alert(`Important task: ${t.task}`) : null;
              let obj = {};
              obj[t.timestamp] = t;
              self.setState({ tasks: { ...self.state.tasks, ...obj } });
              console.log(Object.values(self.state.tasks));
            }
          }
        });
      }
    );
  }

  render() {
    let contractorTasks = Object.values(this.state.tasks).map((t, i) => (
      <li key={i} className={( t.important ? 'important': '')}>{t.task}</li>
    ));
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Contractor</h1>
        </header>
        <p className="App-intro">
          <div>
            <label>
              <span>Contractors</span>
              <select
                value={this.state.contractor}
                onChange={this.handleContractorChange}
              >
                <option value="mark">Mark</option>
                <option value="zach">Zach</option>
                <option value="greg">Greg</option>
                <option value="andy">Andy</option>
              </select>
            </label>
          </div>
          <div>
            <ul>{contractorTasks}</ul>
          </div>
        </p>
      </div>
    );
  }
}

export default App;
