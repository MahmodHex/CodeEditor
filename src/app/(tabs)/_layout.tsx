import { Tabs } from 'expo-router';
import { Code2, Folder, LayoutGrid, Settings } from 'lucide-react-native';
import { Platform, StyleSheet, View } from 'react-native';

export default function TabLayout() {
  const bottomBarHeight = Platform.OS === 'android' ? 68 : 84;
  const bottomBarPadding = Platform.OS === 'android' ? 14 : 26;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#06B6D4',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#0F0F18',
          borderTopColor: '#222234',
          borderTopWidth: 1.5,
          height: bottomBarHeight,
          paddingBottom: bottomBarPadding,
          paddingTop: 8,
          elevation: 25,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeTabBadge : null}>
              <Code2 size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeTabBadge : null}>
              <Folder size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="templates"
        options={{
          title: 'Templates',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeTabBadge : null}>
              <LayoutGrid size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeTabBadge : null}>
              <Settings size={20} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeTabBadge: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
});

