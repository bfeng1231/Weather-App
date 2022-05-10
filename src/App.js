import { useState, useEffect } from 'react';
import './App.css';

function App() {

    const [search, setSearch] = useState('');
    const [results, setResults] = useState([])
    const [location, setLocation] = useState({})

    const searchLocation = async (search) => {
        let  query = 'http://api.openweathermap.org/geo/1.0/direct?q=' + search + '&limit=5&appid=78288220edbc659e816bd8ade5b4fa3e';
        const res = await fetch(query, {method: 'GET'});
        const data = await res.json();
        setResults(data);
    }

    const displayResults = results !== [] ? 
        <div>
            {results.map(elem => 
                <div key={elem.name + elem.state} onClick={() => {
                    setLocation({lat: elem.lat, lon: elem.lon});
                    setResults([]);
                }}>
                    <div>{elem.name}, {elem.state}</div>
                    <div>{elem.country}</div>
                </div>)}
        </div> : 
        <div></div>

    return (
        <div className="App">           
            <div className='app-container'>
                <div>
                    {Object.keys(location).length === 0 ? <p>Current Location: Not Set</p> : <p>Current Location: {location.lat}, {location.lon}</p>}                 
                </div>          
                <div className='search-bar'>                 
                    <input type='text' placeholder='Location' onChange={event => setSearch(event.target.value)}/>
                    <button onClick={(event) => {
                        event.preventDefault();
                        searchLocation(search);
                    }}>Submit</button>
                </div>
                {displayResults}
                <div className='forecast'>

                </div>
            </div>
        </div>
    );
}

export default App;