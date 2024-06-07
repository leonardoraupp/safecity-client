import React, { createContext, useReducer } from "react" 
import users from '../data/users'

const initialState = { users }
const UsersContext = createContext({}) // creating a new context

const actions = {
    createUser(state, action) {
        const user = action.payload
        user.id = Math.random();
        return {
            ...state,
            users: [...state.users, user], // the new state will be the currently users more the new user in the last pos of the array.
        }
    },
    updateUser(state, action) {
        const updatedUser = action.payload;
        return {
            ...state,
            users: state.users.map(u => u.id === updatedUser.id ? updatedUser : u)
        }
    },
    deleteUser(state, action) { // reducer function
        const user = action.payload
        return {    // returns a new state, a new user list.
            ...state,  // clones the actual state in case we have more than one object inside.
            users: state.users.filter(u => u.id !== user.id) // the filter() create a new list without the users id was passed in the Action object.
        }
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

export default UsersContext;