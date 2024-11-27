import { writable } from 'svelte/store';
import { notes } from './notes';
import { statistics } from './statistics';
import { format, isSameMonth, isSameWeek } from 'date-fns';

/**
 * 当前的日期
 */
export const globalCurrentDay = writable(new Date());

let previousDay = new Date("1970-01-01");

globalCurrentDay.subscribe(date => {
    notes.fetchNotes(date);
    // console.log("日历切换", format(date, 'yyyy-MM-dd'), format(previousDay, 'yyyy-MM-dd'))
    if (!isSameMonth(date, previousDay)) {
        statistics.countNotesByMonth(date);
    }
    previousDay = date;
});
