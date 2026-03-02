import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://einbdcsdwdiaodcteavy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_b4KJwhaelYW8Mq7jYxWXBg_48kv2kHo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
