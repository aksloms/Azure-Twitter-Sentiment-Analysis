import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from './components/Home'
import Navbar from './components/Navbar'
import SentimentPlot from './components/SentimentPlot'
import AspectPlot from './components/AspectPlot'

//TODOS

//Poprawić slider na datę
  //slider ma przedstawiać wartości daty
  //Wartości graniczne slidera
  //Wybór daty w kalendarzu ma wpływać na zmianę slidera

//Wprawić w działanie wyszukiwarkę w menu
  //Usunąć ją ze strony głównej
  //Stworzyć listę dostępnych hashtag
  //Sprawić aby po wpisaniu podpowiadała zawarte w tablicy hashtagi


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
