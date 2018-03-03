import React from 'react';
import './App.css';
import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';

import Spotify from '../../util/Spotify.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "Jammming Tracks",
      playlistTracks: []
    };
    this.search = this.search.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }

  search(term) {
    let newResults = Spotify.search(term);
    Spotify.search(term).then(tracks => {
      this.setState({searchResults: tracks})
    });
  }

  addTrack(track) {
    let newPlaylist = this.state.playlistTracks;
    let playlistIds = newPlaylist.map(song => song.id);
    if (!playlistIds.includes(track.id)) {
      newPlaylist.push(track);
      this.setState({playlistTracks: newPlaylist});
    }
  }

  removeTrack(track) {
    let newPlaylist = this.state.playlistTracks;
    let playlistIds = newPlaylist.map(song => song.id);
    let songId = playlistIds.indexOf(track.id);
    if (playlistIds.includes(track.id)) {
      newPlaylist.splice(songId, 1);
      this.setState({playlistTracks: newPlaylist});
    }
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(song => song.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: "Next Playlist",
        playlistTracks: []
      });
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} isRemoval={false} onAdd={this.addTrack} />
            <Playlist tracks={this.state.playlistTracks} isRemoval={true} onRemove={this.removeTrack} name={this.state.playlistName} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
