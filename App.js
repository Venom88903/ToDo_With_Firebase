// import { StyleSheet, Text, View } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import firestore from '@react-native-firebase/firestore';
// import database from '@react-native-firebase/database';

// const App = () => {

//   const [myData, setMyData] = useState(null)

//   useEffect(() => {
//     getDatabase()
//   }, [])

//   const getDatabase = async () => {


//     // For data get
//     // try {
//     //   const data = await firestore().collection('testing').doc('C73SS0EIrXn1AANxkmwU').get();

//     //   console.log('FirebaseDaat=>', data._data)
//     //   setMyData(data._data);
//     // } catch (err) {
//     //   console.log(err)
//     // }


//     // For database to data get
//     try{
//       const data = await database().ref('users/1').once('value')

//       console.log('Database==>',data)
//       setMyData(data.val());
//     }catch(err){
//       console.log(err)
//     }

//   }

//   return (
//     <View>
//       <Text>Name:- {myData ? myData.name : 'Loading...'}</Text>
//       <Text>Age:- {myData ? myData.age : 'Loading...'}</Text>
//     </View>
//   )
// }

// export default App

// const styles = StyleSheet.create({})

import { StyleSheet, Text, TextInput, View, Dimensions, TouchableOpacity, StatusBar, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import database from '@react-native-firebase/database';

const App = () => {

    const [inputTextValue, setInputTextValue] = useState(null)
    const [list, setList] = useState(null)
    const [myData, setMyData] = useState(null)
    const [isUpdateData, setIsUpdateData] = useState(null);
    const [selectCardIndex, setSelectCardIndex] = useState(null);


    const handleAddData = async () => {
        try {
            if (inputTextValue.length > 0) {
                const index = list.length;
                const response = await database().ref(`todo/${index}`).set({
                    value: inputTextValue
                })
                console.log('DatabaseResponse', response)
                setInputTextValue('')
            } else {
                alert('Please Enter Value & Then Try Again');
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleUpdateData = async () => {
        try {
            if (inputTextValue.length > 0) {
                await database().ref(`todo/${selectCardIndex}`).update({
                    value: inputTextValue
                })
                setInputTextValue('')
                setIsUpdateData(false)
            } else {
                alert('Please Enter Update Value & Then Try Again')
            }
        } catch (err) {
            console.log(err)
        }
    }


    const handleCardPress = async (cardIndex, cardValue) => {
        try {
            setIsUpdateData(true)
            console.log('-------', cardValue)
            setSelectCardIndex(cardIndex)
            setInputTextValue(cardValue)
        } catch (err) {
            console.log(err)
        }
    }


    const handleCardLongPress = (cardIndex, cardValue) => {
        try {
            Alert.alert('Alert', `Are You Sure To Delete ${cardValue} ?`, [
                {
                    text: 'Cancel',
                    onPress: () => {
                        console.log('Cancel Is Press');
                    },
                },
                {
                    text: 'Ok',
                    onPress: async () => {
                        try {
                            const response = await database()
                                .ref(`todo/${cardIndex}`)
                                .remove();

                            setInputTextValue('');
                            setIsUpdateData(false);
                            console.log(response);
                        } catch (err) {
                            console.log(err);
                        }
                    },
                },
            ]);
            // setIsUpdateData(true);
            // setSelectedCardIndex(cardIndex);
            // setInputTextValue(cardValue);
        } catch (err) {
            console.log(err);
        }
    };


    useEffect(() => {
        getDatabase()
    }, [])

    const getDatabase = async () => {
        // For database to data get
        try {
            // const data = await database().ref('todo/').once('value')
            const data = await database().ref('todo').on('value', tempData => {
                console.log('Database==>', tempData)
                setList(tempData.val());
            })
        } catch (err) {
            console.log(err)
        }

    }

    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <View style={{ flexDirection: "column" }}>
                <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>
                    TODO App
                </Text>
                <TextInput
                    style={styles.inputBox}
                    placeholder='Enter Any Value'
                    value={inputTextValue}
                    onChangeText={(value) => setInputTextValue(value)}
                />
                {
                    !isUpdateData ? (
                        <TouchableOpacity
                            onPress={() => handleAddData()}
                            style={styles.addButton}
                        >
                            <Text style={{ color: "#ffffff" }}>
                                Add
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() => handleUpdateData()}
                            style={styles.addButton}
                        >
                            <Text style={{ color: "#ffffff" }}>
                                Updated
                            </Text>
                        </TouchableOpacity>
                    )
                }
            </View>
            <View style={styles.cardContainer}>
                <Text style={{ marginVertical: 20, fontSize: 20, fontWeight: 'bold' }}>
                    Todo List
                </Text>

                <FlatList
                    data={list}
                    renderItem={(item) => {
                        console.log(item)
                        if (item.item !== null) {
                            const cardIndex = item.index;
                            const cardValue = item.item.value;
                            return (
                                <TouchableOpacity
                                    style={styles.card}
                                    onPress={() => handleCardPress(cardIndex, cardValue)}
                                    onLongPress={() => { handleCardLongPress(cardIndex, cardValue) }}
                                >
                                    <Text>{item.item.value}</Text>
                                </TouchableOpacity>
                            )
                        }
                    }}
                />
            </View>
        </View>
    )
}

export default App

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
        height: 50
        // backgroundColor:"red"
    },
    addButton: {
        backgroundColor: "blue",
        alignItems: "center",
        padding: 10,
        borderRadius: 50
    },
    cardContainer: {
        marginVertical: 20,
    },
    card: {
        backgroundColor: '#fff',
        width: width - 40,
        padding: 20,
        borderRadius: 30,
        marginVertical: 10,
    },
})