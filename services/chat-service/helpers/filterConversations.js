// Function to filter conversations
exports.filterConversations = (conversations, propositions) => {
    // Create a set of conversation_ids from propositions for fast lookup
    const conversationIdsToRemove = new Set(propositions.map(prop => prop.conversation_id));

    // Filter out conversations that are present in the conversationIdsToRemove set
    const filteredConversations = conversations.filter(conv => !conversationIdsToRemove.has(conv.id));

    return filteredConversations;
};