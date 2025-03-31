// Initialize the popup
document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  const columnsSlider = document.getElementById('columns-slider');
  const columnsValue = document.getElementById('columns-value');
  const widthSlider = document.getElementById('width-slider');
  const widthValue = document.getElementById('width-value');
  const statusElement = document.getElementById('status');
  const gridPreview = document.getElementById('grid-preview');
  
  // Load saved values from storage
  chrome.storage.sync.get(['columns', 'width'], function(result) {
    if (result.columns) {
      columnsSlider.value = result.columns;
      columnsValue.textContent = result.columns;
      updateGridPreview(result.columns);
    } else {
      updateGridPreview(4); // Default value
    }
    
    if (result.width) {
      widthSlider.value = result.width;
      widthValue.textContent = result.width;
    }
  });
  
  // Update display and apply changes when sliders change
  columnsSlider.addEventListener('input', function() {
    const columns = this.value;
    columnsValue.textContent = columns;
    updateGridPreview(columns);
    applyChanges(columns, widthSlider.value);
  });
  
  widthSlider.addEventListener('input', function() {
    const width = this.value;
    widthValue.textContent = width;
    applyChanges(columnsSlider.value, width);
  });
  
  // Function to apply changes
  function applyChanges(columns, width) {
    // Save values to storage
    chrome.storage.sync.set({
      columns: columns,
      width: width
    });
    
    // Send message to content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'updateCSS',
        columns: columns,
        width: width
      });
    });
    
    // Show feedback
    statusElement.textContent = 'Changes applied';
    setTimeout(() => {
      statusElement.textContent = '';
    }, 1000);
  }
  
  // Function to update grid preview
  function updateGridPreview(columns) {
    // Set up the grid container
    gridPreview.style.display = 'grid';
    gridPreview.style.gridTemplateColumns = `${'1fr '.repeat(columns).trim()}`;
    gridPreview.style.height = '20px';
    gridPreview.style.gap = '2px';
    gridPreview.style.marginTop = '5px';
    
    // Clear previous preview
    gridPreview.innerHTML = '';
    
    // Create cells
    for (let i = 0; i < columns; i++) {
      const cell = document.createElement('div');
      cell.style.backgroundColor = '#4285f4';
      cell.style.height = '100%';
      gridPreview.appendChild(cell);
    }
  }
});
