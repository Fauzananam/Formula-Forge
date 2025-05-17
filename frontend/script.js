document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('query-form');
  const queryInput = document.getElementById('query');
  const formulaOutput = document.getElementById('formula');
  const explanationOutput = document.getElementById('explanation');
  const templateList = document.getElementById('template-list');
  const outputSection = document.getElementById('output');
  let isSubmitting = false;

  // Initialize output section
  outputSection.classList.add('hidden');

  // Add loading state to button
  const addLoadingState = (button) => {
    const originalText = button.textContent;
    button.innerHTML = '<span class="loading"></span>';
    button.disabled = true;
    return () => {
      button.innerHTML = originalText;
      button.disabled = false;
    };
  };

  // Show toast notification
  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease-out forwards';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  // Animate text appearance
  const animateText = (element, text) => {
    element.style.opacity = '0';
    element.textContent = text;
    element.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => {
      element.style.opacity = '1';
    }, 10);
  };

  // Load and display templates with animation
  const loadTemplates = async () => {
    try {
      const response = await fetch('templates.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const templates = await response.json();
      
      templates.forEach((template, index) => {
        const li = document.createElement('li');
        li.textContent = template.title;
        li.style.opacity = '0';
        li.style.transform = 'translateY(20px)';
        li.style.transition = 'all 0.3s ease-out';
        
        li.addEventListener('click', () => {
          queryInput.value = template.query;
          queryInput.style.borderColor = '#4a90e2';
          queryInput.focus();
          setTimeout(() => {
            queryInput.style.borderColor = '#e0e0e0';
          }, 1000);
          // Don't auto-submit, let user review the query first
          outputSection.classList.add('hidden');
        });

        templateList.appendChild(li);
        
        // Stagger the animation of template items
        setTimeout(() => {
          li.style.opacity = '1';
          li.style.transform = 'translateY(0)';
        }, index * 100);
      });
    } catch (error) {
      console.error('Error loading templates:', error);
      showToast('Failed to load templates', 'error');
    }
  };

  // Handle form submission with enhanced UI feedback
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    
    isSubmitting = true;
    const submitButton = form.querySelector('button[type="submit"]');
    const resetLoading = addLoadingState(submitButton);

    try {
      const query = queryInput.value.trim();
      if (!query) {
        throw new Error('Please enter a query');
      }

      // Basic query validation - now supporting all formula types and Indonesian language
      // Check for column references in both English and Indonesian (kolom)
      if (!query.match(/\b(column|kolom) [A-Za-z]/i) && !query.match(/[A-Za-z]:[A-Za-z]/i)) {
        throw new Error('Please specify at least one column (e.g., "column A" or "kolom A")');
      }
      
      // No longer requiring specific function names or "where" clause
      // The backend can handle various query types including lookup, text functions, etc.

      const response = await fetch('/generate-formula', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.explanation || 'Failed to generate formula');
      }

      // Show output section if hidden
      outputSection.classList.remove('hidden');

      // Clear any previous error states
      formulaOutput.classList.remove('error');
      explanationOutput.classList.remove('error');

      // Animate the appearance of new content
      animateText(formulaOutput, data.formula);
      animateText(explanationOutput, data.explanation);
      
      showToast('Formula generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.message || 'Error generating formula';
      showToast(errorMessage, 'error');
      
      // Show output section for errors too
      outputSection.classList.remove('hidden');
      
      formulaOutput.classList.add('error');
      explanationOutput.classList.add('error');
      
      animateText(formulaOutput, 'Error: Unable to generate formula');
      animateText(explanationOutput, `${errorMessage}\n\nExample queries:\n- "Sum values in column A where column B equals Yes"\n- "Average values in column C where column D is greater than 100"\n- "Count cells in column E where column F equals Active"\n- "Jumlahkan nilai di kolom A di mana kolom B adalah Ya" (Indonesian)`);
    } finally {
      resetLoading();
      isSubmitting = false;
    }
  };

  form.addEventListener('submit', handleSubmit);

  // Add input animation
  queryInput.addEventListener('focus', () => {
    queryInput.style.transform = 'scale(1.01)';
    queryInput.style.transition = 'transform 0.2s ease-out';
  });

  queryInput.addEventListener('blur', () => {
    queryInput.style.transform = 'scale(1)';
  });

  // Copy to clipboard functionality
  document.getElementById('copy-formula').addEventListener('click', async () => {
    const formula = formulaOutput.textContent;
    if (formula) {
      try {
        await navigator.clipboard.writeText(formula);
        showToast('Formula copied to clipboard!');
      } catch (err) {
        showToast('Failed to copy formula', 'error');
      }
    }
  });

  // Enhance UI by moving copy button into better position
  const enhanceUI = () => {
    const copyButton = document.getElementById('copy-formula');
    const outputContainer = document.querySelector('#output .output-container');
    
    // Move copy button next to formula output for better UX
    if (copyButton && outputContainer) {
      // Create a wrapper for formula output and copy button
      const formulaWrapper = document.createElement('div');
      formulaWrapper.className = 'formula-wrapper';
      formulaWrapper.style.display = 'flex';
      formulaWrapper.style.alignItems = 'center';
      formulaWrapper.style.gap = '10px';
      formulaWrapper.style.marginBottom = '10px';
      
      // Move formula output into wrapper
      formulaOutput.parentNode.insertBefore(formulaWrapper, formulaOutput);
      formulaWrapper.appendChild(formulaOutput);
      
      // Move copy button into wrapper
      copyButton.style.padding = '5px 10px';
      copyButton.style.marginLeft = '10px';
      formulaWrapper.appendChild(copyButton);
    }
  };
  
  // Call the UI enhancement function
  enhanceUI();

  // Initialize templates
  loadTemplates();
});