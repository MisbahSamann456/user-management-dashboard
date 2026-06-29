import axios from "axios";
import { API_URL } from "../utils/constants";

/**
 * Fetches all users from JSONPlaceholder.
 * @returns {Promise<Array>} array of raw API user objects
 */
export const getUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

/**
 * Creates a new user via POST.
 * Note: JSONPlaceholder simulates creation — it always returns id: 11.
 * The caller is responsible for assigning a real unique ID locally.
 *
 * @param {Object} userData - { firstName, lastName, email, department }
 * @returns {Promise<Object>} the created user object returned by the API
 */
export const createUser = async (userData) => {
  const response = await axios.post(API_URL, userData);
  return response.data;
};

/**
 * Updates an existing user via PUT.
 *
 * @param {number} userId   - the ID of the user to update
 * @param {Object} userData - updated user fields
 * @returns {Promise<Object>} the updated user object returned by the API
 */
export const updateUser = async (userId, userData) => {
  const response = await axios.put(`${API_URL}/${userId}`, userData);
  return response.data;
};

/**
 * Deletes a user by ID via DELETE.
 *
 * @param {number} userId - the ID of the user to delete
 * @returns {Promise<void>}
 */
export const deleteUser = async (userId) => {
  await axios.delete(`${API_URL}/${userId}`);
};