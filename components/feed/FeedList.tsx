import { ThemedView } from '@components/themed-view';
import { Post } from '@type/Post';
import { FlatList, StyleSheet } from 'react-native';
import { FeedPost } from './post/FeedPost';

function FeedList({ posts }: { posts: Post[] }) {
    const renderPost = ({ item }: { item: Post }) => (
        <FeedPost post={item} />
    );

    return (
        <ThemedView style={styles.container}>
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id.toString()}
                style={{ flex: 1 }}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
});

export { FeedList };
