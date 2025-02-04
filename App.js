import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { Audio } from 'expo-av';

const SHAKE_THRESHOLD = 1.5;
const ROTATION_THRESHOLD = 1.2;
const SHAKE_COOLDOWN = 1000;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    shakeText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#ff0000',
    },
    stopButton: {
        marginTop: 20,
    },
});

export default function App() {
    const [isShaking, setIsShaking] = useState(false);
    const [sound, setSound] = useState(null);
    const [lastShakeTime, setLastShakeTime] = useState(0);

    useEffect(() => {
        async function setupAudio() {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        }
        setupAudio();

        Accelerometer.setUpdateInterval(100);
        Gyroscope.setUpdateInterval(100);

        const accelerometerSubscription = Accelerometer.addListener(({ x, y, z }) => {
            handleShakeDetection(x, y, z, 0, 0, 0);
        });

        const gyroscopeSubscription = Gyroscope.addListener(({ x, y, z }) => {
            handleShakeDetection(0, 0, 0, x, y, z);
        });

        return () => {
            accelerometerSubscription.remove();
            gyroscopeSubscription.remove();
        };
    }, []);

    function handleShakeDetection(ax, ay, az, gx, gy, gz) {
        const totalForce = Math.sqrt(ax * ax + ay * ay + az * az);
        const totalRotation = Math.sqrt(gx * gx + gy * gy + gz * gz);
        const currentTime = Date.now();

        if (
            (totalForce > SHAKE_THRESHOLD || totalRotation > ROTATION_THRESHOLD) &&
            currentTime - lastShakeTime > SHAKE_COOLDOWN
        ) {
            setIsShaking(true);
            setLastShakeTime(currentTime);
            playSound();
        } else {
            setIsShaking(false);
        }
    }

    async function playSound() {
        try {
            if (sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                require('./182273__martian__gun-for-ghose.wav')
            );

            setSound(newSound);
            await newSound.playAsync();
        } catch (error) {
            console.log('Error playing sound:', error);
        }
    }

    async function stopSound() {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
            setSound(null);
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: isShaking ? '#ffcccc' : '#fff' }]}>
            {isShaking ? <Text style={styles.shakeText}>SHAKE</Text> : <Text>Shake or Rotate your phone!</Text>}
            {sound && <Button title="Stop Sound" onPress={stopSound} />}
        </View>
    );
}
