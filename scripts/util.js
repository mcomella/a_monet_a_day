export function shuffleArray(arr) {
    const shuffled = structuredClone(arr);
    for (let i = 0; i < arr.length; i++) {
        const swapIndex = Math.floor(Math.random() * arr.length);
        const temp = shuffled[i];
        shuffled[i] = shuffled[swapIndex];
        shuffled[swapIndex] = temp;
    }
    return shuffled;
}
