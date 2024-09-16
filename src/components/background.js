export function getBackgroundImage() {
  const images = [
    "assets/wallpaper_1.jpg",
    "assets/wallpaper_2.jpg",
    "assets/wallpaper_3.jpg",
    "assets/wallpaper_4.jpg",
    "assets/wallpaper_5.jpg",
    "assets/wallpaper_6.jpg",
  ];

  return images[Math.floor(Math.random() * images.length)];
}
