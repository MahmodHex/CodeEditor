export type ActiveTab = 'html' | 'css' | 'js' | 'console';

export type DeviceMode = 'desktop' | 'tablet' | 'mobile' | 'fullscreen';

export interface EditorSettings {
  fontSize: number;
  autoSave: boolean;
  autoSaveDelay: number;
  lineNumbers: boolean;
  theme: 'light' | 'dark';
}
