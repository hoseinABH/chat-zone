export function handleResponse(msg, isSuccessful = false) {
  return {
    isSuccessful: isSuccessful,
    message: msg,
  };
}
