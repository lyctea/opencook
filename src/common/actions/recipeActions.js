import { createAction } from 'redux-actions';
//使用 redux-promise，可以很容易使用非同步的行為 WebAPI
import WebAPI from '../utils/WebAPI';

import {
  GET_RECIPES,
  ADD_RECIPE,
  UPDATE_RECIPE,
  DELETE_RECIPE,
  SET_RECIPE,
} from '../constants/actionTypes';

export const getRecipes = createAction('GET_RECIPES', WebAPI.getRecipes);
export const addRecipe = createAction('ADD_RECIPE', WebAPI.addRecipe);
export const updateRecipe = createAction('UPDATE_RECIPE', WebAPI.updateRecipe);
export const deleteRecipe = createAction('DELETE_RECIPE', WebAPI.deleteRecipe);
export const setRecipe = createAction('SET_RECIPE');
