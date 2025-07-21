import './Logo.css';
import logo from './assets/deepverse_logo.png';

function Logo() {
    return (
        <div className="deepverse-logo-wrapper">
            <img src={logo} alt="Deep Verse Logo" className="deepverse-logo" />
        </div>
    );
}

export default Logo;