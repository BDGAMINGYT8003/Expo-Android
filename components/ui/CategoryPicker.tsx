import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemedText } from '../ThemedText';
import { Colors } from '@/constants/Colors';

interface CategoryPickerProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  categories: string[];
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({ selectedValue, onValueChange, categories }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ThemedText style={styles.label}>Category</ThemedText>
      <View style={[styles.pickerContainer, { borderColor: themeColors.icon, backgroundColor: '#2C2C2E' }]}>
        <Picker
          selectedValue={selectedValue}
          style={[styles.picker, { color: themeColors.text }]}
          dropdownIconColor={themeColors.icon}
          onValueChange={(itemValue) => onValueChange(itemValue)}
        >
          <Picker.Item label="All Categories" value="all" />
          {categories.map((category) => (
            <Picker.Item key={category} label={category.charAt(0).toUpperCase() + category.slice(1)} value={category} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginVertical: 10,
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'SpaceMono',
    color: '#c7c7c7',
  },
  pickerContainer: {
    borderRadius: 28,
    borderWidth: 1,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default CategoryPicker;