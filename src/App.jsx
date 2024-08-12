 
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
 
import './App.css';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Spare2 from './pages/Spare2';

function App() {

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Score Creator</Link>
            </li>
            <li>
              <Link to="/about">Drum Machine</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/spare2">Bowling</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/spare2" element={<Spare2 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App