import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type JokesContextType = {
  savedJokes: string[];
  saveJoke: (joke: string) => void;
  deleteJoke: (index: number) => void;
  clearJokes: () => void;
};

const JokesContext = createContext<JokesContextType | undefined>(undefined);

export const JokesProvider = ({ children }: { children: React.ReactNode }) => {
  const [savedJokes, setSavedJokes] = useState<string[]>([]);

  // 🔹 Cargar desde AsyncStorage cuando inicia la app
  useEffect(() => {
    const loadJokes = async () => {
      try {
        const stored = await AsyncStorage.getItem("savedJokes");
        if (stored) setSavedJokes(JSON.parse(stored));
      } catch (e) {
        console.log("Error loading jokes:", e);
      }
    };
    loadJokes();
  }, []);

  // 🔹 Guardar en AsyncStorage cuando cambia la lista
  useEffect(() => {
    AsyncStorage.setItem("savedJokes", JSON.stringify(savedJokes));
  }, [savedJokes]);

  const saveJoke = (joke: string) => {
    if (!savedJokes.includes(joke)) {
      setSavedJokes([...savedJokes, joke]);
      alert("Joke saved!");
    } else {
      alert("This joke is already saved!");
    }
  };

  const deleteJoke = (index: number) => {
    const newJokes = savedJokes.filter((_, i) => i !== index);
    setSavedJokes(newJokes);
  };

  const clearJokes = () => setSavedJokes([]);

  return (
    <JokesContext.Provider value={{ savedJokes, saveJoke, deleteJoke, clearJokes }}>
      {children}
    </JokesContext.Provider>
  );
};

export const useJokes = () => {
  const context = useContext(JokesContext);
  if (!context) throw new Error("useJokes must be used within a JokesProvider");
  return context;
};
