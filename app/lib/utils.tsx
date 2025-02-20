"use client";

import { Revenue } from './definitions';
import axios from 'axios';
import { getUrl } from 'aws-amplify/storage';
import { Inflectors } from 'en-inflectors';
import nlp from 'compromise';


export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const getImageUrl = async (key: string): Promise<string> => {
      const url = getUrl({
          path: key
      });
        return (await url).url.toString();
};

export function formatDate(date: string) {
  // add a day to the date because... timezones
  const dateObj = new Date(date);
  dateObj.setDate(dateObj.getDate() + 1);
  // console.log(date)
  return dateObj.toLocaleDateString("en-US", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export const getNextRobDay = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // Sunday=0, Monday=1, ... Saturday=6
  // If today is Monday, we want the *next* Monday, which is 7 days away.
  const daysUntilMonday = (1 - dayOfWeek + 7) % 7 || 7;

  // Create a new Date for next Monday at midnight
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  nextMonday.setHours(0, 0, 0, 0);

  return nextMonday;
};

export const isRobDay = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // Sunday=0, Monday=1, ... Saturday=6
  return dayOfWeek === 1;
};

export const getCurrentRobDay = () => {
  if (isRobDay()) {
    return new Date();
  }
  return getNextRobDay();
}

// Define a type for the weather response
interface WeatherResponse {
  temperature: string;
  conditions: string;
}

// Fetch weather forecast based on latitude, longitude, and optionally a date
export async function getWeather(lat: number, lon: number, date?: string): Promise<WeatherResponse> {
  try {
    // Step 1: Call the points endpoint to retrieve the forecast URL
    const pointsResponse = await axios.get(`https://api.weather.gov/points/${lat},${lon}`);

    if (!pointsResponse.data || !pointsResponse.data.properties || !pointsResponse.data.properties.forecast) {
      throw new Error('Unable to retrieve forecast URL from the points endpoint.');
    }

    const forecastUrl = pointsResponse.data.properties.forecast;
    const currentUrl = pointsResponse.data.properties.forecastHourly;
    
    console.log('Forecast URL:', forecastUrl);

    // Step 2: Call the forecast endpoint to retrieve the forecast data
    const forecastResponse = await axios.get(forecastUrl);
    const currentResponse = await axios.get(currentUrl);
    console.log('Forecast response:', forecastResponse.data);
    console.log('Current response:', currentResponse.data);

    if (
      !forecastResponse.data ||
      !forecastResponse.data.properties ||
      !forecastResponse.data.properties.periods ||
      !Array.isArray(forecastResponse.data.properties.periods)
    ) {
      throw new Error('Unable to retrieve weather data from the forecast endpoint.');
    }

    // Extract the relevant forecast period
    const forecastPeriods = forecastResponse.data.properties.periods;
    console.log('Forecast periods:', forecastPeriods);

    if (date) {
     // Find the first period with name "Monday Night"
     var matchingPeriod = forecastPeriods.find((period: { name: string; }) => period.name.includes("Monday") ?? period.name.includes("Tonight"));
     if (isRobDay()) {
      matchingPeriod = forecastPeriods.find((period: { name: string; }) => period.name.includes("Today"));
      if (!matchingPeriod) {
        matchingPeriod = forecastPeriods.find((period: { name: string; }) => period.name.includes("Tonight"));
      }
     } 
    console.log('Matching period:', matchingPeriod);

      if (matchingPeriod) {
        return {
          temperature: `${matchingPeriod.temperature} ${matchingPeriod.temperatureUnit}`,
          conditions: matchingPeriod.detailedForecast,
        };
      } else {
        throw new Error('No forecast available for the specified date.');
      }
    } else {
      const currentPeriod = currentResponse.data.properties.periods[0];
      // Return the current forecast (first period)
      // const currentPeriod = forecastPeriods[0];

      return {
        temperature: `${currentPeriod.temperature} ${currentPeriod.temperatureUnit}`,
        conditions: currentPeriod.shortForecast,
      };
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data. Please try again later.');
  }
}

// Request the current location from the browser and return the latitude and longitude
export async function getCurrentLocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      }
    );
  });
}

/**
 * Converts a sentence in present tense to past tense.
 * @param sentence - The input sentence in present tense.
 * @returns The sentence converted to past tense.
 */
export const convertToPastTense = (sentence: string): string => {
  // Split the sentence into words
  const words = sentence.split(' ');

  // Find the first verb and convert it to past tense
  const convertedWords = words.map((word, index) => {
    // Use Inflectors to handle verb conjugation
    if (index === 0 || (index > 0 && /^(to|at|in|with|for|on|by)$/i.test(words[index - 1]))) {
      const inflector = new Inflectors(word);
      return inflector.toPast() || word; // Convert to past tense if possible
    }
    return word;
  });

  // Join the words back into a sentence
  return convertedWords.join(' ');
};

/**
 * Converts a sentence in present tense to past tense.
 * @param sentence - The input sentence in present tense.
 * @returns The sentence converted to past tense.
 */
export const convertToPastTense2 = (sentence: string): string => {
  // Use compromise to parse the sentence
  // const doc = nlp(sentence);

  // Identify verbs and convert them to past tense
  // doc.verbs().toPastTense().all().text();

  // Return the updated sentence
  return nlp(sentence).verbs().toPastTense().all().text();
};