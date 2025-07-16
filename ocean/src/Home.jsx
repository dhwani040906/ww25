import './Home.css';
import diveimg from './assets/home_dive.jpg';
import galleryimg from './assets/home_gallery.jpg';
import threatsimg from './assets/home_threats.jpg';
import solutionsimg from './assets/home_solutions.jpg';
import aboutimg from './assets/home_about.jpg';
import communityimg from './assets/home_community.jpg';

function Home() {
    return (
        <div className="whole-home">
            {/* Top Navigation Bar */}
            <div className="task-bar">
                <div className="logo">
                    <h3>DEEP VERSE</h3>
                </div>
                <div className="auth-buttons">
                    <button className="login">Login</button>
                    <button className="logout">Logout</button>
                </div>
            </div>

            {/* Main Section: Left and Right */}
            <div className="main-section">
                {/* Left: Text */}
                <div className="hero-content">
                    <h1 id="heading">LET'S DIVE INTO THE WORLD OF OCEANS</h1>
                    <p id="lines">
                        Dive in to explore the magical layers of the ocean,
                        discover fascinating marine animals and plants in our Gallery,
                        uncover the threats facing our seas, and learn about real-world Solutions
                        being taken to protect them. Sail through history with legendary Ships,
                        and join a growing Community passionate about preserving the deep blue.
                        Every scroll takes you deeper — every click brings you closer to the ocean’s heartbeat!
                    </p>
                </div>

                {/* Right: Scrollable Buttons */}
                <div className="scroll-wrapper">
                    <div className="scroll-bar">
                        <div className="card-container">
                            <button className="card"><img src={diveimg} /><div className="card-title">Dive In</div></button>
                            <button className="card"><img src={galleryimg} /><div className="card-title">Explore</div></button>
                            <button className="card"><img src={threatsimg} /><div className="card-title">Threats</div></button>
                            <button className="card"><img src={solutionsimg} /><div className="card-title">Solutions</div></button>
                            <button className="card"><img src={communityimg} /><div className="card-title">Community</div></button>
                            <button className="card"><img src={aboutimg} /><div className="card-title">About-Us</div></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;