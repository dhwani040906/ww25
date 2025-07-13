import Gallery from './Gallery';
import Login from './Login'
import Register from './Register';
import React, {useState} from 'react';

function App(){
    const [showLogin, setShowLogin] = useState(true);

    return(
        <div>
           {showLogin ? (<Login switchToRegister={() => setShowLogin(false)} />) : (
            <Register switchToLogin={() => setShowLogin(true)} />)}
        </div>
    )
}

export default App;