import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Favorites from "./Pages/Favorites";
import RecipeDetail from "./Pages/RecipeDetail";
import BrowserTest from "./Pages/BrowserTest";
import { BrowserDetection } from "./utils/browserDetection";
import "./styles/globals.css";

axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize browser detection and apply compatibility classes
    BrowserDetection.applyBrowserClasses();
    
    // Log browser info in development
    if (import.meta.env?.DEV) {
      BrowserDetection.logBrowserInfo();
    }
    
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get("/api/auth/status");
      if (response.data.authenticated) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Header user={user} onLogout={handleLogout} />
        <main id="main-content" className="main-content">
          <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/favorites"
            element={user ? <Favorites /> : <Navigate to="/login" />}
          />
          <Route path="/recipe/:id" element={<RecipeDetail user={user} />} />
          <Route path="/browser-test" element={<BrowserTest />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
