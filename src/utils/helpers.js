export function setButtonText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    // Set the loading text
    btn.textContent = `${loadingText}`;
    console.log(`Setting text to ${loadingText}`);
  } else {
    // Set the not loading text
    btn.textContent = `${defaultText}`;
    console.log(`Setting text to ${defaultText}`);
  }
}

export function setDeleteBtnText(
  delBtn,
  isDelLoading,
  defaultDelText = "Delete",
  loadingDelText = "Deleting..."
) {
  if (isDelLoading) {
    // Set the delete loading text
    delBtn.textContent = `${loadingDelText}`;
    console.log(`Setting text to ${loadingDelText}`);
  } else {
    // Set the not delete loading text
    delBtn.textContent = `${defaultDelText}`;
    console.log(`Setting text to ${defaultDelText}`);
  }
}
