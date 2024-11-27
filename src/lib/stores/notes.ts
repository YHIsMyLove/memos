import { writable } from 'svelte/store';
import { format } from 'date-fns';
import type { NoteBlock } from '../types';
import FileHelper from '../utils/FileHelper';

function extractTags(content: string): string[] {
  const tagRegex = /#(\w+)/g;
  const matches = content.match(tagRegex);
  return matches ? matches.map(tag => tag.slice(1)) : [];
}

/**
 * 笔记相关API
 */
function createNoteStore() {
  const { subscribe, set, update } = writable<NoteBlock[]>([]);

  /**
   * 获取笔记列表
   */
  async function fetchNotes(date?: Date) {
    try {
      const dateObj = date || new Date()
      const dir = `DailyNote/${format(dateObj, 'yyyy-MM-dd')}/${format(dateObj, 'MM')}`
      const files = await FileHelper.listFiles(dir);
      if (!files) return
      const notes = await Promise.all(
        files.map(async (file) => {
          const content = await FileHelper.readFile(file);
          return {
            id: file,
            content,
            createdAt: new Date()
          };
        })
      );
      set(notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      set([]);
    }
  }

  // async function getAllNotes() {
  //   const allNotes = [];
  //   const rootDir = 'DailyNote';
  //   const years = await FileHelper.listDirectories(rootDir);

  //   for (const year of years) {
  //     const months = await FileHelper.listDirectories(year);
  //     for (const month of months) {
  //       const files = await FileHelper.listFiles(month);
  //       const monthNotes = await Promise.all(
  //         files.map(async (file) => {
  //           const content = await FileHelper.readFile(file);
  //           return {
  //             id: file,
  //             content,
  //             createdAt: new Date()
  //           };
  //         })
  //       );
  //       allNotes.push(...monthNotes);
  //     }
  //   }

  //   return allNotes;
  // }

  // async function backupNotes() {
  //   const allNotes = await getAllNotes();
  //   return allNotes;
  // }

  // async function restoreFromBackup(backupData: any[]) {
  //   for (const note of backupData) {
  //     await addNote(note.content);
  //   }
  // }

  return {
    subscribe,
    /**
     * 添加笔记
     * @param content 笔记内容
     */
    addNote: async (content: string) => {
      const today = new Date();
      const file = `DailyNote/${format(today, 'yyyy-MM-dd')}/${format(today, 'MM')}/${format(today, 'dd_HH_mm_ss')}.txt`;
      await FileHelper.createFile(file, content);
    },

    /**
     * 删除笔记
     * @param id 笔记ID
     */
    deleteNote: async (id: string) => {
      try {
        await FileHelper.deleteFile(id);
        update((notes) => notes.filter((note) => note.id !== id));
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    },
    fetchNotes,
    // backupNotes,
    // restoreFromBackup,
  };
}

export const notes = createNoteStore();
