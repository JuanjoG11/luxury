import { Scissors, Check } from 'lucide-react';

const SERVICES = [
    { id: 'corte', name: 'Corte', price: '$25K' },
    { id: 'corte-barba', name: 'Corte + Barba', price: '$30K' },
    { id: 'arreglo-barba', name: 'Arreglo de Barba', price: '$15K' },
    { id: 'cejas', name: 'Cejas', price: '$8K' },
    { id: 'limpieza', name: 'Limpieza Facial', price: '$80K' },
    { id: 'lineas', name: 'Lineas Básicas', price: '$2K' },
    { id: 'freestyle', name: 'Diseño Free Style', price: '$10K' },
    { id: 'pigmentacion', name: 'Pigmentación', price: '$5K' },
];

export default function ServiceList({ selectedService, onSelect }) {
    return (
        <section className="section-padding">
            <div className="max-width-container">
                <h2 className="text-5xl mb-12 barrio-stroke">Servicios & Precios</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                    {SERVICES.map((service) => (
                        <button
                            key={service.id}
                            onClick={() => onSelect(service)}
                            className={`price-item w-full text-left group transition-all ${selectedService?.id === service.id ? 'bg-black text-white px-4' : 'hover:bg-gray-100'
                                }`}
                        >
                            <span className="flex items-center gap-4">
                                {selectedService?.id === service.id ? <Check size={20} /> : <Scissors size={20} className="opacity-30 group-hover:opacity-100" />}
                                <span className="text-2xl uppercase font-black">{service.name}</span>
                            </span>
                            <span className="dotted-leader"></span>
                            <span className="text-2xl font-black">{service.price}</span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
