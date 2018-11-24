import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

let defaultStyle = {
  color: '#fff'
};
let otherStyle = {
  background: 'tomato'
};
let fakeServerData = {
  user: {
    name: 'Andrew',
    playlists: [
      {
        name: 'Favourites',
        songs: ['Starcity', 'Many plow', 'Serpent sole']
      }, {
        name: 'Discover weekly',
        songs: ['Hamony', 'Sandlewood', 'Tri state']
      }, {
        name: 'Moto',
        songs: ['Floss nogo', 'Anywhoo', 'Bass sol']
      }, {
        name: 'Gaming',
        songs: ['Good god', 'Kitty', 'Only once']
      }
    ]
  }
}

class Aggregate extends Component {
  render() {
    return (<div style={{
        ...defaultStyle,
        display: 'inline-block'
    }}>
      <h2>
        {this.props.playlists && this.props.playlists.length} text
      </h2>
    </div>);
  }
}

class Filter extends Component {
  render() {
    return (<div className='app' style={defaultStyle}>
      <img/>
      <input type="text"></input>
      Filter
    </div>);
  }
}

class Playlist extends Component {
  render() {
    return (<div style={{
        ...defaultStyle,
        display: 'inline-block',
        width: "25%"
      }}>
      <img/>
      <h3>Playlist name</h3>
      <ul>
        <li>Song name 1</li>
        <li>Song name 2</li>
        <li>Song name 3</li>
      </ul>
    </div>);
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = {serverData: {}}
  }
  componentDidMount() {
    this.setState({serverData: fakeServerData})
  }
  render() {
    return (<div className='App'>
      <h1>
        {this.state.serverData.user &&
        this.state.serverData.user.name}'s Playlist
      </h1>
      <Aggregate
        playlists={
          this.state.serverData.user &&
          this.state.serverData.user.playlists
        }
      />
      <Aggregate/>
      <Filter/>
      <Playlist/>
      <Playlist/>
      <Playlist/>
      <Playlist/>
    </div>);
  }
}

export default App;
