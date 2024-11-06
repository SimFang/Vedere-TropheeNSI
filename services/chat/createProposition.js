import routes from "../../constants/routes.json"

export const createProposition = async (
    conversation_id,
    date,
    hour,
    location,
    isActive,
    isPaid,
    p1_id,
    p2_id,
    price,
    status
) => {
    try {
        // Prepare the body with individual arguments
        const body = {
            conversation_id,
            date,
            hour,
            location,
            isActive,
            isPaid,
            p1_id,
            p2_id,
            price,
            status,
        };

        const response = await fetch(routes.serverUrl + routes.createNewProposition, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create proposition');
        }

        const data = await response.json();
        console.log('Proposition created successfully:', data);
        return data; // You can return the response data if needed
    } catch (error) {
        console.error('Error creating proposition:', error.message);
        // Handle the error as needed (e.g., show a notification)
    }
};
