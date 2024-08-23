import React, { useContext, useState, useEffect } from "react";
import { View, FlatList, Alert } from "react-native";
import { ListItem, Button, Icon, Text } from "@rneui/base";
import { Avatar, withTheme, ButtonGroup, SearchBar } from '@rneui/themed';
import AddressesContext from "../context/AdressesContext";
import Config from 'react-native-config';

const API_URL = Config.API_URL;

export default props => {

    const { state, dispatch } = useContext(AddressesContext)
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [filteredData, setFilteredData] = useState(state.addresses);

    function confirmAddressDeletion(address) {
        Alert.alert("Excluir endereço", "Deseja excluir este endereço?", [
            {
                text: "Sim",
                onPress() {
                    dispatch({      // Happen an event and Action object is sent throw the dispatch() with two params.    
                        type: "deleteAddress",
                        payload: address
                    })
                }
            },
            {
                text: "Não"
            }
        ])
    }

    function getActions(address) {
        return (
            <>
                <Button
                    onPress={() => props.navigation.navigate('AdressForm', address)}
                    type="clear"
                    icon={<Icon name="edit" size={25} color="orange" />}


                />
                <Button
                    onPress={() => confirmAddressDeletion(address)}
                    type="clear"
                    icon={<Icon name="delete" size={25} color="red" />}

                />
            </>
        )
    }

    function getUserItem({ item: address }) {
        const getColor = (score) => {
            if (score >= 7) return 'green';
            if (score >= 5) return '#FFD700';
            return 'red';
        };
        const getAvatar = () => {
            const avatars = [
                'https://img.freepik.com/psd-gratuitas/ilustracao-3d-de-uma-pessoa-com-oculos_23-2149436191.jpg?t=st=1724295929~exp=1724299529~hmac=e6b25eab7f5c57e68216aff986a48950dbf14e01f082ba206f33622654a22a7d&w=826',
                'https://img.freepik.com/psd-gratuitas/ilustracao-3d-de-avatar-ou-perfil-humano_23-2150671142.jpg?t=st=1724295976~exp=1724299576~hmac=967a9e1a4674d78225e110dde39a8ec02319c6b86478a06cc8dbf61f41f0dbd4&w=826',
                'https://img.freepik.com/psd-gratuitas/ilustracao-3d-com-avatar-on-line_23-2151303097.jpg?t=st=1724295622~exp=1724299222~hmac=164cc19182b924d4412bef7350ac47e77f7601fda8405d8c483a6871556e05f5&w=826',
                'https://img.freepik.com/psd-premium/renderizacao-3d-do-personagem-avatar_23-2150611774.jpg?w=826',
                'https://img.freepik.com/psd-gratuitas/renderizacao-3d-de-avatar_23-2150833584.jpg?t=st=1724295979~exp=1724299579~hmac=23f6d43c5f9d66fd031e05f490b4a27be848f253a021a289ed97e0f56c7a5d88&w=826'
            ];
            const randomIndex = Math.floor(Math.random() * avatars.length);
            return avatars[randomIndex];
        }

        return (
            <ListItem
                key={address.id}
                bottomDivider
                onPress={() => props.navigation.navigate('AdressForm', address)}
            >
                <Avatar
                    size={50}
                    rounded
                    source={{ uri: getAvatar() }}
                />
                <ListItem.Content>
                    <ListItem.Title style={{ color: getColor(address.score), fontWeight: 'bold', size: 18 }}>Nota {address.score}</ListItem.Title>
                    <ListItem.Title>{address.addressName}</ListItem.Title>
                    <ListItem.Subtitle>{address.city} - {address.state}</ListItem.Subtitle>
                </ListItem.Content>
                {getActions(address)}
            </ListItem>
        )
    }
    useEffect(() => {  //Use the useEffect hook to update filteredData whenever state.addresses changes or when the component mounts.
        setFilteredData(state.addresses);
    }, [state.addresses]);
    const updateSearch = (search) => {
        setSearch(search);
        filterData(selectedIndex, search);
    };

    const filterData = (index, searchTerm = search) => {
        setSelectedIndex(index);
        let newData = state.addresses;
        if (index === 1) {
            newData = newData.filter(item => item.score >= 7 && item.score <= 10);
        } else if (index === 2) {
            newData = newData.filter(item => item.score >= 1 && item.score <= 6);
        }
        if (searchTerm) {
            newData = newData.filter(item =>
                item.addressName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.postalCode.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredData(newData);
    };

    return (
        <View>
            <SearchBar
                placeholder="Pesquise um endereço aqui..."
                theme={withTheme}
                onChangeText={updateSearch}
                value={search}
                containerStyle={{ backgroundColor: 'white' }}
                inputContainerStyle={{ backgroundColor: 'white' }}
                inputStyle={{ color: 'black' }} // Optional: to ensure the text is visible
            />
            <ButtonGroup
                onPress={(index) => filterData(index)}
                selectedIndex={selectedIndex}
                buttons={['Todos', 'Seguros', 'Perigosos']}
                textStyle={{ color: '#128C7E', fontWeight: 'bold', fontSize: 16 }}
                selectedButtonStyle={{
                    backgroundColor: '#128C7E',
                }}
            />
            {state.loading ? <Text>Carregado endereços...</Text> :
                <FlatList
                    keyExtractor={address => address.id.toString()}
                    data={filteredData}
                    renderItem={getUserItem}
                    style={{ fontSize: 16 }}
                />}
        </View>
    )
}