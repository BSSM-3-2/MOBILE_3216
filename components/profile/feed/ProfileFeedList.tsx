import { Dimensions, StyleSheet } from 'react-native';
import { FlatList } from 'react-native';
import { Post } from '@type/Post';
import User from '@type/User';
import { Image } from 'expo-image';
import { resolveImageSource } from '@/utils/image';
import { Grid } from '@/constants/theme';
import { ThemedView } from '@components/themed-view';
import { ProfileHeader } from '@components/profile/ProfileHeader';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width / Grid.profileColumnCount;

export default function ProfileFeedList({ posts, user }: { posts: Post[], user: User }) {
    const renderItem = ({ item }: { item: Post }) => (
        <Image
            style={styles.image}
            contentFit={'cover'}
            source={resolveImageSource(item.images[0])}
        />
    );

    const renderHeader = () => (
        <ProfileHeader user={user} />
    );

    return (
        <ThemedView style={styles.wrapper}>
            <FlatList
                data={posts}
                renderItem={renderItem}
                numColumns={Grid.profileColumnCount}
                keyExtractor={item => item.id}
                style={styles.container}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={renderHeader}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    image: {
        height: ITEM_SIZE * Grid.profileImageRatio,
        width: ITEM_SIZE - Grid.gap,
        marginRight: Grid.gap / 2,
        marginBottom: Grid.gap,
    },
    wrapper: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: Grid.gap / 2,
    },
});
