import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

let defaultColor = '#fff';
let defaultStyle = {
    color: defaultColor
};
let otherStyle = {
    background: 'tomato'
};

class Aggregate extends Component {
  render() {
    return (
      <div style={{
          ...defaultStyle,
          display: 'inline-block'
      }}>
          <h2>Number text</h2>
      </div>
    );
  }
}

class Filter extends Component {
render() {
  return (
     <div style={defaultStyle}>
         <img />
         <input type="text"></input>
         Filter
     </div>
    );
  }
}

class Playlist extends Component {
    render() {
        return (
           <div style={{
               ...defaultStyle,
               display: 'inline-block',
               width: "25%"
           }}>
                <img />
                <h3>Playlist name</h3>
                <ul>
                    <li>Song name 1</li>
                    <li>Song name 2</li>
                    <li>Song name 3</li>
                </ul>
            </div>
        );
    }
}

class App extends Component {
  render() {
    return (
      <div className="App">
          <h1>Better Playlist</h1>
          <Aggregate />
          <Aggregate />
          <Filter />
          <Playlist />
          <Playlist />
          <Playlist />
          <Playlist />
      </div>
    );
  }
}

export default App;
