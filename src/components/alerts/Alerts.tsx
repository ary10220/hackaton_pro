import { useEffect, useState } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Alert {
  id: string;
  alert_type: string;
  title: string;
  message: string;
  severity: string;
  is_read: boolean;
  created_at: string;
}

export function Alerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAlerts();
    }
  }, [user]);

  const loadAlerts = async () => {
    const { data } = await supabase
      .from('alerts')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    setAlerts(data || []);
    setLoading(false);
  };

  const markAsRead = async (alertId: string) => {
    await supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('id', alertId);

    setAlerts(alerts.map(alert =>
      alert.id === alertId ? { ...alert, is_read: true } : alert
    ));
  };

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: AlertTriangle,
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          textColor: 'text-red-800'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: AlertTriangle,
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          textColor: 'text-yellow-800'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: Info,
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          textColor: 'text-blue-800'
        };
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const unreadCount = alerts.filter(a => !a.is_read).length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Bell className="w-12 h-12" />
            <div>
              <h2 className="text-3xl font-bold">Alertas y Notificaciones</h2>
              <p className="text-red-100">Mantente informado sobre tus eventos</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <div className="bg-white text-red-600 rounded-full w-16 h-16 flex items-center justify-center">
              <span className="text-2xl font-bold">{unreadCount}</span>
            </div>
          )}
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <p className="text-gray-800 font-semibold text-lg">Todo está en orden</p>
          <p className="text-gray-500 mt-2">No tienes alertas pendientes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const config = getSeverityConfig(alert.severity);
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className={`${config.bg} border ${config.border} rounded-xl p-6 ${
                  !alert.is_read ? 'shadow-md' : 'opacity-75'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`${config.iconBg} rounded-lg p-3 flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${config.iconColor}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`text-lg font-bold ${config.textColor}`}>
                        {alert.title}
                      </h3>
                      {!alert.is_read && (
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="text-sm text-gray-600 hover:text-gray-800 underline"
                        >
                          Marcar como leída
                        </button>
                      )}
                    </div>

                    <p className={`${config.textColor} mb-3`}>{alert.message}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{formatDate(alert.created_at)}</span>
                      <span className="capitalize">{alert.alert_type.replace('_', ' ')}</span>
                      {!alert.is_read && (
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          NUEVO
                        </span>
                      )}
                    </div>
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
