import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, MessageSquare, Send, CheckCircle, Tag, Cake, Coffee } from 'lucide-react';

// Configura aquí el número de teléfono de WhatsApp (con código de país, ej: 57 para Colombia)
const WHATSAPP_NUMBER = '573000000000'; 

interface FormState {
  nombre: string;
  telefono: string;
  fecha: string;
  invitados: string;
  tipoEvento: string;
  productos: string[];
  detalles: string;
}

export const CotizacionesSection: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    nombre: '',
    telefono: '',
    fecha: '',
    invitados: '',
    tipoEvento: 'Familiar / Cumpleaños',
    productos: [],
    detalles: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const eventTypes = [
    'Familiar / Cumpleaños',
    'Corporativo / Empresarial',
    'Reunión de Amigos',
    'Boda / Celebración especial',
    'Otro / Personalizado',
  ];

  const productOptions = [
    'Hamburguesas Artesanales',
    'Perros Calientes Gourmet',
    'Waffles / Dulces y Postres',
    'Sodas & Limonadas Artesanales',
    'Estación de Café / Capuchinos',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (product: string) => {
    setForm((prev) => {
      const alreadySelected = prev.productos.includes(product);
      if (alreadySelected) {
        return { ...prev, productos: prev.productos.filter((p) => p !== product) };
      } else {
        return { ...prev, productos: [...prev.productos, product] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!form.nombre.trim() || !form.telefono.trim() || !form.fecha) {
      alert('Por favor completa los campos obligatorios: Nombre, Teléfono y Fecha.');
      return;
    }

    // Formatear mensaje para WhatsApp
    const message = `*SOLICITUD DE COTIZACIÓN - EFRATA*\n\n` +
      `👤 *Nombre:* ${form.nombre}\n` +
      `📞 *Teléfono:* ${form.telefono}\n` +
      `📅 *Fecha del evento:* ${form.fecha}\n` +
      `👥 *Invitados:* ${form.invitados || 'No especificado'}\n` +
      `🎉 *Tipo de evento:* ${form.tipoEvento}\n\n` +
      `🍔 *Productos sugeridos:*\n${form.productos.length > 0 ? form.productos.map(p => `• ${p}`).join('\n') : '• Ninguno seleccionado (abierto a sugerencias)'}\n\n` +
      `📝 *Detalles adicionales:*\n${form.detalles.trim() || 'Sin comentarios adicionales.'}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Abrir enlace en pestaña nueva
    window.open(whatsappUrl, '_blank');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl mx-auto my-12 p-8 rounded-2xl bg-earth-alabaster/40 border border-earth-border/40 text-center flex flex-col items-center gap-6"
      >
        <div className="w-16 h-16 rounded-full bg-earth-terracotta/10 flex items-center justify-center text-earth-terracotta">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="font-sans font-extralight text-3xl text-earth-clay uppercase tracking-[0.1em]">
          ¡Solicitud Enviada!
        </h2>
        <p className="font-sans font-normal text-sm text-earth-text-sec leading-relaxed max-w-md">
          Se ha abierto WhatsApp para que envíes tu cotización directamente a Efrata. Nos pondremos en contacto contigo lo antes posible para concretar todos los detalles.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 px-6 py-2.5 rounded-full bg-earth-clay text-earth-ivory font-sans text-xs uppercase tracking-[0.2em] font-semibold hover:bg-earth-olive transition-colors duration-300 cursor-pointer"
        >
          Volver a cotizar
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-3xl mx-auto my-8 px-4"
    >
      <div className="text-center mb-10">
        <span className="font-sans font-normal text-[10px] uppercase tracking-[0.3em] text-earth-terracotta flex items-center justify-center gap-2 mb-2">
          <Coffee className="w-3.5 h-3.5" /> Efrata Eventos & Catering
        </span>
        <h2 className="font-sans font-extralight text-3xl md:text-4xl text-earth-clay uppercase tracking-[0.1em]">
          Cotizaciones Especiales
        </h2>
        <p className="font-serif italic text-base text-earth-olive leading-relaxed max-w-xl mx-auto mt-4">
          “Comparte momentos inolvidables. Llevamos el sabor artesanal de Efrata a tus reuniones familiares, corporativas o cumpleaños.”
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md border border-earth-border/20 rounded-2xl p-6 md:p-10 shadow-lg shadow-earth-clay/5 flex flex-col gap-6 md:gap-8">
        
        {/* Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-earth-clay">
              Nombre Completo *
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleInputChange}
              required
              placeholder="Tu nombre"
              className="w-full px-4 py-2.5 rounded-lg border border-earth-border/40 font-sans text-xs bg-earth-sand/30 text-earth-clay focus:border-earth-olive focus:outline-none transition-colors duration-300 placeholder:text-earth-text-sec/45"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-earth-clay">
              Teléfono de Contacto (WhatsApp) *
            </label>
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleInputChange}
              required
              placeholder="Ej: +57 300 123 4567"
              className="w-full px-4 py-2.5 rounded-lg border border-earth-border/40 font-sans text-xs bg-earth-sand/30 text-earth-clay focus:border-earth-olive focus:outline-none transition-colors duration-300 placeholder:text-earth-text-sec/45"
            />
          </div>
        </div>

        {/* Detalles del Evento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-earth-clay flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-earth-terracotta" />
              Fecha del Evento *
            </label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-earth-border/40 font-sans text-xs bg-earth-sand/30 text-earth-clay focus:border-earth-olive focus:outline-none transition-colors duration-300"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-earth-clay flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-earth-terracotta" />
              Nro. Estimado de Invitados
            </label>
            <input
              type="number"
              name="invitados"
              value={form.invitados}
              onChange={handleInputChange}
              min="1"
              placeholder="Ej: 30"
              className="w-full px-4 py-2.5 rounded-lg border border-earth-border/40 font-sans text-xs bg-earth-sand/30 text-earth-clay focus:border-earth-olive focus:outline-none transition-colors duration-300 placeholder:text-earth-text-sec/45"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-earth-clay flex items-center gap-1.5">
              <Cake className="w-3.5 h-3.5 text-earth-terracotta" />
              Tipo de Evento
            </label>
            <div className="relative">
              <select
                name="tipoEvento"
                value={form.tipoEvento}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-earth-border/40 font-sans text-xs bg-earth-sand/30 text-earth-clay focus:border-earth-olive focus:outline-none transition-colors duration-300 appearance-none cursor-pointer"
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type} className="text-earth-clay bg-white">
                    {type}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-earth-text-sec">
                <svg className="fill-current h-3.5 w-3.5" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Productos de interés */}
        <div className="flex flex-col gap-3">
          <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-earth-clay flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-earth-terracotta" />
            Productos de interés
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 mt-1">
            {productOptions.map((option) => {
              const isChecked = form.productos.includes(option);
              return (
                <div
                  key={option}
                  onClick={() => handleCheckboxChange(option)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border border-earth-border/30 cursor-pointer select-none transition-all duration-300 ${
                    isChecked
                      ? 'bg-earth-terracotta/5 border-earth-terracotta/40 shadow-sm'
                      : 'bg-earth-sand/10 hover:bg-earth-alabaster/40'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors duration-300 ${
                      isChecked
                        ? 'bg-earth-terracotta border-earth-terracotta text-white'
                        : 'border-earth-border bg-white'
                    }`}
                  >
                    {isChecked && (
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" fill="white" />
                      </svg>
                    )}
                  </div>
                  <span className="font-sans font-normal text-xs text-earth-clay">
                    {option}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detalles Adicionales */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-earth-clay flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-earth-terracotta" />
            Detalles adicionales del evento
          </label>
          <textarea
            name="detalles"
            value={form.detalles}
            onChange={handleInputChange}
            rows={4}
            placeholder="Cuéntanos más: lugar del evento, requerimientos especiales, si necesitas servicio de meseros, menús especiales (vegetarianos), etc."
            className="w-full px-4 py-3 rounded-lg border border-earth-border/40 font-sans text-xs bg-earth-sand/30 text-earth-clay focus:border-earth-olive focus:outline-none transition-colors duration-300 placeholder:text-earth-text-sec/45 resize-none leading-relaxed"
          />
        </div>

        {/* Botón de envío */}
        <div className="flex justify-center mt-2">
          <button
            type="submit"
            className="flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-earth-terracotta text-earth-ivory font-sans text-xs uppercase tracking-[0.2em] font-semibold hover:bg-earth-terracotta-light transition-all duration-300 cursor-pointer shadow-md shadow-earth-terracotta/10 focus:outline-none select-none touch-manipulation hover:scale-[1.02]"
          >
            <Send className="w-3.5 h-3.5" />
            Enviar Cotización por WhatsApp
          </button>
        </div>

      </form>
    </motion.div>
  );
};
