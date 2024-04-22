import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from './supabase';
import './style.css';


const RecipeSearch = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  

  useEffect(() => {
    fetchSavedRecipes();
  }, []); 


  const APP_ID = 'd1f32121';
  const APP_KEY = '88b6effb4d9723efc212e72d295399e3';

  const fetchSavedRecipes = async () => {
    try {
      const { data, error } = await supabase.from('recipes').select('*');
      if (error) {
        throw error;
      }
      setSavedRecipes(data || []);
    } catch (error) {
      console.error('Error fetching saved recipes:', error.message);
    }
  };

  const saveRecipe = async (recipe) => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .insert([
          {
            label: recipe.label,
            image: recipe.image,
            url: recipe.url,
          },
        ]);

      if (error) {
        throw error;
      }

      setSavedRecipes([...savedRecipes, data[0]]);
    } catch (error) {
      console.error('Error saving recipe:', error.message);
    }
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(
        `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`
      );
      setRecipes(response.data.hits);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search for recipes..."
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md px-4 py-2 ml-2 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Search
        </button>
      </form>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.recipe.uri} className="mb-4">
            <div className="border border-gray-300 rounded-md p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{recipe.recipe.label}</h2>
                <img src={recipe.recipe.image} alt={recipe.recipe.label} className="mt-2 rounded-md" />
              </div>
              <div>
                <a
                  href={recipe.recipe.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Recipe
                </a>
                <button
                  onClick={() => saveRecipe(recipe.recipe)}
                  className="bg-green-500 text-white rounded-md px-4 py-2 ml-2 hover:bg-green-600 focus:outline-none focus:bg-green-600"
                >
                  Save
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mt-8">Saved Recipes</h2>
      <ul>
        {savedRecipes.map((savedRecipe) => (
          <li key={savedRecipe.id} className="mb-4">
            <div className="border border-gray-300 rounded-md p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{savedRecipe.label}</h2>
                <img src={savedRecipe.image} alt={savedRecipe.label} className="mt-2 rounded-md" />
              </div>
              <div>
                <a
                  href={savedRecipe.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Recipe
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default RecipeSearch;