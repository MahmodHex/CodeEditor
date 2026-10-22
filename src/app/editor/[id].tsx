import { QuickKeys } from '@/components/editor/QuickKeys';
import { useProjectStore } from '@/store/useProjectStore';
import { bundleCode } from '@/utils/bundler';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Check,
  ClipboardList,
  Copy,
  Edit2,
  FileCode,
  Folder,
  Globe,
  Menu,
  MoreVertical,
  Palette,
  Play,
  Plus,
  RotateCcw,
  RotateCw,
  Save,
  X
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Alert,
  Clipboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { WebView } from 'react-native-webview';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 44;

interface ThemeColorPreset {
  id: string;
  name: string;
  bg: string;
  text: string;
  header: string;
}

const THEME_PRESETS: ThemeColorPreset[] = [
  { id: 'dark-default', name: 'Dark Pro', bg: '#0F0F16', text: '#F8FAFC', header: '#171722' },
  { id: 'monokai', name: 'Monokai Dark', bg: '#272822', text: '#F8F8F2', header: '#1E1F1C' },
  { id: 'cyberpunk', name: 'Neon Cyber', bg: '#0D0B18', text: '#38BDF8', header: '#17142A' },
  { id: 'light-clean', name: 'Light White', bg: '#FFFFFF', text: '#0F172A', header: '#F1F5F9' },
  { id: 'sepia', name: 'Sepia Paper', bg: '#FDF6E3', text: '#657B83', header: '#EEE8D5' },
];

