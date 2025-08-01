import { invoke } from '@tauri-apps/api/core';

export async function getTaskbarHeight(): Promise<number> {
  try {
    const height = await invoke<number>('get_taskbar_height');
    return height || 40; // Fallback to 40 if null/undefined
  } catch (error) {
    console.error('Failed to get taskbar height:', error);
    return 40; // Default fallback
  }
}