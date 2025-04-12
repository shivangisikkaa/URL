async function shortenUrl() {
    const urlInput = document.getElementById('urlInput');
    const resultDiv = document.getElementById('result');
    const url = urlInput.value.trim();

    if (!url) {
        showError('Please enter a URL');
        return;
    }

    try {
        // Show loading state
        resultDiv.innerHTML = 'Processing...';
        resultDiv.classList.add('show');

        const response = await fetch('/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        // Check if response is ok before trying to parse JSON
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Try to parse the JSON response
        let data;
        try {
            data = await response.json();
        } catch (e) {
            throw new Error('Invalid response from server');
        }

        if (data.success && data.shortUrl) {
            const shortUrl = `${window.location.origin}/${data.shortUrl}`;
            resultDiv.innerHTML = `
                <p>Shortened URL: <a href="${shortUrl}" target="_blank">${shortUrl}</a></p>
                <button onclick="copyToClipboard('${shortUrl}')">Copy URL</button>
            `;
        } else {
            throw new Error(data.error || 'Failed to shorten URL');
        }
    } catch (error) {
        showError(error.message);
    }
}

function showError(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<p style="color: red;">Error: ${message}</p>`;
    resultDiv.classList.add('show');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            alert('URL copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy URL:', err);
            alert('Failed to copy URL to clipboard');
        });
} 