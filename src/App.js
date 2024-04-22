import React from 'react';
import RecipeSearch from './RecipeSearch.js';
import './App.css';


function App() {
  return (
    <div className="app-container"> 
      <h1 className="text-3xl font-semibold text-center my-8">Recipe Search App</h1>
      <RecipeSearch />
    </div>
  );
}

export default App;
