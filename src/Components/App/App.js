import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import PlayList from '../PlayList/PlayList';
import './App.css';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };
        
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
    
  addTrack(newTrack) {
      const playlist = this.state.playlistTracks;
      playlist.push(newTrack);
      
      this.setState({
          playlistTracks: playlist
      });
      //console.log(playlist);
  }
    
  removeTrack(track) {
      const newPlaylistTracks = this.state.playlistTracks.filter(updateTrack => {
          return updateTrack !== track;
      });
      
      this.setState({
          playlistTracks: newPlaylistTracks
      });
      //console.log(newPlaylistTracks);
  }
    
  updatePlaylistName(name) {
      this.setState({
          playlistName: name
      });
  }
    
  savePlaylist() {
      //trackURIs = [uri, uri, uri...]
      let trackURIArray = this.state.playlistTracks.map(track => {
          return track.uri;
      });
      
      //console.log(trackURIArray);
      
      //pass trackURIs and playlistName to user's spotify playlist
      Spotify.savePlaylist(this.state.playlistName, trackURIArray);
      
      this.setState({
          playlistName: 'New Playlist',
          playlistTracks: []
      })
  }

  search(searchTerm) {
      Spotify.search(searchTerm).then(tracks => {
          this.setState({
              searchResults: tracks
          });
      });
  }

  render() {
    return (
        <div>
          <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
            <SearchBar onSearch = {this.search} />
            <div className="App-playlist">
              <SearchResults 
                  searchResults = {this.state.searchResults} 
                  onAdd = {this.addTrack} />
              <PlayList 
                  playlistName = {this.state.playlistName}
                  playlistTracks = {this.state.playlistTracks}
                  onRemove = {this.removeTrack}
                  isRemoval = {true}
                  onNameChange = {this.updatePlaylistName}
                  onSave = {this.savePlaylist} />
            </div>
          </div>
        </div>
    );
  }
}

export default App;