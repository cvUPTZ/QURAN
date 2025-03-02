import { useState, useEffect, useCallback } from "react";
import {
  quranAPI,
  QuranPage,
  Ayah,
  Surah,
  SearchResult,
} from "../services/quranAPI";

// Custom hook for using the Quran API
export function useQuranAPI() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<QuranPage | null>(null);
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [translations, setTranslations] = useState<{
    [language: string]: string[];
  }>({});

  // Fetch a specific page
  const fetchPage = useCallback(async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      const page = await quranAPI.getPage(pageNumber);
      setCurrentPage(page);
      return page;
    } catch (err) {
      setError("Failed to fetch page");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a page with translation
  const fetchPageWithTranslation = useCallback(
    async (pageNumber: number, translationCode: string) => {
      setLoading(true);
      setError(null);
      try {
        const page = await quranAPI.getPageWithTranslation(
          pageNumber,
          translationCode,
        );
        setCurrentPage(page);

        // Extract translations
        const pageTranslations: { [language: string]: string[] } = {};
        if (page.ayahs && page.ayahs.length > 0 && page.ayahs[0].translations) {
          Object.keys(page.ayahs[0].translations).forEach((lang) => {
            pageTranslations[lang] = page.ayahs.map(
              (ayah) => ayah.translations?.[lang] || "",
            );
          });
        }
        setTranslations(pageTranslations);

        return page;
      } catch (err) {
        setError("Failed to fetch page with translation");
        console.error(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Fetch a specific surah
  const fetchSurah = useCallback(async (surahNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      const surah = await quranAPI.getSurah(surahNumber);
      setCurrentSurah(surah);
      return surah;
    } catch (err) {
      setError("Failed to fetch surah");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search the Quran
  const searchQuran = useCallback(async (query: string, language = "ar") => {
    setLoading(true);
    setError(null);
    try {
      const results = await quranAPI.search(query, language);
      setSearchResults(results);
      return results;
    } catch (err) {
      setError("Failed to search Quran");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch audio for a page
  const fetchPageAudio = useCallback(
    async (pageNumber: number, reciter?: string) => {
      setLoading(true);
      setError(null);
      try {
        const urls = await quranAPI.getPageAudio(pageNumber, reciter);
        setAudioUrls(urls);
        return urls;
      } catch (err) {
        setError("Failed to fetch audio");
        console.error(err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Get all surahs
  const fetchAllSurahs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await quranAPI.getAllSurahs();
    } catch (err) {
      setError("Failed to fetch all surahs");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get all juzs
  const fetchAllJuzs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await quranAPI.getAllJuzs();
    } catch (err) {
      setError("Failed to fetch all juzs");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    currentPage,
    currentSurah,
    searchResults,
    audioUrls,
    translations,
    fetchPage,
    fetchPageWithTranslation,
    fetchSurah,
    searchQuran,
    fetchPageAudio,
    fetchAllSurahs,
    fetchAllJuzs,
  };
}
