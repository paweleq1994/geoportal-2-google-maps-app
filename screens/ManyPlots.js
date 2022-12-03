import React, {useState} from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Pressable
} from 'react-native'

export default function ManyPlots({navigation}) {
    // const [inputs, setInputs] = useState([{key: '', value: ''}]);
    const [inputs, setInputs] = useState([
        {key: 0, value: 'Chwaszczewo 15'},
        {key: 1, value: 'Plebanowce 43'},
    ]);

    const addHandler = () => {
        const _inputs = [...inputs];
        _inputs.push({key: '', value: ''});
        setInputs(_inputs);
    }

    const deleteHandler = (key) => {
        const _inputs = inputs.filter((input, index) => index !== key);
        setInputs(_inputs);
    }

    const inputHandler = (text, key) => {
        const _inputs = [...inputs];
        _inputs[key].value = text;
        _inputs[key].key = key;
        setInputs(_inputs);
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.inputsContainer}>
                {inputs.map((input, key) => (
                    <View key={key} style={styles.inputContainer}>
                        <TextInput
                            placeholder={"Wyszukaj działkę"}
                            value={input.value}
                            onChangeText={(text) => inputHandler(text, key)}
                            style={styles.input}
                        />
                        <TouchableOpacity
                            onPress={() => deleteHandler(key)}
                            style={styles.deleteContainer}
                        >
                            <Text style={styles.deleteText}>Usuń</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <Pressable
                    style={{...styles.button, backgroundColor: '#2AA10F'}}
                    onPress={addHandler}
                >
                    <Text style={styles.text}>Dodaj działkę</Text>
                </Pressable>
            </ScrollView>
            <Pressable
                style={styles.button}
                onPress={() => navigation.navigate('ManyPlotsResult', {
                    data: inputs
                })}
            >
                <Text style={styles.text}>Kontynuuj</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white'
    },
    inputsContainer: {
        flex: 1
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: "lightgray",
        marginBottom: 20,
    },
    input: {
        fontSize: 20,
        flex: 12
    },
    deleteContainer: {
        flex: 2
    },
    deleteText: {
        textAlign: "right",
        color: "red",
        fontSize: 13
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 4,
        backgroundColor: '#2196F3'
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
})