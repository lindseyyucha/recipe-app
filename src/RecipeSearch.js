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
    <div className="flex flex-col items-center justify-center min-h-screen bg-peach text-brown">
      <h1 className="text-4xl font-bold mt-8 mb-4">Recipe Search</h1>
      <form onSubmit={handleSubmit} className="mb-8 flex items-center justify-center">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search for recipes..."
          className="w-64 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md px-4 py-2 ml-2 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Search
        </button>
      </form>
      <div className="lg:w-1/4 ml-auto">
        <h2 className="text-xl font-semibold mb-4">Saved Recipes</h2>
        <ul>
          {savedRecipes.map((savedRecipe) => (
            <li key={savedRecipe.id} className="mb-4">
              <div className="border border-gray-300 rounded-md p-4">
                <h2 className="text-xl font-semibold">{savedRecipe.label}</h2>
                <img src={savedRecipe.image} alt={savedRecipe.label} className="mt-2 rounded-md" />
                <a
                  href={savedRecipe.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline block mt-2"
                >
                  View Recipe
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeSearch;