import { useEffect } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import NavigationTop from '@components/navigation/NavigationTop';
import ContentContainer from '@components/container';
import { FeedList } from '@components/feed/FeedList';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@components/themed-view';
import { useFeedStore } from '@/store/feed-store';
import { useRouter } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';

function FeedError({
    message,
    onRetry,
}: {
    message: string;
    onRetry: () => void;
}) {
    return (
        <View style={styles.errorContainer}>
            <Text style={styles.errorMessage}>{message}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                <Text style={styles.retryText}>재시도</Text>
            </TouchableOpacity>
        </View>
    );
}

export default function HomeScreen() {
    const { posts, loading, error, fetchFeed, loadMore } = useFeedStore();
    const router = useRouter();

    // scrollY: 스크롤 위치를 UI 스레드에서 직접 추적하는 SharedValue
    const scrollY = useSharedValue(0);

    // useAnimatedStyle: scrollY 변화에 따라 헤더를 UI 스레드에서 직접 변환
    // interpolate: 입력 범위 [0, 80] → 출력 범위 매핑 (Extrapolation.CLAMP: 범위 초과 시 고정)
    const headerAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: interpolate(
                    scrollY.value,
                    [0, 80],
                    [0, -80],
                    Extrapolation.CLAMP,
                ),
            },
        ],
        opacity: interpolate(
            scrollY.value,
            [0, 60],
            [1, 0],
            Extrapolation.CLAMP,
        ),
    }));

    useEffect(() => {
        fetchFeed();
    }, []);

    return (
        <ThemedView style={{ flex: 1, overflow: 'hidden' }}>
            {/* Animated.View: headerAnimatedStyle 적용 — 스크롤에 따라 헤더 숨김 */}
            <Animated.View style={headerAnimatedStyle}>
                <ContentContainer isTopElement={true}>
                    <NavigationTop
                        title='MyFeed'
                        icon={'layers'}
                        rightButtons={
                            <TouchableOpacity
                                onPress={() => router.push('/create' as never)}
                                hitSlop={8}
                            >
                                <Ionicons
                                    name='add-outline'
                                    size={28}
                                    color='#262626'
                                />
                            </TouchableOpacity>
                        }
                    />
                </ContentContainer>
            </Animated.View>

            {error && posts.length === 0 ? (
                <FeedError message={error} onRetry={fetchFeed} />
            ) : loading && posts.length === 0 ? (
                <ActivityIndicator style={{ flex: 1 }} />
            ) : (
                // scrollY를 FeedList에 전달 → useAnimatedScrollHandler가 내부에서 처리
                <FeedList
                    posts={posts}
                    onEndReached={loadMore}
                    scrollY={scrollY}
                />
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        gap: 12,
    },
    errorMessage: {
        fontSize: 15,
        textAlign: 'center',
    },
    retryButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    retryText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
