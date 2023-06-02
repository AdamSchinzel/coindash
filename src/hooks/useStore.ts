import { useEffect, useState } from "react";

/**
 * Wrapper so Zustand can be used with Next.js
 * @param store The store function which accepts a callback taking the state as a parameter
 * @param callback The callback function that receives the state and returns a transformed value
 * @returns Updated data based on the callback function
 */
const useStore = <T, F>(store: (callback: (state: T) => unknown) => unknown, callback: (state: T) => F) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

export default useStore;
