import { useProjectStore } from '@/store/useProjectStore';
import { useRouter } from 'expo-router';
import { FileCode, Folder, Plus, Search, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 44;

export default function ProjectsScreen() {
  const router = useRouter();
  const { projects, createProjectFromTemplate, deleteProjectById } = useProjectStore();
  const [search, setSearch] = useState('');

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateNew = async () => {
    const count = projects.length + 1;
    const newProj = await createProjectFromTemplate(
      {
        id: 'new',
        title: `file_${count}.html`,
        category: 'blank',
        description: 'New file',
        html: '<!DOCTYPE html>\n<html>\n<body>\n  <h1>New Code</h1>\n</body>\n</html>',
        css: '',
        js: '',
      },
      `file_${count}.html`
    );
    router.push(`/editor/${newProj.id}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F18" />

      {/* Top Header with Safe Inset */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Folder size={22} color="#06B6D4" />
          <Text style={styles.headerTitle}>My Canvases</Text>
        </View>

        <TouchableOpacity onPress={handleCreateNew} style={styles.newBtn} activeOpacity={0.8}>
          <Plus size={16} color="#FFF" />
          <Text style={styles.newBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={16} color="#94A3B8" />
        <TextInput
          placeholder="Search saved canvases..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
        {filtered.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.projectCard}
            onPress={() => router.push(`/editor/${item.id}`)}
            activeOpacity={0.7}
          >
            <View style={styles.iconBox}>
              <FileCode size={20} color="#06B6D4" />
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.projectTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.projectDate}>
                {new Date(item.updatedAt).toLocaleDateString()} • {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                Alert.alert('Delete File', `Delete "${item.title}"?`, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => deleteProjectById(item.id) }
                ]);
              }}
              style={styles.deleteBtn}
            >
              <Trash2 size={16} color="#F87171" />
            </TouchableOpacity>
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: STATUS_BAR_HEIGHT + 10,
    paddingBottom: 12,
    backgroundColor: '#0F0F18',
    borderBottomWidth: 1,
    borderBottomColor: '#222234',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#06B6D4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  newBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    height: 42,
    backgroundColor: '#12121E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#222234',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#FFFFFF',
  },
  scrollList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 8,
  },
  projectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12121E',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222234',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#1A1A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  projectDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  deleteBtn: {
    padding: 6,
  },
});

