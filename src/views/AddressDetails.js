import React, { useContext } from "react"
import { View, Text, StyleSheet, FlatList } from "react-native"
import { ListItem, Button, Icon } from "@rneui/base";
import AddressesContext from "../context/AdressesContext"

export default ({ route, navigation }) => {
    const { state, dispatch } = useContext(AddressesContext) // usar contexto para poder trabalhar com os valores nesse compoente.

    const renderAddress = ({ address }) => (
        <ListItem
            bottomDivider
            key={1}
        >
            <Text>teste</Text>
        </ListItem>
    )
    const securyLevelScore = () => {
        const postalCode = route.params?.postalCode
        const list = state.addresses.filter(address => address.postalCode === postalCode)
        const addressScore = list.reduce((accumulator, item) => accumulator + item.score, 0)
        return list.length > 0 ? addressScore / list.length : 0
    }

    return (
        <View>
            <View style={styles.addressInfo}>
                <Text style={styles.tittle}>Endereço</Text>
                <Text style={styles.text}>{route.params?.postalCode}, {route.params?.city}, {route.params?.state}</Text>
            </View>
            <View style={styles.addressInfo}>
                <Text style={styles.tittle}>Nível de segurança</Text>
                <Text style={styles.text}>{securyLevelScore()} </Text>
            </View>
            <View style={styles.addressInfo} >
                <Text style={styles.tittle}>Avaliações feitas</Text>
                <FlatList
                    keyExtractor={address => address.id.toString()}
                    renderItem={renderAddress}
                    data={state.addresses}
                    onEndReached={() => {
                        // Load more data when the end of the list is reached
                    }}
                    onEndReachedThreshold={0.5} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    addressInfo: {
        width: '100%',
        maxWidth: 400, // Max width for the form
        padding: 20, // Padding inside the form
        margin: 20, // Margin around the form
        backgroundColor: '#fff', // Background color for the form
        borderRadius: 10, // Rounded corners
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5, // Shadow for Android
    },
    tittle: {
        color: 'black',
        fontWeight: 'bold', // Increase the weight
        padding: 7,
        fontSize: 18,
        marginBottom: 10,
    },
    text: {
        color: 'black',
        padding: 7,
        fontSize: 15,
    },
    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },

})