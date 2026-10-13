import React, { useState } from 'react';
import { Star, X, Check, ThumbsUp, Heart, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RatingModal: React.FC = () => {
  const { ratingModalOrder, setRatingModalOrder, submitReview } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Excelente acabado',
    'Muy puntual',
  ]);

  if (!ratingModalOrder) return null;

  const availableTags = [
    'Muy puntual',
    'Excelente acabado',
    'Trato amable',
    'Cuidado de vestiduras',
    'Buena limpieza de rines',
    'Aroma agradable',
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview(ratingModalOrder.id, rating, comment, selectedTags);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 relative space-y-4">
        {/* Close Button */}
        <button
          onClick={() => setRatingModalOrder(null)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center mx-auto shadow-md shadow-amber-500/30">
            <Star className="w-8 h-8 fill-white" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">
            ¿Cómo quedó tu vehículo?
          </h3>
          <p className="text-xs text-slate-500">
            Valora el servicio de <strong>{ratingModalOrder.washer?.name || 'tu lavador'}</strong> en la orden {ratingModalOrder.orderNumber}
          </p>
        </div>

        {/* 5-Star Interactive Selector */}
        <div className="flex justify-center items-center gap-2 py-2">
          {[1, 2, 3, 4, 5].map(star => {
            const isFilled = (hoverRating || rating) >= star;
            return (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    isFilled
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-200 fill-slate-100'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Positive aspect tags */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            ¿Qué destacarías del trabajo?
          </label>
          <div className="flex flex-wrap gap-1.5">
            {availableTags.map(tag => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Free text review */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Comentario u observaciones (opcional)
          </label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            placeholder="Escribe tu opinión sobre la limpieza, atención o puntualidad..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-600 focus:bg-white resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/25 transition cursor-pointer"
          >
            Enviar Calificación
          </button>
        </div>
      </div>
    </div>
  );
};
