chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_PAGE_INFO") {
    const coordsIncludedDiv = document.getElementById("PanoramaIframe");

    const mapEmbedUrl = new URL(coordsIncludedDiv.attributes.src.nodeValue);

    const location = mapEmbedUrl.searchParams.get("location");
    
    sendResponse({
      location
    });
  }
  return true;
});
console.log("OpenGuessr Extractor script executed");
