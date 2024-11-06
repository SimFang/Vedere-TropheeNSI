import routes from "../constants/routes.json"

export const updateProfilePicture = async (formData) => {
    const url = routes.serverUrl + routes.updateProfilePicture; // Replace with your actual endpoint URL

    // Create a FormData object to hold the file and user ID

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData, // Send the FormData as the request body
        });

        if (!response.ok) {
            throw new Error('Failed to update profile picture');
        }

        const data = await response.json(); // Parse the JSON response
        console.log('Profile picture updated successfully:', data.imageUrl);
        return data.imageUrl; // Return the updated image URL if needed
    } catch (error) {
        console.error('Error uploading profile picture:', error.message);
        throw error; // Rethrow the error for further handling if necessary
    }
};
