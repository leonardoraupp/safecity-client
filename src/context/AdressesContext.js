import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@env"
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const initialState = {
    adresses: [], // inicialmente vazio
    loading: true,
    currentAction: ''
}

const AdressesContext = createContext({})
let newAdress = {};
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
        const adress = action.payload
        adress.id = Math.random()
        return {
            ...state,
            adresses: [...state.adresses, adress],
            currentAction: "createAdress"
        }
    },
    updateAdress(state, action) {
        newAdress = action.payload;
        const updatedAdresses = state.adresses.map((a) =>
            a.id === newAdress.id ? newAdress : a
        );


        // Atualiza o estado com os endereços atualizados
        return {
            ...state,
            adresses: updatedAdresses,
            currentAction: "updateAdress"

        };
    },
    deleteAdress(state, action) {

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
                const response = await axios.get(`${API_URL}/adress`);
                dispatch({ type: 'getAdress', payload: response.data });

                const updatedAdress = state.adresses.find((a) => a.id === newAdress.id);
                // Crie um novo objeto para armazenar os dados filtrados
                const filteredParams = {};
                for (const key in updatedAdress) {
                    if (key != 'createdAt' && key != 'updatedAt' && key != 'id') {
                        filteredParams[key] = updatedAdress[key]; // exemplo filteredParam.city = updatedAdress.city
                    }
                }

                // Atualiza o servidor com os dados do estado
                if (state.currentAction == 'updateAdress') {
                    if (updatedAdress) {
                        const response = await axios.put(`${API_URL}/adress/${updatedAdress.id}`, filteredParams);
                        const result = await axios.get(`${API_URL}/adress/${updatedAdress.id}`);
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar ou manipular endereços:', error);
            }
        };
        fetchData();
    }, [state.currentAction, newAdress]); // Adicione action.payload.id como dependência
    return (
        <AdressesContext.Provider value={{ state, dispatch }}>
            {props.children}
        </AdressesContext.Provider>  // a user data provider made from the Context API
    )
}

export default AdressesContext