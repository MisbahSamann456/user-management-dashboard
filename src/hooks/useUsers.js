import { useState, useEffect, useCallback } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api/userService";
import { mapApiUserToAppUser, generateUniqueId } from "../utils/helpers";

/**
 * Custom hook that manages the full user list state.
 * Handles fetching, creating, updating, and deleting users,
 * and exposes loading / error states for the UI to consume.
 */
const useUsers = () => {
  const [users,     setUsers]     = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState(null);

  // ─── Fetch ────────────────────────────────────────────────────────────────

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rawUsers    = await getUsers();
      // Pass index so mapApiUserToAppUser can assign alternating active status
      const mappedUsers = rawUsers.map((user, index) =>
        mapApiUserToAppUser(user, index)
      );
      setUsers(mappedUsers);
    } catch (err) {
      setError("Failed to load users. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ─── Create ───────────────────────────────────────────────────────────────

  const addUser = useCallback(async (userData) => {
    try {
      await createUser(userData);
      // userData.active comes from the form (EMPTY_FORM defaults it to true
      // for new users), so we no longer hardcode it here — just attach an id.
      const newUser = {
        ...userData,
        id: generateUniqueId(users),
      };
      setUsers((prev) => [newUser, ...prev]);
    } catch (err) {
      setError("Failed to create user. Please try again.");
    }
  }, [users]);

  // ─── Update ───────────────────────────────────────────────────────────────

  const editUser = useCallback(async (userId, userData) => {
    try {
      await updateUser(userId, userData);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, ...userData } : user
        )
      );
    } catch (err) {
      setError("Failed to update user. Please try again.");
    }
  }, []);

  // ─── Delete ───────────────────────────────────────────────────────────────

  const removeUser = useCallback(async (userId) => {
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      setError("Failed to delete user. Please try again.");
    }
  }, []);

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const clearError = useCallback(() => setError(null), []);

  return { users, isLoading, error, addUser, editUser, removeUser, clearError };
};

export default useUsers;