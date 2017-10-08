import React from 'react';
import TrackList from '../TrackList/TrackList';
import './PlayList.css';

class PlayList extends React.Component {
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
    }
    
    handleNameChange(e) {
        this.props.onNameChange(e.target.value);
    }
    
    render() {
        return (
            <div className="Playlist">
              <input onChange={this.handleNameChange} defaultValue={this.props.playlistName}/>
              <TrackList 
                  tracks = {this.props.playlistTracks}
                  onRemove = {this.props.onRemove}
                  isRemoval = {this.props.isRemoval} />
              <a onClick={this.props.onSave} className="Playlist-save">SAVE TO SPOTIFY</a>
            </div>
        );
    }
}

export default PlayList;