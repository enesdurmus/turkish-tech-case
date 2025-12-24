import {createContext, ReactNode, useContext, useState} from 'react';

const ErrorContext = createContext<any>(null);

export function ErrorProvider({children}: { children: ReactNode }) {
    const [error, setError] = useState<string | null>(null);

    const showError = (message: string) => {
        setError(message);
        setTimeout(() => setError(null), 2000);
    };

    return (
        <ErrorContext.Provider value={{error, showError, clearError: () => setError(null)}}>
            {children}
        </ErrorContext.Provider>
    );
}

export function useError() {
    return useContext(ErrorContext);
}
