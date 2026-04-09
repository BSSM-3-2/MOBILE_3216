import { View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import NavigationTop from '@components/navigation/NavigationTop';
import ContentContainer from '@components/container';
import { FeedList } from '@components/feed/FeedList';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@components/themed-view';
import { useFeedStore } from '@/store/feed-store';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';

export default function HomeScreen() {
    const posts = useFeedStore(state => state.posts);
    const loading = useFeedStore(state => state.loading);
    const loadMore = useFeedStore(state => state.loadMore);
    const fetchFeed = useFeedStore(state => state.fetchFeed);
    const scrollY = useSharedValue(0);

    const headerAnimatedStyle = useAnimatedStyle(() => {
        const translateY = -Math.min(scrollY.value, 72);
        const opacity = interpolate(
            scrollY.value,
            [0, 72],
            [1, 0],
            Extrapolation.CLAMP,
        );
        return {
            transform: [{ translateY }],
            opacity,
        };
    });

    useEffect(() => {
        fetchFeed();
    }, [fetchFeed]);

    return (
        <ThemedView style={{ flex: 1 }}>
            <Animated.View style={headerAnimatedStyle}>
                <ContentContainer isTopElement={true}>
                    <NavigationTop
                        title='MyFeed'
                        icon={'layers'}
                        rightButtons={
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: 15,
                                }}
                            >
                                <Ionicons
                                    name='add-outline'
                                    size={24}
                                    color='#262626'
                                />
                            </View>
                        }
                    />
                </ContentContainer>
            </Animated.View>

            {loading && posts.length === 0 ? (
                <ActivityIndicator style={{ flex: 1 }} />
            ) : (
                <FeedList
                    posts={posts}
                    onEndReached={loadMore}
                    scrollY={scrollY}
                />
            )}
        </ThemedView>
    );
}
