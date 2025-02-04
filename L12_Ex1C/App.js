import React, { useState, useEffect } from 'react';
import { StatusBar, Text, View } from 'react-native';
import { Magnetometer } from 'expo-sensors';

export default function App() {
    const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
    const [available, setAvailable] = useState(false);

    useEffect(() => {
        Magnetometer.isAvailableAsync().then(setAvailable);

        const subscription = Magnetometer.addListener(setData);
        return () => subscription.remove()
    }, []);

    return (
        <View>
            <StatusBar />
            {available ? (
                <>
                    <Text>x: {x}</Text>
                    <Text>y: {y}</Text>
                    <Text>z: {z}</Text>
                </>
            ) : (
                <Text>Magnetometer not available</Text>
            )}
        </View>
    );
}
