import { useProjectStore } from '@/store/useProjectStore';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { loadProjects } = useProjectStore();

  // Animation Shared Values
  const logoScale = useSharedValue(0.7);
  const logoOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const textOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const screenOpacity = useSharedValue(1);

  const navigateToHome = () => {
    router.replace('/(tabs)');
  };

  useEffect(() => {
    // 1. Local project data preload
    loadProjects();

    // 2. Logo entrance animation
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withSpring(1, { damping: 12, stiffness: 90 });

    // 3. Text entrance animation
    textOpacity.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.ease) });
    textTranslateY.value = withSpring(0, { damping: 14 });

    // 4. Progress bar loader animation
    progressWidth.value = withTiming(width * 0.45, { duration: 1800, easing: Easing.inOut(Easing.quad) }, (finished) => {
      if (finished) {
        // 5. Fade out and transition to Dashboard
        screenOpacity.value = withTiming(0, { duration: 400 }, () => {
          runOnJS(navigateToHome)();
        });
      }
    });
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: progressWidth.value,
  }));

  const animatedScreenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedScreenStyle]}>
      {/* Background Soft Wave Orbs */}
      <View style={[styles.orb, styles.orbPurple]} />
      <View style={[styles.orb, styles.orbCyan]} />

      {/* Center Brand Identity */}
      <View style={styles.centerContent}>
        <Animated.View style={[styles.logoCard, animatedLogoStyle]}>
          <View style={styles.bracketLeft}>
            <Text style={styles.bracketChar}>&lt;</Text>
          </View>
          <View style={styles.sparkBolt}>
            <Text style={styles.sparkChar}>⚡</Text>
          </View>
          <View style={styles.bracketRight}>
            <Text style={styles.bracketChar}>&gt;</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.textWrapper, animatedTextStyle]}>
          <Text style={styles.mainTitle}>
            Code <Text style={styles.titleHighlight}>Editor</Text>
          </Text>
          <Text style={styles.subtitle}>Preview & More</Text>
        </Animated.View>
      </View>

      {/* Bottom Loading Indicator */}
      <View style={styles.bottomArea}>
        <View style={styles.progressBarTrack}>
          <Animated.View style={[styles.progressBarFill, animatedProgressStyle]} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orbPurple: {
    width: width * 1.1,
    height: width * 1.1,
    top: -width * 0.4,
    left: -width * 0.3,
    backgroundColor: '#EAE5FD',
    opacity: 0.65,
  },
  orbCyan: {
    width: width * 1.2,
    height: width * 1.2,
    bottom: -width * 0.5,
    right: -width * 0.35,
    backgroundColor: '#E0F3FE',
    opacity: 0.7,
  },
  centerContent: {
    alignItems: 'center',
    zIndex: 10,
  },
  logoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
    height: 110,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
    marginBottom: 24,
  },
  bracketLeft: {
    marginRight: 2,
  },
  bracketRight: {
    marginLeft: 2,
  },
  bracketChar: {
    fontSize: 42,
    fontWeight: '900',
    color: '#8B5CF6',
  },
  sparkBolt: {
    transform: [{ scale: 1.1 }],
  },
  sparkChar: {
    fontSize: 28,
    color: '#06B6D4',
  },
  textWrapper: {
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  titleHighlight: {
    color: '#2563EB',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  bottomArea: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  progressBarTrack: {
    width: width * 0.45,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 2,
  },
});
