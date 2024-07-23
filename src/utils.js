export function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

export function toggleDarkMode(on) {
  const body = document.querySelector("body");
  const header = document.querySelector("header");
  if (body && header) {
    if (on) {
      body.classList.add("dark");
      header.classList.add("dark");
      console.log("Dark mode toggled");
    } else {
      body.classList.remove("dark");
      header.classList.remove("dark");
    }
  }
}
