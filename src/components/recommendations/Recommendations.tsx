import { useState } from 'react';
import { MapPin, TrendingUp, Calendar, Sparkles } from 'lucide-react';

const LOCATIONS = [
  {
    id: 'tunari',
    name: 'Parque Nacional Tunari',
    description: 'Perfecto para senderismo y observación de naturaleza',
    image: 'https://images.pexels.com/photos/1561020/pexels-photo-1561020.jpeg?auto=compress&cs=tinysrgb&w=800',
    bestMonths: ['Mayo', 'Junio', 'Julio', 'Agosto'],
    activities: ['senderismo', 'camping', 'fotografia']
  },
  {
    id: 'torotoro',
    name: 'Toro Toro',
    description: 'Cañones, cavernas y huellas de dinosaurios',
    image: 'https://images.pexels.com/photos/2437299/pexels-photo-2437299.jpeg?auto=compress&cs=tinysrgb&w=800',
    bestMonths: ['Abril', 'Mayo', 'Septiembre', 'Octubre'],
    activities: ['senderismo', 'fotografia', 'escalada']
  },
  {
    id: 'incachaca',
    name: 'Incachaca',
    description: 'Bosques nublados y rica biodiversidad',
    image: 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=800',
    bestMonths: ['Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre'],
    activities: ['senderismo', 'observacion', 'fotografia']
  },
  {
    id: 'laguna',
    name: 'Laguna Alalay',
    description: 'Ideal para ciclismo y actividades familiares',
    image: 'https://images.pexels.com/photos/1438834/pexels-photo-1438834.jpeg?auto=compress&cs=tinysrgb&w=800',
    bestMonths: ['Todo el año'],
    activities: ['ciclismo', 'picnic', 'fotografia']
  },
];

const ACTIVITY_TYPES = [
  { id: 'senderismo', label: 'Senderismo', icon: '🥾' },
  { id: 'camping', label: 'Camping', icon: '⛺' },
  { id: 'fotografia', label: 'Fotografía', icon: '📸' },
  { id: 'observacion', label: 'Observación', icon: '🔭' },
  { id: 'escalada', label: 'Escalada', icon: '🧗' },
  { id: 'ciclismo', label: 'Ciclismo', icon: '🚴' },
];

export function Recommendations() {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const filteredLocations = LOCATIONS.filter(location => {
    if (selectedActivity && !location.activities.includes(selectedActivity)) {
      return false;
    }
    if (selectedMonth && !location.bestMonths.includes(selectedMonth) && !location.bestMonths.includes('Todo el año')) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4">
          <TrendingUp className="w-12 h-12" />
          <div>
            <h2 className="text-3xl font-bold">Recomendaciones Inteligentes</h2>
            <p className="text-orange-100">Encuentra el mejor lugar y momento para tu aventura</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Filtros</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de actividad
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ACTIVITY_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedActivity(selectedActivity === type.id ? '' : type.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    selectedActivity === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl block mb-1">{type.icon}</span>
                  <span className="text-xs font-medium text-gray-700">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Calendar className="w-4 h-4 inline mr-1" />
              Mes preferido
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los meses</option>
              <option value="Enero">Enero</option>
              <option value="Febrero">Febrero</option>
              <option value="Marzo">Marzo</option>
              <option value="Abril">Abril</option>
              <option value="Mayo">Mayo</option>
              <option value="Junio">Junio</option>
              <option value="Julio">Julio</option>
              <option value="Agosto">Agosto</option>
              <option value="Septiembre">Septiembre</option>
              <option value="Octubre">Octubre</option>
              <option value="Noviembre">Noviembre</option>
              <option value="Diciembre">Diciembre</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLocations.map((location) => (
          <div
            key={location.id}
            className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={location.image}
                alt={location.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-semibold text-gray-800">Recomendado</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{location.name}</h3>
                <p className="text-gray-600">{location.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {location.activities.map((activity) => {
                  const activityType = ACTIVITY_TYPES.find(t => t.id === activity);
                  return (
                    <span
                      key={activity}
                      className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{activityType?.icon}</span>
                      <span>{activityType?.label}</span>
                    </span>
                  );
                })}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-800 text-sm">Mejores meses</p>
                    <p className="text-sm text-green-700">{location.bestMonths.join(', ')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Condiciones históricas
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Días despejados:</span>
                    <span className="font-semibold text-gray-800 ml-1">85%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Temp. promedio:</span>
                    <span className="font-semibold text-gray-800 ml-1">16°C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLocations.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No se encontraron lugares con estos filtros</p>
        </div>
      )}
    </div>
  );
}
