import routes from "../../constants/routes.json"

export const getSuggestions = async (query) => {
    if (!query) return [];
  
    try {
      const response = await fetch(`${routes.serverUrl}${routes.getLocationSuggestions}?query=${query}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  };
  