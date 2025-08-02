import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useState } from 'react';
import axios from 'axios'

function Register() {
    const navigate = useNavigate();
    const [username,setusername] = useState("");
    const [email,setemail] = useState("");
    const [phone,setphone] = useState();
    
    return (
        <div className="auth-wrapper">
            <div className="auth-box">
                <h2>Sign Up</h2>
                <label>
                    Username:
                    <input type="text" name="username" onChange={(e)=>{setusername(e.target)}}/>
                </label>
                <label>
                    Email:
                    <input type="email" name="email" onChange={(e)=>{setemail(e.target)}}/>
                </label>
                <label>
                    Phone No:
                    <input type="tel" name="telephone" onChange={(e)=>{setphone(e.target)}}/>
                </label>
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
                <button className="auth-btn">Sign Up</button>
                <p>
                    Already have an account?{' '}
                    <button className="switch-btn" onClick={() => navigate('/login')}>
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Register;