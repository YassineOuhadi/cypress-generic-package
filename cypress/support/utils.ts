const generateRandomWords = (count: number): string => {
    const words = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grapefruit', 'honeydew', 'imbe', 'jackfruit'];
    let randomWords = '';
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        randomWords += words[randomIndex] + ' ';
    }
    return randomWords.trim();
};

export {
    generateRandomWords
}