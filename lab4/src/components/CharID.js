import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';

const CharID = () => {
  let {id} = useParams();

  const md5 = require('blueimp-md5');
  const publickey = '034db87042e2d2df1665fbe308e9e220';
  const privatekey = '5c915e68f16801b81c75625fad98524dc4413da9';
  const ts = new Date().getTime();
  const stringToHash = ts + privatekey + publickey;
  const hash = md5(stringToHash);
  const [loading, setLoading] = useState(true);
  const [charData, setCharData] = useState(undefined);

  useEffect(() => {
    const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters/' + id;
    const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
    async function fetchData() {
      try {
        const res = await axios.get(url);
        setCharData(res.data);
        setLoading(false);
      } catch (e) {
        setCharData(404);
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
    if(charData === 404){
      return (
        <div>
            <p>Character Not Found</p>
        </div>
      );
    }
    else{
      return (
        <div>
            <img className='thumbnail' alt="thumbnail for character" src={`${charData.data.results[0].thumbnail.path}.${charData.data.results[0].thumbnail.extension}`} />
            <p>Name: {charData.data.results[0].name}</p>
            <p>Description: {charData.data.results[0].description}</p>
        </div>
      );
    }
  }
};

export default CharID;

