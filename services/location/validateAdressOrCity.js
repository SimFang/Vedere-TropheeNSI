import routes from "../../constants/routes.json"

export const validateAddressOrCity = async (input) => {
    if (!input) return false;
  
    try {
      const response = await fetch(`${routes.serverUrl}${routes.checkLocation}?input=${input}`);
      const data = await response.json();
      return data.isValid;
    } catch (error) {
      console.error('Error validating address:', error);
      return false;
    }
  };
  