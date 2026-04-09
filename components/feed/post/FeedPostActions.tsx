import { FeedColors, Spacing } from '@/constants/theme';
import { useFeedStore } from '@/store/feed-store';
import { ThemedText } from '@components/themed-text';
import { ThemedView } from '@components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';

function FeedPostActions({
    postId,
    initialLikes,
    initialLiked = false,
    commentCount = 0,
}: {
    postId: string;
    initialLikes: number;
    initialLiked?: boolean;
    commentCount?: number;
}) {
    const [saved, setSaved] = useState(false);
    const { posts, toggleLike } = useFeedStore();
    const likeScale = useRef(new Animated.Value(1)).current;

    const post = posts.find(p => p.id === postId);
    const liked = post?.liked ?? initialLiked;
    const likeCount = post?.likes ?? initialLikes;

    const handleSave = () => setSaved(prev => !prev);
    const handleLike = () => {
        toggleLike(postId);
        likeScale.setValue(1);
        Animated.sequence([
            Animated.timing(likeScale, {
                toValue: 1.25,
                duration: 120,
                useNativeDriver: true,
            }),
            Animated.spring(likeScale, {
                toValue: 1,
                friction: 5,
                tension: 150,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <ThemedView style={styles.actions}>
            <ThemedView style={styles.leftActions}>
                <TouchableOpacity
                    onPress={handleLike}
                    style={[styles.actionButton, styles.row]}
                >
                    <Animated.View
                        style={{ transform: [{ scale: likeScale }] }}
                    >
                        <Ionicons
                            name={liked ? 'heart' : 'heart-outline'}
                            size={26}
                            color={
                                liked
                                    ? FeedColors.likeActive
                                    : FeedColors.primaryText
                            }
                        />
                    </Animated.View>
                    <ThemedText style={styles.countText}>
                        {likeCount.toLocaleString()}
                    </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, styles.row]}>
                    <Ionicons
                        name='chatbubble-outline'
                        size={24}
                        color={FeedColors.primaryText}
                    />
                    <ThemedText style={styles.countText}>
                        {commentCount.toLocaleString()}
                    </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons
                        name='paper-plane-outline'
                        size={24}
                        color={FeedColors.primaryText}
                    />
                </TouchableOpacity>
            </ThemedView>

            <TouchableOpacity onPress={handleSave} style={styles.actionButton}>
                <Ionicons
                    name={saved ? 'bookmark' : 'bookmark-outline'}
                    size={24}
                    color={FeedColors.primaryText}
                />
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Spacing.md,
    },
    leftActions: {
        flexDirection: 'row',
        gap: Spacing.lg,
    },
    actionButton: {
        padding: 2,
    },
    row: {
        flexDirection: 'row',
        gap: Spacing.xs,
        alignItems: 'center',
    },
    countText: {
        fontWeight: '600',
    },
});

export { FeedPostActions };
