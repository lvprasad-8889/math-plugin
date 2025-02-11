// adding katex cdns to existing or opened tiny mce
const startCDN = async () => {
  const katexStyling = document.createElement("link");
  katexStyling.rel = "stylesheet";
  katexStyling.href =
    "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.css";
  katexStyling.integrity =
    "sha384-NFTC4wvyQKLwuJ8Ez9AvPNBv8zcC2XaQzXSMvtORKw28BdJbB2QE8Ka+OyrIHcQJ";
  katexStyling.crossOrigin = "anonymous";

  const katexFunctionality = document.createElement("script");
  katexFunctionality.src =
    "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.js";
  katexFunctionality.integrity =
    "sha384-z9arB7KJHppq8kK9AESncXcQd/KXIMMPiCrAdxfFpp+5QU438lgBE7UFGbk+gljP";
  katexFunctionality.crossOrigin = "anonymous";

  let iframe = document.querySelector(
    'iframe[id^="tinyMceEditor_"][id$="_ifr"]'
  );
  let innerDoc;
  if (iframe) {
    innerDoc = iframe.contentDocument || iframe.contentWindow.document;
  }
  if (innerDoc && innerDoc.head) {
    await innerDoc.head.appendChild(katexStyling);
    await innerDoc.head.appendChild(katexFunctionality);
  }
};

export default startCDN;
