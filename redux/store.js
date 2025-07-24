import { configureStore } from '@reduxjs/toolkit';
import pokemonReducer from './pokemonSlice';  
import favoriteReducer from './favoriteSlice';  

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
    favorite: favoriteReducer
  }
});