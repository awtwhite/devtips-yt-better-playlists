import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

let defaultStyle = {
  color: '#fff'
};

let fakeServerData = {
  user: {
    name: 'Andrew',
    playlists: [
      {
        name: 'Favourites',
        songs: [
          { name: 'Starcity', duration: 200 },
          { name: 'Many plow' , duration: 200 },
          { name: 'Serpent sole', duration: 200 }
        ]
      }, {
        name: 'Discover weekly',
        songs: [
          { name: 'Hamony', duration: 200 },
          { name: 'Sandlewood', duration: 200 },
          { name: 'Tri state', duration: 200 }
        ]
      }, {
        name: 'Moto',
        songs: [
           { name: 'Floss nogo', duration: 200 },
           { name: 'Anywhoo', duration: 200 },
           { name: 'Bass sol', duration: 200 }
         ]
      }, {
        name: 'Gaming',
        songs: [
          { name: 'Good god', duration: 200 },
          { name: 'Kitty', duration: 200 },
          { name: 'Only once', duration: 200 }
        ]
      }
    ]
  }
}

class PlaylistsCounter extends Component {
  render() {
    return (<div style={{
        ...defaultStyle,
        display: 'inline-block'
    }}>
      <h2>
        {this.props.playlists.length} playlists
      </h2>
    </div>);
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((collective, eachPlaylist) => {
      return collective.concat(eachPlaylist.songs) }, [])

    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)

    return (
      <div style={{
        ...defaultStyle,
        display: 'inline-block'
      }}>
        <h2>{Math.round(totalDuration/60)} minutes</h2>
      </div>
    );

  }
}

class Filter extends Component {
  render() {
    return (<div className='app' style={defaultStyle}>
      <img/>
      <input type="text" onKeyUp={event =>
        this.props.onTextChange(event.target.value)}></input>
      Filter
    </div>);
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist;
    return (<div style={{
        ...defaultStyle,
        display: 'inline-block',
        width: "25%"
    }}>
      <img/>
      <h3>{playlist.name}</h3>
      <ul>
        {playlist.songs.map(song =>
          <li>{song.name}</li>
        )}
      </ul>
    </div>);
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = {
      serverData: {},
      filterKeyword: ''
    }
  }
  componentDidMount() {
    setTimeout(() => this.setState({serverData: fakeServerData}), 500)
  }
  render() {
    return (
      <div className='App'>
        {this.state.serverData.user ?
          <div>
            <h1 style={defaultStyle}>
              {this.state.serverData.user.name}'s Playlist
            </h1>
            <PlaylistsCounter playlists={this.state.serverData.user.playlists}/>
            <HoursCounter playlists={this.state.serverData.user.playlists}/>
            <Filter onTextChange={text => this.setState({filterKeyword: text})}/>
            {this.state.serverData.user.playlists.filter(playlist =>
              playlist.name.toLowerCase().includes(
                this.state.filterKeyword.toLowerCase()
              )
            ).map(playlist =>
              <Playlist playlist={playlist} />
            )}
          </div> : <h1 style={defaultStyle}>Loading you app...</h1>
        }
      </div>
    );
  }
}

export default App;
