def boost_proposition(conversations, propositions):
    boosted_propositions = []

    for proposition in propositions:
        proposition_conversation_id = proposition['conversation_id']

        # Get the conversation that matches the proposition's conversation_id
        matching_conversation = next(
            (conversation for conversation in conversations if conversation['id'] == proposition_conversation_id),
            None
        )

        # If there's a matching conversation, merge it with the proposition
        if matching_conversation:
            boosted_proposition = {
                **proposition,
                'chat': matching_conversation['chat'],
                'lastTimestamp': matching_conversation['lastTimestamp'],
                'lastmessage': matching_conversation['lastmessage'],
            }
            boosted_propositions.append(boosted_proposition)
        else:
            # Optionally, you can still push the proposition if no matching conversation is found
            boosted_propositions.append(proposition)

    return boosted_propositions
