'use client';

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuthStore } from '@eduverse/ui';
import wishlistService from '../../services/wishlistService';
import { useRouter } from 'next/navigation';

interface WishlistButtonProps {
  courseId: string;
  className?: string;
  onToggle?: (isInWishlist: boolean) => void;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  courseId,
  className = '',
  onToggle,
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [inWishlist, setInWishlist] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    setInWishlist(wishlistService.isInWishlist(courseId));
  }, [courseId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowPrompt(true);
      return;
    }

    if (inWishlist) {
      wishlistService.removeFromWishlist(courseId);
      setInWishlist(false);
      if (onToggle) onToggle(false);
    } else {
      wishlistService.addToWishlist(courseId);
      setInWishlist(true);
      if (onToggle) onToggle(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`p-2 rounded-full border border-slate-800 hover:bg-slate-800 hover:text-red-400 transition-colors ${
          inWishlist ? 'bg-slate-800 text-red-500 border-red-500/20' : 'text-slate-400 bg-slate-900/60'
        } ${className}`}
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={16} className={inWishlist ? 'fill-red-500' : ''} />
      </button>

      {showPrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h4 className="text-white font-bold font-heading text-lg">Save to Wishlist</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create an account or login to save your favorite courses and synchronize your learning across devices.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowPrompt(false)}
                className="flex-1 px-4 py-2 border border-slate-800 rounded-xl text-xs text-slate-400 hover:bg-slate-800 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPrompt(false);
                  router.push('/register?redirect=/courses');
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs text-white font-bold"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WishlistButton;
