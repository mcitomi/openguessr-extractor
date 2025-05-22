document.addEventListener("DOMContentLoaded", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url.includes("openguessr.com")) {
        document.getElementById("content").innerHTML = `<p class="text-center text-warning">This plugin only works with OpenGuessr.com</p>`;
        return;
    }

    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
    });

    chrome.tabs.sendMessage(tab.id, { type: "GET_PAGE_INFO" }, (response) => {
        if (chrome.runtime.lastError) {
            document.getElementById("title").textContent = "Err: " + chrome.runtime.lastError.message;
            return;
        }

        const [latStr, lonStr] = response.location.split(",");

        const lat = parseFloat(latStr.trim());
        const lon = parseFloat(lonStr.trim());

        const delta = 0.01;

        const bbox = [
            lon - delta, // min lon
            lat - delta, // min lat
            lon + delta, // max lon
            lat + delta  // max lat
        ].join(',');
        // https://www.openstreetmap.org/export/embed.html?bbox=19.973311,47.681954,19.993311,47.701954&layer=mapnik&marker=47.691954,19.983311

        document.getElementById("mapFrame").src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;

        document.getElementById("gMaps").href = `https://maps.google.com/?q=${lat},${lon}`;
        document.getElementById("oMaps").href = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
    });
});
