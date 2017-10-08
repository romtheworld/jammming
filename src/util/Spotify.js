const clientID = '7bbdfdc99f094540914e08e879a7f1d6';
let uri = 'http://localhost:3000/';
let accessToken = ''; //user access token
let expiresIn = '';

const Spotify = {
    getAccessToken() {
        if(accessToken) {
            //console.log('good to go');
            return accessToken;
        } else if (window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
            accessToken = window.location.href.match(/access_token=([^&]*)/);
            expiresIn = window.location.href.match(/expires_in=([^&]*)/);
            accessToken = accessToken[1];
            expiresIn = expiresIn[1];
            
            //console.log('I used the url');
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-private&redirect_uri=${uri}`
            
            //console.log('you have to log in');
        }
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
    },
    search(searchTerm) {
        Spotify.getAccessToken();
        //console.log(accessToken);
        //console.log(expiresIn);
        
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
        }).then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error('Request failed!');
        }, networkError => console.log(networkError.message)).then(jsonResponse => {
            let jsonResponseTracks = jsonResponse.tracks.items;
            
            if (jsonResponseTracks) {
                //console.log(jsonResponseTracks);
                return jsonResponseTracks.map(function(track) {
                    track = {
                       uri: 'spotify:track:' + track.id,
                       name: track.name,
                       artist: track.artists[0].name,
                       album: track.album.name
                    };
                    //console.log(track);
                    return track;
                });
            }
        });
    },
    savePlaylist(playlistName, trackURIArray) {
        if (playlistName && trackURIArray) {
            let saveToken = accessToken;
            let headers = {
                Authorization: `Bearer ${saveToken}`
            };
            let userID = '';
            let playlistID = '';
            
            //GET user id
            userID = fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Request failed!');
            }, networkError => console.log(networkError.message)).then(jsonResponse => {
                
                //this is user id
                return jsonResponse.id;
                
            });
            
            userID.then(userID => {
                //console.log(userID);
                
                //POST 1 of 2 create playlist
                playlistID = fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        description: 'Custom Jammming Playlist',
                        public: false,
                        name: playlistName
                    })
                }).then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Request failed!');
                }, networkError => console.log(networkError.message)).then(jsonResponse => {

                    //this is playlist id
                    return jsonResponse.id;

                });
                
                //POST 2 of 2 add tracks to playlist
                playlistID.then(playlistID => {
                    //console.log(playlistID);

                    fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({
                            uris: trackURIArray
                        })
                    }).then(response => {
                        if (response.ok) {
                            return response.json();
                        }
                        throw new Error('Request failed!');
                    }, networkError => console.log(networkError.message)).then(jsonResponse => {

                        return jsonResponse;

                    });
                });
            });
        }
    }
};

export default Spotify;