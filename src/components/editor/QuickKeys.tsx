import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QuickKeysProps {
  onInsertSymbol: (symbol: string) => void;
  isDark: boolean;
}

const SYMBOLS = ['<', '</', '>', '{', '}', '(', ')', '[', ']', '=', '"', "'", ';', ':', '/', '!', 'tab'];

export function QuickKeys({ onInsertSymbol, isDark }: QuickKeysProps) {
  return (
    <View style={[styles.barContainer, { backgroundColor: isDark ? '#1C1C22' : '#E2E8F0', borderTopColor: isDark ? '#2B2B36' : '#CBD5E1' }]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="always"
      >
        {SYMBOLS.map((sym, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.keyBtn, { backgroundColor: isDark ? '#262630' : '#FFFFFF', borderColor: isDark ? '#383846' : '#CBD5E1' }]}
            onPress={() => onInsertSymbol(sym === 'tab' ? '  ' : sym)}
            activeOpacity={0.5}
          >
            <Text style={[styles.keyText, { color: isDark ? '#E2E8F0' : '#1E293B' }]}>{sym}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    height: 34, // Ekdom compact anWriter strip
    borderTopWidth: 1,
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: 4,
    alignItems: 'center',
    gap: 4,
  },
  keyBtn: {
    minWidth: 32,
    height: 26,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  keyText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
});

