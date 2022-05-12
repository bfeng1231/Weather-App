import { useState, useEffect, useReducer } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faCloud, faCloudSun, faSmog, faSnowflake, faCloudBolt, faCloudRain } from '@fortawesome/free-solid-svg-icons';

const initialState = {
    isLoading: true,
    error: false
}

function reducer(state, action) {
    switch (action.type) {
        case 'isLoading':
            return {...state, isLoading: true}
        case 'doneLoading':
            return {...state, isLoading: false}
        case 'errorLoading':
            return {isLoading: false, error: true}
        default:
            return state
    }
}

function App() {

    const [search, setSearch] = useState('')
    const [results, setResults] = useState([])
    const [location, setLocation] = useState({})
    const [forecast, setForecast] = useState([])
    const [units, setUnits] = useState({unit: 'F', system: 'imperial'})
    const [state, dispatch] = useReducer(reducer, initialState)
    const [toggle, setToggle] = useState('slideLeft')

    const searchLocation = async (search) => {
        try {
            let  query = 'http://api.openweathermap.org/geo/1.0/direct?q=' + search + '&limit=5&appid=78288220edbc659e816bd8ade5b4fa3e';
            const res = await fetch(query, {method: 'GET'});
            const data = await res.json();
            setResults(data);
        }
        catch {
            window.alert("Unable to get location data. Please try again later.")
        }
    }

    const displayResults = results !== [] ? 
        <div>
            {results.map(elem => 
                <div key={elem.name + elem.state} onClick={() => {
                    setLocation({lat: elem.lat, lon: elem.lon, name: elem.name});
                    setResults([]);
                    //fetchForecast(elem.lat, elem.lon);
                    //console.log(forecast)
                    fetchForecast(elem.lat, elem.lon);     
                }}>
                    <div>{elem.name}, {elem.state}</div>
                    <div>{elem.country}</div>
                </div>)}
        </div> : 
        <div></div>
        
    const fetchForecast = async(lat, lon) => {    
        dispatch({type: 'isLoading'})  
        try {
            let query = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon +'&appid=78288220edbc659e816bd8ade5b4fa3e&units=' + units.system;
            const res = await fetch(query, {method: 'GET'});
            const data = await res.json();
            setForecast(data);
            dispatch({type: 'doneLoading'})
            console.log(forecast)
        }
        catch {
            window.alert("Unable to get weather data. Please try again later.")
            dispatch({type: 'errorLoading'})
        }
    }  

    useEffect(() => {
        setLocation({lat: 39.9527237, lon: -75.1635262, name: 'Philadelphia'}); 
        fetchForecast(39.9527237, -75.1635262)
        console.log('Initial Location')
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    /* useEffect(() => {
        console.log('Changed Units')  
        fetchForecast(location.lat, location.lon);
    }, [units]) */


    const degToCompass = (deg) => {
        const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        let direction = Math.floor((deg / 22.5) + 0.5);       
        return arr[(direction % 16)];
    }

    const getDate = (string) => {
        let date = new Date(string * 1000);
        date = date.toLocaleDateString()
        return date.substring(date.length - 5, 0)
    }

    const getIcon = (id) => {
        if (id === 800)
            return <FontAwesomeIcon icon={faSun} />
        else if (id >= 803)
            return <FontAwesomeIcon icon={faCloud} />
        else if (id >= 801)
            return <FontAwesomeIcon icon={faCloudSun} />
        else if (id >= 700)
            return <FontAwesomeIcon icon={faSmog} />
        else if (id >= 600)
            return <FontAwesomeIcon icon={faSnowflake} />
        else if (id >= 300)
            return <FontAwesomeIcon icon={faCloudRain} />
        else if (id >= 200)
            return <FontAwesomeIcon icon={faCloudBolt} />
        else
            return console.log(id, "no match")
    }

    const toggleSwitch = () => {
        if (toggle === 'slideLeft') {        
            return setToggle('slideRight')
        }
        else
            return setToggle('slideLeft')       
    }

    return (
        <div className="App">           
            <div className='header'>
                <div>
                    {Object.keys(location).length === 0 ? <div>Current Location: Not Set</div> : <div>Current Location: {location.lat}, {location.lon}</div>}
                </div>
                <div className='toggleSwitch'>                     
                    <div className='switch'>                       
                        <div>&#176;C</div>
                        <div>&#176;F</div>
                    </div>
                    <div className={toggle} onClick={() => toggleSwitch()}/>
                </div>                 
            </div>
            <div className='search-bar'>                 
                <input type='text' placeholder='Location' onChange={event => setSearch(event.target.value)}/>
                <button onClick={(event) => {
                    event.preventDefault();
                    searchLocation(search);
                }}>Submit</button>
            </div>
            {displayResults}
            {state.isLoading ?
                <div></div> :
                <div className='forecast'>
                    <div className='forecastToday'>
                        <div>
                            <h3>{location.name}</h3>
                            {getIcon(forecast.current.weather[0].id)}
                            <h1>{Math.round(forecast.current.temp)}&#176;{units.unit}</h1>
                            <h4>{forecast.current.weather[0].main}</h4>
                        </div>
                        <div>
                            <h5>Feels like {forecast.current.feels_like}</h5>
                            <h5>Humidity {forecast.current.humidity}%</h5>
                            <h5>Wind {forecast.current.wind_speed} mph {degToCompass(forecast.current.wind_deg)}</h5>
                        </div>
                    </div>
                    <div className='forecastDaily'>
                        {
                            forecast.daily.map(elem => 
                                <div key={elem.dt}>
                                    <h4>{getDate(elem.dt)}</h4>
                                    {getIcon(elem.weather[0].id)}
                                    <h5>{Math.round(elem.temp.max)}&#176;{units.unit}/{Math.round(elem.temp.min)}&#176;{units.unit}</h5>
                                    
                                </div>
                            )
                        }
                    </div>
                </div>
            }          
        </div>
    );
}

export default App;