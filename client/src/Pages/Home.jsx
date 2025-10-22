import React, { useState } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";

function Home({ user }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setMessage("");
    try {
      const response = await axios.get(`/api/search?q=${query}`);
      if (response.data.success) {
        setResults(response.data.results);
        if (response.data.results.length === 0) {
          setMessage("No recipes found. Try a different search.");
        }
      }
    } catch (error) {
      setMessage("Error fetching recipes. Please try again.");
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="search-section">
        <h1>Find Your Perfect Recipe</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for recipes..."
            className="search-input"
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="recipes-grid">
        {results.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} user={user} />
        ))}
      </div>
    </div>
  );
}

export default Home;
