import { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import Animated, {
    clamp,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const ACTION_WIDTH = 92;
const OPEN_THRESHOLD = 56;
const SPRING_CONFIG = {
    damping: 18,
    stiffness: 220,
};

function SwipeableFeedPost({
    children,
    onDelete,
}: {
    children: ReactNode;
    onDelete: () => void;
}) {
    const translateX = useSharedValue(0);
    const startX = useSharedValue(0);
    const scale = useSharedValue(1);

    const triggerLongPressHaptic = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const panGesture = Gesture.Pan()
        .maxPointers(1)
        .activeOffsetX([-10, 10])
        .onBegin(() => {
            startX.value = translateX.value;
        })
        .onUpdate(event => {
            const nextX = startX.value + event.translationX;
            translateX.value = clamp(nextX, -ACTION_WIDTH, 0);
        })
        .onEnd(() => {
            const shouldOpen = translateX.value <= -OPEN_THRESHOLD;
            translateX.value = withSpring(
                shouldOpen ? -ACTION_WIDTH : 0,
                SPRING_CONFIG,
            );
        });

    const longPressGesture = Gesture.LongPress()
        .minDuration(350)
        .onStart(() => {
            scale.value = withTiming(0.97, { duration: 120 });
            runOnJS(triggerLongPressHaptic)();
        })
        .onFinalize(() => {
            scale.value = withTiming(1, { duration: 120 });
        });

    const cardAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }, { scale: scale.value }],
    }));

    const handleDelete = () => {
        onDelete();
        translateX.value = withSpring(0, SPRING_CONFIG);
    };

    return (
        <View style={styles.container}>
            <View style={styles.deleteAction}>
                <TouchableOpacity
                    onPress={handleDelete}
                    style={styles.deleteButton}
                    activeOpacity={0.8}
                >
                    <Ionicons name='trash' size={22} color='#ffffff' />
                </TouchableOpacity>
            </View>
            <GestureDetector
                gesture={Gesture.Simultaneous(panGesture, longPressGesture)}
            >
                <Animated.View style={cardAnimatedStyle}>
                    {children}
                </Animated.View>
            </GestureDetector>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 20,
    },
    deleteAction: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: ACTION_WIDTH,
        backgroundColor: '#ff3b30',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export { SwipeableFeedPost };
