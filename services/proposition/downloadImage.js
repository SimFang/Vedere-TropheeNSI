import routes from "../../constants/routes.json"

export async function downloadImageFromUrl(imageUrl) {
    try {
      // Define the backend endpoint
      const backendEndpoint = routes.serverUrl+routes.downloadpicture;
      // Make a POST request to the backend
      const response = await fetch(backendEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }), // Send the image URL in the request body
      });
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      // Parse the JSON response
      const data = await response.json();
  
      // Return the File.io URL from the backend
      return data.fileUrl;
    } catch (error) {
      console.error("Error uploading the image to File.io:", error);
      throw error; // Rethrow the error for further handling
    }
  }