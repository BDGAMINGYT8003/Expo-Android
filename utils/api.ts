import { Alert } from 'react-native';

const API_BASE_URL = 'https://api.n-sfw.com';
const API_RANDOM_BASE_URL = 'https://api-random.n-sfw.com';

export interface Endpoints {
  sfw: string[];
  nsfw: string[];
}

export interface ImageResponse {
  file: string;
  url: string;
}

export const fetchCategories = async (): Promise<Endpoints> => {
  try {
    const response = await fetch(`${API_BASE_URL}/endpoints`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data: Endpoints = await response.json();
    return data;
  } catch (error) {
    Alert.alert('Error', 'Could not fetch categories. Please try again later.');
    return { sfw: [], nsfw: [] };
  }
};

export const fetchImage = async (type: string, category: string): Promise<ImageResponse | null> => {
  try {
    const response = await fetch(`${API_RANDOM_BASE_URL}/${type}/${category}`);
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    const data: ImageResponse = await response.json();
    return data;
  } catch (error) {
    Alert.alert('Error', 'Could not fetch image. Please try again later.');
    return null;
  }
};