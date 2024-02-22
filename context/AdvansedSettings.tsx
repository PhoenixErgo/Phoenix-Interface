import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ContextProps {
    advancedSettings: boolean;
    setAdvancedSettings: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdvancedSettingsContext = createContext<ContextProps | undefined>(undefined);

export const AdvancedSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [advancedSettings, setAdvancedSettings] = useState<boolean>(false);

    return (
        <AdvancedSettingsContext.Provider value={{ advancedSettings, setAdvancedSettings }}>
            {children}
        </AdvancedSettingsContext.Provider>
    );
};

export const useAdvancedSettings = (): ContextProps => {
    const context = useContext(AdvancedSettingsContext);
    if (!context) {
        throw new Error('useAdvancedSettings must be used within an AdvancedSettingsProvider');
    }
    return context;
};