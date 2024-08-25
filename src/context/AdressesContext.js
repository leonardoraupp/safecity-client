import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import addresses from "../data/adresses";
import Config from 'react-native-config';

const API_URL = Config.API_URL;

const initialState = {
    addresses: [], // inicialmente vazio
    loading: true,
    currentAction: 'getAddress'
}
let response = ''

const AddressesContext = createContext({})
let addressToBeUpdated = {}
let addressToBeDeleted = {}
let addressToBeCreated = {}
const actions = {

    getAddress(state, action) {
        return {
            ...state,
            addresses: action.payload,
            loading: false,
            currentAction: "getAddress"
        }
    },
    createAddress(state, action) {
        addressToBeCreated = action.payload
        addressToBeCreated.id = Math.random()
        return {
            ...state,
            addresses: [...state.addresses, addressToBeCreated],
            currentAction: "createAddress"
        }
    },
    updateAddress(state, action) {
        addressToBeUpdated = action.payload;
        const updatedAddresses = state.addresses.map(a => a.id === addressToBeUpdated.id ? addressToBeUpdated : a)
        // Atualiza o estado com os endereços atualizados
        return {
            ...state,
            addresses: updatedAddresses,
            currentAction: "updateAddress"

        };
    },
    deleteAddress(state, action) {
        addressToBeDeleted = action.payload // address passed for deletation
        const updatedAddresses = state.addresses.filter(a => a.id !== addressToBeDeleted.id) // returns a new addresses object without the address deleted.
        return {
            ...state, // it clones the current states of the app
            addresses: updatedAddresses,
            currentAction: 'deleteAddress' // it defines which endpoint will be call.
        }
    }
}

function addressReducer(state, action) { // receives the current state and the actions object and generante or not a new state how is sent to the interface.
    const fn = actions[action.type] // access the action method
    return fn ? fn(state, action) : state
}

export const AddressProvider = props => {
    const [state, dispatch] = useReducer(addressReducer, initialState)  // Hook addressReducer

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentAction = state.currentAction
                const addressToBeModified = currentAction == 'updateAddress' ? state.addresses.find((a) => a.id === addressToBeUpdated.id) : state.addresses.find((a) => a.id === addressToBeCreated.id);
                const filteredParams = {};

                // Crie um novo objeto para armazenar os dados filtrados
                for (const key in addressToBeModified) {
                    if (key != 'createdAt' && key != 'updatedAt' && key != 'id') {
                        filteredParams[key] = addressToBeModified[key]; // exemplo filteredParam.city = updatedAddress.city
                    }
                }
                switch (currentAction) {
                    case 'getAddress':
                        response = await axios.get(`${API_URL}/address`);
                        dispatch({ type: 'getAddress', payload: response.data });
                        break

                    case 'createAddress':
                        response = await axios.post(`${API_URL}/address`, filteredParams);
                        break
                    case 'updateAddress':
                        console.log('id do end atualizado' + addressToBeUpdated.id)
                        await axios.put(`${API_URL}/address/${addressToBeUpdated.id}`, filteredParams);
                        break

                    case 'deleteAddress':
                        await axios.delete(`${API_URL}/address/${addressToBeDeleted.id}`);
                        break
                    default:
                        await axios.get(`${API_URL}/address`);
                        break;
                }
            } catch (error) {
                console.error('Erro ao buscar ou manipular endereços:', error);
            }
        };
        fetchData();
    }, [state.currentAction, addressToBeUpdated]); // Adicione action.payload.id como dependência
    return (
        <AddressesContext.Provider value={{ state, dispatch }}>
            {props.children}
        </AddressesContext.Provider>  // a user data provider made from the Context API
    )
}

export default AddressesContext