import { useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faCloud, faCloudSun, faSmog, faSnowflake, faCloudBolt, faCloudRain, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import useFetchForecast from './useFetchForecast';
import clear from './images/clear.jpg'
import cloudy from './images/cloudy.jpg'
import fog from './images/fog.jpg'
import rain from './images/rain.jpg'
import snow from './images/snow.jpg'

function App() {

    const [search, setSearch] = useState('')
    const [results, setResults] = useState([])
    const [location, setLocation] = useState({lat: 39.9527237, lon: -75.1635262, name: 'Philadelphia'})
    //const [forecast, setForecast] = useState([])
    const [units, setUnits] = useState({unit: 'F', system: 'imperial', speed: 'mph'})
    const [toggle, setToggle] = useState('slideLeft')
    const forecast = useFetchForecast(location, units)

    const searchLocation = async (search) => {
        if(search)
            try {
                let  query = 'http://api.openweathermap.org/geo/1.0/direct?q=' + search + '&limit=5&appid=78288220edbc659e816bd8ade5b4fa3e';
                const res = await fetch(query, {method: 'GET'});
                const data = await res.json();
                setResults(data);
            }
            catch {
                window.alert("Unable to get location data. Please try again later.")
            }
        return
    }

    const displayResults = results !== [] ? 
        <div>
            <div className='results'>
            {results.map(elem => 
                <div key={elem.name + elem.state} onClick={() => {
                    setLocation({lat: elem.lat, lon: elem.lon, name: elem.name});
                    setResults([]);
                    //fetchForecast(elem.lat, elem.lon);
                    //console.log(forecast)   
                }}>
                    <div>{elem.name}, {elem.state}</div>
                    <div>{elem.country}</div>
                </div>)}
            </div>
            <div className='closeResults' onClick={() => {setResults([])}} />
        </div> : 
        <div></div>
        
    /* const fetchForecast = async(lat, lon) => {    
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

    useEffect(() => {
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
        console.log('Changed Units')
        if (toggle === 'slideLeft') {
            setUnits({unit: 'C', system: 'metric', speed: 'mps'})   
            return setToggle('slideRight')
        }
        else {
            setUnits({unit: 'F', system: 'imperial', speed: 'mph'})  
            return setToggle('slideLeft')
        }       
    }

    const changeBackground = () => {
        if (Object.keys(forecast).length === 0)
            return
        else if (forecast.current.weather[0].id >= 803)
            return {backgroundImage: `url(${cloudy})`}
        else if (forecast.current.weather[0].id >= 800)
            return {backgroundImage: `url(${clear})`}
        else if (forecast.current.weather[0].id >= 700)
            return {backgroundImage: `url(${fog})`}
        else if (forecast.current.weather[0].id >= 600)
            return {backgroundImage: `url(${snow})`}
        else if (forecast.current.weather[0].id >= 200)
            return {backgroundImage: `url(${rain})`}
        else
            return
    }

    return (
        <div className="App" style={changeBackground()}>           
            <div className='header'>
                <div className='coord'>
                    {Object.keys(location).length === 0 ? <div>Current Location: Not Set</div> : <div>Coordinates: {location.lat}, {location.lon}</div>}
                </div>
                <div className='toggleSwitch'>                     
                    <div className='switch'>                       
                        <div>&#176;C</div>
                        <div>&#176;F</div>
                    </div>
                    <div className={toggle} onClick={() => toggleSwitch()}/>
                </div>                 
            </div>
            <div className='searchBar'>
                <div className='search'>                
                    <input type='text' placeholder='Location' onChange={event => setSearch(event.target.value)} onKeyDown={event => {if (event.key === 'Enter') searchLocation(search)}}/>
                    <button onClick={(event) => {
                        event.preventDefault();
                        searchLocation(search);
                    }}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                </div>
                <div>
                   {results.length !== 0 ? <div>{displayResults}</div> : <div></div>}
                </div> 
            </div>           
            {Object.keys(forecast).length === 0 ?
                <div></div> :
                <div className='forecast'>
                    <div className='forecastToday'>
                        <div className='main'>
                            <h2>{location.name}</h2>
                            <div>
                                <div>{getIcon(forecast.current.weather[0].id)}</div>
                                <div>{Math.round(forecast.current.temp)}&#176;{units.unit}</div>
                            </div>                            
                        </div>
                        <div className='details'>
                            <div>
                                <label />
                                <div>{forecast.current.weather[0].main}</div>
                            </div>
                            <div>
                                <label>Feels like</label> <div>{Math.round(forecast.current.feels_like)}&#176;{units.unit}</div>
                            </div>
                            <div>
                                <label>Humidity</label>
                                <div> {forecast.current.humidity}%</div>
                            </div>
                            <div>
                                <label>Wind</label>
                                <div>{Math.round(forecast.current.wind_speed)} {units.speed} {degToCompass(forecast.current.wind_deg)}</div>
                            </div>
                        </div>
                    </div>
                    <div className='forecastDaily'>
                        {
                            forecast.daily.map(elem => 
                                <div key={elem.dt}>
                                    <h4>{getDate(elem.dt)}</h4>
                                    <div>{getIcon(elem.weather[0].id)}</div>
                                    <p>{Math.round(elem.temp.max)}&#176;{units.unit}/{Math.round(elem.temp.min)}&#176;{units.unit}</p>                                   
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