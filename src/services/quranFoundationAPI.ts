import axios from "axios";

// Define types for Quran Foundation API responses
interface QuranFoundationPage {
  page: number;
  verses: QuranFoundationVerse[];
  meta: {
    juz: number;
    hizb: number;
    rub: number;
    surahs: {
      number: number;
      name: string;
      englishName: string;
      verses: number[];
    }[];
  };
}

interface QuranFoundationVerse {
  id: number;
  verse_key: string;
  text_uthmani: string;
  text_indopak?: string;
  juz_number: number;
  hizb_number: number;
  rub_number: number;
  sajdah_type?: string;
  page_number: number;
  surah: {
    id: number;
    name: string;
    english_name: string;
    revelation_place: string;
    revelation_order: number;
    verses_count: number;
  };
  words: QuranFoundationWord[];
  translations?: {
    [language: string]: string;
  };
}

interface QuranFoundationWord {
  id: number;
  position: number;
  text_uthmani: string;
  text_indopak?: string;
  code_v1?: string;
  page_number: number;
  line_number: number;
  audio?: {
    url: string;
  };
  translation?: {
    text: string;
    language: string;
  };
  transliteration?: {
    text: string;
    language: string;
  };
}

interface QuranFoundationSurah {
  id: number;
  name: string;
  english_name: string;
  english_name_translation: string;
  revelation_place: string;
  revelation_order: number;
  verses_count: number;
  pages: number[];
}

interface QuranFoundationJuz {
  id: number;
  juz_number: number;
  verse_mapping: {
    [surahNumber: string]: string;
  };
  first_verse_id: number;
  last_verse_id: number;
  verses_count: number;
}

interface QuranFoundationSearchResult {
  verses: QuranFoundationVerse[];
  total: number;
  page: number;
  per_page: number;
}

interface QuranFoundationReciter {
  id: number;
  name: string;
  style?: string;
  recitation_style?: string;
}

interface QuranFoundationTranslation {
  id: number;
  name: string;
  author_name: string;
  language_name: string;
  translator_foreign_name?: string;
}

// Main API class for Quran Foundation API
class QuranFoundationAPI {
  private baseURL: string;
  private defaultReciter: number;
  private defaultTranslation: number;

  constructor() {
    this.baseURL = "https://api.quran.foundation/api/v1";
    this.defaultReciter = 7; // Mishary Rashid Alafasy
    this.defaultTranslation = 131; // Sahih International
  }

  // Get a specific page of the Quran
  async getPage(pageNumber: number): Promise<QuranFoundationPage> {
    try {
      const response = await axios.get(
        `${this.baseURL}/pages/${pageNumber}?words=true`,
      );
      return response.data.page;
    } catch (error) {
      console.error("Error fetching Quran page:", error);
      throw new Error("Failed to fetch Quran page");
    }
  }

  // Get a specific page with translation
  async getPageWithTranslation(
    pageNumber: number,
    translationId = this.defaultTranslation,
  ): Promise<QuranFoundationPage> {
    try {
      const response = await axios.get(
        `${this.baseURL}/pages/${pageNumber}?words=true&translations=${translationId}`,
      );
      return response.data.page;
    } catch (error) {
      console.error("Error fetching Quran page with translation:", error);
      throw new Error("Failed to fetch Quran page with translation");
    }
  }

  // Get a specific surah
  async getSurah(surahNumber: number): Promise<QuranFoundationSurah> {
    try {
      const response = await axios.get(
        `${this.baseURL}/chapters/${surahNumber}`,
      );
      return response.data.chapter;
    } catch (error) {
      console.error("Error fetching surah:", error);
      throw new Error("Failed to fetch surah");
    }
  }

  // Get a specific juz
  async getJuz(juzNumber: number): Promise<QuranFoundationJuz> {
    try {
      const response = await axios.get(`${this.baseURL}/juzs/${juzNumber}`);
      return response.data.juz;
    } catch (error) {
      console.error("Error fetching juz:", error);
      throw new Error("Failed to fetch juz");
    }
  }

