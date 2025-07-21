import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const navigate = useNavigate();

    return (
        <div className="auth-wrapper">
            <div className="auth-box">
                <h2>Login</h2>
                <label>
                    Username:
                    <input type="text" name="username" />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
                <button className="auth-btn">Login</button>
                <p>
                    Didn't sign up?{' '}
                    <button className="switch-btn" onClick={() => navigate('/register')}>
                        Register
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Login;