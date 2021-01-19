import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from './components/Home'
import Navbar from './components/Navbar'
import SentimentPlot from './components/SentimentPlot'
import AspectPlot from './components/AspectPlot'

//TODOS

//Zmiana hashtag powoduje zmianę tytułu wykresu
//Graficzne ułożenie elementów
//Skalowanie homepage do aplikacji mobilnej
//Refaktoryzacja



function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Navbar isHome={true}/>
          <Home />
        </Route>

        <Route path="/plot/aspect">
          <Navbar isHome={false}/>
          <AspectPlot />
        </Route>

        <Route path="/plot/sentiment">
          <Navbar isHome={false}/>
          <SentimentPlot />
        </Route>
      </Switch>

    </Router>
  );
}

export default App;
