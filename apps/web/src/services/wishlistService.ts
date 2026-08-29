const WISHLIST_KEY = 'eduverse-wishlist';

class WishlistService {
  getWishlist(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const items = window.localStorage.getItem(WISHLIST_KEY);
      return items ? JSON.parse(items) : [];
    } catch {
      return [];
    }
  }

  addToWishlist(courseId: string): void {
    if (typeof window === 'undefined') return;
    try {
      const list = this.getWishlist();
      if (!list.includes(courseId)) {
        list.push(courseId);
        window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
      }
    } catch {
      // fail-safe
    }
  }

  removeFromWishlist(courseId: string): void {
    if (typeof window === 'undefined') return;
    try {
      let list = this.getWishlist();
      list = list.filter((id) => id !== courseId);
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    } catch {
      // fail-safe
    }
  }

  isInWishlist(courseId: string): boolean {
    return this.getWishlist().includes(courseId);
  }
}

export const wishlistService = new WishlistService();
export default wishlistService;
