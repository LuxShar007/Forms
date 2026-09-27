// lib/survey/localStore.ts
// Local persistent storage fallback for survey responses when remote database is not connected

import fs from 'fs';
import path from 'path';
import { AdminResponseItem } from '@/lib/admin/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'survey_responses.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

export function getLocalResponses(): AdminResponseItem[] {
  try {
    ensureDataFile();
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content) as AdminResponseItem[];
  } catch (err) {
    console.error('Error reading local survey responses:', err);
    return [];
  }
}

export function saveLocalResponse(item: AdminResponseItem): boolean {
  try {
    ensureDataFile();
    const list = getLocalResponses();
    // Add to beginning of list (newest first)
    list.unshift(item);
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving local survey response:', err);
    return false;
  }
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceKey) return false;
  if (url.includes('your-project') || anonKey.includes('your-anon-key') || serviceKey.includes('your-service-role')) {
    return false;
  }
  return true;
}
