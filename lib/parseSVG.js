export default function parseSVG(text) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'image/svg+xml');
    const svg = doc.documentElement;
    return document.adoptNode(svg);
}
