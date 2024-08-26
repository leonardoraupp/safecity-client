import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Dimensions } from "react-native";
import AdressesContext from "../context/AdressesContext"; // Importe o contexto
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import AddressReviewSlider from "../components/AddressReviewSlider";
import SendButton from "../components/SendButton";

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default ({ route, navigation }) => {

    const { dispatch } = useContext(AdressesContext) // Use o contexto
    const formik = useFormik({
        initialValues: {
            id: route.params?.id || '',
            postalCode: route.params?.postalCode || '', // Valor inicial do CEP
            addressName: route.params?.addressName || '',
            city: route.params?.city || '',
            state: route.params?.state || '',
            score: route.params?.score || '',
            comment: route.params?.comment || ''
        },
        validationSchema: Yup.object({
            postalCode: Yup.string()
                .matches(/^\d{8}$/, 'CEP inválido') // Aceita apenas números com 8 dígitos
                .required('Campo CEP é obrigatório'),
            addressName: Yup.string()
                .required("Campo rua é obrigatório"),
            city: Yup.string()
                .required("Campo cidade é obrigatório"),
            state: Yup.string()
                .required("Campo estado é obrigatório"),
        }),
        onSubmit: (values) => {
            // Lógica para lidar com o envio do formulário
            dispatch({
                type: values.id ? 'updateAddress' : 'createAddress',
                payload: values,
            });
            navigation.goBack();
        },
    })

    const buscarEnderecoPorCep = async (cep) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            const data = response.data;
            formik.setFieldValue('addressName', data.logradouro);
            formik.setFieldValue('city', data.localidade);
            formik.setFieldValue('state', data.uf);
        } catch (error) {
            console.error('Erro ao buscar CEP:', error.message);
        }
    };

    // a function to receive the Slider value from the child component
    const handleSliderValueChange = (value) => {
        formik.setFieldValue("score", value) // change the score in formik when the user change the slider value.
    }

    return (
        <ScrollView contentContainerStyle={styles.conteiner}>
            <View style={styles.form}>
                <Text style={styles.tittle}>CEP</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Informe o CEP"
                    placeholderTextColor="#000000"
                    onChangeText={(postalCode) => {
                        formik.setFieldValue('postalCode', postalCode); // Chama a segunda  função
                        if (postalCode.length === 8) {
                            buscarEnderecoPorCep(postalCode) // Chama a segunda  função
                        }
                    }}
                    onBlur={formik.handleBlur('postalCode')}
                    value={formik.values.postalCode}
                    keyboardType="numeric"
                />
                {
                    formik.touched.postalCode && formik.errors.postalCode && (
                        <Text style={{ color: 'red' }}>{formik.errors.postalCode}</Text>)
                }
                <Text style={styles.tittle}>Rua</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Informe o nome da rua"
                    placeholderTextColor="#000000"
                    onChangeText={(addressName) => {
                        formik.setFieldValue('addressName', addressName)
                    }}
                    value={formik.values.addressName}
                />
                {
                    formik.touched.addressName && formik.errors.addressName && (
                        <Text style={{ color: 'red' }}>{formik.errors.addressName}</Text>)
                }
                <Text style={styles.tittle}>Cidade</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Informe o nome da cidade"
                    placeholderTextColor="#000000"
                    onChangeText={formik.handleChange('city')}
                    value={formik.values.city}

                />
                {formik.touched.city && formik.errors.city && (
                    <Text style={{ color: 'red' }}>{formik.errors.city}</Text>)
                }
                <Text style={styles.tittle}>Estado</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Informe o nome do estado"
                    placeholderTextColor="#000000"
                    onChangeText={formik.handleChange('state')}
                    value={formik.values.state}
                />
                {formik.touched.state && formik.errors.state && (
                    <Text style={{ color: 'red' }}>{formik.errors.state}</Text>)
                }
                <AddressReviewSlider value={formik.values.score} onSliderValueChange={handleSliderValueChange} />
                <TextInput
                    style={styles.commentInput}
                    placeholder="Informe seu relato pra gente!"
                    placeholderTextColor="#000000"
                    onChangeText={(comment) => { formik.setFieldValue('comment', comment) }}
                    value={formik.values.comment}
                />
                <View>
                    <SendButton onPress={formik.handleSubmit} title="Salvar" disabled={!formik.isValid} />
                </View>
            </View>
        </ScrollView>)
}
const styles = StyleSheet.create({
    conteiner: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: height, // Ensure the container takes at least the full height of the screen
    },
    form: {
        flex: 1,
        width: width * 0.9, // Relative width
        minHeight: height, // Ensure the container takes at least the full height of the screen
        alignSelf: 'center', // Center the card
        maxWidth: 400, // Max width for the form
        padding: 20, // Padding inside the form
        margin: 20, // Margin around the form
        backgroundColor: '#fff', // Background color for the form
        borderRadius: 10, // Rounded corners
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5, // Shadow for Android,
        justifyContent: 'space-between',
    },
    tittle: {
        color: 'black',
        fontWeight: 'bold', // Increase the weight
        padding: 7,
        fontSize: 18,
        marginBottom: 10,
    },
    textInput: {
        color: '#000000',
        fontSize: 15,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
        width: '100%',
    },
    commentInput: {
        fontSize: 15,
        color: 'black',
        height: '15%',
        borderWidth: 1,
        borderColor: "gray",
        padding: 10,
        marginBottom: 10,
        width: '100%',

    },
    sendButton: {
        backgroundColor: '#075E54',
        fontSize: 15,
        fontWeight: "bold",
        color: "black"
    },
})