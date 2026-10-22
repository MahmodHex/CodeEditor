import { getDatabase } from '@/database/db';
import { useThemeStore } from '@/store/useThemeStore';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const { mode, colors } = useThemeStore();

  useEffect(() => {
    // App bootup-e offline SQLite database warmup
    getDatabase().catch((err) => console.error('Database pre-init error:', err));
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'none' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="editor/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="preview/[id]" options={{ animation: 'slide_from_bottom' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
