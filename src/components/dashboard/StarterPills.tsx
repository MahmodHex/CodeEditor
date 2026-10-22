import { BUILTIN_TEMPLATES } from '@/constants/Templates';
import { useThemeStore } from '@/store/useThemeStore';
import { StarterTemplate } from '@/types/project';
import { ChevronRight, FileCode, Gamepad2, Layers, Smartphone } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StarterPillsProps {
  onSelectTemplate: (template: StarterTemplate) => void;
}

export function StarterPills({ onSelectTemplate }: StarterPillsProps) {
  const { colors } = useThemeStore();

  const getIcon = (category: string) => {
    switch (category) {
      case 'blank':
        return <FileCode size={22} color="#2563EB" />;
      case 'component':
        return <Layers size={22} color="#9333EA" />;
      case 'game':
        return <Gamepad2 size={22} color="#10B981" />;
      case 'mobile':
        return <Smartphone size={22} color="#F97316" />;
      default:
        return <FileCode size={22} color="#2563EB" />;
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {BUILTIN_TEMPLATES.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border }
            ]}
            onPress={() => onSelectTemplate(item)}
            activeOpacity={0.8}
          >
            <View style={styles.iconBox}>{getIcon(item.category)}</View>
            <View style={styles.textBox}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>{item.title}</Text>
              <Text style={[styles.description, { color: colors.textSecondary }]}>{item.description}</Text>
            </View>
            <ChevronRight size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 18,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 200,
    gap: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  description: {
    fontSize: 11,
    fontWeight: '500',
  },
});

