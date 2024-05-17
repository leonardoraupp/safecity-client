import React from "react";
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import UserForm from "./views/UserForm";
import UserList from "./views/UserList";

const Stack = createNativeStackNavigator();

export default props => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="UserForm">
                <Stack.Screen
                    name="UserForm"
                    component={UserForm}
                />
                <Stack.Screen
                    name="UserList"
                    component={UserList}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}