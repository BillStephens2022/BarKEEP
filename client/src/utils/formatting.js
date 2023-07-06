export const formatDate = (postDateValue) => {
  const postDate = new Date(parseInt(postDateValue));
  const formattedDate = postDate.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  return formattedDate;
}