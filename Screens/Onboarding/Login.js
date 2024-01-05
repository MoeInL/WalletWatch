import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";

import CustomButton from "../../Components/OnboardingComponents/CustomButton";
import CustomTextInput from "../../Components/OnboardingComponents/CustomTextInput";
import PasswordBox from "../../Components/OnboardingComponents/PasswordBox";
import LoadingOverlay from "../../Components/AuthUIComponents/LoadingOverlay";

import { loginUser } from "../../Requests/auth";

export default function Login({navigation}){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [emailValid, setEmailValid] = useState(true)
    const [passValid, setPassValid] = useState(true)

    const [isAuthenticating, setIsAuthenticating] = useState(false)

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setEmail("")
            setPassword("")
            setEmailValid(true)
            setPassValid(true)
        });
    
        return unsubscribe;
    }, [navigation]);

    async function logInHandler(email, password){
        let proceed = true;
        setIsAuthenticating(true)

        try{
            const token = await loginUser(email, password)
        }catch(error){
            Alert.alert(
                'Authentication Failed', 
                'Could not log you in. Please check your credentials.'
            )
        md
            setIsAuthenticating(false)
            proceed = false
        }

        proceed? navigation.navigate("SetupNavigation"): null
    }

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
            
            logInHandler(email, password)
        }
    }

    if(isAuthenticating){
        return <LoadingOverlay message = 'Logging in...'/>
    }

    return(
        <View style = {styles.screenStyle}>
            <CustomTextInput placeholder = "Email" isValid = {emailValid} onChangeText={(text) => setEmail(text)} value={email} mode={"email"}/>
            <PasswordBox placeholder = "Password" isValid={passValid} onChangeText={(text) => setPassword(text)} value = {password}/>
            <CustomButton text = "Login" onPress={confirmLogin}/>
            <TouchableOpacity style = {styles.container} onPress={()=> navigation.navigate("ForgotPassword")}>
                <Text style = {styles.txtStyle}>Forgot Password?</Text>
            </TouchableOpacity>

            <View style = {styles.txtContainer}>
            <Text style = {styles.txt}>Don't have an account?</Text>

            <TouchableOpacity onPress={()=> navigation.navigate("SignUp")}>
                <Text style = {styles.hyperlinkTxt}>Sign Up</Text>
            </TouchableOpacity>
           </View>
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
    },

    txtContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 5,
        flex: 1,
        alignItems: "flex-end",
    },

    txt: {
        fontSize: 16,
        fontWeight: "500",
        color: "#91919F",
    },

    hyperlinkTxt:{
        fontSize: 16,
        fontWeight: "500",
        color: "#7F3DFF",
        textDecorationLine: "underline",
    }
})
