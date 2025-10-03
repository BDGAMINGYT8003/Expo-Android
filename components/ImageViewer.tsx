import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from './ThemedText';
import CategoryPicker from './ui/CategoryPicker';
import Button from './ui/Button';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Image } from 'expo-image';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const ImageViewer = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://api.n-sfw.com/endpoints');
      const data = await response.json();
      setCategories(data.nsfw);
    } catch (e) {
      setError('Failed to fetch categories.');
      console.error('Failed to fetch categories', e);
    }
  };

  const fetchImage = useCallback(async (category: string) => {
    setIsLoading(true);
    setError(null);
    opacity.value = withTiming(0, { duration: 200 });

    let endpointCategory = category;
    if (category === 'all') {
      if (categories.length === 0) {
        setError("Categories are not loaded yet. Please wait.");
        setIsLoading(false);
        return;
      }
      endpointCategory = categories[Math.floor(Math.random() * categories.length)];
    }

    const url = `https://api-random.n-sfw.com/nsfw/${endpointCategory}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API returned error: ${response.status}`);
      }
      const data = await response.json();

      if (data && data.url) {
        setImageUrl(data.url);
      } else {
        throw new Error('Invalid data format from API.');
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to fetch image. ${message}`);
      setImageUrl(null);
      setIsLoading(false);
    }
  }, [categories, opacity]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchImage(selectedCategory);
    }
  }, [selectedCategory, categories, fetchImage]);

  const handleImageLoad = () => {
    setIsLoading(false);
    opacity.value = withTiming(1, { duration: 500 });
  };

  return (
    <View style={styles.container}>
      <CategoryPicker
        selectedValue={selectedCategory}
        onValueChange={(value) => setSelectedCategory(value)}
        categories={categories}
      />
      <View style={styles.imageContainer}>
        {isLoading && <ActivityIndicator size="large" color="#c7c7c7" style={StyleSheet.absoluteFill} />}

        {imageUrl && !error && (
          <AnimatedImage
            source={{ uri: imageUrl }}
            style={[styles.image, animatedStyle]}
            onLoad={handleImageLoad}
            onError={() => {
                setError('Failed to load image from URL.');
                setIsLoading(false);
            }}
            contentFit="contain"
            transition={300}
          />
        )}

        {error && !isLoading && (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        )}
      </View>
      <Button onPress={() => fetchImage(selectedCategory)} title="Next" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#121212',
    paddingVertical: 20,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    flex: 1,
    width: '100%',
  },
  errorContainer: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#2C2C2E',
    marginHorizontal: 20,
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'SpaceMono',
  },
});

export default ImageViewer;