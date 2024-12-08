import routes from "../../constants/routes.json"

// services/photographer-service/addImageToWork.js

export const addImageToWork = async (photographerId, imageFile) => {
    console.log("FE sent id : "+photographerId)
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageFile,
        name: 'profile_picture.jpg',
        type: 'image/jpeg',
      });
      formData.append('photographerId', photographerId);
  
      const response = await fetch(routes.serverUrl+routes.addPhotographerWork, {
        method: 'POST',
        body: formData, // Sending FormData with the image file and photographerId
      });
  
      if (!response.ok) {
        throw new Error('Failed to add image to photographer\'s work list');
      }
  
      const result = await response.json();
      return result; // Return the result (e.g., success message, image URL)
    } catch (error) {
      console.error('Error adding image to work:', error);
      throw error; // Propagate the error to the calling function
    }
  };

// services/photographer-service/removeImageFromWork.js

export const removeImageFromWork = async (photographerId, imageUrl) => {
    try {
      const response = await fetch(routes.serverUrl+routes.removePhotographerWork, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photographerId, imageUrl }), // Send photographerId and imageUrl to be removed
      });
  
      if (!response.ok) {
        throw new Error('Failed to remove image from photographer\'s work list');
      }
  
      const result = await response.json();
      return result; // Return the result (e.g., success message)
    } catch (error) {
      console.error('Error removing image from work:', error);
      throw error; // Propagate the error to the calling function
    }
  };