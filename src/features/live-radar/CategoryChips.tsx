import { ScrollView, Text, TouchableOpacity } from 'react-native';

import { styles } from '../../styles/app.styles';

type Props = {
  categories: string[];
  selected: string;
  onChange: (category: string) => void;
};

export function CategoryChips({ categories, selected, onChange }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[styles.categoryChip, category === selected && styles.categoryChipActive]}
          onPress={() => onChange(category)}>
          <Text style={[styles.categoryText, category === selected && styles.categoryTextActive]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
