import colors from "tailwindcss/colors";

export const validColors = Object.entries(colors).reduce(
  (acc, [key, value]) => {
    if (
      ![
        "black",
        "gray",
        "coolGray",
        "trueGray",
        "blueGray",
        "warmGray",
        "white",
      ].includes(key)
    )
      ["400", "500", "600", "700"].forEach((i) => {
        acc.push(`bg-${key}-${i}`);
      });
    return acc;
  },
  []
);

export function randomColor(tags) {
  const takenColors = Object.values(tags).map((i) => i.color);
  const available = validColors.filter((i) => !takenColors.includes(i));
  console.log(takenColors, available);
  return available[Math.floor(Math.random() * available.length)];
}
