import { useState } from 'react';
import { Calendar, MapPin, Clock, Sparkles, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const EVENT_TYPES = [
  { id: 'senderismo', label: 'Senderismo', icon: '🥾' },
  { id: 'camping', label: 'Camping', icon: '⛺' },
  { id: 'fotografia', label: 'Fotografía', icon: '📸' },
  { id: 'observacion', label: 'Observación Astronómica', icon: '🔭' },
  { id: 'escalada', label: 'Escalada', icon: '🧗' },
  { id: 'ciclismo', label: 'Ciclismo', icon: '🚴' },
  { id: 'pesca', label: 'Pesca', icon: '🎣' },
  { id: 'picnic', label: 'Picnic', icon: '🧺' },
];

export function EventPlanner() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('');
  const [locationName, setLocationName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handlePredict = async () => {
    if (!eventDate || !locationName) return;

    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockPrediction = {
      temperature: Math.floor(Math.random() * 15) + 10,
      condition: ['Despejado', 'Parcialmente nublado', 'Nublado'][Math.floor(Math.random() * 3)],
      humidity: Math.floor(Math.random() * 30) + 40,
      wind: Math.floor(Math.random() * 20) + 5,
      precipitation: Math.floor(Math.random() * 20),
      visibility: Math.floor(Math.random() * 20) + 80,
      recommendation: 'Condiciones ideales para la actividad. Recomendamos llevar protección solar y agua suficiente.',
      warnings: [] as string[]
    };

    if (mockPrediction.precipitation > 15) {
      mockPrediction.warnings.push('Posibilidad de lluvia moderada');
    }
    if (mockPrediction.wind > 20) {
      mockPrediction.warnings.push('Vientos fuertes esperados');
    }

    setPrediction(mockPrediction);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user || !title || !eventType || !locationName || !eventDate) return;

    setSaving(true);

    const { error } = await supabase.from('planned_events').insert({
      user_id: user.id,
      title,
      event_type: eventType,
      location_name: locationName,
      latitude: -17.3935,
      longitude: -66.1570,
      event_date: eventDate,
      event_time: eventTime || null,
      weather_data: prediction || {},
      ai_recommendations: prediction?.recommendation || '',
      status: 'planned'
    });

    setSaving(false);

    if (!error) {
      setTitle('');
      setEventType('');
      setLocationName('');
      setEventDate('');
      setEventTime('');
      setPrediction(null);
      alert('Evento guardado exitosamente');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4">
          <Calendar className="w-12 h-12" />
          <div>
            <h2 className="text-3xl font-bold">Planificar Evento</h2>
            <p className="text-green-100">Crea tu próxima aventura con predicciones precisas</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Detalles del Evento</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del evento
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Trekking al Tunari"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de actividad
              </label>
              <div className="grid grid-cols-2 gap-3">
                {EVENT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setEventType(type.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      eventType === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl mb-1 block">{type.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Ubicación
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Parque Nacional Tunari"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Fecha
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Hora
                </label>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handlePredict}
              disabled={!eventDate || !locationName || loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>Analizando...</>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Obtener Predicción IA
                </>
              )}
            </button>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Predicción Climática</h3>

            {!prediction ? (
              <div className="bg-gray-50 rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
                <Sparkles className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">
                  Completa los datos y obtén una predicción
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Temperatura</p>
                      <p className="text-2xl font-bold text-gray-800">{prediction.temperature}°C</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Condición</p>
                      <p className="text-lg font-semibold text-gray-800">{prediction.condition}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Humedad</p>
                      <p className="text-xl font-bold text-gray-800">{prediction.humidity}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Viento</p>
                      <p className="text-xl font-bold text-gray-800">{prediction.wind} km/h</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Probabilidad de lluvia</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${prediction.precipitation}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">{prediction.precipitation}%</span>
                    </div>
                  </div>
                </div>

                {prediction.warnings.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="font-semibold text-yellow-800 mb-2">⚠️ Advertencias</p>
                    {prediction.warnings.map((warning: string, idx: number) => (
                      <p key={idx} className="text-sm text-yellow-700">• {warning}</p>
                    ))}
                  </div>
                )}

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="font-semibold text-green-800 mb-2">💡 Recomendaciones IA</p>
                  <p className="text-sm text-green-700">{prediction.recommendation}</p>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    'Guardando...'
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Guardar Evento
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
