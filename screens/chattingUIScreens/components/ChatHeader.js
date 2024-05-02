//import liraries
import Ionicons from '@expo/vector-icons/Ionicons';
import React, {useState } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, Platform } from 'react-native';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import loginLogo from "../../../assets/loginLogo.jpg";
import { useNavigation } from '@react-navigation/native';

// create a component
const ChatHeader = ({icons,title}) => {
    const navigation = useNavigation();
    // const [lastSeen, setlastSeen] = useState('');

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent={false} />
            <Ionicons
                style={styles.icon}
                name="chevron-back"
                type="Ionicons"
                size={26}
                onPress={() => navigation.goBack()}
            />
            <Text style={styles.text}>{title}</Text>

            {icons && (
            <>
           
            <Avatar
               source={loginLogo}
               rounded
               size="medium"
            /> 

            <View style={styles.textContainer}>
                <Text numberOfLines={1} style={styles.name}>
                    Zuhair Raza
                </Text>
                <Text style={styles.lastSeen}>
                    {/* dumy date */}
                    10:00 AM
                </Text>
            </View>

            <Ionicons
                style={styles.icon}
                name='call-outline'
                type="Ionicons"
                size={26}
            />

                <Ionicons
                style={styles.icon}
                name="videocam-outline"
                type="Ionicons"
                size={26}
            />
            </>
            )}
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        height: 70,
        backgroundColor: "#3182ce",
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginHorizontal: 10,
        color: "white",
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    name: {
        color: "white",
        fontSize: 16,
        textTransform: 'capitalize',
    },
    lastSeen: {
        fontSize: 10,
        color:"white",
    },
    text: {
        color: "white",
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

//make this component available to the app
export default ChatHeader;
