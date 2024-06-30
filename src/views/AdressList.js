import React, { useContext } from "react";
import { View, FlatList, Alert } from "react-native";
import { ListItem, Button, Icon } from "@rneui/base";
import { Avatar } from '@rneui/themed';
import AdressesContext from "../context/AdressesContext";

const BASE_URL = 'http://10.0.2.2:8000/adress' // O endereço IP especial para se comunicar com a máquina host a partir do emulador Android é 10.0.2.2

import { API_URL } from "@env"

// export async function fetchUsers() {
//     try {
//         const response = await fetch(BASE_URL);
//         const data = await response.json();
//         console.log(data)
//         return data;
//     } catch (error) {
//         console.error('Erro ao buscar usuários:', error);
//         throw error;
//     }    
// }

export default props => {

    const { state, dispatch } = useContext(AdressesContext)
    // console.log(Object.values(state.fetchAdresses))

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
                    // source={{ uri: adress.avatarUrl }}
                />
                <ListItem.Content>
                    <ListItem.Title>{adress.adressName}</ListItem.Title>
                    <ListItem.Subtitle>{adress.city}</ListItem.Subtitle>
                </ListItem.Content>
                {getActions(adress)}
            </ListItem>
        )
    }
    return (
        <View>
            <FlatList
                keyExtractor={adress => adress.id.toString()}
                data={state.adresses}
                renderItem={getUserItem}
            />
        </View>
    )
}

//Teste de integração com  a API safecity app
// {
//     fetch(`${BASE_URL}/users`)
//     .then((response) => response.json())
//     .then((data) => {
//         console.log('Dados recebidos do servidor:', data);
//     })
//     .catch((error) => {
//         console.error('Erro ao buscar dados do servidor:', error);
//     })
// }