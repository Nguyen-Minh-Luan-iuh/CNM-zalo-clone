import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, useWindowDimensions } from 'react-native';

const OnboardingItem = ({ item }) => {
    const { width } = useWindowDimensions();

    return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={[styles.container, { width }]}>
                <View style={{ height: 300, width: width}}>
                    <Image source={item.image} style={styles.image} resizeMode='contain' />
                    <View style={{ flex: 0.3 }}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default OnboardingItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:"center"
    },
    image: {
        width: "100%",
        height: 150,
        justifyContent: "center",
    },
    title: {
        fontWeight: "700",
        fontSize: 18,
        marginBottom: 10,
        textAlign: "center",
    },
    description: {
        fontWeight: '300',
        textAlign: "center",
        paddingHorizontal: 64,
    }
});
