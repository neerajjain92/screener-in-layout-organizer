// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'updateCSS') {
    applyChanges(message.columns, message.width);
  }
});

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings and apply changes
  loadSettingsAndApply();
});

// Also try to apply changes when the page is loaded
window.addEventListener('load', function() {
  // Load saved settings and apply changes
  loadSettingsAndApply();
});

// Function to load settings and apply changes
function loadSettingsAndApply() {
  chrome.storage.sync.get(['columns', 'width'], function(result) {
    const columns = result.columns || 4; // Default to 4 columns
    const width = result.width || 12;    // Default to 12%
    
    // Apply the CSS changes
    applyChanges(columns, width);
    
    // Also try a few times with delays to ensure elements are loaded
    setTimeout(() => applyChanges(columns, width), 500);
    setTimeout(() => applyChanges(columns, width), 1000);
    setTimeout(() => applyChanges(columns, width), 2000);
  });
}

// Function to apply the CSS changes
function applyChanges(columns, width) {
  // Create the grid template columns value (e.g., "1fr 1fr 1fr 1fr")
  const gridTemplateValue = Array(parseInt(columns)).fill('1fr').join(' ');
  
  // Modify the grid template columns
  const topRatios = document.querySelector('#top-ratios');
  if (topRatios) {
    topRatios.style.gridTemplateColumns = gridTemplateValue;
    // console.log(`Modified #top-ratios grid template columns to: ${gridTemplateValue}`);
    
    // Fix the alternating row colors
    fixAlternatingRowColors(columns);
  }
  
  // Modify the company profile width
  const companyProfile = document.getElementsByClassName('company-profile')[0];
  if (companyProfile) {
    companyProfile.style.width = `${width}%`;
    // console.log(`Modified company-profile width to: ${width}%`);
  }
}

// Function to fix alternating row colors
function fixAlternatingRowColors(columns) {
  // Get all cells in the grid
  const cells = document.querySelectorAll('#top-ratios li');
  
  if (cells.length > 0) {
    // Create a style element if it doesn't exist
    let styleElement = document.getElementById('screener-layout-modifier-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'screener-layout-modifier-styles';
      document.head.appendChild(styleElement);
    }
    
    // Clear any existing styles
    styleElement.textContent = '';
    
    // Calculate how many items are in each row based on the number of columns
    const itemsPerRow = parseInt(columns);
    
    // Create CSS to ensure alternating rows maintain their background color
    let css = '';
    
    // Process each cell
    cells.forEach((cell, index) => {
      // Calculate which row this cell belongs to (0-based)
      const rowIndex = Math.floor(index / itemsPerRow);
      
      // Check if this is an even row (1, 3, 5, etc.)
      const isEvenRow = rowIndex % 2 === 1;
      
      // Remove any previously added classes
      cell.classList.remove('screener-even-row', 'screener-odd-row');
      
      if (isEvenRow) {
        // Add a custom class to cells in even rows
        cell.classList.add('screener-even-row');
        
        // Add CSS for this specific cell
        css += `#top-ratios li:nth-child(${index + 1}) { background-color: var(--stripes) !important; }\n`;
      } else {
        // Add a custom class to cells in odd rows
        cell.classList.add('screener-odd-row');
        
        // Ensure cells in odd rows have transparent background
        css += `#top-ratios li:nth-child(${index + 1}) { background-color: transparent !important; }\n`;
      }
    });
    
    // Update the style element
    styleElement.textContent = css;
    // console.log('Applied fixed alternating row colors based on row position');
  }
}
