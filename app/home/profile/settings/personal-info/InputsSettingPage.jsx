import { StyleSheet, Text, View, TouchableOpacity, Alert, Animated } from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../../../../../components/elements/header';
import { Entypo } from '@expo/vector-icons';
import { t } from "../../../../../localization";
import SettingInput from '../../components/SettingInput';
import { validateVederePassword } from "../../../../../helpers/validatePassword";

const InputsSettingPage = ({ 
    onSubmit = () => {}, 
    initialFirstValue = "", 
    initialSecondValue = "", 
    id = "", 
    onClose = () => {}, 
    title1 = "", 
    title2 = "" 
}) => {
    // State to hold input values
    const [firstValue, setFirstValue] = useState(initialFirstValue);
    const [secondValue, setSecondValue] = useState(initialSecondValue);

    // Animation state
    const fadeAnim = useState(new Animated.Value(0))[0];

    // Start fade-in animation when component mounts
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200, // Duration of the fade-in effect
            useNativeDriver: true, // Use native driver for better performance
        }).start();
    }, [fadeAnim]);

    const checkField = (fieldAmount) => {
        if (!firstValue && fieldAmount === 1) {
            Alert.alert(t('fields-cant-be-empty'));
            return;
        }
        if (!firstValue || !secondValue && fieldAmount === 2) {
            Alert.alert(t('fields-cant-be-empty'));
            return;
        }
    };

    const handleSubmit = async () => {
        // if it's password check for validation
        if (title1 === t('password')) {
            checkField(2);
            if (firstValue !== secondValue) {
                Alert.alert(t('bothpasswordmustmatch'));
                return;
            }
            const passwordVerification = validateVederePassword(firstValue);
            if (!passwordVerification.valid) {
                Alert.alert(passwordVerification.message);
                return;
            }
            console.log("Now I WILL MODIFY PASSWORD");
            try {
                await onSubmit(id, firstValue);
            } catch (e) {
                console.log(e);
            }
        }

        if (title1 === t('name') && title2 === t('surname')) {
            checkField(2);
            console.log("Now I will update the name and surname");
            try {
                await onSubmit[0](id, firstValue);
                await onSubmit[1](id, secondValue);
            } catch (e) {
                console.log(e);
            }
        }

        if (title1 === t('email')) {
            checkField(1);
            console.log("Now I will modify the email");
            try {
                await onSubmit(id[0], id[1], firstValue);
            } catch (e) {
                console.log(e);
            }
        }
        return;
    };

    return (
        <View style={styles.mainContainer}>
            <Header>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Entypo name="cross" size={30} color="black" />
                </TouchableOpacity>
            </Header>
            <View style={styles.container}>
                <Animated.View style={{ opacity: fadeAnim }}>
                    <SettingInput
                        label={title1}
                        value={firstValue}
                        onChangeText={setFirstValue}
                        placeholder={`${t('enteryour')} ${title1}`}
                        helperText={t(`${title1.toLowerCase()}Helper`)} // Pass the corresponding helper text
                    />
                    {title2 && (
                        <SettingInput
                            label={title2}
                            value={secondValue}
                            onChangeText={setSecondValue}
                            placeholder={`${t('enteryour')} ${title2}`}
                            helperText={t(`${title2.toLowerCase()}Helper`)} // Pass the corresponding helper text
                        />
                    )}
                </Animated.View>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>{t('submit')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default InputsSettingPage;

const styles = StyleSheet.create({
    mainContainer: {
        zIndex: 2,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0, // Take full height of the screen
        backgroundColor: 'white',
        paddingTop: 16,
        paddingHorizontal: 16,
        flex: 1, // Ensure it uses flex to fill available space
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        top: -15,
    },
    submitButton: {
        backgroundColor: '#000000', // Change to your desired color
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 20,
    },
    submitButtonText: {
        color: 'white',
        fontFamily: 'Satoshi-Medium',
        fontSize: 18,
    },
    container: {
        justifyContent: 'space-between',
        height: '70%',
    },
});
