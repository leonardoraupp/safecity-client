import React, { useContext, useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import UsersContext from "../context/UsersContext";

export default ({ route, navigation }) => {

    const [user, setUser] = useState(route.params ? route.params : {})
    const { dispatch } = useContext(UsersContext)

    return (
        <View style={styles.form}>
            <Text>CEP</Text>
            <TextInput
                style={styles.input}
                onChangeText={name => setUser({ ...user, name })}
                placeholder="Informe o CEP"
                value={user.name}
            />
            <Text>Rua</Text>
            <TextInput
                style={styles.input}
                onChangeText={name => setUser({ ...user, name })}
                placeholder="Informe o nome da rua"
                value={user.name}
            />
            <Text>Bairro</Text>
            <TextInput
                style={styles.input}
                onChangeText={email => setUser({ ...user, email })}
                placeholder="Informe o nome do bairro"
                value={user.email}
            />
            <Text>Cidade</Text>
            <TextInput
                style={styles.input}
                onChangeText={email => setUser({ ...user, email })}
                placeholder="Informe o nome da cidade"
                value={user.email}
            />
            <Text>Estado</Text>
            <TextInput
                style={styles.input}
                onChangeText={email => setUser({ ...user, email })}
                placeholder="Informe o nome do estado"
                value={user.email}
            />
            <Button
                title="Salvar"
                onPress={() => {
                    dispatch({
                        type: user.id ? "updateUser" : "createUser",
                        payload: user
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