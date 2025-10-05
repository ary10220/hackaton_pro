import { useState, useEffect } from 'react';
import { Users, Star, MapPin, Calendar, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Review {
  id: string;
  comment: string;
  rating: number;
  visit_date: string;
  weather_conditions: any;
  created_at: string;
  profiles: {
    username: string;
    avatar_url?: string;
  };
  locations: {
    name: string;
  } | null;
}

export function Community() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (username, avatar_url),
        locations:location_id (name)
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    setReviews(data || []);
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

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
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
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4">
          <Users className="w-12 h-12" />
          <div>
            <h2 className="text-3xl font-bold">Comunidad</h2>
            <p className="text-pink-100">Experiencias compartidas por viajeros como tú</p>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No hay reseñas disponibles</p>
          <p className="text-sm text-gray-400 mt-2">Sé el primero en compartir tu experiencia</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {review.profiles?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">
                    {review.profiles?.username || 'Usuario'}
                  </h4>
                  <div className="flex gap-1 mt-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {formatDate(review.created_at)}
                  </p>
                </div>
              </div>

              {review.locations && (
                <div className="flex items-center gap-2 mb-3 text-gray-700">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{review.locations.name}</span>
                </div>
              )}

              <p className="text-gray-700 mb-4">{review.comment}</p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Visitado: {formatDate(review.visit_date)}</span>
                </div>
                {review.weather_conditions?.condition && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>☀️</span>
                    <span>{review.weather_conditions.condition}</span>
                  </div>
                )}
              </div>

              {review.weather_conditions?.recommendation && (
                <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Consejo:</strong> {review.weather_conditions.recommendation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
