import { TrendingUp, Cloud, Droplets, Wind, Sun } from 'lucide-react';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const mockTemperatureData = [15, 16, 15, 14, 13, 12, 12, 13, 14, 15, 16, 15];
const mockRainfallData = [120, 100, 80, 40, 10, 5, 5, 10, 30, 60, 80, 100];

export function Statistics() {
  const maxTemp = Math.max(...mockTemperatureData);
  const maxRain = Math.max(...mockRainfallData);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4">
          <TrendingUp className="w-12 h-12" />
          <div>
            <h2 className="text-3xl font-bold">Estadísticas Climáticas</h2>
            <p className="text-cyan-100">Datos históricos para una mejor planificación</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-100 rounded-lg p-2">
              <Sun className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Temperatura Promedio Mensual</h3>
          </div>

          <div className="space-y-3">
            {MONTHS.map((month, index) => (
              <div key={month} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 w-8">{month}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-red-500 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                    style={{ width: `${(mockTemperatureData[index] / maxTemp) * 100}%` }}
                  >
                    <span className="text-white text-sm font-semibold">
                      {mockTemperatureData[index]}°C
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 rounded-lg p-2">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Precipitación Mensual (mm)</h3>
          </div>

          <div className="space-y-3">
            {MONTHS.map((month, index) => (
              <div key={month} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 w-8">{month}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                    style={{ width: `${(mockRainfallData[index] / maxRain) * 100}%` }}
                  >
                    <span className="text-white text-sm font-semibold">
                      {mockRainfallData[index]}mm
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 rounded-lg p-3">
              <Cloud className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Días Despejados</h3>
          </div>
          <p className="text-4xl font-bold text-gray-800 mb-2">245</p>
          <p className="text-sm text-gray-600">días al año en promedio</p>
          <div className="mt-4 bg-green-50 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <strong>67%</strong> del año con condiciones ideales
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 rounded-lg p-3">
              <Wind className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Velocidad del Viento</h3>
          </div>
          <p className="text-4xl font-bold text-gray-800 mb-2">12 km/h</p>
          <p className="text-sm text-gray-600">promedio anual</p>
          <div className="mt-4 bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              Condiciones <strong>moderadas</strong> para actividades
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-yellow-100 rounded-lg p-3">
              <Sun className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Radiación Solar</h3>
          </div>
          <p className="text-4xl font-bold text-gray-800 mb-2">8/10</p>
          <p className="text-sm text-gray-600">índice UV promedio</p>
          <div className="mt-4 bg-yellow-50 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Alta</strong> - usar protección solar
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Mejores Meses por Actividad</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🥾</span>
              <div>
                <h4 className="font-semibold text-gray-800">Senderismo</h4>
                <p className="text-sm text-gray-600">Mayo - Agosto</p>
                <p className="text-xs text-gray-500 mt-1">Clima seco, temperaturas moderadas</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">⛺</span>
              <div>
                <h4 className="font-semibold text-gray-800">Camping</h4>
                <p className="text-sm text-gray-600">Junio - Septiembre</p>
                <p className="text-xs text-gray-500 mt-1">Noches despejadas, baja precipitación</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">📸</span>
              <div>
                <h4 className="font-semibold text-gray-800">Fotografía</h4>
                <p className="text-sm text-gray-600">Abril - Octubre</p>
                <p className="text-xs text-gray-500 mt-1">Luz ideal, cielos despejados</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔭</span>
              <div>
                <h4 className="font-semibold text-gray-800">Observación Astronómica</h4>
                <p className="text-sm text-gray-600">Mayo - Agosto</p>
                <p className="text-xs text-gray-500 mt-1">Cielos más despejados del año</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🧗</span>
              <div>
                <h4 className="font-semibold text-gray-800">Escalada</h4>
                <p className="text-sm text-gray-600">Abril - Octubre</p>
                <p className="text-xs text-gray-500 mt-1">Roca seca, condiciones seguras</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🚴</span>
              <div>
                <h4 className="font-semibold text-gray-800">Ciclismo</h4>
                <p className="text-sm text-gray-600">Todo el año</p>
                <p className="text-xs text-gray-500 mt-1">Condiciones generalmente favorables</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
