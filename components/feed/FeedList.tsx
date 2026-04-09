import { Post } from '@type/Post';
import { FeedPost } from './post/FeedPost';
import { SwipeableFeedPost } from './post/SwipeableFeedPost';
import { useFeedStore } from '@/store/feed-store';
import Animated, {
    SharedValue,
    useAnimatedScrollHandler,
} from 'react-native-reanimated';

function FeedList({
    posts,
    onEndReached,
    scrollY,
}: {
    posts: Post[];
    onEndReached?: () => void;
    scrollY?: SharedValue<number>;
}) {
    const removePost = useFeedStore(state => state.removePost);
    const onScroll = useAnimatedScrollHandler(event => {
        if (!scrollY) {
            return;
        }
        scrollY.value = event.contentOffset.y;
    });

    return (
        <Animated.FlatList
            data={posts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <SwipeableFeedPost onDelete={() => removePost(item.id)}>
                    <FeedPost post={item} />
                </SwipeableFeedPost>
            )}
            onScroll={onScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
        />
    );
}

export { FeedList };
