import React, { useContext, useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import AdressesContext from "../context/AdressesContext"; // Importe o contexto
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import AddressReviewSlider from "../components/AddressReviewSlider";

export default ({ route, navigation }) => {

    const { dispatch } = useContext(AdressesContext) // Use o contexto

    const formik = useFormik({
        initialValues: {
            postalCode: route.params?.postalCode || '', // Valor inicial do CEP
            addressName: route.params?.addressName || '',
            city: route.params?.city || '',
            state: route.params?.state || '',
            score: route.params?.sliderValue || '',
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
            // sliderValue: Yup.required("Campo nota é obrigatório"),
        }),
        onSubmit: (values) => {
            // Lógica para lidar com o envio do formulário
            dispatch({
                type: values.id ? 'updateAdress' : 'createAdress',
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
        formik.setFieldValue("score", value)
    }


    return (
        <View style={styles.form}>
            <Text>CEP</Text>
            <TextInput
                style={styles.input}
                placeholder="Informe o CEP"
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
            <Text>Rua</Text>
            <TextInput
                style={styles.input}
                placeholder="Informe o nome da rua"
                onChangeText={(addressName) => {
                    formik.setFieldValue('addressName', addressName)
                }}
                value={formik.values.addressName}
            />
            {
                formik.touched.addressName && formik.errors.addressName && (
                    <Text style={{ color: 'red' }}>{formik.errors.addressName}</Text>)
            }
            <Text>Cidade</Text>
            <TextInput
                style={styles.input}
                placeholder="Informe o nome da cidade"
                onChangeText={formik.handleChange('city')}
                value={formik.values.city}

            />
            {formik.touched.city && formik.errors.city && (
                <Text style={{ color: 'red' }}>{formik.errors.city}</Text>)
            }
            <Text>Estado</Text>
            <TextInput
                style={styles.input}
                placeholder="Informe o nome do estado"
                onChangeText={formik.handleChange('state')}
                value={formik.values.state}
            />
            {formik.touched.state && formik.errors.state && (
                <Text style={{ color: 'red' }}>{formik.errors.state}</Text>)
            }
            <AddressReviewSlider onSliderValueChange={handleSliderValueChange} />
            <TextInput
                style={styles.commentInput}
                placeholder="Informe seu relato pra gente!"
                onChangeText={(comment) => { formik.setFieldValue('comment', comment) }}
            />
            <Button onPress={formik.handleSubmit} title="Salvar" disabled={!formik.isValid} />
        </View>)
}
const styles = StyleSheet.create({
    form: {
        padding: 12
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: "gray",
        marginBottom: 40
    },
    commentInput: {
        height: 80,
        borderWidth: 1,
        borderColor: "gray",
        marginBottom: 40
    },
    title: {
        fontSize: 15,
        fontWeight: "bold"
    }
})