import { useState, useEffect, Dispatch, SetStateAction } from "react";

const getStorageValue = <T>(key: string, defaultValue: T) => {
    const strValue = localStorage.getItem(key);
    if (strValue === null) return defaultValue;
    try {
        return JSON.parse(strValue) as T;
    } catch {
        return defaultValue;
    }
}

export const useLocalStorage = <T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] => {
    const [value, setValue] = useState<T>(() => {
        return getStorageValue<T>(key, defaultValue);
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};