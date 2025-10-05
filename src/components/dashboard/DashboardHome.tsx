import { useEffect, useState } from 'react';
import { Cloud, Calendar, MapPin, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface PlannedEvent {
  id: string;
  title: string;
  event_date: string;
  location_name: string;
  event_type: string;
  weather_data: any;
}

interface AstronomicalEvent {
  id: string;
  event_name: string;
  event_type: string;
  event_date: string;
  description: string;
}

export function DashboardHome() {
  const { user } = useAuth();
  const [plannedEvents, setPlannedEvents] = useState<PlannedEvent[]>([]);
  const [astronomicalEvents, setAstronomicalEvents] = useState<AstronomicalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    const { data: events } = await supabase
      .from('planned_events')
      .select('*')
      .eq('user_id', user.id)
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: true })
      .limit(3);

    const { data: astroEvents } = await supabase
      .from('astronomical_events')
      .select('*')
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true })
      .limit(3);

    setPlannedEvents(events || []);
    setAstronomicalEvents(astroEvents || []);
    setLoading(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Bienvenido a CLIMEXA</h2>
        <p className="text-blue-100">Tu compañero inteligente para actividades al aire libre</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-lg p-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Eventos Planeados</p>
              <p className="text-2xl font-bold text-gray-800">{plannedEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 rounded-lg p-3">
              <Cloud className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Clima Favorable</p>
              <p className="text-2xl font-bold text-gray-800">85%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 rounded-lg p-3">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Lugares Visitados</p>
              <p className="text-2xl font-bold text-gray-800">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 rounded-lg p-3">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Precisión IA</p>
              <p className="text-2xl font-bold text-gray-800">92%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Próximos Eventos</h3>
          {plannedEvents.length > 0 ? (
            <div className="space-y-4">
              {plannedEvents.map((event) => (
                <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-800">{event.title}</h4>
                  <p className="text-sm text-gray-600">{event.location_name}</p>
                  <p className="text-sm text-gray-500">{formatDate(event.event_date)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No tienes eventos planeados</p>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Eventos Astronómicos</h3>
          {astronomicalEvents.length > 0 ? (
            <div className="space-y-4">
              {astronomicalEvents.map((event) => (
                <div key={event.id} className="border-l-4 border-yellow-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-800">{event.event_name}</h4>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  <p className="text-sm text-gray-500">{formatDate(event.event_date)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No hay eventos astronómicos próximos</p>
          )}
        </div>
      </div>
    </div>
  );
}
