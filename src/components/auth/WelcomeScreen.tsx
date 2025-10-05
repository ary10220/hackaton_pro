import { Cloud, Sun, Moon, CloudRain } from 'lucide-react';

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
}

export function WelcomeScreen({ onLogin, onRegister }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      <div className="absolute inset-0 bg-black/10">
        <div className="absolute top-20 left-20 animate-float">
          <Cloud className="w-24 h-24 text-white/30" />
        </div>
        <div className="absolute top-40 right-32 animate-float-delayed">
          <Sun className="w-32 h-32 text-yellow-200/40" />
        </div>
        <div className="absolute bottom-32 left-1/4 animate-float">
          <CloudRain className="w-20 h-20 text-white/20" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-delayed">
          <Moon className="w-28 h-28 text-white/25" />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-2xl">
          <h1 className="text-7xl font-bold text-white tracking-tight">
            CLIMEXA
          </h1>

          <p className="text-2xl text-white/90 font-light">
            Tu compañero inteligente para planificar actividades al aire libre
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-8">
            <button
              onClick={onLogin}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
            >
              Iniciar sesión
            </button>
            <button
              onClick={onRegister}
              className="px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold text-lg hover:bg-blue-800 transition-all transform hover:scale-105 shadow-xl border-2 border-white/20"
            >
              Registrarse
            </button>
          </div>

          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-white/90">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Cloud className="w-12 h-12 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Predicciones Precisas</h3>
              <p className="text-sm text-white/80">Datos climáticos en tiempo real y predicciones basadas en IA</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Moon className="w-12 h-12 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Eventos Astronómicos</h3>
              <p className="text-sm text-white/80">No te pierdas lunas llenas, eclipses y lluvias de meteoros</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Sun className="w-12 h-12 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Recomendaciones IA</h3>
              <p className="text-sm text-white/80">Sugerencias personalizadas para tus actividades favoritas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
