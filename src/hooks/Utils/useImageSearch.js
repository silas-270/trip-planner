import { useRef, useState, useCallback } from "react";
import { fetchImages } from '../../services/api/api';

const useImageSearch = () => {
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(false);
  const lastQuery = useRef("");
  const index = useRef(1);

  const search = useCallback(async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      if (query === lastQuery.current) {
        index.current += 10;
      } else {
        index.current = 1;
        lastQuery.current = query;
      }
      const fetched = await fetchImages(query, index.current);
      setImages(fetched);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setImages(null);
    lastQuery.current = "";
    index.current = 1;
  }, []);

  return { images, loading, search, reset };
}

export default useImageSearch;