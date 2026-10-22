import { Project } from '@/types/project';
import { Platform } from 'react-native';

let webProjectsCache: Project[] = [];
let SQLiteModule: typeof import('expo-sqlite') | null = null;
let databaseInstance: any = null;
let initPromise: Promise<any> | null = null;

export async function getDatabase() {
  if (Platform.OS === 'web') {
    return null;
  }

  if (databaseInstance) {
    return databaseInstance;
  }

  if (!initPromise) {
    initPromise = (async () => {
      if (!SQLiteModule) {
        SQLiteModule = await import('expo-sqlite');
      }

      const db = await SQLiteModule.openDatabaseAsync('code_editor.db');
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          html TEXT DEFAULT '',
          css TEXT DEFAULT '',
          js TEXT DEFAULT '',
          thumbnail TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          is_favorite INTEGER DEFAULT 0
        );
      `);
      databaseInstance = db;
      return db;
    })();
  }

  return await initPromise;
}

export async function getAllProjects(): Promise<Project[]> {
  if (Platform.OS === 'web') {
    return [...webProjectsCache];
  }

  try {
    const db = await getDatabase();
    if (!db) return [];

    // খালি অ্যারে [] পাস করা আবশ্যক অ্যান্ড্রয়েড নালপয়েন্টার প্রতিরোধ করতে
    const rows = await db.getAllAsync(
      'SELECT id, title, html, css, js, thumbnail, created_at, updated_at, is_favorite FROM projects ORDER BY updated_at DESC;',
      []
    );

    if (!Array.isArray(rows)) return [];

    return rows.map((row: any) => ({
      id: String(row.id || ''),
      title: String(row.title || 'Untitled Canvas'),
      html: String(row.html || ''),
      css: String(row.css || ''),
      js: String(row.js || ''),
      thumbnail: row.thumbnail ? String(row.thumbnail) : undefined,
      createdAt: Number(row.created_at) || Date.now(),
      updatedAt: Number(row.updated_at) || Date.now(),
      isFavorite: Number(row.is_favorite) === 1,
    }));
  } catch (error) {
    console.error('getAllProjects error caught safely:', error);
    return [];
  }
}

export async function saveProject(project: Project): Promise<void> {
  if (Platform.OS === 'web') {
    const idx = webProjectsCache.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      webProjectsCache[idx] = project;
    } else {
      webProjectsCache.unshift(project);
    }
    return;
  }

  try {
    const db = await getDatabase();
    if (!db) return;

    // কোনো প্যারামিটার যেন undefined না থাকে তা নিশ্চিত করা হলো
    const params = [
      String(project.id || ''),
      String(project.title || 'Untitled Canvas'),
      String(project.html ?? ''),
      String(project.css ?? ''),
      String(project.js ?? ''),
      project.thumbnail ? String(project.thumbnail) : null,
      Number(project.createdAt) || Date.now(),
      Number(project.updatedAt) || Date.now(),
      project.isFavorite ? 1 : 0,
    ];

    await db.runAsync(
      `INSERT OR REPLACE INTO projects (id, title, html, css, js, thumbnail, created_at, updated_at, is_favorite)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      params
    );
  } catch (error) {
    console.error('saveProject error caught safely:', error);
  }
}

export async function removeProject(id: string): Promise<void> {
  if (Platform.OS === 'web') {
    webProjectsCache = webProjectsCache.filter((p) => p.id !== id);
    return;
  }

  try {
    const db = await getDatabase();
    if (!db) return;
    await db.runAsync('DELETE FROM projects WHERE id = ?;', [String(id)]);
  } catch (error) {
    console.error('removeProject error caught safely:', error);
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (Platform.OS === 'web') {
    return webProjectsCache.find((p) => p.id === id) || null;
  }

  try {
    const db = await getDatabase();
    if (!db) return null;

    const row: any = await db.getFirstAsync(
      'SELECT id, title, html, css, js, thumbnail, created_at, updated_at, is_favorite FROM projects WHERE id = ?;',
      [String(id)]
    );

    if (!row) return null;

    return {
      id: String(row.id),
      title: String(row.title),
      html: String(row.html || ''),
      css: String(row.css || ''),
      js: String(row.js || ''),
      thumbnail: row.thumbnail ? String(row.thumbnail) : undefined,
      createdAt: Number(row.created_at) || Date.now(),
      updatedAt: Number(row.updated_at) || Date.now(),
      isFavorite: Number(row.is_favorite) === 1,
    };
  } catch (error) {
    console.error('getProjectById error caught safely:', error);
    return null;
  }
}

