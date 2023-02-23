function randomSeed(length) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";

    let seed = "";
    const charCount = chars.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charCount);
        seed += chars[randomIndex];
    }

    return seed;
}

export default randomSeed;
