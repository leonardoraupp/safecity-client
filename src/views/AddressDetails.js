import React, { useState, useContext, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native"
import { ListItem, Overlay, Button } from "@rneui/base";
import AddressesContext from "../context/AdressesContext"
import SendButton from "../components/SendButton";

const { width } = Dimensions.get('window');

export default ({ route, navigation }) => {
    const { state, dispatch } = useContext(AddressesContext) // usar contexto para poder trabalhar com os valores nesse compoente.
    const [addressRateList, setAddressRateList] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [overlayVisible, setOverlayVisible] = useState(false);

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };

    useEffect(() => {
        const postalCode = route.params?.postalCode;
        const filteredAddresses = state.addresses
            .filter(address => address.postalCode === postalCode)
            .map(address => ({
                ...address,
                createdAt: new Date(address.createdAt).toLocaleDateString('pt-BR', options),
                updatedAt: new Date(address.updatedAt).toLocaleDateString('pt-BR', options)
            }));
        setAddressRateList(filteredAddresses);
    }, [route.params?.postalCode, state.addresses]);

    const renderAddress = ({ item: address }) => {
        return (
            <ListItem bottomDivider onPress={() => openOverlay(address)} key={address.id}>
                <Text style={{ fontWeight: 'bold', flexWrap: 'wrap', color: 'black' }} numberOfLines={2} ellipsizeMode="tail">Nota:</Text>
                <Text style={{ flexWrap: 'wrap', color:'black' }} numberOfLines={1} ellipsizeMode="tail">{address.score || 0}</Text>
                <Text style={{ fontWeight: 'bold', flexWrap: 'wrap', color: 'black' }} numberOfLines={2} ellipsizeMode="tail">Relato:</Text>
                <Text style={{ flexWrap: 'wrap', color: 'black' }} numberOfLines={1} ellipsizeMode="tail">{address.comment || "Não há"}</Text>
            </ListItem>
        )
    }

    const openOverlay = (item) => {
        setSelectedAddress(item);
        setOverlayVisible(true);
    };

    const closeOverlay = () => {
        setOverlayVisible(false);
        setSelectedAddress(null);
    };

    const securyLevelScore = () => {
        const addressScore = addressRateList.reduce((accumulator, item) => accumulator + item.score, 0)
        const score = addressRateList.length > 0 ? addressScore / addressRateList.length : 0
        return score.toFixed(1)
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.addressInfo}>
                <Text style={styles.tittle}>Endereço</Text>
                <Text style={styles.text}>{route.params?.postalCode}, {route.params?.city}, {route.params?.state}</Text>
            </View>
            <View style={styles.addressInfo}>
                <Text style={styles.tittle}>Nível de segurança</Text>
                <Text style={styles.text}>{securyLevelScore()} de 10 </Text>
            </View>
            <View style={styles.addressInfo} >
                <Text style={styles.tittle}>Avaliações anteriores</Text>
                <FlatList
                    keyExtractor={address => address.id.toString()}
                    renderItem={renderAddress}
                    data={addressRateList}
                    onEndReached={() => {
                        // Load more data when the end of the list is reached
                    }}
                    onEndReachedThreshold={0.5} />
                {selectedAddress && (
                    <Overlay
                        isVisible={overlayVisible}
                        onBackdropPress={closeOverlay}
                        overlayStyle={styles.overlay}
                    >
                        <View style={styles.overlayView}>
                            <Text style={styles.tittle}>Nota:</Text>
                            <Text style={styles.text}>{selectedAddress.score} de 10</Text>
                            <Text style={styles.tittle}>Relato do cidadão:</Text>
                            <Text style={styles.text}>{selectedAddress.comment || "Não há"}</Text>
                            <Text style={styles.tittle}>Data:</Text>
                            <Text style={styles.text}>{selectedAddress.createdAt || "Não há"}</Text>
                            <Text style={styles.tittle}>Edição:</Text>
                            <Text style={styles.text}>{selectedAddress.updatedAt || "Não há"}</Text>
                            <SendButton title="Fechar" onPress={closeOverlay} />
                        </View>
                    </Overlay>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    addressInfo: {
        width: width * 0.9, // Relative width
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
        elevation: 5, // Shadow for Android
    },
    tittle: {
        color: 'black',
        fontWeight: 'bold', // Increase the weight
        padding: 7,
        fontSize: 18,
        marginBottom: 8,
    },
    text: {
        padding: 7,
        fontSize: 15,
        color: 'black'
    },
    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    overlayView: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Light background with some transparency
    },
    overlay: {
        padding: 20,
        alignItems: 'center',
        width: width * 0.8, // Relative width for overlay
        maxWidth: 400, // Max width for the form
        margin: 20, // Margin around the form
        backgroundColor: '#fff', // Background color for the form
        borderRadius: 10, // Rounded corners
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5, // Shadow for Android
    },

})