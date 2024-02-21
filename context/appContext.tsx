import { createContext, useContext } from "react";

interface IAppContext {
    advancedSettings: boolean;
    setAdvancedSettings: (value: boolean) => void;
}

export const AppContext = createContext<IAppContext>({
    advancedSettings: false,
    setAdvancedSettings: (value: boolean) => { }
});

export const useAppContext = () => useContext(AppContext);