import React, { useState, useEffect } from 'react';
import socketio from 'socket.io-client';
import  { Alert, View, ScrollView, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {YellowBox} from 'react-native';

YellowBox.ignoreWarnings(['Warning: Async Storage has been extracted from react-native core']);

import SpotList from '../components/SpotList';

import logo from '../assets/logo.png';

export default function List() {
    const [techs, setTechs] = useState([]);

    useEffect(() => {
        AsyncStorage.getItem('user').then(user_id => {
            const socket = socketio('http://10.0.2.2:3333', {
                query: { user_id }
            })

            socket.on('booking_response', booking => {
                Alert.alert(`Sua reserva em ${booking.spot.company} em ${booking.date} foi ${booking.approved ? 'aprovada' : 'rejeitada'}`);
            })
        })
    }, []);

    useEffect(() => {
        AsyncStorage.getItem('techs').then(storagedTechs => {
            const techsArray = storagedTechs.split(',').map(tech => tech.trim());

            setTechs(techsArray);
        })
    },[]);
    
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={logo} />

            <ScrollView>
                {techs.map (tech => <SpotList key={tech} tech={tech} />)}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    logo: {
        height: 32,
        resizeMode: "contain",
        alignSelf: 'center',
        marginTop: 10,
    },
})