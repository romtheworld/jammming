import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: ' '
        };
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }
    
    search() {
        //pass term to this.props.onSearch
        this.props.onSearch(this.state.searchTerm);
    }
    
    handleTermChange(e) {
        //sets state of search bar term to e.target.value
        const target = e.target.value;
        
        this.setState({
            searchTerm: target
        });
    }
    
    render() {
        return (
            <div className="SearchBar">
              <input onChange = {this.handleTermChange} placeholder="Enter A Song, Album, or Artist" />
              <a onClick = {this.search} >SEARCH</a>
            </div>
        );
    }
}

export default SearchBar;