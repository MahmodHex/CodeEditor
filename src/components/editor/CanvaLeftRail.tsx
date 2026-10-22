import { useThemeStore } from '@/store/useThemeStore';
import {
    Box,
    FileCode2,
    Layers,
    LayoutTemplate,
    Type
} from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CanvaLeftRailProps {
  activeTab: string | null;
  onSelectTab: (tab: string) => void;
}

export function CanvaLeftRail({ activeTab, onSelectTab }: CanvaLeftRailProps) {
  const { colors } = useThemeStore();

  const MENU_ITEMS = [
    { id: 'templates', label: 'Design', icon: LayoutTemplate },
    { id: 'elements', label: 'Elements', icon: Layers },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'components', label: 'UI Kit', icon: Box },
    { id: 'snippets', label: 'Code', icon: FileCode2 },
  ];

  return (
    <View style={[styles.railContainer, { backgroundColor: colors.surface, borderRightColor: colors.border }]}>
      {MENU_ITEMS.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.railItem, isActive && styles.railItemActive]}
            onPress={() => onSelectTab(item.id)}
            activeOpacity={0.7}
          >
            <IconComponent size={18} color={isActive ? '#6366F1' : colors.textSecondary} />
            <Text style={[styles.railLabel, { color: isActive ? '#6366F1' : colors.textSecondary }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  railContainer: {
    width: 60,
    borderRightWidth: 1,
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  railItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    paddingVertical: 6,
    borderRadius: 8,
  },
  railItemActive: {
    backgroundColor: '#EEF2FF',
  },
  railLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 4,
  },
});
