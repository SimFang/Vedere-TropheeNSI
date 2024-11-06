// Function to calculate total income
export function calculateTotalIncome(propositions) {
    return propositions
      .filter((prop) => prop.isPaid) // Filter only paid propositions
      .reduce((total, prop) => total + parseFloat(prop.price), 0); // Sum up the prices
  }
  
  // Function to calculate last income for the current month
  export function calculateLastIncomeForMonth(propositions) {
    // Get current month
    const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed, so we add 1
    const currentYear = new Date().getFullYear();
  
    // Filter propositions that are paid and in the current month
    const paidPropositionsForMonth = propositions.filter((prop) => {
      const [day, month] = prop.date.split('/').map(Number); // Split the date string to get day and month
      return prop.isPaid && month === currentMonth;
    });
  
    // If no paid propositions for the current month, return 0
    if (paidPropositionsForMonth.length === 0) {
      return 0;
    }
  
    // Sort propositions by date and time (assuming same-day propositions are also sorted by time)
    paidPropositionsForMonth.sort((a, b) => {
      const [dayA, monthA] = a.date.split('/').map(Number);
      const [dayB, monthB] = b.date.split('/').map(Number);
      
      if (dayA !== dayB) {
        return dayB - dayA; // Sort by day
      }
      
      // If days are the same, compare hours (assuming time is in 24-hour format)
      const [hourA, minuteA] = a.hour.split(':').map(Number);
      const [hourB, minuteB] = b.hour.split(':').map(Number);
      
      return hourB - hourA || minuteB - minuteA;
    });
  
    // The first element in the sorted array will be the last income for the current month
    return parseFloat(paidPropositionsForMonth[0].price);
  }