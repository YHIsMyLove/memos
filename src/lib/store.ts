import { format } from 'date-fns';
import { writable } from 'svelte/store';
import type { NoteBlock, NoteStatistics, Tag } from './types';

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
    try {
      const response = await fetch(`http://localhost:3000/notes?date=${dateObj.toLocaleDateString('en-CA')}`);//
      const note = await response.json();
      set(note);
    } catch (error) {
      set([])
    }
  }

  return {
    subscribe,
    addNote: async (content: string) => {
      const extractedTags = extractTags(content);
      const todayTag = format(new Date(), 'yyyy-MM-dd');
      const tags = [...new Set([...extractedTags, todayTag])];

      const response = await fetch('http://localhost:3000/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, tags })
      });

      if (response.ok) {
        const newNote = await response.json();
        update(notes => [...notes, newNote]);
        await fetchNotes()
        // 刷新日历
        await statistics.countNotesByMonth()
      }
    },
    deleteNote: async (id: string) => {
      const response = await fetch(`http://localhost:3000/notes/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        update(notes => notes.filter(note => note.id !== id));
        await fetchNotes()
      }
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
    // 生成一个数组，当月所有的日期
    const dateObj = date || new Date()
    const firstDayOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
    const lastDayOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
    const dates = [];
    for (let day = firstDayOfMonth; day <= lastDayOfMonth; day.setDate(day.getDate() + 1)) {
      dates.push({
        date: day,
        count: Math.random() * 10
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
      dates.push({
        date: day,
        count: Math.random() * 10
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
// notes.fetchNotes();
// tags.fetchTags();

globalCurrentDay.subscribe(date => {
  // notes.fetchNotes(date);
})
globalCurrentDate.subscribe(date => {
  // notes.fetchNotes(date);
  statistics.countNotesByMonth(date);
})