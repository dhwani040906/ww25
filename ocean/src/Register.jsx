import './Register.css'

function Register(){
    return(
        <div className="register-container">
        {/* register box   */}
        <div className="register-box">
            <h2>SIGN UP</h2>
            <br/>
            <label>
                <span>Username: </span>
                <input type="text" id="username" name="username" pattern="[A-Za-z0-9]"/>
            </label>
            <br/>
            <label>
                <span>Email: </span>
                <input type="email" id="email" name="email"/>
            </label>
            <br/>
            <label>
                <span>Phone No: </span>
                <input type="tel" id="telephone" name="telephone"/>
            </label>
            <br/>
            <label>
                <span>Password: </span>
                <input type="password" id="password" name="password"/> 
            </label>
            <br/>
            <div className="sign-box">
            <button className="submit" type="submit">Sign Up</button>
            </div>
            <p>Already have an account? <button className="switch" type="button">Login</button></p>
        </div>
        </div>
    )
}
export default Register;