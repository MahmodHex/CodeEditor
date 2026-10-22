import { ChevronRight, FolderOpen, Info, Settings as SettingsIcon, ShieldCheck, Smartphone, Sun } from 'lucide-react-native';
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 28) : 44;

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F18" />

      {/* Top Header with Safe Inset */}
      <View style={styles.header}>
        <SettingsIcon size={22} color="#06B6D4" />
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
        <Text style={styles.groupTitle}>APPEARANCE</Text>
        <View style={styles.groupCard}>
          <TouchableOpacity style={styles.rowItem} onPress={() => Alert.alert('Theme', 'Dark Mode is set as default.')}>
            <View style={styles.rowLeft}>
              <Sun size={18} color="#F59E0B" />
              <Text style={styles.rowText}>Theme Mode</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>Dark Pro</Text>
              <ChevronRight size={16} color="#94A3B8" />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.groupTitle}>STORAGE & FILES</Text>
        <View style={styles.groupCard}>
          <TouchableOpacity style={styles.rowItem} onPress={() => Alert.alert('Directory', 'Local device storage active.')}>
            <View style={styles.rowLeft}>
              <FolderOpen size={18} color="#06B6D4" />
              <View>
                <Text style={styles.rowText}>Directory Folder</Text>
                <Text style={styles.rowSub}>Internal Storage / App Sandbox</Text>
              </View>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <Text style={styles.groupTitle}>DEVICE & APP INFO</Text>
        <View style={styles.groupCard}>
          <TouchableOpacity style={styles.rowItem} onPress={() => Alert.alert('Platform', `OS: ${Platform.OS.toUpperCase()}`)}>
            <View style={styles.rowLeft}>
              <Smartphone size={18} color="#10B981" />
              <Text style={styles.rowText}>Phone & OS Info</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.rowItem} onPress={() => Alert.alert('About Us', 'Code Editor, Preview, & More - 100% Offline Studio')}>
            <View style={styles.rowLeft}>
              <Info size={18} color="#38BDF8" />
              <Text style={styles.rowText}>About Us</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.rowItem} onPress={() => Alert.alert('Privacy Policy', 'No user data leaves your device.')}>
            <View style={styles.rowLeft}>
              <ShieldCheck size={18} color="#10B981" />
              <Text style={styles.rowText}>Privacy Policy</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: STATUS_BAR_HEIGHT + 10,
    paddingBottom: 14,
    backgroundColor: '#0F0F18',
    borderBottomWidth: 1,
    borderBottomColor: '#222234',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  scrollList: {
    padding: 16,
    paddingBottom: 100,
  },
  groupTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 8,
    marginTop: 12,
    letterSpacing: 0.5,
  },
  groupCard: {
    backgroundColor: '#12121E',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#222234',
    overflow: 'hidden',
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rowText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rowSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowValue: {
    fontSize: 12,
    color: '#94A3B8',
  },
  separator: {
    height: 1,
    backgroundColor: '#1C1C2C',
    marginLeft: 42,
  },
});

