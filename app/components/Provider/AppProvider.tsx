import { createContext, useContext } from "react";

const context = createContext<{ clearCache: () => void }>(undefined as never);

export const AppProvider = context.Provider;

export const useApp = () => useContext(context);
