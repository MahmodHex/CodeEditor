import { useThemeStore } from '@/store/useThemeStore';
import { FileCode2, X } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EditorSidebarProps {
  activeTab: string | null;
  onClose: () => void;
  onInsertSnippet: (snippet: string) => void;
}

export function EditorSidebar({ activeTab, onClose, onInsertSnippet }: EditorSidebarProps) {
  const { colors } = useThemeStore();

  if (!activeTab) return null;

  const DATA: Record<string, { title: string; items: { name: string; code: string }[] }> = {
    templates: {
      title: 'Templates & Layouts',
      items: [
        { name: 'Hero Banner Section', code: '<section class="hero">\n  <h1>Modern Title</h1>\n  <button class="btn">Explore</button>\n</section>\n' },
        { name: 'Feature Grid (3 Cols)', code: '<div class="grid">\n  <div class="col">Feature 1</div>\n  <div class="col">Feature 2</div>\n  <div class="col">Feature 3</div>\n</div>\n' },
        { name: 'Pricing Card Table', code: '<div class="pricing-card">\n  <h3>Pro Plan</h3>\n  <p class="price">$19/mo</p>\n</div>\n' },
      ],
    },
    elements: {
      title: 'HTML & UI Elements',
      items: [
        { name: 'Primary Button', code: '<button class="btn btn-primary">Click Me</button>\n' },
        { name: 'Card Container', code: '<div class="card">\n  <h3>Card Heading</h3>\n  <p>Card body text goes here.</p>\n</div>\n' },
        { name: 'Navigation Bar', code: '<nav class="nav">\n  <a href="#">Home</a>\n  <a href="#">Projects</a>\n</nav>\n' },
        { name: 'Responsive Image', code: '<img src="https://picsum.photos/400/250" class="img-fluid" alt="Sample" />\n' },
      ],
    },
    text: {
      title: 'Typography & Headings',
      items: [
        { name: 'H1 Display Heading', code: '<h1 class="heading-1">Bold Display Text</h1>\n' },
        { name: 'H2 Section Subtitle', code: '<h2 class="sub-heading">Sub Headline</h2>\n' },
        { name: 'Body Paragraph', code: '<p class="lead-text">Clean responsive paragraph text.</p>\n' },
        { name: 'Blockquote Quote', code: '<blockquote>"Design is intelligence made visible."</blockquote>\n' },
      ],
    },
    components: {
      title: 'Interactive UI Kit',
      items: [
        { name: 'Pill Badge', code: '<span class="badge">ACTIVE</span>\n' },
        { name: 'Search Input Box', code: '<input type="text" placeholder="Search..." class="search-input" />\n' },
        { name: 'Modal Dialog Box', code: '<div class="modal"><div class="modal-box"><h3>Modal Title</h3></div></div>\n' },
      ],
    },
    snippets: {
      title: 'Code Logic & Scripts',
      items: [
        { name: 'Event Listener Click', code: 'document.querySelector(".btn").addEventListener("click", () => {\n  alert("Button clicked!");\n});\n' },
        { name: 'Fetch API Helper', code: 'fetch("https://api.example.com/data")\n  .then(res => res.json())\n  .then(data => console.log(data));\n' },
      ],
    },
  };

  const currentCategory = DATA[activeTab] || DATA.elements;

  return (
    <View style={[styles.panelContainer, { backgroundColor: colors.surface, borderRightColor: colors.border }]}>
      <View style={styles.panelHeader}>
        <Text style={[styles.panelTitle, { color: colors.textPrimary }]}>{currentCategory.title}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <X size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {currentCategory.items.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.card, { backgroundColor: colors.surfaceSubtle, borderColor: colors.border }]}
            onPress={() => {
              onInsertSnippet(item.code);
              onClose();
            }}
            activeOpacity={0.7}
          >
            <FileCode2 size={16} color="#6366F1" />
            <Text style={[styles.cardText, { color: colors.textPrimary }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.insertBadge}>+ Insert</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panelContainer: {
    width: 210,
    borderRightWidth: 1,
    height: '100%',
    elevation: 8,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#33415515',
  },
  panelTitle: {
    fontSize: 11,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  list: {
    padding: 8,
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  cardText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
  },
  insertBadge: {
    fontSize: 10,
    color: '#6366F1',
    fontWeight: '800',
  },
});

