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
      task: "",
      important: true,
      contractor: "greg"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCheckBoxInputChange = this.handleCheckBoxInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleContractorChange = this.handleContractorChange.bind(this);
  }

  componentWillMount() {
    this.initializeWebSocketConnection();
  }

  handleChange(event) {
    this.setState({ task: event.target.value });
  }

  handleCheckBoxInputChange(event) {
    this.setState({ important: event.target.checked });
  }

  handleContractorChange(event) {
    this.setState({ contractor: event.target.value });
  }

  handleSubmit(event) {
    console.log(this.state);
    this.stompClient.send("/app/send/message", {}, JSON.stringify(this.state));
    event.preventDefault();
  }

  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect(
      {},
      function(frame) {
        that.stompClient.subscribe("/chat", message => {
          if (message.body) {
            console.log(message.body);
          }
        });
      }
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Admin</h1>
        </header>
        <p className="App-intro">
          <form onSubmit={this.handleSubmit}>
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
              <label>
                <span>Task</span>
                <input
                  type="text"
                  value={this.state.task}
                  onChange={this.handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                <span>Important</span>
                <input
                  type="checkbox"
                  checked={this.state.important}
                  onChange={this.handleCheckBoxInputChange}
                />
              </label>
            </div>
            <div>
              <button type="submit">Assign task</button>
            </div>
          </form>
        </p>
      </div>
    );
  }
}

export default App;
