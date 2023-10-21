export const setItemToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error while saving to local storage:", error);
  }
};

export const getItemFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error while retrieving from local storage:", error);
    return null;
  }
};

export const isToday = (isoDate) => {
  const isoDateObj = new Date(isoDate);
  const currentDate = new Date();

  const isDateMatchingToday =
    isoDateObj.getFullYear() === currentDate.getFullYear() &&
    isoDateObj.getMonth() === currentDate.getMonth() &&
    isoDateObj.getDate() === currentDate.getDate();

  if (isDateMatchingToday) {
    return true;
  } else {
    return false;
  }
};
