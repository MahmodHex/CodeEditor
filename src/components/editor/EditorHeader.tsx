import { useEditorStore } from '@/store/useEditorStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useRouter } from 'expo-router';
import {
    Check,
    CheckCircle2,
    ChevronLeft,
    Download,
    Eye,
    Minus,
    Moon,
    Plus,
    RotateCcw,
    RotateCw,
    Share2,
    Sun
} from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface EditorHeaderProps {
  title: string;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenPreview: () => void;
  onRename: (newTitle: string) => void;
  onExport: () => void;
  onShare: () => void;
}

export function EditorHeader({ 
  title, 
  canUndo, 
  canRedo, 
  onUndo, 
  onRedo, 
  onOpenPreview,
  onRename, 
  onExport, 
  onShare 
}: EditorHeaderProps) {
  const router = useRouter();
  const { colors, mode, toggleTheme } = useThemeStore();
  const { zoomLevel, setZoomLevel } = useEditorStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);

  const handleFinishRename = () => {
    setIsEditing(false);
    if (currentTitle.trim() && currentTitle !== title) {
      onRename(currentTitle.trim());
    } else {
      setCurrentTitle(title);
    }
  };

  return (
    <View style={[styles.headerContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      {/* Left: Back & Title */}
      <View style={styles.leftGroup}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <ChevronLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        {isEditing ? (
          <View style={styles.renameBox}>
            <TextInput
              value={currentTitle}
              onChangeText={setCurrentTitle}
              style={[styles.renameInput, { color: colors.textPrimary, borderColor: colors.primary }]}
              autoFocus
              onBlur={handleFinishRename}
              onSubmitEditing={handleFinishRename}
            />
            <TouchableOpacity onPress={handleFinishRename} style={styles.checkBtn}>
              <Check size={14} color="#10B981" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.titleWrap}>
            <Text style={[styles.titleText, { color: colors.textPrimary }]} numberOfLines={1}>
              {title}
            </Text>
            <View style={styles.autoSavedBadge}>
              <CheckCircle2 size={9} color="#10B981" />
              <Text style={styles.autoSavedText}>Saved</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Center: Undo, Redo, Zoom */}
      <View style={styles.centerGroup}>
        <View style={[styles.historyPill, { backgroundColor: colors.surfaceSubtle }]}>
          <TouchableOpacity onPress={onUndo} disabled={!canUndo} style={styles.iconBtnSmall}>
            <RotateCcw size={13} color={canUndo ? colors.textPrimary : colors.textSecondary} opacity={canUndo ? 1 : 0.4} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onRedo} disabled={!canRedo} style={styles.iconBtnSmall}>
            <RotateCw size={13} color={canRedo ? colors.textPrimary : colors.textSecondary} opacity={canRedo ? 1 : 0.4} />
          </TouchableOpacity>
        </View>

        <View style={[styles.zoomPill, { backgroundColor: colors.surfaceSubtle }]}>
          <TouchableOpacity onPress={() => setZoomLevel(Math.max(25, zoomLevel - 25))} style={styles.zoomBtn}>
            <Minus size={11} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.zoomText, { color: colors.textPrimary }]}>{zoomLevel}%</Text>
          <TouchableOpacity onPress={() => setZoomLevel(Math.min(200, zoomLevel + 25))} style={styles.zoomBtn}>
            <Plus size={11} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Right: Theme, PREVIEW BUTTON, Share, Export */}
      <View style={styles.rightGroup}>
        <TouchableOpacity style={styles.iconBtn} onPress={toggleTheme} activeOpacity={0.7}>
          {mode === 'dark' ? <Sun size={16} color="#FBBF24" /> : <Moon size={16} color="#64748B" />}
        </TouchableOpacity>

        {/* Canva-style Top-Right Glowing PREVIEW Button */}
        <TouchableOpacity 
          style={styles.previewBtnPill} 
          onPress={onOpenPreview}
          activeOpacity={0.85}
        >
          <Eye size={13} color="#FFF" />
          <Text style={styles.previewBtnText}>Preview</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={onShare} activeOpacity={0.7}>
          <Share2 size={16} color={colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={onExport} activeOpacity={0.7}>
          <Download size={16} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.1,
    gap: 4,
  },
  iconBtn: {
    padding: 5,
  },
  iconBtnSmall: {
    padding: 4,
  },
  titleWrap: {
    maxWidth: 95,
  },
  titleText: {
    fontSize: 12,
    fontWeight: '800',
  },
  autoSavedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: -2,
  },
  autoSavedText: {
    fontSize: 9,
    color: '#10B981',
    fontWeight: '700',
  },
  renameBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  renameInput: {
    height: 28,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    fontSize: 11,
    maxWidth: 85,
  },
  checkBtn: {
    padding: 4,
  },
  centerGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyPill: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
    gap: 2,
  },
  zoomPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 2,
  },
  zoomBtn: {
    padding: 2,
  },
  zoomText: {
    fontSize: 10,
    fontWeight: '800',
    minWidth: 32,
    textAlign: 'center',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  previewBtnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#6366F1',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 14,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 3,
  },
  previewBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});

