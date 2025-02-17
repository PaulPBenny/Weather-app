

import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import './w.css';

function Weather() {
  const API_key = "228b492fda91d5126216cb573939a770";

  const [search, setSearch] = useState('');
  const [img, setImg] = useState([]);
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(false);

  const bg = 'https://cdn.pixabay.com/photo/2020/02/06/15/59/forest-4824759_1280.png';

  const fetchData = async () => {
    try {
      const response = await Axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${API_key}&units=metric`
      );
      console.log(response.data);
      setData(response.data);
      setError(false);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError(true);
      } else {
        console.error("Weather API Error:", err);
        setError(true);
      }
      setData(null);
    }
  };

  const fetchForecast = async () => {
    try {
      const response = await Axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${search}&appid=${API_key}&units=metric`
      );
      console.log(response.data);
      const dailyData = response.data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(dailyData);
    } catch (err) {
      console.error("Forecast API Error:", err);
      setForecast([]);
    }
  };

  const getImg = () => {
    Axios.get(`https://api.unsplash.com/search/photos?page=1&query=${search}&client_id=vlWvWOTSt6UkqCFZ4gX76GqacFinpC_SMqmPahXo2RI`)
      .then((response) => {
        setImg(response.data.results);
      })
      .catch((error) => {
        console.error("img api error", error);
        setImg([]);
      });
  };

  useEffect(() => {
    if (search) {
      fetchData();
      fetchForecast();
      getImg();
    }
  }, [search]);

  const randomImage = img.length > 0 ? img[Math.floor(Math.random() * img.length)]?.urls?.regular : bg;

  return (
    <>
      <div className='body'>
        <h1 className='my-5 text-center fw-bold fs-1 header'>
          <img src="https://cdn2.iconfinder.com/data/icons/weather-flat-14/64/weather02-512.png" alt="" style={{ width: '100px' }} />
          <span className='head'>Weather App</span>
        </h1>

        <div className="input-search px-5 mt-5">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Enter Your city' />
          <button className="ms-3" onClick={fetchData}>
            <i className="fa-solid fa-2x fa-magnifying-glass"></i>
          </button>
        </div>

        <div className='display'>
          {error ? (
            <div className='error'>
              <div className="container">
                <h1>Oops! City not found</h1>
                <img src="https://img.freepik.com/free-vector/404-error-lost-space-concept-illustration_114360-7971.jpg" alt="" className="img-fluid errimg" />
              </div>
            </div>
          ) : !data ? (
            <h2 className='serch'>
              <img src="https://cdn.dribbble.com/users/2598999/screenshots/8659774/media/de5b8240adc015d6d11c48e98d14896c.gif" alt="" style={{ width: '120px', borderRadius: '50px' }} className='img-fluid mt-5' />
              Search City
            </h2>
          ) : (
            <div className='city-info'>
              <div className="row row-pic"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.573), rgba(0, 0, 0, 0.277)), url(${randomImage})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  height: '450px',
                  width: '100%',
                  borderRadius: '30px',
                }}>
                <div className='loc'>
                  <h3>
                    <i className="fa-solid fa-location-dot fa-fade" style={{ color: "#fcfcfc" }}></i> {data?.name} | {data?.sys.country}
                  </h3>
                </div>
                <img className='wicon' src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`} alt="Weather Icon" />
                <h1>{data?.main?.temp} &deg;C</h1>
                <h2 style={{ color: 'yellow' }}>{data?.weather[0].description}</h2>
              </div>

              <div className="row">
                <div className='col'>
                  <div className="box">
                    <h5><i className="fa-solid fa-water me-2 fs-5"></i>Humidity</h5>
                    <h2>{data?.main?.humidity + " %"}</h2>
                  </div>
                  <div className="box">
                    <h5><i className="fa-solid fa-wind me-2 fs-5"></i>Wind Speed</h5>
                    <h2>{data?.wind?.speed + " Km/h"}</h2>
                  </div>
                </div>
                <div className='col'>
                  <div className="box">
                    <h5>Feels Like</h5>
                    <h2 className='pb-2'> {Math.round(data?.main.feels_like)}°C</h2>
                  </div>
                  <div className="box">
                    <h5><i className="fa-solid fa-wind me-2 fs-5"></i>Pressure</h5>
                    <h2 className='pb-2'>{data?.main.pressure}<span className='font2 fs-5'>hPa</span></h2>
                  </div>
                </div>
              </div>

               {/* Five-Day Forecast  */}


              <div className='forecast'>
                <h3 className='my-4'>5-Day Forecast</h3>
                <div className="forecast-container">
                  {forecast.map((day, idx) => (
                    <div key={idx} className="forecast-item">
                      <h5>{new Date(day.dt_txt).toLocaleDateString()}</h5>
                      <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt="Weather Icon" />
                      <h2>{day.main.temp}°C</h2>
                      <p>{day.weather[0].description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Weather;
