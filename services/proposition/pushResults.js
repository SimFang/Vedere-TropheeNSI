import routes from "../../constants/routes.json"
export const addWorkToProposition = async (propositionId, images) => {
  const formData = new FormData();

  // Append the proposition ID
  formData.append('proposition_id', propositionId);

  // Append each image to the FormData
  images.forEach((image, index) => {
    formData.append('images', {
      uri: image.uri, // Use the uri of the image
      name: `image_${index}.jpg`, // You can change this to reflect the image type
      type: 'image/jpeg', // Change according to your image type
    });
  });

  try {
    const response = await fetch(`${routes.serverUrl}${routes.pushResultsToProposition}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        // Do not set Content-Type header; the browser sets it automatically for FormData
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Images uploaded successfully:", data);
      return data; // Return data for further processing if needed
    } else {
      console.error("Error uploading images:", data.message);
      throw new Error(data.message); // Throw an error for handling in your UI
    }
  } catch (error) {
    console.error('Network error:', error);
    throw new Error("Network error, please try again."); // Handle network errors
  }
};

export default addWorkToProposition;
