import { DateTime } from 'luxon';
import { customAlphabet } from 'nanoid';
import slugify from 'slugify';

function createSlugId() {
  return customAlphabet('1234567890abcdef', 10)();
}

export function extractSlugId(text: string) {
  return text.split('-')[0]
}

export function createSlug(text: string, id?: string) {
  const baseSlug = slugify(text);
              
  return (!id ? createSlugId() + '-' : id + '-') + baseSlug;
}