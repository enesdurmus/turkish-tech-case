import React, {createContext, useContext, useState, ReactNode} from 'react';

interface ErrorContextType {
    showError: (message: string) => void;
    error: string | null;
    clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [error, setError] = useState<string | null>(null);

    const showError = (message: string) => {
        setError(message);
        setTimeout(() => {
            setError(null);
        }, 2000);
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <ErrorContext.Provider value={{showError, error, clearError}}>
            {children}
        </ErrorContext.Provider>
    );
};

export const useError = () => {
    const context = useContext(ErrorContext);
    if (context === undefined) {
        throw new Error('useError must be used within an ErrorProvider');
    }
    return context;
};
