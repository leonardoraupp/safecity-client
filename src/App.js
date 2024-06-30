import { API_URL } from "@env"
import React from "react";
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import AdressForm from "./views/AdressForm";
import AdressList from "./views/AdressList";
import { Button, Icon } from "@rneui/base";
import { AdressesProvider } from "./context/AdressesContext";

const Stack = createNativeStackNavigator();
console.log("URL da API" + API_URL)

export default props => {
    return (
        <AdressesProvider>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="AdressList"
                    screenOptions={screenOptions}>
                    <Stack.Screen
                        name="AdressList"
                        component={AdressList}
                        options={
                            ({ navigation }) => {
                                return {
                                    title: "Endereços avaliados",
                                    headerRight: () => (
                                        <Button
                                            onPress={() => {
                                                navigation.navigate("AdressForm")
                                            }}
                                            type="clear"
                                            icon={<Icon name="add" size={25} color={"white"} />}
                                        />
                                    )
                                }
                            }
                        }

                    />
                    <Stack.Screen
                        name="AdressForm"
                        component={AdressForm}
                        options={{
                            title: "Novo de endereço"
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </AdressesProvider>
    )
}
const screenOptions = {
    headerStyle: {
        backgroundColor: '#f4511e'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
        fontWeight: 'bold'
    }

}