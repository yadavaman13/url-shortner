import { useContext, createContext, useState } from "react";

const UrlContext = createContext(null)

export const urlProvider = ({children}) => {
    const [url, setUrl] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    return(
        <UrlContext.Provider
            value = {{url,setUrl,loading,setLoading,error,setError}}
        >
            {children}
        </UrlContext.Provider>
    )
}

export const useUrlContext = () => {
    const context = useContext(UrlContext);

    if (!context) {
        throw new Error('useUrlContext must be inside the UrlContext.Provider');
    }

    return context;
};