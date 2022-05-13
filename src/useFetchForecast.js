import { useEffect, useState } from "react";

const useFetchForecast = (location, units) => {
    const [data, setData] = useState({})
    
    useEffect(() => {  
        async function fetchData() {
            try {
                let query = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + location.lat + '&lon=' + location.lon +'&appid=78288220edbc659e816bd8ade5b4fa3e&units=' + units.system;
                const res = await fetch(query, {method: 'GET'});
                const data = await res.json();
                //setForecast(data);
                console.log('Getting forecast data')
                console.log(data)
                return setData(data)
            }
            catch {
                window.alert("Unable to get weather data. Please try again later.")
                return
            }
        }
        fetchData();
    }, [location, units])
    return data;
}

export default useFetchForecast;