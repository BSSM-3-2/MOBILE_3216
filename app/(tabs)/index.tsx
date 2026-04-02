import { View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import NavigationTop from '@components/navigation/NavigationTop';
import ContentContainer from '@components/container';
import { FeedList } from '@components/feed/FeedList';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@components/themed-view';
import { useFeedStore } from '@/store/feed-store';

export default function HomeScreen() {
    const posts = useFeedStore(state => state.posts);
    const loading = useFeedStore(state => state.loading);
    const loadMore = useFeedStore(state => state.loadMore);
    const fetchFeed = useFeedStore(state => state.fetchFeed);

    useEffect(() => {
        fetchFeed();
    }, [fetchFeed]);

    return (
        <ThemedView style={{ flex: 1 }}>
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

            {loading && posts.length === 0 ? (
                <ActivityIndicator style={{ flex: 1 }} />
            ) : (
                <FeedList posts={posts} onEndReached={loadMore} />
            )}
        </ThemedView>
    );
}
