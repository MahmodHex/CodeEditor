import { useProjectStore } from '@/store/useProjectStore';
import { bundleCode } from '@/utils/bundler';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ExternalLink, X } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PreviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { projects } = useProjectStore();

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Project not found in storage.</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Text style={styles.closeBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const compiledHtml = bundleCode(project.html, project.css, project.js);

  return (
    <View style={styles.container}>
      {/* Top Floating Browser Chrome */}
      <View style={styles.previewChrome}>
        <View style={styles.chromeAddressBar}>
          <ExternalLink size={14} color="#64748B" />
          <Text style={styles.chromeUrlText} numberOfLines={1}>
            https://live-preview.local/{project.title.toLowerCase().replace(/\s+/g, '-')}
          </Text>
        </View>
        <TouchableOpacity style={styles.exitBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <X size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Rendered Sandbox */}
      <WebView
        originWhitelist={['*']}
        source={{ html: compiledHtml }}
        style={styles.webView}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  previewChrome: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#1E293B',
    gap: 10,
  },
  chromeAddressBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0F172A',
    height: 32,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  chromeUrlText: {
    color: '#94A3B8',
    fontSize: 12,
    fontFamily: 'monospace',
    flex: 1,
  },
  exitBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B0B12',
    padding: 20,
  },
  errorText: {
    color: '#F87171',
    fontSize: 16,
    marginBottom: 16,
  },
  closeBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#6366F1',
    borderRadius: 12,
  },
  closeBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
});

