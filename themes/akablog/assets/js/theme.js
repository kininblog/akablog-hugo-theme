// Theme toggle
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
const themeToggleButton = document.getElementById('theme-toggle');

// Function to set theme
function setTheme(isDark) {
  if (isDark) {
    document.documentElement.classList.add('dark');
    if (themeToggleDarkIcon) themeToggleDarkIcon.classList.remove('hidden');
    if (themeToggleLightIcon) themeToggleLightIcon.classList.add('hidden');
    localStorage.setItem('color-theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    if (themeToggleDarkIcon) themeToggleDarkIcon.classList.add('hidden');
    if (themeToggleLightIcon) themeToggleLightIcon.classList.remove('hidden');
    localStorage.setItem('color-theme', 'light');
  }
}

// Initial theme setup based on localStorage or prefers-color-scheme
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  setTheme(true);
} else {
  setTheme(false);
}

if (themeToggleButton) {
  themeToggleButton.addEventListener('click', function() {
    setTheme(!document.documentElement.classList.contains('dark'));
  });
}


// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const menuIconOpen = document.getElementById('menu-icon-open');
const menuIconClose = document.getElementById('menu-icon-close');

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener('click', () => {
    const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
    mobileMenuButton.setAttribute('aria-expanded', String(!isExpanded)); // Ensure attribute is string
    mobileMenu.classList.toggle('hidden');
    // mobileMenu.classList.toggle('block'); // 'block' is default for non-hidden, Tailwind handles this.

    // Toggle icons based on the new state
    if (!isExpanded) { // If menu was closed, now it's open
        if(menuIconOpen) menuIconOpen.style.display = 'none';
        if(menuIconClose) menuIconClose.style.display = 'block';
    } else { // If menu was open, now it's closed
        if(menuIconOpen) menuIconOpen.style.display = 'block';
        if(menuIconClose) menuIconClose.style.display = 'none';
        // Close all open mobile submenus when main mobile menu is closed
        document.querySelectorAll('[data-mobile-dropdown-toggle][aria-expanded="true"]').forEach(openSubmenuButton => {
            openSubmenuButton.click(); // Simulate click to close it
        });
    }
  });
}

// Initialize mobile menu icon state correctly on load
if (mobileMenuButton && menuIconOpen && menuIconClose) {
    const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
        menuIconOpen.style.display = 'none';
        menuIconClose.style.display = 'block';
    } else {
        menuIconOpen.style.display = 'block';
        menuIconClose.style.display = 'none';
    }
}

// Mobile Dropdown Toggle
document.querySelectorAll('[data-mobile-dropdown-toggle]').forEach(button => {
  const submenuId = button.getAttribute('aria-controls');
  const submenu = document.getElementById(submenuId);
  const icon = button.querySelector('svg');

  if (submenu) {
    button.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent click from bubbling up to parent menu toggles if any
      const isCurrentlyExpanded = button.getAttribute('aria-expanded') === 'true';
      
      submenu.classList.toggle('hidden');
      button.setAttribute('aria-expanded', String(!isCurrentlyExpanded));
      
      if (icon) {
        icon.classList.toggle('rotate-180', !isCurrentlyExpanded);
      }
    });
  }
});


// Lazy Load Disqus Comments
document.addEventListener('DOMContentLoaded', () => {
  const disqusWrapper = document.getElementById('disqus-comments-wrapper');
  const loadButton = document.getElementById('load-disqus-comments-button');
  const disqusThreadContainer = document.getElementById('disqus_thread_container');

  if (disqusWrapper && loadButton && disqusThreadContainer) {
    const disqusShortname = disqusWrapper.dataset.disqusShortname;
    const disqusUrl = disqusWrapper.dataset.disqusUrl;
    const disqusIdentifier = disqusWrapper.dataset.disqusIdentifier;
    const disqusTitle = disqusWrapper.dataset.disqusTitle;

    if (!disqusShortname || disqusShortname === "your_disqus_shortname_here") {
      // Don't initialize if shortname is missing or is the placeholder
      if (loadButton) loadButton.style.display = 'none'; // Hide button if no shortname
      console.warn("Disqus shortname not configured. Comments will not load.");
      return;
    }
    
    loadButton.addEventListener('click', function() {
      // Set Disqus configuration variables
      window.disqus_config = function () {
        this.page.url = disqusUrl;
        this.page.identifier = disqusIdentifier;
        this.page.title = disqusTitle;
      };

      // Dynamically load the Disqus script
      const d = document;
      const s = d.createElement('script');
      s.src = `https://${disqusShortname}.disqus.com/embed.js`;
      s.setAttribute('data-timestamp', String(+new Date()));
      (d.head || d.body).appendChild(s);

      // Hide the button and show the Disqus thread container
      loadButton.style.display = 'none';
      disqusThreadContainer.classList.remove('hidden');
    });
  }
});
