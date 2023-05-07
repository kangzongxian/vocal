// Store the context of the user
import { createContext } from 'react';

export const UserContext = createContext({ user: null, username: null });