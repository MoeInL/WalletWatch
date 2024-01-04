import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";

import CustomButton from "../../Components/OnboardingComponents/CustomButton";
import CustomTextInput from "../../Components/OnboardingComponents/CustomTextInput";
import PasswordBox from "../../Components/OnboardingComponents/PasswordBox";

export default function Login({navigation}){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [emailValid, setEmailValid] = useState(true)
    const [passValid, setPassValid] = useState(true)

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setEmail("")
            setPassword("")
        });
    
        return unsubscribe;
      }, [navigation]);

    function confirmLogin(){
        let proceed = true;

        if(email === "" || email.includes("@") === false){
            setEmailValid(false)
            proceed = false
        }

        if(password === ""){
            setPassValid(false)
            proceed = false
        }

        if(proceed){
            setEmail("")
            setPassword("")
            setName("")
        }
    }

    return(
        <View style = {styles.screenStyle}>
            <CustomTextInput placeholder = "Email" isValid = {emailValid} onChangeText={(text) => setEmail(text)} value={email}/>
            <PasswordBox placeholder = "Password" isValid={passValid} onChangeText={(text) => setPassword(text)} value = {password}/>
            <CustomButton text = "Login" onPress={confirmLogin}/>
            <TouchableOpacity style = {styles.container} onPress={()=> navigation.navigate("ForgotPassword")}>
                <Text style = {styles.txtStyle}>Forgot Password?</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    screenStyle: {
        flex: 1,
        padding: "5%",
        marginTop: 50,
        gap: 20,
    },

    container: {
        alignItems: "center",
    },

    txtStyle: {
        color: "#7F3DFF",
        fontSize: 18,
        fontWeight: "600",
    }
})
