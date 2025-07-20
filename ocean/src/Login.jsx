// import { Navigate } from 'react-router';
import { useNavigate } from 'react-router-dom';
import './Login.css'
function Login({switchToRegister}){
    const navigate = useNavigate();
    return(
        <div className="login-container">
        <div className="login-box">
            <h2>LOGIN</h2>
            <br/>
            <label>Username: <input type="text" id="username" name="username" /></label>
            <br/>
            <label>Password: <input type="password" id="password" name="password"/></label>
            <br/>
            <div className="button-box">
            <button type="submit">Login</button>
            </div>
            <p>Didn't sign up? <button onClick={()=>navigate('/register')} className="switch" type="button">Register</button></p>
        </div>
        </div>
    )
}

export default Login;