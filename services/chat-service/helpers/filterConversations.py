def filter_conversations(conversations, propositions):
    # Create a set of conversation_ids from propositions for fast lookup
    conversation_ids_to_remove = {prop['conversation_id'] for prop in propositions}

    # Filter out conversations that are present in the conversation_ids_to_remove set
    filtered_conversations = [conv for conv in conversations if conv['id'] not in conversation_ids_to_remove]

    return filtered_conversations
