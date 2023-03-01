import { createStore } from 'vuex'
import { io } from 'socket.io-client'

export default createStore({
  state: {
    socket: null,
    client: null
  },
  mutations: {
    SETUP_CONNECTION(state) {
      state.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT)
    },
    SET_CLIENT_DATA(state, data) {
      state.client = data
      localStorage.setItem('client', JSON.stringify(data))
    },
    REMOVE_CLIENT_DATA(state) {
      state.client = null
    }
  },
  actions: {
    disconnect(state, commit) {
      if(state.socket) {
        commit('REMOVE_CLIENT_DATA')
        state.socket.disconnect()
      }
    }
  },
  modules: {
  }
})
