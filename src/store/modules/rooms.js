export const state = {
  messages: [],
  removeInterval: null
}

export const mutations = {
  ADD_MESSAGE(state, data) {
    // eslint-disable-next-line no-console
    console.log(data)
    if(state.messages.length > 4) {
      state.messages.shift();
    }
    state.messages.push(data.message);
  },
  ON_ROOM_DESTROY(state) {
    state.messages = [];
    clearInterval(state.removeInterval);
    state.removeInterval = null;
  },
  INIT_CLEAN_MESSAGES_INTERVAL(state) {
    const maxLifespan = 5000;
    state.removeInterval = setInterval(() => {
      if (state.messages.length) {
        state.messages.forEach(item => {
          if (Date.now() - maxLifespan > item.createdAt) {
            state.messages.shift();
          }
        });
      }
    }, 2000);
  }
}
export const actions = {

}

export const getters = {}