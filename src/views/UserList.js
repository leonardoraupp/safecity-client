import React, { useContext } from "react";
import { View, FlatList, Alert } from "react-native";
import { ListItem, Button, Icon } from "@rneui/base";
import { Avatar } from '@rneui/themed';
import UsersContext from "../context/UsersContext";


export default props => {

    const { state, dispatch } = useContext(UsersContext)

    function confirmUserDeletion(user) {
        Alert.alert("Excluir usuário", "Deseja excluir este usuário?", [
            {
                text: "Sim",
                onPress() {
                    dispatch({      // Happen an event and Action object is sent throw the dispatch() with two params.    
                        type: "deleteUser",
                        payload: user
                    })
                }
            },
            {
                text: "Não"
            }
        ])
    }

    function getActions(user) {
        return (
            <>
                <Button
                    onPress={() => props.navigation.navigate('UserForm', user)}
                    type="clear"
                    icon={<Icon name="edit" size={25} color="orange" />}


                />
                <Button
                    onPress={() => confirmUserDeletion(user)}
                    type="clear"
                    icon={<Icon name="delete" size={25} color="red" />}

                />
            </>
        )
    }

    function getUserItem({ item: user }) {
        return (
            <ListItem
                key={user.id}
                bottomDivider
                onPress={() => props.navigation.navigate('UserForm', user)}
            >
                <Avatar
                    size={50}
                    rounded
                    source={{ uri: user.avatarUrl }}
                />
                <ListItem.Content>
                    <ListItem.Title>{user.name}</ListItem.Title>
                    <ListItem.Subtitle>{user.email}</ListItem.Subtitle>
                </ListItem.Content>
                {getActions(user)}
            </ListItem>
        )
    }
    return (
        <View>
            <FlatList
                keyExtractor={user => user.id.toString()}
                data={state.users}
                renderItem={getUserItem}
            />
        </View>
    )
}