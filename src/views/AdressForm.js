import React, { useContext, useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import AdressesContext from "../context/AdressesContext";

export default ({ route, navigation }) => {

    const [adress, setAdress] = useState(route.params ? route.params : {})
    const { dispatch } = useContext(AdressesContext)

    return (
        <View style={styles.form}>
            <Text>CEP</Text>
            <TextInput
                style={styles.input}
                onChangeText={estado => setAdress({ ...adress, estado })}
                placeholder="Informe o CEP"
                value={adress.estado}
            />
            <Text>Rua</Text>
            <TextInput
                style={styles.input}
                onChangeText={rua => setAdress({ ...adress, rua })}
                placeholder="Informe o nome da rua"
                value={adress.rua}
            />
            <Text>Bairro</Text>
            <TextInput
                style={styles.input}
                onChangeText={bairro => setAdress({ ...adress, bairro })}
                placeholder="Informe o nome do bairro"
                value={adress.bairro}
            />
            <Text>Cidade</Text>
            <TextInput
                style={styles.input}
                onChangeText={cidade => setAdress({ ...adress, cidade })}
                placeholder="Informe o nome da cidade"
                value={adress.cidade}
            />
            <Text>Estado</Text>
            <TextInput
                style={styles.input}
                onChangeText={estado => setAdress({ ...adress, estado })}
                placeholder="Informe o nome do estado"
                value={adress.estado}
            />
            <Button
                title="Salvar"
                onPress={() => {
                    dispatch({
                        type: adress.id ? "createAdress" : "createAdress",
                        payload: adress
                    })
                    navigation.goBack()
                }}
            />
        </View>
    )
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
    }
})