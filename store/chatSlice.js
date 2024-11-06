import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  propositions: [],
  currentChat: {
    id: "",
  },
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Conversations
    pushConversation: (state, action) => {
      state.conversations.push(action.payload);
    },
    setConversation: (state, action) => {
      state.conversations = action.payload;
    },
    removeConversationById: (state, action) => {
      state.conversations = state.conversations.filter(convo => convo.id !== action.payload);
    },

    // Propositions
    pushProposition: (state, action) => {
      state.propositions.push(action.payload);
    },
    setProposition: (state, action) => {
      state.propositions = action.payload;
    },
    removePropositionById: (state, action) => {
      state.propositions = state.propositions.filter(prop => prop.id !== action.payload);
    },

    // Current Chat
    setCurrentChatId: (state, action) => {
      state.currentChat.id = action.payload;
    },
    clearCurrentChat: (state) => {
      state.currentChat.id = null; 
    },

    // Reset chat state
    resetChatState(state) {
      // Reset everything to initial state
      return initialState; // This will reset all properties to their initial values
    },
  },
});

export const {
  pushConversation,
  setConversation,
  removeConversationById,
  pushProposition,
  setProposition,
  removePropositionById,
  setCurrentChatId,
  clearCurrentChat,
  resetChatState, // Export the reset action
} = chatSlice.actions;

export default chatSlice.reducer;
