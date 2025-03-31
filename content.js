// Function to fix the layout
function fixScreenerLayout() {
  // Wait for elements to be available
  const checkElements = setInterval(() => {
    const companyProfile = document.querySelector('.company-profile');
    const topRatios = document.querySelector('#top-ratios');
    
    if (companyProfile && topRatios) {
      clearInterval(checkElements);
      
      // Fix the layout
      companyProfile.style.width = '100%';
      topRatios.style.gridTemplateColumns = '1fr 1fr 1fr 1fr';
      
      // Additional fixes for the container
      const ratiosContainer = document.querySelector('.company-ratios');
      if (ratiosContainer) {
        ratiosContainer.style.maxWidth = 'none';
        ratiosContainer.style.width = '100%';
      }
      
      // Fix the company info section without breaking layout
      const companyInfo = document.querySelector('.company-info');
      if (companyInfo) {
        // Instead of changing display to block, adjust the flex properties
        companyInfo.style.flexWrap = 'nowrap';
        companyInfo.style.justifyContent = 'space-between';
      }
      
      console.log('Screener.in layout fixed by extension');
    }
  }, 500);
}

// Run the fix when page loads
document.addEventListener('DOMContentLoaded', fixScreenerLayout);

// Also run when content is loaded (for faster pages)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  fixScreenerLayout();
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "applyFixes") {
    fixScreenerLayout();
  }
});

// Also run when URL changes (for SPA navigation)
let lastUrl = location.href; 
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    fixScreenerLayout();
  }
}).observe(document, {subtree: true, childList: true});
