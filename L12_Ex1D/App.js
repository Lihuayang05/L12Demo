import React, { useState, useEffect } from 'react';
import { StatusBar, Text, View } from 'react-native';
import { Barometer } from 'expo-sensors';

export default function App() {
    const [{ pressure, relativeAltitude }, setData] = useState({ pressure: 0, relativeAltitude: 0 });

    useEffect(() => {
        const subscription = Barometer.addListener(setData);
        return () => subscription.remove();
    }, []);

    return (
        <View>
            <StatusBar />
            <Text>Pressure: {pressure} hPa</Text>
            <Text>Relative Altitude: {relativeAltitude} m</Text>
        </View>
    );
}
