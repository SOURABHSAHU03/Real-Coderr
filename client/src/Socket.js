import { io } from 'socket.io-client';
import ACTIONS from './Actions';

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempts: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };

    // Use environment variable with fallback
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    const socket = io(BACKEND_URL, options);
    return socket;
};