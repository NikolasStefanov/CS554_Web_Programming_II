import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';

const SeriesID = () => {
  let {id} = useParams();

  const md5 = require('blueimp-md5');
  const publickey = '034db87042e2d2df1665fbe308e9e220';
  const privatekey = '5c915e68f16801b81c75625fad98524dc4413da9';
  const ts = new Date().getTime();
  const stringToHash = ts + privatekey + publickey;
  const hash = md5(stringToHash);
  const [loading, setLoading] = useState(true);
  const [seriesData, setSeriesData] = useState(undefined);

  useEffect(() => {
    const baseUrl = 'https://gateway.marvel.com:443/v1/public/series/' + id;
    const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
    async function fetchData() {
      try {
        const res = await axios.get(url);
        setSeriesData(res.data);
        setLoading(false);
      } catch (e) {
        setSeriesData(404);
        setLoading(false);
        console.log(e);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    )}
  else{
    if(seriesData === 404){
      return (
        <div>
            <p>Series Not Found</p>
        </div>
      );
    }
    else{
      return (
        <div>
            <img className='thumbnail' alt="thumbnail for character" src={`${seriesData.data.results[0].thumbnail.path}.${seriesData.data.results[0].thumbnail.extension}`} />
            <p>Title: {seriesData.data.results[0].title}</p>
            <p>Rating: {seriesData.data.results[0].rating}</p>
        </div>
      );
    }
  }
};

export default SeriesID;
