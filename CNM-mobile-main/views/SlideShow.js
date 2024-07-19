import React, { useState, useRef } from 'react';
import { View, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import OnboardingItem from './OnboardingItem';
import slides from '../database/slides';

const SlideShow = () => {
    const { width } = useWindowDimensions();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    const viewableItemChanged = useRef(({ viewableItems }) => {
        setCurrentIndex(viewableItems[0]?.index || 0);
    }).current;

    return (
        <View style={styles.container}>
            <Animated.FlatList
                data={slides}
                renderItem={({ item }) => <OnboardingItem item={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                keyExtractor={(item) => item.id}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: false,
                })}
                onViewableItemsChanged={viewableItemChanged}
                snapToInterval={width}
                decelerationRate="fast"
            />
        </View>
    );
};

export default SlideShow;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
