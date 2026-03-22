// Function to extract article text from the webpage
function extractArticleText() {
    // A basic extraction approach: grab all paragraphs
    const paragraphs = document.querySelectorAll('p');
    let text = '';
    paragraphs.forEach(p => {
        const pText = p.innerText.trim();
        if (pText.length > 20) {
            text += pText + '\n\n';
        }
    });
    return text.substring(0, 5000); // Limit length to avoid massive payloads
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extract_text") {
        sendResponse({ text: extractArticleText() });
    }
});
