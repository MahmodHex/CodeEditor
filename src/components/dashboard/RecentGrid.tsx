import { useThemeStore } from '@/store/useThemeStore';
import { Project } from '@/types/project';
import { ArrowRight, Code, MoreVertical } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RecentGridProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
  onOpenMenu: (project: Project) => void;
  onViewAll: () => void;
}

export function RecentGrid({ projects, onOpenProject, onOpenMenu, onViewAll }: RecentGridProps) {
  const { colors } = useThemeStore();

  const formatTime = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent Projects</Text>
        <TouchableOpacity style={styles.viewAllBtn} onPress={onViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
          <ArrowRight size={14} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {projects.length === 0 ? (
        <View style={[styles.emptyBox, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No saved canvases yet. Click "[ + New Canvas ]" to create your first design!
          </Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {projects.slice(0, 6).map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border }
              ]}
              onPress={() => onOpenProject(item)}
              activeOpacity={0.8}
            >
              {/* Thumbnail Mock Stage */}
              <View style={[styles.mockThumbnail, { backgroundColor: colors.surfaceSubtle }]}>
                <Code size={28} color={colors.primary} />
                <View style={styles.codeTag}>
                  <Text style={styles.codeTagText}>HTML5</Text>
                </View>
              </View>

              {/* Card Meta Info */}
              <View style={styles.metaRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.projectTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.projectTime, { color: colors.textSecondary }]}>
                    Edited {formatTime(item.updatedAt)}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => onOpenMenu(item)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <MoreVertical size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 22,
    marginBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyBox: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  mockThumbnail: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  codeTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  codeTagText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
  },
  metaRow: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  projectTime: {
    fontSize: 11,
    marginTop: 2,
  },
});

