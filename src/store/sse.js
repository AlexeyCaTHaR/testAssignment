export default {
  namespaced: true,

  state: {
    messages: [
      {
        id: 1,
        type: 'log',
        message: 'Simple log message from store',
        hidden: false,
      },
      {
        id: 2,
        type: 'warning',
        message: 'Simple warning message from store',
        hidden: false,
      },
    ],
  },

  actions: {
    loadMessage({ commit }, message) {
      commit('addMessage', message);
    },
    hideMessage({ commit }, messageId) {
      commit('hideMessage', messageId);
    },
  },

  mutations: {
    addMessage(state, message) {
      state.messages.push({
        id: message.id,
        type: message.type,
        message: message.message,
        hidden: false,
      });
    },
    hideMessage(state, messageId) {
      const key = state.messages.findIndex((el) => messageId === el.id);

      state.messages[key].hidden = true;
    },
  },

  getters: {
    getMessages(state) {
      return state.messages;
    },
  },
};
