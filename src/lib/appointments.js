import { supabase } from './supabase';

/**
 * Obtiene los horarios ya ocupados para un barbero en una fecha específica.
 */
export async function getBookedSlots(barberId, date) {
    const { data, error } = await supabase
        .from('appointments')
        .select('time')
        .eq('barber_id', barberId)
        .eq('date', date)
        .eq('status', 'confirmed');

    if (error) {
        console.error('Error fetching booked slots:', error);
        return [];
    }

    return data.map((row) => row.time);
}

/**
 * Crea una nueva cita en la base de datos.
 */
export async function createAppointment({ barberId, barberName, serviceName, servicePrice, date, time, clientName, clientPhone }) {
    const { data, error } = await supabase
        .from('appointments')
        .insert([{
            barber_id: barberId,
            barber_name: barberName,
            service_name: serviceName,
            service_price: servicePrice,
            date,
            time,
            client_name: clientName,
            client_phone: clientPhone,
            status: 'confirmed'
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating appointment:', error);
        throw error;
    }

    return data;
}
