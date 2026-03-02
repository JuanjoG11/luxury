import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, ChevronRight, MessageSquare } from 'lucide-react';

export default function BookingFlow({ selectedBarber, selectedService }) {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const WHATSAPP_NUMBER = '+573015981843';

    const isComplete = selectedBarber && selectedService && date && time;

    const handleConfirm = () => {
        const message = `¡Hola BrotherHood! Deseo agendar una cita:%0A%0A✂️ *Servicio:* ${selectedService.name}%0A🧔 *Barbero:* ${selectedBarber.name}%0A📅 *Fecha:* ${date}%0A⏰ *Hora:* ${time}%0A%0A¡Nos vemos allá! 🔥`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    };

    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
    ];

    return (
        <section className="section-padding">
            <div className="max-width-container">
                <h2 className="text-5xl mb-12 barrio-stroke">Agendar Cita</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="brutalist-card">
                            <div className="flex items-center gap-4 mb-6">
                                <CalendarIcon />
                                <h3 className="text-2xl uppercase">Selecciona Fecha</h3>
                            </div>
                            <input
                                type="date"
                                className="w-full text-2xl font-black p-4 border-4 border-black uppercase focus:bg-black focus:text-white transition-all outline-none"
                                onChange={(e) => setDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="brutalist-card">
                            <div className="flex items-center gap-4 mb-6">
                                <Clock />
                                <h3 className="text-2xl uppercase">Elige la Hora</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {timeSlots.map(slot => (
                                    <button
                                        key={slot}
                                        onClick={() => setTime(slot)}
                                        className={`p-3 font-black text-center border-4 border-black transition-all ${time === slot ? 'bg-black text-white shadow-none' : 'hover:bg-gray-100 shadow-small'
                                            }`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="brutalist-card bg-black text-white flex-grow h-fit sticky top-8">
                            <h3 className="text-4xl mb-8 border-b-4 border-white pb-4">Tu Resumen</h3>
                            <div className="space-y-6 text-xl mb-12">
                                <div className="flex justify-between border-b border-white/20 pb-2">
                                    <span className="opacity-60">Barbero:</span>
                                    <span className="font-black uppercase">{selectedBarber?.name || '---'}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/20 pb-2">
                                    <span className="opacity-60">Servicio:</span>
                                    <span className="font-black uppercase">{selectedService?.name || '---'}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/20 pb-2">
                                    <span className="opacity-60">Fecha:</span>
                                    <span className="font-black">{date || '---'}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/20 pb-2">
                                    <span className="opacity-60">Hora:</span>
                                    <span className="font-black">{time || '---'}</span>
                                </div>
                                <div className="flex justify-between items-center mt-8 pt-4">
                                    <span className="text-3xl font-black">TOTAL:</span>
                                    <span className="text-4xl font-black">{selectedService?.price || '$0'}</span>
                                </div>
                            </div>

                            <button
                                disabled={!isComplete}
                                onClick={handleConfirm}
                                className={`w-full p-6 text-2xl font-black uppercase flex items-center justify-center gap-4 transition-all ${isComplete
                                        ? 'bg-white text-black hover:bg-black hover:text-white border-4 border-white hover:border-white'
                                        : 'bg-neutral-800 text-neutral-500 border-none opacity-50 cursor-not-allowed'
                                    }`}
                            >
                                <MessageSquare />
                                Agendar ahora
                            </button>
                            {!isComplete && (
                                <p className="text-center mt-4 text-sm opacity-50 font-bold uppercase italic">Completa todos los pasos</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
