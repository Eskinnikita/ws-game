import { createStore } from 'vuex';
import { io } from 'socket.io-client';

export default createStore({
  state: {
    socket: null,
    client: localStorage.getItem('client')
  },
  mutations: {
    SETUP_CONNECTION(state) {
      state.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);
    },
    SET_CLIENT_DATA(state, data) {
      state.client = data;
      localStorage.setItem('client', JSON.stringify(data));
    },
    REMOVE_CLIENT_DATA(state) {
      state.client = null;
      localStorage.removeItem('client');
    }
  },
  actions: {
    disconnect(state, commit) {
      if (state.socket) {
        commit('REMOVE_CLIENT_DATA');
        state.socket.disconnect(state.client);
      }
    }
  },
  modules: {
  }
});
