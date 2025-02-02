import { useEffect, useState, createContext, useContext } from 'react';
import { getTranslations } from './request';
import { useRouter } from 'next/router';

const TranslationContext = createContext();

export function TranslationProvider({ children }) {
    const { locale } = useRouter();
    const [translations, setTranslations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getTranslations();
            setTranslations(data?.translations);
        };

        fetchData();
    }, [locale]);

    return (
        <TranslationContext.Provider value={translations}>
            {children}
        </TranslationContext.Provider>
    );
}

export function useTranslations() {
    return useContext(TranslationContext);
}