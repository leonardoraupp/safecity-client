import React, { createContext, useReducer } from "react";
import adresses from "../data/adresses";

const initialState = { adresses }
const AdressesContext = createContext({})

const actions = {
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

export const UsersProvider = props => {

    function reducer(state, action) { // receives the current state and the actions object and generante or not a new state how is sent to the interface.
        const fn = actions[action.type] // access the action method
        return fn ? fn(state, action) : state
    }

    const [state, dispatch] = useReducer(reducer, initialState)  // Hook userReducer

    return (
        <UsersContext.Provider value={{ state, dispatch }}>
            {props.children}
        </UsersContext.Provider>  // a user data provider made from the Context API
    )
}

export default AdressesContext