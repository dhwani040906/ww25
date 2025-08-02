import Gallery from './Gallery';
import Login from './Login'
import Register from './Register';
import Home from './Home';
import Explore from './Explore'
import Fishes from './Fishes'
import Plants from './Plants'
import Shells from './Shells'
// import About from './About'
// import Community from './Community'
//import Dive from './Dive'
import Game from './Game'
// import Ocean from './Ocean'
import Quiz from './Quiz'
import Ships from './Ships'
// import Solutions from './Solutions'
import Threats from './Threats'
import React, {useState} from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App(){

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element = {<Home/>} />
                <Route path="/login" element = {<Login/>} />
                <Route path="/register" element= {<Register/>} /> 
                <Route path="/explore" element= {<Explore/>} /> 
                <Route path="/threats" element= {<Threats/>} /> 
                <Route path="/gallery" element= {<Gallery/>} /> 
                <Route path="/fishes" element= {<Fishes/>} /> 
                <Route path="/shells" element= {<Shells/>} /> 
                <Route path="/plants" element= {<Plants/>} /> 
                <Route path="/quiz" element= {<Quiz/>} /> 
                <Route path="/ships" element= {<Ships/>} /> 
                <Route path="/game" element= {<Game/>} /> 
                {/* {<Route path="/dive" element= {<Dive/>} />} */}
                {/* <Route path="/solutions" element= {<Solutions/>} /> 
                <Route path="/community" element= {<Community/>} />  */}
                {/* <Route path="/about" element= {<About/>} />  */}
                
            </Routes>
        </BrowserRouter>
    )
}

export default App;
