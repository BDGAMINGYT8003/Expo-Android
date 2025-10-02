import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { fetchCategories, fetchImage, Endpoints, ImageResponse } from '@/utils/api';
import { Image } from 'expo-image';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';

export default function HomeScreen() {
  const [categories, setCategories] = useState<Endpoints>({ sfw: [], nsfw: [] });
  const [selectedType, setSelectedType] = useState('sfw');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [image, setImage] = useState<ImageResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    };
    loadCategories();
  }, []);

  const handleFetchImage = async () => {
    setLoading(true);
    setImage(null);
    let categoryToFetch = selectedCategory;
    let typeToFetch = selectedType;

    if (selectedCategory === 'all') {
      const allCategories = [...categories.sfw, ...categories.nsfw];
      categoryToFetch = allCategories[Math.floor(Math.random() * allCategories.length)];
      if (categories.nsfw.includes(categoryToFetch)) {
        typeToFetch = 'nsfw';
      } else {
        typeToFetch = 'sfw';
      }
    }

    const fetchedImage = await fetchImage(typeToFetch, categoryToFetch);
    setImage(fetchedImage);
    setLoading(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Anime Image Fetcher</ThemedText>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedType}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedType(itemValue)}
        >
          <Picker.Item label="SFW" value="sfw" />
          <Picker.Item label="NSFW" value="nsfw" />
        </Picker>
        <Picker
          selectedValue={selectedCategory}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        >
          <Picker.Item label="All Categories" value="all" />
          {(selectedType === 'sfw' ? categories.sfw : categories.nsfw).map((category) => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>
      </View>
      <View style={styles.imageContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : (
          image && <Image source={{ uri: image.url }} style={styles.image} contentFit="contain" />
        )}
      </View>
      <View style={styles.buttonContainer}>
        <FontAwesome.Button name="random" backgroundColor="#3b5998" onPress={handleFetchImage}>
          Fetch New Image
        </FontAwesome.Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#121212',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    borderRadius: 25,
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: 160,
    color: '#e0e0e0',
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    borderWidth: 2,
    borderColor: '#2c2c2c',
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    marginVertical: 20,
    width: '80%',
    borderRadius: 25,
  },
});