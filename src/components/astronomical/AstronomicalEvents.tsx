import { useEffect, useState } from 'react';
import { Moon, Star, Eye, MapPin, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AstroEvent {
  id: string;
  event_type: string;
  event_name: string;
  event_date: string;
  description: string;
  visibility_data: any;
  image_url?: string;
}

export function AstronomicalEvents() {
  const [events, setEvents] = useState<AstroEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const { data } = await supabase
      .from('astronomical_events')
      .select('*')
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true });

    setEvents(data || []);
    setLoading(false);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'luna_llena':
      case 'luna_nueva':
      case 'superluna':
        return <Moon className="w-8 h-8" />;
      case 'lluvia_meteoros':
        return <Star className="w-8 h-8" />;
      default:
        return <Eye className="w-8 h-8" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'luna_llena':
        return 'from-yellow-400 to-orange-500';
      case 'luna_nueva':
        return 'from-gray-700 to-gray-900';
      case 'eclipse':
        return 'from-red-500 to-orange-600';
      case 'superluna':
        return 'from-yellow-300 to-orange-400';
      case 'lluvia_meteoros':
        return 'from-blue-500 to-indigo-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <Moon className="w-12 h-12" />
          <div>
            <h2 className="text-3xl font-bold">Eventos Astronómicos</h2>
            <p className="text-gray-300">No te pierdas los espectáculos celestes</p>
          </div>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <Moon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No hay eventos astronómicos programados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const dateTime = formatDate(event.event_date);
            return (
              <div
                key={event.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className={`bg-gradient-to-br ${getEventColor(event.event_type)} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    {getEventIcon(event.event_type)}
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      {event.event_type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold">{event.event_name}</h3>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-gray-600">{event.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{dateTime.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Eye className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Hora: {dateTime.time}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-800">Mejor ubicación</p>
                        <p className="text-sm text-gray-600">
                          Lugares altos con poca contaminación lumínica
                        </p>
                        <p className="text-sm text-blue-600 mt-1">
                          Visibilidad: {event.visibility_data?.visibility || '90%'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Recomendaciones:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Llegar 30 minutos antes</li>
                      <li>• Llevar abrigo y bebidas calientes</li>
                      <li>• Binoculares o telescopio (opcional)</li>
                      <li>• Verificar clima antes de salir</li>
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
