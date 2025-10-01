const logoChuleta = document.querySelector("img#chuleta");

logoChuleta.addEventListener("mouseover", () => {
  logoChuleta.src = "img/Chuleta_gif.gif";
});

logoChuleta.addEventListener("mouseout", () => {
  logoChuleta.src = "img/chuleta_icon.svg";
});

let projChuleta = document.getElementById("proj-chuleta");
projChuleta.style.visibility = "hidden";
projChuleta.style.opacity = "0";


logoChuleta.addEventListener("click", () => {
  projChuleta.style.visibility = "visible"; 
})