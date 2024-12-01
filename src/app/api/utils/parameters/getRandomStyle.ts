export type Style = "blues" | "rock" | "jazz" | "hip-hop" | "pop" | "country" | "electronic" | "midwest emo"| "deep house" | "berlin techno"

export default function getRandomStyle(): Style {
    const styles: Style[] = ["blues", "rock", "jazz", "hip-hop", "pop", "country", "electronic", "midwest emo", "deep house", "berlin techno"];
    return styles[Math.floor(Math.random() * styles.length)];
}
