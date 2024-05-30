'use client';

import axios, { AxiosError } from "axios";
import { useEffect } from "react";

function Worker() {
    const publicVapidKey = 'BGDQdixyYHYbR6v9Kfwo8JGYPJWo7bZI3TRx8_Xnt7tTeJIMb8-0HULXYUGOiY7xR_ygvtdSV79UzeDAHFNLATY';

    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const subscribeUser = async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            const existingRegistration = await registration.pushManager.getSubscription();

            if (existingRegistration) {
                return;
            }

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            });

            const subscriptionResponse = await axios.post('/api/v1/push/subscribe', subscription);

            if (!subscriptionResponse) {
                console.error('Failed to register');
                return;
            }

            localStorage.setItem('push_id', subscriptionResponse.data.id);

            console.log('User is subscribed:', subscription);
        } else {
            console.error('Service Worker or Push Manager is not supported');
        }
    };

    const estabilishPushNotification = async () => {
        const subscriptionId = localStorage.getItem('push_id');
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        const existingRegistration = await registration.pushManager.getSubscription();

        if (!existingRegistration) {
            await subscribeUser();
            return;
        }

        if (!subscriptionId) {
            await registration.unregister();
            await subscribeUser();
            return;
        }

        axios.post('/api/v1/push/check', {
            subscription_id: subscriptionId
        }).then(() => {

        }).catch(async (error: AxiosError) => {
            if (error.response?.status === 404) {
                await registration.unregister();
                await subscribeUser();
            }
        })
    };

    useEffect(() => {
        estabilishPushNotification();
    }, []);

    return null;
}

export default Worker;