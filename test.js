import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient('https://einbdcsdwdiaodcteavy.supabase.co', 'sb_publishable_b4KJwhaelYW8Mq7jYxWXBg_48kv2kHo');

async function test() {
    try {
        const res = await supabase.from('appointments').insert([{
            barber_id: 'nico',
            barber_name: 'Nico',
            service_name: 'Arreglo de Barba',
            service_price: '$15K',
            date: '2026-03-22',
            time: '04:00 PM',
            client_name: 'Mateo',
            client_phone: '3015981843',
            status: 'confirmed'
        }]).select().single();
        fs.writeFileSync('res.json', JSON.stringify(res, null, 2));
    } catch (e) {
        fs.writeFileSync('res.json', JSON.stringify({ error_caught: e.message, stack: e.stack }, null, 2));
    }
}

test();
