import axios from "axios";

// Define types for API responses
interface QuranPage {
  number: number;
  ayahs: Ayah[];
  surahs: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    ayahs: Ayah[];
  }[];
  juzNumber: number;
  hizbNumber: number;
  rub3Number: number;
  sajdah: boolean;
}

interface Ayah {
  number: number;
  text: string;
  surah: {
    number: number;
    name: string;
  };
  numberInSurah: number;
  juz: number;
  page: number;
  audio: {
    primary: string;
    secondary: string[];
  };
  translations?: {
    [language: string]: string;
  };
  sajdah?: boolean;
}

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Juz {
  number: number;
  ayahs: Ayah[];
  surahs: {
    [surahNumber: string]: {
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
      ayahs: Ayah[];
    };
  };
}

interface SearchResult {
  ayahs: Ayah[];
  count: number;
}

interface Reciter {
  identifier: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
}

interface Translation {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
}

// Main API class
class QuranAPI {
  private baseURL: string;
  private apiKey: string | null;
  private defaultReciter: string;
  private defaultTranslation: string;

  constructor() {
    // Using Alquran.cloud API as the primary source
    this.baseURL = "https://api.alquran.cloud/v1";
    // Using QuranAPI.com as a backup
    this.apiKey = null; // Set your API key here if needed
    this.defaultReciter = "ar.alafasy"; // Mishary Rashid Alafasy
    this.defaultTranslation = "en.sahih"; // Sahih International
  }

  // Get a specific page of the Quran
  async getPage(pageNumber: number): Promise<QuranPage> {
    try {
      const response = await axios.get(
        `${this.baseURL}/page/${pageNumber}/quran-uthmani`,
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching Quran page:", error);
      throw new Error("Failed to fetch Quran page");
    }
  }

  // Get a specific page with translation
  async getPageWithTranslation(
    pageNumber: number,
    translation = this.defaultTranslation,
  ): Promise<QuranPage> {
    try {
      const response = await axios.get(
        `${this.baseURL}/page/${pageNumber}/quran-uthmani,${translation}`,
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching Quran page with translation:", error);
      throw new Error("Failed to fetch Quran page with translation");
    }
  }

  // Get a specific surah
  async getSurah(surahNumber: number): Promise<Surah> {
    try {
      const response = await axios.get(`${this.baseURL}/surah/${surahNumber}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching surah:", error);
      throw new Error("Failed to fetch surah");
    }
  }

  // Get a specific juz
  async getJuz(juzNumber: number): Promise<Juz> {
    try {
      const response = await axios.get(
        `${this.baseURL}/juz/${juzNumber}/quran-uthmani`,
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching juz:", error);
      throw new Error("Failed to fetch juz");
    }
  }

  // Get audio for a specific ayah from a specific reciter
  getAyahAudio(
    surahNumber: number,
    ayahNumber: number,
    reciter = this.defaultReciter,
  ): string {
    return `${this.baseURL}/ayah/${surahNumber}:${ayahNumber}/${reciter}`;
  }

  // Get audio for a specific page from a specific reciter
  async getPageAudio(
    pageNumber: number,
    reciter = this.defaultReciter,
  ): Promise<string[]> {
    try {
      const page = await this.getPage(pageNumber);
      return page.ayahs.map(
        (ayah) =>
          `https://verses.quran.com/${reciter}/${ayah.surah.number}/${ayah.numberInSurah}.mp3`,
      );
    } catch (error) {
      console.error("Error fetching page audio:", error);
      throw new Error("Failed to fetch page audio");
    }
  }

  // Search the Quran
  async search(query: string, language = "ar"): Promise<SearchResult> {
    try {
      const response = await axios.get(
        `${this.baseURL}/search/${query}/${language}`,
      );
      return response.data.data;
    } catch (error) {
      console.error("Error searching Quran:", error);
      throw new Error("Failed to search Quran");
    }
  }

  // Get available reciters
  async getReciters(): Promise<Reciter[]> {
    try {
      const response = await axios.get(`${this.baseURL}/edition/format/audio`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching reciters:", error);
      throw new Error("Failed to fetch reciters");
    }
  }

  // Get available translations
  async getTranslations(): Promise<Translation[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/edition/type/translation`,
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching translations:", error);
      throw new Error("Failed to fetch translations");
    }
  }

  // Get ayah positions on the page (for highlighting)
  async getAyahPositions(
    pageNumber: number,
  ): Promise<{
    [ayahKey: string]: {
      top: number;
      left: number;
      width: number;
      height: number;
    };
  }> {
    // This is a placeholder. In a real implementation, you would need a database of ayah positions
    // or use an API that provides this information
    const page = await this.getPage(pageNumber);
    const positions: {
      [ayahKey: string]: {
        top: number;
        left: number;
        width: number;
        height: number;
      };
    } = {};

    // Create simulated positions for demonstration
    page.ayahs.forEach((ayah, index) => {
      const key = `${ayah.surah.number}:${ayah.numberInSurah}`;
      positions[key] = {
        top: 10 + index * 30, // Simulated vertical position
        left: 10, // Simulated horizontal position
        width: 80, // Simulated width
        height: 25, // Simulated height
      };
    });

    return positions;
  }

  // Get metadata for all surahs
  async getAllSurahs(): Promise<Surah[]> {
    try {
      const response = await axios.get(`${this.baseURL}/surah`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching all surahs:", error);
      throw new Error("Failed to fetch all surahs");
    }
  }

  // Get metadata for all juzs
  async getAllJuzs(): Promise<{ number: number; startPage: number }[]> {
    // This is a simplified implementation since the API doesn't directly provide juz metadata
    const juzs = [];
    for (let i = 1; i <= 30; i++) {
      try {
        const juz = await this.getJuz(i);
        const firstAyah = juz.ayahs[0];
        juzs.push({
          number: i,
          startPage: firstAyah.page,
        });
      } catch (error) {
        console.error(`Error fetching juz ${i}:`, error);
      }
    }
    return juzs;
  }
}

// Export a singleton instance
export const quranAPI = new QuranAPI();

// Export types for use in other components
export type { QuranPage, Ayah, Surah, Juz, SearchResult, Reciter, Translation };
