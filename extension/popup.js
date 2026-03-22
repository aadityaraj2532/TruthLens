document.getElementById('analyze-btn').addEventListener('click', async () => {
    const btn = document.getElementById('analyze-btn');
    const btnText = document.getElementById('btn-text');
    const spinner = document.getElementById('btn-spinner');
    const statusMsg = document.getElementById('status-msg');
    const resultsCard = document.getElementById('results');

    // Display Loading State
    btn.disabled = true;
    btnText.innerText = "Analyzing...";
    spinner.classList.remove('hidden');
    statusMsg.innerText = "Extracting current page context...";
    statusMsg.style.color = '#a6adc8';
    resultsCard.classList.add('hidden');

    try {
        // Query the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab.url || tab.url.startsWith("chrome://")) {
            throw new Error("Cannot scan native Chrome system tabs.");
        }

        // Execute content script to scrape the loaded DOM directly.
        // This cleanly bypasses paywalls or backend blocking protections.
        const injection = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
                const paragraphs = document.querySelectorAll('p, h1, h2, h3, article');
                return Array.from(paragraphs)
                    .map(p => p.innerText.trim())
                    .filter(t => t.length > 20)
                    .join('\n\n')
                    .substring(0, 8000); // 8K limit to save tokens
            }
        });

        const extractedText = injection[0].result;
        if (!extractedText) {
             throw new Error("Could not detect any primary article text.");
        }

        statusMsg.innerText = "Pinging Groq Llama-3 Servers...";

        // Issue request to FastAPI Backend
        const LIVE_BACKEND_URL = "https://truthlens-qex0.onrender.com/api/analyze";
        const response = await fetch(LIVE_BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                url: tab.url,
                text: extractedText
            })
        });

        if (!response.ok) {
             if (response.status === 429) throw new Error("Throttled! 5 requests per minute limit reached.");
             const errData = await response.json().catch(() => ({}));
             throw new Error(errData.detail || errData.error || "Backend server refused the connection.");
        }

        const data = await response.json();

        // Populate visually dynamic UI
        document.getElementById('score').innerText = Math.round(data.credibility_score);
        document.getElementById('domain-trust').innerText = `${Math.round(data.source_reliability)}/100`;
        document.getElementById('explanation').innerText = data.explanation;
        
        const verdictBadge = document.getElementById('verdict');
        verdictBadge.innerText = data.ai_verdict;
        
        if (data.risk_level === 'High') {
            document.getElementById('score').style.color = '#f38ba8'; 
            verdictBadge.style.background = 'rgba(243,139,168,0.15)';
            verdictBadge.style.color = '#f38ba8';
            verdictBadge.style.border = '1px solid rgba(243,139,168,0.3)';
        } else if (data.risk_level === 'Medium') {
            document.getElementById('score').style.color = '#f9e2af'; 
            verdictBadge.style.background = 'rgba(249,226,175,0.15)';
            verdictBadge.style.color = '#f9e2af';
            verdictBadge.style.border = '1px solid rgba(249,226,175,0.3)';
        } else {
            document.getElementById('score').style.color = '#a6e3a1'; 
            verdictBadge.style.background = 'rgba(166,227,161,0.15)';
            verdictBadge.style.color = '#a6e3a1';
            verdictBadge.style.border = '1px solid rgba(166,227,161,0.3)';
        }

        resultsCard.classList.remove('hidden');
        statusMsg.innerText = "Audit Completed Successfully.";
        
    } catch (error) {
        statusMsg.innerText = `Error: ${error.message}`;
        statusMsg.style.color = '#f38ba8';
    } finally {
        btn.disabled = false;
        btnText.innerText = "Audit Webpage Again";
        spinner.classList.add('hidden');
    }
});
