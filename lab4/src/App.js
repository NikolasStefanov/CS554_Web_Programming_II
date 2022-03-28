import React from 'react';
import './App.css';
import Home from './components/Home';
import CharID from './components/CharID';
import CharPage from './components/CharPage';
import CharSearch from './components/CharSearch';
import ComicID from './components/ComicID';
import ComicPage from './components/ComicPage';
import ComicSearch from './components/ComicSearch';
import SeriesID from './components/SeriesID';
import SeriesPage from './components/SeriesPage';
import SeriesSearch from './components/SeriesSearch';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div className='App'>
      <header className='App-header'>
          <h1 className='App-title'>
            Welcome to the React.js Marvel API Lab
          </h1>
          <Link className='headerLink' to='/'>
            Home
          </Link>
          <Link className='headerLink' to='/characters/page/0'>
            Characters
          </Link>
          <Link className='headerLink' to='/characters/search'>
            Character Search
          </Link>
          <Link className='headerLink' to='/comics/page/0'>
            Comics
          </Link>
          <Link className='headerLink' to='/comics/search'>
            Comic Search
          </Link>
          <Link className='headerLink' to='/series/page/0'>
            Series
          </Link>
          <Link className='headerLink' to='/series/search'>
            Series Search
          </Link>
        </header>
        <br />
        <br />
        <div className='App-body'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/characters/page/:page' element={<CharPage />} />
            <Route path='/characters/:id' element={<CharID />} />
            <Route path='/characters/search' element={<CharSearch />} />
            <Route path='/comics/page/:page' element={<ComicPage />} />
            <Route path='/comics/:id' element={<ComicID />} />
            <Route path='/comics/search' element={<ComicSearch />} />
            <Route path='/series/page/:page' element={<SeriesPage />} />
            <Route path='/series/:id' element={<SeriesID />} />
            <Route path='/series/search' element={<SeriesSearch />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
