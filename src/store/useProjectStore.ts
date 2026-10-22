import { getAllProjects, removeProject, saveProject } from '@/database/db';
import { Project, StarterTemplate } from '@/types/project';
import { create } from 'zustand';

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  loadProjects: () => Promise<void>;
  createProjectFromTemplate: (template: StarterTemplate, customTitle?: string) => Promise<Project>;
  updateProjectContent: (id: string, html: string, css: string, js: string) => Promise<void>;
  renameProject: (id: string, newTitle: string) => Promise<void>;
  deleteProjectById: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  isLoading: false,

  loadProjects: async () => {
    set({ isLoading: true });
    try {
      const stored = await getAllProjects();
      set({ projects: stored, isLoading: false });
    } catch (error) {
      console.error('Failed to load local projects:', error);
      set({ isLoading: false });
    }
  },

  createProjectFromTemplate: async (template, customTitle) => {
    const timestamp = Date.now();
    const newProject: Project = {
      id: `proj_${timestamp}_${Math.random().toString(36).substring(2, 7)}`,
      title: customTitle || `${template.title} Canvas`,
      html: template.html,
      css: template.css,
      js: template.js,
      createdAt: timestamp,
      updatedAt: timestamp,
      isFavorite: false,
    };

    await saveProject(newProject);
    set((state) => ({ projects: [newProject, ...state.projects] }));
    return newProject;
  },

  updateProjectContent: async (id, html, css, js) => {
    const current = get().projects.find((p) => p.id === id);
    if (!current) return;

    const updated: Project = {
      ...current,
      html,
      css,
      js,
      updatedAt: Date.now(),
    };

    await saveProject(updated);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? updated : p)),
    }));
  },

  renameProject: async (id, newTitle) => {
    const current = get().projects.find((p) => p.id === id);
    if (!current) return;

    const updated: Project = {
      ...current,
      title: newTitle,
      updatedAt: Date.now(),
    };

    await saveProject(updated);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? updated : p)),
    }));
  },

  deleteProjectById: async (id) => {
    await removeProject(id);
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    }));
  },
}));

