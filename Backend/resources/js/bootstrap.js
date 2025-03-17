import Echo from 'laravel-echo';
import axios from 'axios';
window.axios = axios;
import io from 'socket.io-client';
window.io = io;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';




window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: window.location.hostname + ':6001', // منفذ Socket.io
});
