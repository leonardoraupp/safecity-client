import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@env"

const initialState = {
    adresses:[], // inicialmente vazio
    loading: true
}

const AdressesContext = createContext({})

const actions = {
    
    getAdress(state, action) {
        return{
            ...state,
            adresses: action.payload,
            loading: false
         }
    },
    createAdress(state, action) {
        const adress = action.payload
        adress.id = Math.random()
        return {
            ...state,
            adresses: [...state.adresses, adress]
        }
    },
    updateAdress(state, action) {

    },    
    deleteAdress(state, action) {

    }
}

function userReducer(state, action) { // receives the current state and the actions object and generante or not a new state how is sent to the interface.
    const fn = actions[action.type] // access the action method
    return fn ? fn(state, action) : state
}

export const AdressProvider = props => {
    const [state, dispatch] = useReducer(userReducer, initialState)  // Hook userReducer

    useEffect(() => {
        const fetchAdresses = async () => {
            try {
                const response = await axios.get(`${API_URL}/adress`);                
                dispatch({ type: 'getAdress', payload: response.data });
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        };
        fetchAdresses();
    }, []);
    console.log(state.adresses)
    return (
        <AdressesContext.Provider value={{ state, dispatch }}>
            {props.children}
        </AdressesContext.Provider>  // a user data provider made from the Context API
    )
}

export default AdressesContext