// helper function to format the date (Mmm DD, YYYY)
export const formatDate = (postDateValue) => {
  const postDate = new Date(parseInt(postDateValue));
  const formattedDate = postDate.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return formattedDate;
}

// Helper function to format elapsed time
export const formatElapsedTime = (postDate) => {
  const dateValue = typeof postDate === "string" ? parseInt(postDate, 10) : postDate;
  const now = new Date().getTime();
  const elapsedTime = now - dateValue;

  // Calculate minutes, hours, and days
  const minutes = Math.floor(elapsedTime / (1000 * 60));
  const hours = Math.floor(elapsedTime / (1000 * 60 * 60));

  if (minutes < 60) {
    return `${minutes}min`;
  } else if (hours < 24) {
    return `${hours}h`;
  } else {
    const formattedDate = formatDate(dateValue);
    return formattedDate;
  }
};
