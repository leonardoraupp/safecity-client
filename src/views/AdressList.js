import React, { useContext } from "react";
import { View, FlatList, Alert } from "react-native";
import { ListItem, Button, Icon } from "@rneui/base";
import { Avatar } from '@rneui/themed';
import UsersContext from "../context/UsersContext";
import AdressesContext from "../context/AdressesContext";


export default props => {

    const { state, dispatch } = useContext(AdressesContext)

    function confirmAdressDeletion(adress) {
        Alert.alert("Excluir endereço", "Deseja excluir este endereço?", [
            {
                text: "Sim",
                onPress() {
                    dispatch({      // Happen an event and Action object is sent throw the dispatch() with two params.    
                        type: "createAdress",
                        payload: adress
                    })
                }
            },
            {
                text: "Não"
            }
        ])
    }

    function getActions(adress) {
        return (
            <>
                <Button
                    onPress={() => props.navigation.navigate('AdressForm', adress)}
                    type="clear"
                    icon={<Icon name="edit" size={25} color="orange" />}


                />
                <Button
                    onPress={() => confirmAdressDeletion(adress)}
                    type="clear"
                    icon={<Icon name="delete" size={25} color="red" />}

                />
            </>
        )
    }

    function getUserItem({ item: adress }) {
        return (
            <ListItem
                key={adress.id}
                bottomDivider
                onPress={() => props.navigation.navigate('AdressForm', adress)}
            >
                <Avatar
                    size={50}
                    rounded
                    source={{ uri: adress.avatarUrl }}
                />
                <ListItem.Content>
                    <ListItem.Title>{adress.endereco}</ListItem.Title>
                    <ListItem.Subtitle>{adress.cidade}</ListItem.Subtitle>
                </ListItem.Content>
                {getActions(adress)}
            </ListItem>
        )
    }
    return (
        <View>
            <FlatList
                keyExtractor={adress => adress.id.toString()}
                // data={state.adresses}
                renderItem={getUserItem}
            />
        </View>
    )
}