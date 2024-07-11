import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@env"
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import adresses from "../data/adresses";

const initialState = {
    adresses: [], // inicialmente vazio
    loading: true,
    currentAction: 'getAdress'
}
let response = ''

const AdressesContext = createContext({})
let adressToBeUpdated = {}
let adressToBeDeleted = {}
let adressToBeCreated = {}
const actions = {

    getAdress(state, action) {
        return {
            ...state,
            adresses: action.payload,
            loading: false,
            currentAction: "getAdress"
        }
    },
    createAdress(state, action) {
        adressToBeCreated = action.payload
        adressToBeCreated.id = Math.random()
        return {
            ...state,
            adresses: [...state.adresses, adressToBeCreated],
            currentAction: "createAdress"
        }
    },
    updateAdress(state, action) {
        adressToBeUpdated = action.payload;
        const updatedAdresses = state.adresses.map(a => a.id === adressToBeUpdated.id ? adressToBeUpdated : a)
        // Atualiza o estado com os endereços atualizados
        return {
            ...state,
            adresses: updatedAdresses,
            currentAction: "updateAdress"

        };
    },
    deleteAdress(state, action) {
        adressToBeDeleted = action.payload // adress passed for deletation
        const updatedAdresses = state.adresses.filter(a => a.id !== adressToBeDeleted.id) // returns a new adresses object without the adress deleted.
        return {
            ...state, // it clones the current states of the app
            adresses: updatedAdresses,
            currentAction: 'deleteAdress' // it defines which endpoint will be call.
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
                const adressToBeModified = currentAction == 'updateAdress' ? state.adresses.find((a) => a.id === adressToBeUpdated.id) : state.adresses.find((a) => a.id === adressToBeCreated.id);
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

                    case 'deleteAdress':
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
        <AdressesContext.Provider value={{ state, dispatch }}>
            {props.children}
        </AdressesContext.Provider>  // a user data provider made from the Context API
    )
}

export default AdressesContext