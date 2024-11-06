import React from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';

const SettingInput = ({ label, value, onChangeText, placeholder, helperText, style }) => {
    return (
        <View style={[styles.container, style]}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
            />
            {helperText && <Text style={styles.helperText}>{helperText}</Text>}
        </View>
    );
};

export default SettingInput;

const styles = StyleSheet.create({
    container: {
        marginVertical: 30,
        marginHorizontal: 20,
    },
    label: {
        fontSize: 22,
        color: 'black',
        marginVertical: 10,
        fontFamily: 'Satoshi-Bold',
    },
    input: {
        borderRadius: 10,
        padding: 20,
        backgroundColor: '#EFEFEF',
    },
    helperText: {
        fontSize: 14,
        color: '#888', // Grey color for helper text
        marginTop: 5,
        fontFamily: 'Satoshi-Regular',
    },
});
