exports.boostProposition = (conversations, propositions) => {
    const boostedPropositions = [];
  
    propositions.forEach((proposition) => {
      const propositionConversationId = proposition.conversation_id;
  
      // Get the conversation that matches the proposition's conversation_id
      const matchingConversation = conversations.find(
        (conversation) => conversation.id === propositionConversationId
      );
  
      // If there's a matching conversation, merge it with the proposition
      if (matchingConversation) {
        boostedPropositions.push({
          ...proposition,
          chat: matchingConversation.chat,
          lastTimestamp: matchingConversation.lastTimestamp,
          lastmessage: matchingConversation.lastmessage,
        });
      } else {
        // Optionally, you can still push the proposition if no matching conversation is found
        boostedPropositions.push(proposition);
      }
    });
  
    return boostedPropositions;
  };
  