  // Get audio for a specific verse
  getVerseAudio(verseKey: string, reciterId = this.defaultReciter): string {
    return `${this.baseURL}/recitations/${reciterId}/by_verse/${verseKey}`;
  }

  // Get audio for a specific page from a specific reciter
  async getPageAudio(
    pageNumber: number,
    reciterId = this.defaultReciter,
  ): Promise<string[]> {
    try {
      const page = await this.getPage(pageNumber);
      return page.verses.map((verse) =>
        this.getVerseAudio(verse.verse_key, reciterId),
      );
    } catch (error) {
      console.error("Error fetching page audio:", error);
      throw new Error("Failed to fetch page audio");
    }
  }

  // Search the Quran
  async search(
    query: string,
    language = "en",
  ): Promise<QuranFoundationSearchResult> {
    try {
      const response = await axios.get(
        `${this.baseURL}/search?query=${encodeURIComponent(query)}&language=${language}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error searching Quran:", error);
      throw new Error("Failed to search Quran");
    }
  }

  // Get available reciters
  async getReciters(): Promise<QuranFoundationReciter[]> {
    try {
      const response = await axios.get(`${this.baseURL}/resources/recitations`);
      return response.data.recitations;
    } catch (error) {
      console.error("Error fetching reciters:", error);
      throw new Error("Failed to fetch reciters");
    }
  }

  // Get available translations
  async getTranslations(): Promise<QuranFoundationTranslation[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/resources/translations`,
      );
      return response.data.translations;
    } catch (error) {
      console.error("Error fetching translations:", error);
      throw new Error("Failed to fetch translations");
    }
  }

  // Get metadata for all surahs
  async getAllSurahs(): Promise<QuranFoundationSurah[]> {
    try {
      const response = await axios.get(`${this.baseURL}/chapters`);
      return response.data.chapters;
    } catch (error) {
      console.error("Error fetching all surahs:", error);
      throw new Error("Failed to fetch all surahs");
    }
  }

  // Get metadata for all juzs
  async getAllJuzs(): Promise<QuranFoundationJuz[]> {
    try {
      const response = await axios.get(`${this.baseURL}/juzs`);
      return response.data.juzs;
    } catch (error) {
      console.error("Error fetching all juzs:", error);
      throw new Error("Failed to fetch all juzs");
    }
  }

  // Get word positions for a page
  async getWordPositions(pageNumber: number): Promise<{
    [verseKey: string]: {
      bounds: {
        top: number;
        left: number;
        width: number;
        height: number;
      }[];
    };
  }> {
    try {
      const response = await axios.get(
        `${this.baseURL}/pages/${pageNumber}/word_positions`,
      );
      return response.data.positions;
    } catch (error) {
      console.error("Error fetching word positions:", error);

      // Return a simulated positions object as fallback
      const page = await this.getPage(pageNumber);
      const positions: {
        [verseKey: string]: {
          bounds: {
            top: number;
            left: number;
            width: number;
            height: number;
          }[];
        };
      } = {};

      // Create simulated positions for demonstration
      page.verses.forEach((verse, verseIndex) => {
        const bounds = [];
        const wordsCount = verse.words.length;

        for (let i = 0; i < wordsCount; i++) {
          bounds.push({
            top: 50 + verseIndex * 30, // Simulated vertical position
            left: 50 + i * 40, // Simulated horizontal position
            width: 30, // Simulated width
            height: 20, // Simulated height
          });
        }

        positions[verse.verse_key] = { bounds };
      });

      return positions;
    }
  }
}

// Export a singleton instance
export const quranFoundationAPI = new QuranFoundationAPI();

// Export types for use in other components
export type {
  QuranFoundationPage,
  QuranFoundationVerse,
  QuranFoundationWord,
  QuranFoundationSurah,
  QuranFoundationJuz,
  QuranFoundationSearchResult,
  QuranFoundationReciter,
  QuranFoundationTranslation,
};
