import { BUILTIN_TEMPLATES } from '@/constants/Templates';
import { useProjectStore } from '@/store/useProjectStore';
import { useRouter } from 'expo-router';
import { ArrowRight, LayoutGrid, Sparkles } from 'lucide-react-native';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 44;

export default function TemplatesScreen() {
  const router = useRouter();
  const { createProjectFromTemplate } = useProjectStore();

  const handleUseTemplate = async (template: any) => {
    const finalName = `${template.title.split('.')[0]}_canvas${template.ext}`;
    const newProj = await createProjectFromTemplate(
      {
        id: template.id,
        title: finalName,
        category: 'blank',
        description: template.description,
        html: template.code,
        css: '',
        js: '',
      },
      finalName
    );
    router.push(`/editor/${newProj.id}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F18" />

      {/* Top Header with Safe Inset */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <LayoutGrid size={22} color="#06B6D4" />
          <Text style={styles.headerTitle}>Template Library</Text>
        </View>
        <Text style={styles.headerSub}>100% offline starter packs with HTML5, CSS3, JS ready to build.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
        {BUILTIN_TEMPLATES.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.badgeRow}>
              <Sparkles size={12} color="#06B6D4" />
              <Text style={styles.badgeText}>{item.category.toUpperCase()}</Text>
            </View>

            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDesc}>{item.description}</Text>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleUseTemplate(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnText}>Load into Canvas</Text>
              <ArrowRight size={14} color="#FFF" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090F',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: STATUS_BAR_HEIGHT + 10,
    paddingBottom: 14,
    backgroundColor: '#0F0F18',
    borderBottomWidth: 1,
    borderBottomColor: '#222234',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  scrollList: {
    padding: 16,
    paddingBottom: 100,
    gap: 12,
  },
  card: {
    backgroundColor: '#12121E',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222234',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#06B6D4',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  itemDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginVertical: 6,
    lineHeight: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    marginTop: 6,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
});

