import './Login.css'
function Login(){
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
            <p>Didn't sign up? <button className="switch" type="button">Register</button></p>
        </div>
        </div>
    )
}

export default Login;