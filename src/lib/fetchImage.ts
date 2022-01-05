export default function fetchImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    img.src = src;
    img.onload = () => resolve(img);
  });
}
