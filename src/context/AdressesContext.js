import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import addresses from "../data/adresses";
import Config from 'react-native-config';

const API_URL = Config.API_URL;

const initialState = {
    addresses: [], // inicialmente vazio
    loading: true,
    currentAction: 'getAdress'
}
let response = ''

const AddressesContext = createContext({})
let adressToBeUpdated = {}
let adressToBeDeleted = {}
let adressToBeCreated = {}
const actions = {

    getAdress(state, action) {
        return {
            ...state,
            addresses: action.payload,
            loading: false,
            currentAction: "getAdress"
        }
    },
    createAdress(state, action) {
        adressToBeCreated = action.payload
        adressToBeCreated.id = Math.random()
        return {
            ...state,
            addresses: [...state.addresses, adressToBeCreated],
            currentAction: "createAdress"
        }
    },
    updateAdress(state, action) {
        adressToBeUpdated = action.payload;
        const updatedAddresses = state.addresses.map(a => a.id === adressToBeUpdated.id ? adressToBeUpdated : a)
        // Atualiza o estado com os endereços atualizados
        return {
            ...state,
            addresses: updatedAddresses,
            currentAction: "updateAdress"

        };
    },
    deleteAddress(state, action) {
        adressToBeDeleted = action.payload // adress passed for deletation
        const updatedAddresses = state.addresses.filter(a => a.id !== adressToBeDeleted.id) // returns a new addresses object without the adress deleted.
        return {
            ...state, // it clones the current states of the app
            addresses: updatedAddresses,
            currentAction: 'deleteAddress' // it defines which endpoint will be call.
        }
    }
}

function adressReducer(state, action) { // receives the current state and the actions object and generante or not a new state how is sent to the interface.
    const fn = actions[action.type] // access the action method
    return fn ? fn(state, action) : state
}

export const AdressProvider = props => {
    const [state, dispatch] = useReducer(adressReducer, initialState)  // Hook adressReducer

    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentAction = state.currentAction
                const adressToBeModified = currentAction == 'updateAdress' ? state.addresses.find((a) => a.id === adressToBeUpdated.id) : state.addresses.find((a) => a.id === adressToBeCreated.id);
                const filteredParams = {};

                // Crie um novo objeto para armazenar os dados filtrados
                for (const key in adressToBeModified) {
                    if (key != 'createdAt' && key != 'updatedAt' && key != 'id') {
                        filteredParams[key] = adressToBeModified[key]; // exemplo filteredParam.city = updatedAdress.city
                    }
                }

                switch (currentAction) {
                    case 'getAdress':
                        response = await axios.get(`${API_URL}/adress`);
                        dispatch({ type: 'getAdress', payload: response.data });
                        break

                    case 'createAdress':
                        response = await axios.post(`${API_URL}/adress`, filteredParams);
                        break
                    case 'updateAdress':
                            await axios.put(`${API_URL}/adress/${adressToBeUpdated.id}`, filteredParams);
                        break

                    case 'deleteAddress':
                        await axios.delete(`${API_URL}/adress/${adressToBeDeleted.id}`);
                        break
                    default:
                        await axios.get(`${API_URL}/adress`);
                        break;
                }
            } catch (error) {
                console.error('Erro ao buscar ou manipular endereços:', error);
            }
        };
        fetchData();
    }, [state.currentAction, adressToBeUpdated]); // Adicione action.payload.id como dependência
    return (
        <AddressesContext.Provider value={{ state, dispatch }}>
            {props.children}
        </AddressesContext.Provider>  // a user data provider made from the Context API
    )
}

export default AddressesContext