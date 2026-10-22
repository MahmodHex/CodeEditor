import { BUILTIN_TEMPLATES, TemplateItem } from '@/constants/Templates';
import { useProjectStore } from '@/store/useProjectStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useRouter } from 'expo-router';
import {
  Code2,
  FileCode,
  FolderOpen,
  Gamepad2,
  Layout,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

const { width } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 44;

export default function HomeScreen() {
  const router = useRouter();
  const { mode } = useThemeStore();
  const { projects, createProjectFromTemplate } = useProjectStore();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isDark = mode === 'dark';

  const handleOpenPlayStore = () => {
    setShowMenu(false);
    Linking.openURL('https://play.google.com/store/apps/details?id=com.CodeEditor').catch(() => {
      Alert.alert('Play Store', 'Play Store link will be active after release.');
    });
  };

  const handleRateUs = () => {
    setShowMenu(false);
    Linking.openURL('market://details?id=com.CodeEditor').catch(() => {
      Alert.alert('Rate Us', 'Thank you for your rating!');
    });
  };

  const handlePrivacyPolicy = () => {
    setShowMenu(false);
    Alert.alert('Privacy Policy', 'Code Editor is 100% offline.');
  };

  const handleCreateCategory = async (type: 'web' | 'game' | 'uikit' | 'script' | 'python') => {
    const tmpl = BUILTIN_TEMPLATES.find((t) => t.category === type) || BUILTIN_TEMPLATES[0];
    const extension = tmpl.ext;
    const baseName = type === 'web' ? 'index' : type === 'game' ? 'game' : type === 'uikit' ? 'components' : type === 'script' ? 'main' : 'app';
    const finalName = `${baseName}_${projects.length + 1}${extension}`;

    const newProj = await createProjectFromTemplate(
      {
        id: tmpl.id,
        title: finalName,
        category: 'blank',
        description: tmpl.description,
        html: tmpl.code,
        css: '',
        js: '',
      },
      finalName
    );
    router.push(`/editor/${newProj.id}`);
  };

  const handleCreateFromTemplate = async (template: TemplateItem) => {
    const finalName = `${template.title.split('.')[0]}_${projects.length + 1}${template.ext}`;
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

  const CANVA_CATEGORIES = [
    { id: 'web', title: 'Web Page', icon: Layout, color: '#6366F1' },
    { id: 'game', title: '2D Game', icon: Gamepad2, color: '#EC4899' },
    { id: 'uikit', title: 'UI Kit', icon: Sparkles, color: '#F59E0B' },
    { id: 'script', title: 'Scripts', icon: Code2, color: '#10B981' },
    { id: 'python', title: 'Python', icon: FileCode, color: '#06B6D4' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F18" />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.codeLogoBadge}>
            <Code2 size={18} color="#FFF" />
          </View>
          <View style={styles.brandTitleWrap}>
            <Text style={styles.mainTitle}>Code Editor</Text>
            <Text style={styles.subtitleText}>Preview. & More</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.iconBtn} activeOpacity={0.7}>
          <MoreVertical size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Search */}
        <View style={styles.heroBanner}>
          <Text style={styles.heroHeading}>What will you code today?</Text>
          <View style={styles.searchBox}>
            <Search size={16} color="#94A3B8" />
            <TextInput
              placeholder="Search templates, components, projects..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CANVA_CATEGORIES.map((cat) => {
            const IconComp = cat.icon;
            return (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryCard}
                onPress={() => handleCreateCategory(cat.id as any)}
                activeOpacity={0.8}
              >
                <View style={[styles.catIconWrap, { backgroundColor: cat.color + '22' }]}>
                  <IconComp size={18} color={cat.color} />
                </View>
                <Text style={styles.catTitle}>{cat.title}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Recent Projects */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Projects</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/projects')}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {projects.length === 0 ? (
          <TouchableOpacity 
            style={styles.emptyDesignBox}
            onPress={() => handleCreateCategory('web')}
          >
            <FolderOpen size={32} color="#94A3B8" />
            <Text style={styles.emptyDesignTitle}>No files created yet</Text>
            <Text style={styles.emptyDesignSub}>Tap to create your first code file</Text>
          </TouchableOpacity>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentCardsScroll}>
            {projects.slice(0, 6).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.canvaDesignCard}
                onPress={() => router.push(`/editor/${item.id}`)}
                activeOpacity={0.8}
              >
                <View style={styles.artboardPreviewThumb}>
                  <FileCode size={28} color="#06B6D4" />
                </View>
                <View style={styles.designCardInfo}>
                  <Text style={styles.designCardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.designCardDate}>
                    {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Starter Templates */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Starter Templates</Text>
        </View>

        <View style={styles.templatesGrid}>
          {BUILTIN_TEMPLATES.map((tmpl) => (
            <TouchableOpacity
              key={tmpl.id}
              style={styles.templateGridCard}
              onPress={() => handleCreateFromTemplate(tmpl)}
              activeOpacity={0.8}
            >
              <View style={styles.templateThumbHeader}>
                <Layout size={22} color="#06B6D4" />
              </View>
              <View style={styles.templateBody}>
                <Text style={styles.tmplTitle} numberOfLines={1}>
                  {tmpl.title}
                </Text>
                <Text style={styles.tmplDesc} numberOfLines={2}>
                  {tmpl.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Visible Floating Action Button (+) */}
      <TouchableOpacity 
        style={styles.canvaFabBtn} 
        onPress={() => handleCreateCategory('web')}
        activeOpacity={0.85}
      >
        <Plus size={26} color="#FFFFFF" />
      </TouchableOpacity>

      {/* 3-Dot Menu */}
      <Modal visible={showMenu} transparent animationType="fade" onRequestClose={() => setShowMenu(false)}>
        <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
          <View style={styles.menuOverlay}>
            <View style={styles.menuDropdown}>
              <TouchableOpacity style={styles.menuItem} onPress={handlePrivacyPolicy}>
                <ShieldCheck size={16} color="#10B981" />
                <Text style={styles.menuText}>Privacy policy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={handleOpenPlayStore}>
                <MessageSquare size={16} color="#38BDF8" />
                <Text style={styles.menuText}>Feedback on Play Store</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={handleRateUs}>
                <Star size={16} color="#FBBF24" />
                <Text style={styles.menuText}>Rate us</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: STATUS_BAR_HEIGHT + 8,
    paddingBottom: 10,
    backgroundColor: '#0F0F18',
    borderBottomWidth: 1,
    borderBottomColor: '#222234',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  codeLogoBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#06B6D4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitleWrap: {
    justifyContent: 'center',
  },
  mainTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  subtitleText: {
    fontSize: 10,
    color: '#06B6D4',
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  iconBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  heroBanner: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#161426',
    borderWidth: 1,
    borderColor: '#292546',
  },
  heroHeading: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#0F0F18',
    borderWidth: 1,
    borderColor: '#2D2D42',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#FFFFFF',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#12121E',
    borderWidth: 1,
    borderColor: '#222234',
    gap: 8,
  },
  catIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 12,
    color: '#06B6D4',
    fontWeight: '700',
  },
  emptyDesignBox: {
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 14,
    backgroundColor: '#12121E',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#2D2D42',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  emptyDesignTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyDesignSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  recentCardsScroll: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 18,
  },
  canvaDesignCard: {
    width: 125,
    borderRadius: 12,
    backgroundColor: '#12121E',
    borderWidth: 1,
    borderColor: '#222234',
    overflow: 'hidden',
  },
  artboardPreviewThumb: {
    height: 80,
    backgroundColor: '#09090F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  designCardInfo: {
    padding: 8,
  },
  designCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  designCardDate: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 10,
  },
  templateGridCard: {
    width: (width - 34) / 2,
    borderRadius: 12,
    backgroundColor: '#12121E',
    borderWidth: 1,
    borderColor: '#222234',
    overflow: 'hidden',
  },
  templateThumbHeader: {
    height: 60,
    backgroundColor: '#181826',
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateBody: {
    padding: 8,
  },
  tmplTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tmplDesc: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 14,
  },
  canvaFabBtn: {
    position: 'absolute',
    bottom: 85,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#06B6D4',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    zIndex: 999,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuDropdown: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + 50,
    right: 16,
    width: 210,
    borderRadius: 10,
    backgroundColor: '#161624',
    borderWidth: 1,
    borderColor: '#2E2E42',
    paddingVertical: 6,
    elevation: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
  },
  menuText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});



