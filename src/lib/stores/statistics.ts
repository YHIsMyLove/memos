import { writable } from 'svelte/store';
import { format } from 'date-fns';
import type { NoteStatistics } from '../types';
import FileHelper from '../utils/FileHelper';

/**
 * 笔记统计
 */
function createStatisticsStore() {
  const { subscribe, set } = writable<NoteStatistics[]>([]);

  async function countNotesByMonth(date?: Date) {
    const dateObj = date || new Date()
    const firstDayOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
    const lastDayOfMonth = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
    const dates = [];
    for (let day = firstDayOfMonth; day <= lastDayOfMonth; day.setDate(day.getDate() + 1)) {
      const dir = `DailyNote/${format(day, 'yyyy-MM-dd')}/${format(day, 'MM')}`
      const files = (await FileHelper.listFiles(dir)).length;
      dates.push({
        date: new Date(day),
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
      const itemDay = new Date(day)
      const dir = `DailyNote/${format(itemDay, 'yyyy-MM-dd')}/${format(itemDay, 'MM')}`
      const files = (await FileHelper.listFiles(dir)).length;
      dates.push({
        date: itemDay,
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

export const statistics = createStatisticsStore();
