import routes from "../../constants/routes.json"
export async function loadPhotographerDashboard(photographerId) {
    try {
      // Define the API URL
      const apiUrl = routes.serverUrl+routes.loadPhotographerDashboard;
            // Make the request with the photographerId in the body
      const response = await fetch(apiUrl, {
        method: 'POST', // Using POST since you are passing photographerId in the body
        headers: {
          'Content-Type': 'application/json', // Ensure the content type is JSON
        },
        body: JSON.stringify({
          photographerId: photographerId, // Pass the photographerId in the request body
        }),
      });
  
      // Check if the response is successful
      if (!response.ok) {
        console.log("no propositions found for "+photographerId)

        return
      }
  
      // Parse the response JSON
      const propositions = await response.json();
      console.log("propositions is :")
      console.log(propositions)
      return propositions
  
    } catch (error) {
      console.log('Error loading dashboard:', error);
    }
  }


  