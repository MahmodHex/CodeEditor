import { useThemeStore } from '@/store/useThemeStore';
import { Bell, Crown, Moon, Search, Sun } from 'lucide-react-native';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface HeaderBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
}

export function HeaderBar({ searchQuery, onSearchChange }: HeaderBarProps) {
  const { colors, mode, toggleTheme } = useThemeStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      {/* Brand & Search Container */}
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBracket}>&lt;</Text>
            <Text style={styles.logoBolt}>⚡</Text>
            <Text style={styles.logoBracket}>&gt;</Text>
          </View>
          <View>
            <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>Code Editor</Text>
            <Text style={[styles.brandSubtitle, { color: colors.textSecondary }]}>Preview & More</Text>
          </View>
        </View>

        {/* Right Action Icons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.surfaceSubtle }]}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            {mode === 'dark' ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#475569" />}
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.surfaceSubtle }]} activeOpacity={0.7}>
            <Bell size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.premiumBadge} activeOpacity={0.8}>
            <Crown size={14} color="#FFF" />
            <Text style={styles.premiumText}>Premium</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Clean Mobile Search Bar */}
      <View style={[styles.searchBox, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}>
        <Search size={18} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          placeholder="Search projects, templates..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={onSearchChange}
          style={[styles.searchInput, { color: colors.textPrimary }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  logoBracket: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6366F1',
  },
  logoBolt: {
    fontSize: 10,
    marginHorizontal: 1,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: -2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 18,
  },
  premiumText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
});