export default function EditorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { projects, updateProjectContent, createProjectFromTemplate, deleteProjectById, renameProject } = useProjectStore();

  const currentProject = projects.find((p) => p.id === id);

  const [code, setCode] = useState(
    currentProject?.html || '<!DOCTYPE html>\n<html>\n<head>\n  <title>App</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>'
  );
  const [history, setHistory] = useState<string[]>([code]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const [activeTheme, setActiveTheme] = useState<ThemeColorPreset>(THEME_PRESETS[0]);

  const [showMenu, setShowMenu] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showFolderDrawer, setShowFolderDrawer] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newTitleInput, setNewTitleInput] = useState('');

  useEffect(() => {
    if (currentProject) {
      setCode(currentProject.html || '');
      setHistory([currentProject.html || '']);
      setHistoryIdx(0);
    }
  }, [id, currentProject?.id]);

  useEffect(() => {
    if (!currentProject) return;
    const timer = setTimeout(() => {
      updateProjectContent(currentProject.id, code, '', '');
    }, 600);
    return () => clearTimeout(timer);
  }, [code]);

  const handleCodeChange = (text: string) => {
    setCode(text);
    const updated = history.slice(0, historyIdx + 1);
    setHistory([...updated, text]);
    setHistoryIdx(updated.length);
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      setCode(history[historyIdx - 1]);
      setHistoryIdx(historyIdx - 1);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      setCode(history[historyIdx + 1]);
      setHistoryIdx(historyIdx + 1);
    }
  };

  const handleCreateNewBlank = async () => {
    setShowFolderDrawer(false);
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
    router.replace(`/editor/${newProj.id}`);
  };

  const handleConfirmRename = () => {
    if (currentProject && newTitleInput.trim()) {
      renameProject(currentProject.id, newTitleInput.trim());
      setShowRenameModal(false);
    }
  };

  const handleSaveAndShare = async () => {
    if (currentProject) {
      await updateProjectContent(currentProject.id, code, '', '');
    }
    Alert.alert(
      'Saved Successfully',
      `File "${currentProject?.title || 'file.html'}" saved. Do you want to share it?`,
      [
        { text: 'Done', style: 'cancel' },
        {
          text: 'Share',
          onPress: async () => {
            try {
              await Share.share({ title: currentProject?.title || 'Code File', message: code });
            } catch (err: any) {
              console.error(err.message);
            }
          },
        },
      ]
    );
  };

  const isDark = activeTheme.bg !== '#FFFFFF' && activeTheme.bg !== '#FDF6E3';
  const compiledHtml = bundleCode(code, '', '');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: activeTheme.bg }]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={activeTheme.header} />

      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: activeTheme.header, paddingTop: STATUS_BAR_HEIGHT + 4 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => setShowFolderDrawer(true)} style={styles.iconBtn}>
            <Menu size={20} color={isDark ? '#F1F5F9' : '#0F172A'} />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => {
              if (currentProject) {
                setNewTitleInput(currentProject.title);
                setShowRenameModal(true);
              }
            }} 
            style={styles.fileNameButton}
          >
            <Text style={[styles.headerTitle, { color: isDark ? '#F1F5F9' : '#0F172A' }]} numberOfLines={1}>
              {currentProject?.title || 'noname.html'}
            </Text>
            <Edit2 size={12} color="#94A3B8" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleCreateNewBlank} style={styles.iconBtn}>
            <Plus size={19} color={isDark ? '#FFF' : '#000'} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSaveAndShare} style={styles.iconBtn}>
            <Save size={18} color="#06B6D4" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleUndo} disabled={historyIdx === 0} style={styles.iconBtn}>
            <RotateCcw size={17} color={historyIdx > 0 ? (isDark ? '#FFF' : '#000') : '#64748B'} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRedo} disabled={historyIdx >= history.length - 1} style={styles.iconBtn}>
            <RotateCw size={17} color={historyIdx < history.length - 1 ? (isDark ? '#FFF' : '#000') : '#64748B'} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowPreviewModal(true)} style={styles.iconBtn}>
            <Play size={17} color="#10B981" fill="#10B981" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.iconBtn}>
            <MoreVertical size={19} color={isDark ? '#F1F5F9' : '#0F172A'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Editor Body */}
      <View style={styles.editorWrapper}>
        <TextInput
          value={code}
          onChangeText={handleCodeChange}
          multiline
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          style={[
            styles.codeArea,
            {
              backgroundColor: activeTheme.bg,
              color: activeTheme.text,
            }
          ]}
        />
      </View>

      {/* Quick Symbol Toolbar */}
      <QuickKeys onInsertSymbol={(sym) => handleCodeChange(code + sym)} isDark={isDark} />

      {/* Rename Modal */}
      <Modal visible={showRenameModal} transparent animationType="fade" onRequestClose={() => setShowRenameModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.dialogCard, { backgroundColor: isDark ? '#1C1C28' : '#FFFFFF' }]}>
            <Text style={[styles.dialogTitle, { color: isDark ? '#FFF' : '#0F172A' }]}>Rename File</Text>
            <TextInput
              value={newTitleInput}
              onChangeText={setNewTitleInput}
              autoFocus
              style={[styles.fileNameInput, { backgroundColor: isDark ? '#12121A' : '#F8FAFC', color: isDark ? '#FFF' : '#000' }]}
            />
            <View style={styles.dialogActions}>
              <TouchableOpacity onPress={() => setShowRenameModal(false)} style={styles.cancelBtn}>
                <Text style={{ color: '#94A3B8' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmRename} style={styles.confirmBtn}>
                <Text style={styles.confirmBtnText}>RENAME</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Left Folder Drawer with Bottom Add Button */}
      <Modal visible={showFolderDrawer} transparent animationType="fade" onRequestClose={() => setShowFolderDrawer(false)}>
        <View style={styles.drawerBackdrop}>
          <View style={[styles.drawerContent, { backgroundColor: isDark ? '#12121B' : '#FFFFFF' }]}>
            <View style={styles.drawerHeader}>
              <View style={styles.drawerTitleRow}>
                <Folder size={18} color="#06B6D4" />
                <Text style={[styles.drawerTitle, { color: isDark ? '#FFF' : '#0F172A' }]}>Project Files</Text>
              </View>
              <TouchableOpacity onPress={() => setShowFolderDrawer(false)}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1, marginTop: 10 }}>
              {projects.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.fileItemRow, item.id === id && { backgroundColor: isDark ? '#1E1E2E' : '#EEF2FF' }]}
                  onPress={() => {
                    setShowFolderDrawer(false);
                    if (item.id !== id) router.replace(`/editor/${item.id}`);
                  }}
                >
                  <FileCode size={16} color="#06B6D4" />
                  <Text style={[styles.fileItemTitle, { color: isDark ? '#FFF' : '#0F172A' }]} numberOfLines={1}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Bottom Add File Action Button */}
            <TouchableOpacity style={styles.drawerAddBtn} onPress={handleCreateNewBlank} activeOpacity={0.85}>
              <Plus size={18} color="#FFF" />
              <Text style={styles.drawerAddBtnText}>Add New File</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 3-Dot Menu */}
      <Modal visible={showMenu} transparent animationType="none" onRequestClose={() => setShowMenu(false)}>
        <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
          <View style={styles.menuBackdrop}>
            <View style={[styles.menuDropdown, { backgroundColor: isDark ? '#1C1C28' : '#FFFFFF', top: STATUS_BAR_HEIGHT + 45 }]}>
              <TouchableOpacity style={styles.menuItem} onPress={() => { Clipboard.setString(code); setShowMenu(false); Alert.alert('Copied'); }}>
                <Copy size={16} color={isDark ? '#FFF' : '#0F172A'} />
                <Text style={[styles.menuItemText, { color: isDark ? '#FFF' : '#0F172A' }]}>Copy All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={async () => { const text = await Clipboard.getString(); handleCodeChange(code + text); setShowMenu(false); }}>
                <ClipboardList size={16} color={isDark ? '#FFF' : '#0F172A'} />
                <Text style={[styles.menuItemText, { color: isDark ? '#FFF' : '#0F172A' }]}>Paste</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); setShowThemeModal(true); }}>
                <Palette size={16} color="#06B6D4" />
                <Text style={[styles.menuItemText, { color: isDark ? '#FFF' : '#0F172A', fontWeight: '700' }]}>Themes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Themes Modal */}
      <Modal visible={showThemeModal} transparent animationType="fade" onRequestClose={() => setShowThemeModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.themeDialogCard, { backgroundColor: isDark ? '#1C1C28' : '#FFFFFF' }]}>
            <Text style={[styles.dialogTitle, { color: isDark ? '#FFF' : '#0F172A' }]}>Themes</Text>
            {THEME_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.id}
                style={[styles.presetRow, { backgroundColor: preset.bg }]}
                onPress={() => { setActiveTheme(preset); setShowThemeModal(false); }}
              >
                <Text style={{ color: preset.text, fontWeight: '700' }}>{preset.name}</Text>
                {activeTheme.id === preset.id && <Check size={16} color="#06B6D4" />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Live Preview Modal */}
      <Modal visible={showPreviewModal} animationType="slide" onRequestClose={() => setShowPreviewModal(false)}>
        <View style={styles.previewStageBackground}>
          <View style={[styles.previewBrowserHeader, { paddingTop: STATUS_BAR_HEIGHT + 6 }]}>
            <View style={styles.previewAddressBar}>
              <Globe size={13} color="#94A3B8" />
              <Text style={styles.previewAddressText} numberOfLines={1}>preview://{currentProject?.title || 'index.html'}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowPreviewModal(false)} style={styles.closePreviewBtn}>
              <X size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.artboardCanvasContainer}>
            <View style={styles.artboardFrameBorder}>
              <WebView originWhitelist={['*']} source={{ html: compiledHtml }} style={{ flex: 1 }} javaScriptEnabled domStorageEnabled />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#222234',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileNameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
    maxWidth: 130,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    padding: 6,
  },
  editorWrapper: {
    flex: 1,
  },
  codeArea: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    fontFamily: 'monospace',
    textAlignVertical: 'top',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogCard: {
    width: '100%',
    borderRadius: 12,
    padding: 18,
  },
  dialogTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  fileNameInput: {
    height: 42,
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 14,
    gap: 12,
  },
  cancelBtn: {
    padding: 8,
  },
  confirmBtn: {
    backgroundColor: '#06B6D4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  confirmBtnText: {
    color: '#FFF',
    fontWeight: '800',
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  drawerContent: {
    width: 270,
    height: '100%',
    padding: 14,
    paddingTop: STATUS_BAR_HEIGHT + 10,
    paddingBottom: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#222234',
  },
  drawerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  fileItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 8,
    marginBottom: 4,
  },
  fileItemTitle: {
    fontSize: 13,
  },
  drawerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#06B6D4',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    marginTop: 10,
  },
  drawerAddBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  menuBackdrop: {
    flex: 1,
  },
  menuDropdown: {
    position: 'absolute',
    right: 12,
    width: 170,
    borderRadius: 8,
    paddingVertical: 6,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  menuItemText: {
    fontSize: 13,
  },
  themeDialogCard: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  previewStageBackground: {
    flex: 1,
    backgroundColor: '#0B0B10',
  },
  previewBrowserHeader: {
    backgroundColor: '#161622',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  previewAddressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#202030',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    maxWidth: 240,
  },
  previewAddressText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  closePreviewBtn: {
    padding: 4,
  },
  artboardCanvasContainer: {
    flex: 1,
    padding: 12,
  },
  artboardFrameBorder: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#06B6D4',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
});

