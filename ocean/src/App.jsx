import Gallery from './Gallery';
import Login from './Login'
import Register from './Register';
import Home from './Home';
import Explore from './Explore'
import React, {useState} from 'react';

function App(){

    const [showLogin, setShowLogin] = useState(true);

    return(
        <div>
           {/* {showLogin ? (<Login switchToRegister={() => setShowLogin(false)} />) : (
            <Register switchToLogin={() => setShowLogin(true)} />)} */}
            <Home/>
            {/* <Explore/> */}
            {/* <Fishes/> */}
        </div>
    )
}

export default App;