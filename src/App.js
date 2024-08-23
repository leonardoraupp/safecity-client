import React from "react";
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import AdressForm from "./views/AdressForm";
import AdressList from "./views/AdressList";
import { Button, Icon } from "@rneui/base";
import { AdressProvider } from "./context/AdressesContext";
import { Colors } from "react-native/Libraries/NewAppScreen";

const Stack = createNativeStackNavigator();

export default props => {
    return (
        <AdressProvider>
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
        </AdressProvider>
    )
}
const screenOptions = {
    headerStyle: {
        backgroundColor: '#128C7E'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
        fontWeight: 'bold'
    }

}

// Colors
// #715aff Medium slate blue
// #55c1ff Maya blue
// #5887ff Conflower blue 
// #a682ff Tropical indigo
// #102e4a Prussian blue

//white tones
// #d0cfcf tinberwolf
// #fffbfe snow
