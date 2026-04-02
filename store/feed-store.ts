import { create } from 'zustand';
import { Post } from '@type/Post';
import { getFeed } from '@/api/content';
// toggleLike 구현에 필요한 API 함수 import
import { likePost, unlikePost } from '@/api/content';

interface FeedState {
    posts: Post[];
    page: number;
    hasNext: boolean;
    loading: boolean;
    error: string | null;

    fetchFeed: () => Promise<void>;
    loadMore: () => Promise<void>;
    toggleLike: (postId: string) => Promise<void>;
}

export const useFeedStore = create<FeedState>((set: any, get: any) => ({
    posts: [],
    page: 1,
    hasNext: false,
    loading: false,
    error: null,

    fetchFeed: async () => {
        set({ loading: true, error: null });
        try {
            const { data, pagination } = await getFeed(1);
            set({
                posts: data,
                page: 1,
                hasNext: pagination.hasNext,
                loading: false,
            });
        } catch (e: any) {
            set({ error: e?.message ?? '피드 로드 실패', loading: false });
        }
    },

    loadMore: async () => {
        const { loading, hasNext, page, posts } = get();
        if (loading || !hasNext) return;

        set({ loading: true });
        try {
            const nextPage = page + 1;
            const { data, pagination } = await getFeed(nextPage);
            set({
                posts: [...posts, ...data],
                page: nextPage,
                hasNext: pagination.hasNext,
                loading: false,
            });
        } catch {
            set({ loading: false });
        }
    },

    // 낙관적 업데이트: UI를 먼저 바꾸고 API 호출 → 실패 시 원상복구
    toggleLike: async (postId: string) => {
        // snapshot for rollback
        const prevPosts = get().posts;
        // optimistic update: toggle liked and update likes count
        set((state: FeedState) => ({
            posts: state.posts.map(p =>
                p.id === postId
                    ? {
                          ...p,
                          liked: !p.liked,
                          likes: p.liked ? p.likes - 1 : p.likes + 1,
                      }
                    : p,
            ),
        }));

        try {
            // call API depending on new liked state
            const updated = get().posts.find((p: Post) => p.id === postId);
            if (!updated) return;

            if (updated.liked) {
                const res = await likePost(postId);
                // sync server response if needed
                set((state: FeedState) => ({
                    posts: state.posts.map(p =>
                        p.id === postId
                            ? { ...p, likes: res.likes, liked: res.liked }
                            : p,
                    ),
                }));
            } else {
                const res = await unlikePost(postId);
                set((state: FeedState) => ({
                    posts: state.posts.map(p =>
                        p.id === postId
                            ? { ...p, likes: res.likes, liked: res.liked }
                            : p,
                    ),
                }));
            }
        } catch (e) {
            // rollback using latest store state source get().posts to avoid stale closure
            set({ posts: prevPosts });
        }
    },
}));
