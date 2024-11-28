import { writable } from 'svelte/store';
import { format, parse } from 'date-fns';
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
      const day = format(dateObj, 'yyyy-MM-dd');
      const dir = `DailyNote/${day}`
      const files = await FileHelper.listFiles(dir);
      if (!files) return
      const notes = await Promise.all(
        files.map(async (file) => {
          const content = await FileHelper.readFile(`${dir}/${file.name}`);
          const timeString = `${day} ${file.name.replaceAll('_', ':').replace('.txt', '')}`
          console.log(timeString)
          return {
            id: file.name,
            content,
            createdAt: parse(timeString, 'yyyy-MM-dd HH:mm:ss', new Date()),
          };
        })
      );
      set(notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      set([]);
    }
  }

  return {
    subscribe,
    /**
     * 添加笔记
     * @param content 笔记内容
     */
    addNote: async (content: string) => {
      const today = new Date();
      const file = `DailyNote/${format(today, 'yyyy-MM-dd')}/${format(today, 'HH_mm_ss')}.txt`;
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
