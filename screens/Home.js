import {Button, Dimensions, Pressable, StyleSheet, Text} from "react-native";

export default function Home({navigation}) {
    return (
        <>
            <Pressable
                style={styles.button}
                onPress={() => navigation.navigate('SinglePlot')}
            >
                <Text style={styles.text}>Jedna działka</Text>
            </Pressable>
            <Pressable
                style={styles.button}
                onPress={() => navigation.navigate('ManyPlots')}
            >
                <Text style={styles.text}>Wiele działek</Text>
            </Pressable>
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#2196F3',
        margin: 20
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});
