const inputArea = document.getElementById("json--post");

document.getElementById("prettify-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  try {
    const formatted = JSON.stringify(JSON.parse(inputArea.value), null, 4);

    inputArea.value = formatted;
  } catch (error) {
    alert(error);
  }
});
