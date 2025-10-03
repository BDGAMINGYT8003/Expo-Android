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
      console.error('Failed to fetch categories', e);
    }
  };

  const fetchImage = useCallback(async (category: string) => {
    setIsLoading(true);
    opacity.value = withTiming(0, { duration: 300 });
    let url = 'https://api-random.n-sfw.com/nsfw/';
    if (category === 'all' && categories.length > 0) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      url += randomCategory;
    } else {
      url += category;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setImageUrl(data.url);
      setError(null);
    } catch (e) {
      setError('Failed to fetch image');
      setImageUrl(null);
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
    opacity.value = withTiming(1, { duration: 300 });
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
        {imageUrl && !error ? (
          <AnimatedImage
            source={{ uri: imageUrl }}
            style={[styles.image, animatedStyle]}
            onLoad={handleImageLoad}
            contentFit="contain"
            transition={300}
          />
        ) : (
          <ThemedText>{error || 'Loading...'}</ThemedText>
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
});

export default ImageViewer;