import { Image, ImageLoadEventData } from 'expo-image';
import {
    Dimensions,
    ImageSourcePropType,
    StyleSheet,
    View,
} from 'react-native';
import { useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    clamp,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FeedImage({
    image,
    onDoubleTap,
}: {
    image: ImageSourcePropType;
    onDoubleTap?: () => void;
}) {
    const [imageHeight, setImageHeight] = useState(SCREEN_WIDTH);
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const imageHeightValue = useSharedValue(SCREEN_WIDTH);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    // 이미지 비율 참조하여 이미지 크기 계산
    const handleImageLoad = (e: ImageLoadEventData) => {
        const { width, height } = e.source;
        const ratio = height / width;
        const nextHeight = SCREEN_WIDTH * ratio;
        setImageHeight(nextHeight);
        imageHeightValue.value = nextHeight;
    };

    const pinchGesture = Gesture.Pinch()
        .onUpdate(event => {
            const nextScale = savedScale.value * event.scale;
            scale.value = Math.min(4, Math.max(1, nextScale));
        })
        .onEnd(() => {
            const targetScale = scale.value < 1.03 ? 1 : scale.value;
            scale.value = withTiming(targetScale, { duration: 140 });
            savedScale.value = targetScale;
            if (targetScale === 1) {
                translateX.value = withTiming(0, { duration: 140 });
                translateY.value = withTiming(0, { duration: 140 });
                savedTranslateX.value = 0;
                savedTranslateY.value = 0;
            }
        });

    const panGesture = Gesture.Pan()
        .maxPointers(1)
        .onUpdate(event => {
            if (scale.value <= 1.01) {
                return;
            }
            const maxX = (SCREEN_WIDTH * scale.value - SCREEN_WIDTH) / 2;
            const maxY =
                (imageHeightValue.value * scale.value -
                    imageHeightValue.value) /
                2;
            const nextX = savedTranslateX.value + event.translationX;
            const nextY = savedTranslateY.value + event.translationY;
            translateX.value = clamp(nextX, -maxX, maxX);
            translateY.value = clamp(nextY, -maxY, maxY);
        })
        .onEnd(() => {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        });

    const doubleTapGesture = Gesture.Tap()
        .numberOfTaps(2)
        .maxDelay(250)
        .onEnd((_, success) => {
            if (success && onDoubleTap) {
                runOnJS(onDoubleTap)();
            }
        });

    const composedGesture = Gesture.Simultaneous(
        pinchGesture,
        panGesture,
        doubleTapGesture,
    );

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    return (
        <GestureDetector gesture={composedGesture}>
            <View
                style={[
                    styles.frame,
                    { width: SCREEN_WIDTH, height: imageHeight },
                ]}
            >
                <Animated.View
                    style={[StyleSheet.absoluteFillObject, animatedStyle]}
                >
                    <Image
                        source={image}
                        style={{ width: '100%', height: '100%' }}
                        onLoad={handleImageLoad}
                    />
                </Animated.View>
            </View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    frame: {
        overflow: 'hidden',
        backgroundColor: '#000000',
    },
});
