//import liraries
import Ionicons from '@expo/vector-icons/Ionicons';
import React, {useState } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, Platform } from 'react-native';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import loginLogo from "../../../assets/loginLogo.jpg";
import { useNavigation } from '@react-navigation/native';

// create a component
const ChatHeader = () => {
    const navigation = useNavigation();
    const [lastSeen, setlastSeen] = useState('')

    return (
        <View style={styles.container}>
            {/* backgroundColor={COLORS.theme} */}
            <StatusBar barStyle="light-content"  translucent={false} />
            <Ionicons
                style={{
                    marginHorizontal: 10,
                    // color: COLORS.white,
                    color:"white"
                }}
                name = "chevron-back"
                type = "Ionicons"
                size={26}
                onPress={() => navigation.goBack() }
            />
            <Avatar
               source={loginLogo}
               rounded
               size="medium"
            /> 

            <View 
                style={{flex:1, marginLeft: 10}}
            >
                <Text
                    numberOfLines={1}
                    style={{
                        // color: COLORS.white,
                        color:"white",
                        fontSize: 16,
                        // fontFamily: "bold",
                        textTransform:'capitalize'
                    }}
                >
                    Zuhair Raza
                    {/* {data.name} */}
                </Text>

                <Text
                // color: COLORS.primaryBackground,
                // fontFamily: FONTS.Regular 
                    style={{  fontSize: 10}}
                >
                    {/* {lastSeen} */}
                    last seen
                </Text>
            </View>

            <Ionicons
                style={{
                    marginHorizontal: 10,
                    // color: COLORS.themeColor
                    color:"white"
                }}
                name="videocam-outline"
                type="Ionicons"
                size={26}
            />

        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        height:70,
        // backgroundColor: COLORS.theme,
        backgroundColor:"#3182ce",
        elevation: 5,
        flexDirection: 'row',
        alignItems:'center',
    },
});

//make this component available to the app
export default ChatHeader;