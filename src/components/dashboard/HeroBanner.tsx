import { Code2, Plus } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeroBannerProps {
  onNewCanvas: () => void;
}

export function HeroBanner({ onNewCanvas }: HeroBannerProps) {
  return (
    <View style={styles.bannerContainer}>
      {/* Background Soft Glow Accents */}
      <View style={styles.glowCircle1} />
      <View style={styles.glowCircle2} />

      <View style={styles.content}>
        <View style={styles.badge}>
          <Code2 size={13} color="#A78BFA" />
          <Text style={styles.badgeText}>Canvas Studio v1.0</Text>
        </View>

        <Text style={styles.title}>
          Code Editor, <Text style={styles.highlightText}>Preview</Text> & More
        </Text>
        <Text style={styles.subtitle}>Code Editor • Live Preview • And Much More</Text>

        <TouchableOpacity style={styles.newCanvasBtn} onPress={onNewCanvas} activeOpacity={0.85}>
          <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.newCanvasText}>New Canvas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 22,
    backgroundColor: '#1E1B4B',
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  glowCircle1: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#7C3AED',
    opacity: 0.45,
  },
  glowCircle2: {
    position: 'absolute',
    bottom: -60,
    left: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#06B6D4',
    opacity: 0.35,
  },
  content: {
    zIndex: 2,
    alignItems: 'flex-start',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  badgeText: {
    color: '#E0E7FF',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  highlightText: {
    color: '#A855F7',
  },
  subtitle: {
    fontSize: 13,
    color: '#CBD5E1',
    marginTop: 6,
    marginBottom: 18,
  },
  newCanvasBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 25,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  newCanvasText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

