import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
import {Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles} from '@material-ui/core';

const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 5,
    border: '1px solid #1e8678',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
  },
  titleHead: {
    borderBottom: '1px solid #1e8678',
    fontWeight: 'bold'
  },
  grid: {
    flexGrow: 1,
    flexDirection: 'row'
  },
  media: {
    height: '100%',
    width: '100%'
  },
  button: {
    color: '#1e8678',
    fontWeight: 'bold',
    fontSize: 12
  }
});

const SeriesPage = () => {
  const regex = /(<([^>]+)>)/gi;
  const classes = useStyles();
  let {page} = useParams();
  let card = null;

  const md5 = require('blueimp-md5');
  const publickey = '034db87042e2d2df1665fbe308e9e220';
  const privatekey = '5c915e68f16801b81c75625fad98524dc4413da9';
  const ts = new Date().getTime();
  const stringToHash = ts + privatekey + publickey;
  const hash = md5(stringToHash);
  const [loading, setLoading] = useState(true);
  const [seriesData, setSeriesData] = useState(undefined);
  const [nextData, setNextData] = useState(undefined);
  const [prevData, setPrevData] = useState(undefined);

  useEffect(() => {
    let pageNum = page*20
    let pageNumPlusOne = page*20+1
    const baseUrl = `https://gateway.marvel.com:443/v1/public/series?offset=${pageNum}`;
    const nextUrl = `https://gateway.marvel.com:443/v1/public/series?offset=${pageNumPlusOne}`
    const url = baseUrl + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
    const nextFullUrl = nextUrl + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(url);
        setSeriesData(res.data);
        if(res.data.data.results.length === 0){
          setSeriesData("Bad Data");
        }
        setPrevData("Good Prev")
        if(res.data.data.offset === 0){
          setPrevData("Bad Prev")
        }
      } catch (e) {
        setSeriesData("Bad Data");
      }
      try {
        const res = await axios.get(nextFullUrl);
        setNextData("Good Next");
        //640
        if(res.data.data.count !== 20){
          setNextData("Bad Next")
        }
      } catch (e) {
        setNextData("Bad Next");
      }
      setLoading(false);
    }
    fetchData()
  },[page])

  const buildCard = (series) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={series.id}>
        <Card className={classes.card} variant='outlined'>
            <Link to={`/series/${series.id}`}>
              <CardMedia
                className={classes.media}
                component='img'
                image= {`${series.thumbnail.path}.${series.thumbnail.extension}`}
                title='show image'
              />

              <CardContent>
                <Typography
                  className={classes.titleHead}
                  gutterBottom
                  variant='h6'
                  component='h2'
                >
                  {series.title}
                </Typography>
                <Typography variant='body2' color='textSecondary' component='p'>
                  {series.description
                    ? series.description.replace(regex, '').substring(0, 139) + '...'
                    : 'No Summary'}
                </Typography>
              </CardContent>
            </Link>
        </Card>
      </Grid>
    );
  };

  card =
        seriesData && seriesData !== "Bad Data" &&
        seriesData.data.results.map((series) => {
        return buildCard(series);
  });

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } 
  else {
    if(seriesData == "Bad Data"){
      return (
        <div>
          Bad Page
          <br />
          <Link to={`/series/page/0`}>
              Back to Page 0
          </Link> 
        </div>
      );
    }
    if(prevData == "Bad Prev"){
      return (
        <div>
          <Link to={`/series/page/${parseInt(page)+1}`}>
              Next
          </Link> 
          <br />
          <br />
          <Grid container className={classes.grid} spacing={5}>
            {card}
          </Grid>
        </div>
      );
    }
    if(nextData == "Bad Next"){
      return (
        <div>
          <Link to={`/series/page/${parseInt(page)-1}`}>
              Previous
          </Link> 
          <br />
          <br />
          <Grid container className={classes.grid} spacing={5}>
            {card}
          </Grid>
        </div>
      );
    }
    else{
    return (
      <div>
        <Link to={`/series/page/${parseInt(page)-1}`}>
            Previous
        </Link> 
        &nbsp;
        <Link to={`/series/page/${parseInt(page)+1}`}>
            Next
        </Link> 
        <br />
        <br />
        <Grid container className={classes.grid} spacing={5}>
          {card}
        </Grid>
      </div>
    );
    }
  }
};

export default SeriesPage;

  
