import React from 'react';
import { Star, MessageSquare, Award, ThumbsUp, Users, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminMetrics: React.FC = () => {
  const { washers, orders } = useApp();

  // Extract all reviews from orders
  const reviews = orders.filter(o => !!o.review).map(o => o.review!);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Métricas de Calidad & Reseñas
        </h2>
        <p className="text-xs text-slate-500">
          Supervisión del desempeño del personal y satisfacción reportada por los clientes
        </p>
      </div>

      {/* Washers Ranking Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {washers.map((washer, idx) => (
          <div
            key={washer.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Ranking #{idx + 1}
                </span>
                <span className="flex items-center gap-1 text-xs font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {washer.rating}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={washer.avatar}
                  alt={washer.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-100 shadow-2xs"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-extrabold text-slate-900 truncate">{washer.name}</h4>
                  <p className="text-xs text-slate-500 truncate">{washer.vehicleType}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 text-center">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Servicios
                  </span>
                  <span className="text-xs font-extrabold text-slate-800">
                    {washer.completedServices}
                  </span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Satisfacción
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600">
                    {Math.round((washer.rating / 5) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Estado operativo:</span>
              <span className="font-bold text-indigo-600 capitalize">
                {washer.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Reviews Feed */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Opiniones y Reseñas Recientes de Clientes
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {reviews.length} valoraciones registradas
          </span>
        </div>

        <div className="space-y-3">
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4 text-center">
              Aún no se han registrado opiniones de clientes.
            </p>
          ) : (
            reviews.map(rev => {
              const washer = washers.find(w => w.id === rev.washerId);
              return (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">{rev.clientName}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-indigo-600 font-semibold">
                        Lavador: {washer?.name || 'Carlos Méndez'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                      <span className="text-[11px] ml-1">({rev.rating}.0)</span>
                    </div>
                  </div>

                  {rev.comment && (
                    <p className="text-slate-700 italic leading-relaxed">"{rev.comment}"</p>
                  )}

                  {rev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rev.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-indigo-100/70 text-indigo-800 text-[10px] font-bold"
                        >
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
