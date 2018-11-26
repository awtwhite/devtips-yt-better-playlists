import React, {Component} from 'react';
import queryString from 'query-string';
import 'normalize.css/normalize.css';
import './App.css';

let defaultLabel = {
  color: '#fff',
  fontSize: '16px'
}

let defualtInlineLabel = {
  display: 'inline-block',
  padding: '0 10px'
}

let defaultInput = {
  display: 'inline-block',
  padding: '10px 20px',
  width: '100%',
  maxWidth: '460px',
  fontSize: '16px'
}

let removeListSTyles = {
  margin: 0,
  paddingLeft: 0,
  listStyle: 'none'
}

class PlaylistsCounter extends Component {
  render() {
    let noPlaylistsFound = this.props.playlists.length === 0
    let playlistsCounterStyle = {
      ...defaultLabel,
      ...defualtInlineLabel,
        opacity: noPlaylistsFound ? '0.3' : '1'
    }

    return (<div style={playlistsCounterStyle}>
      <h2>
        {this.props.playlists.length} playlists
      </h2>
    </div>);
  }
}

class DurationCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((collective, eachPlaylist) => {
      return collective.concat(eachPlaylist.songs) }, [])

    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)

    let totalDurationInMinutes = Math.round(totalDuration/60)

    let noDuration = totalDurationInMinutes === 0
    let hoursCounterStyle = {
      ...defaultLabel,
      ...defualtInlineLabel,
        opacity: noDuration ? '0.3' : '1'
    }

    return (
      <div style={hoursCounterStyle}>
        <h2>{totalDurationInMinutes} minutes</h2>
      </div>
    );

  }
}

class Filter extends Component {
  render() {
    return (<div className='app' style={{
      marginBottom: '1em'
    }}>
      <input placeholder="Filter playlists" style={{...defaultInput}} type="text" onKeyUp={event =>
        this.props.onTextChange(event.target.value)}></input>
    </div>);
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist;
    return (<div style={{
        width: '25%',
        padding: '10px'
    }}>
      <div style={{
          backgroundColor: 'rgba(255,230,200, 0.1)',
          border: '1px solid rgba(255,255,255, 0.25)',
          height: '100%'
      }}>
        <img style={{width: '100%'}} src={playlist.imageUrl}/>
        <div style={{
          ...defaultLabel,
          padding: '15px',
          textAlign: 'left'
        }}>
          <h3>{playlist.name}</h3>
          <ul style={removeListSTyles}>
            {playlist.songs.map(song =>
              <li>{song.name}</li>
            )}
          </ul>
        </div>
      </div>
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

    if(!accessToken)
      return;

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
    .then(playlistData => {
      let playlists = playlistData.items
      let trackDataPromoses = playlists.map(playlist => {
        let responsePromise = fetch(playlist.tracks.href, {
          headers: {'Authorization': 'Bearer ' + accessToken}
        })
        let trackDataPromose = responsePromise
          .then(response => response.json())
        return trackDataPromose
      })
      let allTracksDatasPromises =
        Promise.all(trackDataPromoses)
      let playlistsPromoise = allTracksDatasPromises.then(trackDatas => {
          trackDatas.forEach((trackData, i) => {
            playlists[i].trackDatas = trackData.items
              .map(item => item.track)
              .map(trackData => ({
                name: trackData.name,
                duration: trackData.duration_ms / 1000
              }))
          })
          return playlists
      })
      return playlistsPromoise
    })
    .then(playlists => this.setState({
      playlists: playlists.map(item => {
        var imageUrl = item.images.length > 0
          ? item.images[0].url
          : 'https://via.placeholder.com/150'
        return {
          name: item.name,
          imageUrl: imageUrl,
          songs: item.trackDatas.slice(0,3)
        }
      })
    }))
  }
  render() {
    let playlistsToRender =
      this.state.user &&
      this.state.playlists
      ? this.state.playlists.filter(playlist => {
        let matchesPlaylist = playlist.name.toLowerCase().includes(
            this.state.filterKeyword.toLowerCase())
        let matchesSong = playlist.songs.find(song => song.name.toLowerCase()
          .includes(this.state.filterKeyword.toLowerCase()))
        return matchesPlaylist || matchesSong
      })
      : []

    return (
      <div className='App'>
        {this.state.user ?
          <div>
            <h1 style={{
              margin: '0.2em 0 0.4em',
              color: '#fff',
              fontSize: '52px'
            }}>
              {this.state.user.name}'s Playlist
            </h1>
            <PlaylistsCounter playlists={playlistsToRender}/>
            <DurationCounter playlists={playlistsToRender}/>
            <Filter onTextChange={text => this.setState({filterKeyword: text})}/>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap'
            }}>
              {playlistsToRender.map(playlist =>
                <Playlist playlist={playlist} />
              )}
            </div>
          </div> : <button
            onClick={() => {
              window.location = window.location.href.includes('localhost')
                ? 'http://localhost:8888/login'
                : 'https://infinite-peak-11339.herokuapp.com/login'
            }}
            style={{padding: '20px', fontSize: '16px'}}>Log in with Spotify</button>
        }
      </div>
    );
  }
}

export default App;
