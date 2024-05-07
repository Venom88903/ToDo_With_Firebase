import { StyleSheet, Text, TextInput, View, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'

const FiestScreen = () => {

    return (
        <View style={styles.container}>
            <View style={{flexDirection:"column"}}>
                <TextInput
                    style={styles.inputBox}
                    placeholder='Enter Any Value'
                />
                <TouchableOpacity style={styles.addButton}>
                    <Text>
                        Add
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default FiestScreen

const { height, width } = Dimensions.get('screen');

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        alignItems: "center"
    },
    inputBox: {
        width: width - 30,
        borderRadius: 15,
        borderWidth: 2,
        marginVertical: 10,
        padding: 10,
        height:50
        // backgroundColor:"red"
    },
    addButton: {
        backgroundColor:"red",
        alignItems:"center"
    }
})