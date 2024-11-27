import { format } from 'date-fns';
import { writable } from 'svelte/store';
import type { NoteBlock, NoteStatistics, Tag } from './types';
import { FileHelper } from './fileHelper';
const isWeb = typeof window !== 'undefined';
console.log(isWeb)

function extractTags(content: string): string[] {
  const tagRegex = /#(\w+)/g;
  const matches = content.match(tagRegex);
  return matches ? matches.map(tag => tag.slice(1)) : [];
}

/**
 * 笔记相关API
 * @returns 
 */
function createNoteStore() {
  const { subscribe, set, update } = writable<NoteBlock[]>([]);

  /**
   * 根据日期查询笔记
   * @param date 
   * @returns 
   */
  async function fetchNotes(date?: Date) {
    const dateObj = date || new Date()
    const dir = `DailyNote/${format(dateObj, 'yyyy-MM-dd')}/${format(dateObj, 'MM-dd')}`
    const files = isWeb ? [] : await FileHelper.getFiles(dir);
    const notes = []
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const id = `${dir}/${file.name}`
      const content = await FileHelper.readFile(id);
      const note: NoteBlock = {
        id: id,
        content,
        tags: [],
        createdAt: new Date(),
      };
      notes.push(note);
    }
    set(notes)
  }

  return {
    subscribe,
    /**
     * 添加笔记
     * @param content 笔记内容
     */
    addNote: async (content: string) => {
      // const extractedTags = extractTags(content);
      // const todayTag = format(new Date(), 'yyyy-MM-dd');
      // const tags = [...new Set([...extractedTags, todayTag])];
      // 以日期为文件名，将笔记内容保存到文件中,年份为顶级目录月份中级目录，日期+时间为文件名
      const today = new Date();
      const file = `DailyNote/${format(today, 'yyyy-MM-dd')}/${format(today, 'MM-dd')}/${format(today, 'MM-dd_HH_mm_ss')}.txt`;
      if(isWeb){
      }else{
        await FileHelper.createFile(file, content);
      }
    },
    /**
     * 删除笔记
     * @param id 笔记id
     */
    deleteNote: async (id: string) => {
      await FileHelper.deleteFile(id);
      update(notes => notes.filter(note => note.id !== id));
    },
    fetchNotes,
  };
}

/**
 * 笔记统计
 * @returns 
 */
function noteStatistics() {
  const { subscribe, set } = writable<NoteStatistics[]>([]);
  async function countNotesByMonth(date?: Date) {
    const dateObj = date || new Date()
    const firstDayOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
    const lastDayOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
    const dates = [];
    for (let day = firstDayOfMonth; day <= lastDayOfMonth; day.setDate(day.getDate() + 1)) {
      const dir = `DailyNote/${format(day, 'yyyy-MM-dd')}/${format(day, 'MM-dd')}`
      const files = isWeb ? Math.floor(Math.random() * 10) : (await FileHelper.getFiles(dir)).length;
      dates.push({
        date: day,
        count: files
      });
    }
    set(dates);
  }
  async function countNotesByWeek(date?: Date) {
    const dateObj = date || new Date()
    const firstDayOfWeek = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate() - dateObj.getDay());
    const lastDayOfWeek = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate() + (6 - dateObj.getDay()));
    const dates = [];
    for (let day = firstDayOfWeek; day <= lastDayOfWeek; day.setDate(day.getDate() + 1)) {
      const dir = `DailyNote/${format(day, 'yyyy-MM-dd')}/${format(day, 'MM-dd')}`
      const files = isWeb ? Math.floor(Math.random() * 10) : (await FileHelper.getFiles(dir)).length;
      dates.push({
        date: day,
        count: files
      })
    }
    set(dates);
  }
  return {
    subscribe,
    countNotesByMonth,
    countNotesByWeek
  }
}

/**
 * 标签相关API
 * @returns 
 */
function createTagStore() {
  const { subscribe, set } = writable<Tag[]>([]);

  async function fetchTags() {
    const response = await fetch('http://localhost:3000/tags');
    const tags = await response.json();
    set(tags);
  }

  return {
    subscribe,
    fetchTags
  };
}

export const notes = createNoteStore();
export const tags = createTagStore();
export const statistics = noteStatistics();

/**
 * 当前的月份
 */
export let globalCurrentDate = writable(new Date());
/**
 * 当前的日期
 */
export let globalCurrentDay = writable(new Date());
// Initialize data
notes.fetchNotes();
// tags.fetchTags();

globalCurrentDay.subscribe(date => {
  notes.fetchNotes(date);
})
globalCurrentDate.subscribe(date => {
  notes.fetchNotes(date);
  statistics.countNotesByMonth(date);
})