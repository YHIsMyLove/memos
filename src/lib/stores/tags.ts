import { writable } from 'svelte/store';
import type { Tag } from '../types';

/**
 * 标签相关API
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

export const tags = createTagStore();
