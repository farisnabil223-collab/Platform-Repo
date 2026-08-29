import React from 'react';
import Rating from './Rating';
import { Card, Avatar } from '@eduverse/ui';
import { CheckCircle2 } from 'lucide-react';

interface Review {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  content: string;
  date: string;
  verified: boolean;
}

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <Card className="bg-slate-900/40 border border-slate-800/80 p-5 rounded-xl flex flex-col justify-between space-y-3 h-full">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar
              src={review.authorAvatar}
              fallback={review.authorName}
              alt={review.authorName}
              size="sm"
              className="h-8 w-8 rounded-full border border-slate-700 bg-indigo-900/30 text-indigo-300 font-bold text-xs"
            />
            <div>
              <h5 className="text-xs font-bold text-white font-heading">{review.authorName}</h5>
              <span className="text-[9px] text-slate-500">{review.date}</span>
            </div>
          </div>
          {review.verified && (
            <span className="inline-flex items-center gap-1 text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 size={8} /> Verified
            </span>
          )}
        </div>
        <Rating value={review.rating} size={12} />
      </div>
      <p className="text-xs text-slate-400 leading-relaxed italic">
        "{review.content}"
      </p>
    </Card>
  );
};

export default ReviewCard;
