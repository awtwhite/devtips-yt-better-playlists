import React, {Component} from 'react';
import queryString from 'query-string';
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
      let parsed = queryString.parse(window.location.search)
      let accessToken = parsed.access_token

      fetch('https://api.spotify.com/v1/me', {
        headers: {'Authorization': 'Bearer ' + accessToken}
      }).then(response => response.json())
      .then(data => this.setState({
        user: {
          name: data.display_name
        }
      }))

      fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {'Authorization': 'Bearer ' + accessToken}
      }).then(response => response.json())
      .then(data => this.setState({
        playlists: data.items.map(item => ({
          name: item.name,
          songs: []
        }))
      }))
  }
  render() {
    let playlistsToRender =
      this.state.user &&
      this.state.playlists
      ? this.state.playlists.filter(playlist =>
        playlist.name.toLowerCase().includes(
          this.state.filterKeyword.toLowerCase()))
      : []

    return (
      <div className='App'>
        {this.state.user ?
          <div>
            <h1 style={defaultStyle}>
              {this.state.user.name}'s Playlist
            </h1>
            <PlaylistsCounter playlists={playlistsToRender}/>
            <HoursCounter playlists={playlistsToRender}/>
            <Filter onTextChange={text => this.setState({filterKeyword: text})}/>
            {playlistsToRender.map(playlist =>
              <Playlist playlist={playlist} />
            )}
          </div> : <button
            onClick={() => window.location='http://localhost:8888/login'}
            style={{padding: '20px', fontSize: '16px'}}>
          Log in with Spotify</button>
        }
      </div>
    );
  }
}

export default App;
