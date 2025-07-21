import { useNavigate } from 'react-router-dom';
import './Login.css';

function Register() {
    const navigate = useNavigate();

    return (
        <div className="auth-wrapper">
            <div className="auth-box">
                <h2>Sign Up</h2>
                <label>
                    Username:
                    <input type="text" name="username" />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" />
                </label>
                <label>
                    Phone No:
                    <input type="tel" name="telephone" />
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