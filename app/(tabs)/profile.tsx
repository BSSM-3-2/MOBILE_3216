import { useLocalSearchParams } from 'expo-router';
import MOCK_USER from '@/mock/user';
import { MOCK_USERS_MAP } from '@/mock/users';
import { ThemedView } from '@components/themed-view';

import ProfileFeedList from '@components/profile/feed/ProfileFeedList';
import MOCK_POSTS from '@/mock/posts';
import ContentContainer from '@components/container';
import NavigationTop from '@components/navigation/NavigationTop';

export default function ProfileScreen() {
    const { userId } = useLocalSearchParams<{ userId?: string }>();

    const currentUser = (userId && MOCK_USERS_MAP[userId]) ? MOCK_USERS_MAP[userId] : MOCK_USER;
    const userPosts = userId ? MOCK_POSTS.filter(post => post.userId === userId) : MOCK_POSTS;

    return (
        <ThemedView style={{ flex: 1 }}>
            <ContentContainer isTopElement={true}>
                <NavigationTop title={currentUser.username} />
            </ContentContainer>
            <ProfileFeedList posts={userPosts} user={currentUser} />
        </ThemedView>
    );
}
