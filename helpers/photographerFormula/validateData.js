import { Alert } from "react-native";

export const validateData = (name, surname, description, age, state, phoneNumber, price) => {
    // Define a flag for validation
    let isValid = true;
    let message = '';
  
    // Check for empty fields
    if (!name || !surname || !description || !age || !state || !phoneNumber || !price) {
      message = 'All fields must be filled out.';
      isValid = false;
    } else if (name.length < 16 || name.length > 120) {
      message = 'Name must be between 16 and 120 characters.';
      isValid = false;
    } else if (isNaN(age) || age <= 0) {
      message = 'Age must be a valid positive number.';
      isValid = false;
    } else if (!/^\d{10}$/.test(phoneNumber)) { // Simple phone number validation (10 digits)
      message = 'Phone number must be 10 digits.';
      isValid = false;
    } else if (isNaN(price) || price < 0 || price > 200) {
      message = 'Price must be between 0 and 200.';
      isValid = false;
    }
  
    // Alert the user if validation fails
    if (!isValid) {
        Alert.alert(message);
    }
  
    return isValid;
  };
  