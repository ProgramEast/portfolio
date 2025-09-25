const logo = document.getElementById("Chuleta");

logo.addEventListener("mouseover", () => {
  logo.src = "/img/Chuleta_gif.gif";
});

logo.addEventListener("mouseout", () => {
  logo.src = "/img/chuleta_icon.svg";
});