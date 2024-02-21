import React, { ReactNode, useState, useContext } from "react";
import { AppContext } from "./appContext";

interface IProps {
    children: ReactNode;
}

const ProductContextProvider = ({ children }: IProps) => {
    const { advancedSettings, setAdvancedSettings } = useContext(AppContext);

    return (
        <AppContext.Provider
            value={{
                advancedSettings,
                setAdvancedSettings,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export default ProductContextProvider;
