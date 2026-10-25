/* ==========================================================================
   PURANDAR MEDICAL (पुरंदर मेडिकल) - APP.JS
   Interactive functionality matching Google Maps metadata
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. REAL-TIME STORE OPEN / CLOSED CHECKER
  // Mon-Sat: 10:00 am - 10:30 pm (10:00 - 22:30)
  // Sunday: 11:30 am - 10:30 pm (11:30 - 22:30)
  // ==========================================
  function updateStoreStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMin;

    let openTimeInMinutes;
    const closeTimeInMinutes = 22 * 60 + 30; // 10:30 PM = 1350 mins

    if (day === 0) {
      // Sunday opens at 11:30 AM
      openTimeInMinutes = 11 * 60 + 30; // 690 mins
    } else {
      // Monday to Saturday opens at 10:00 AM
      openTimeInMinutes = 10 * 60; // 600 mins
    }

    const isOpen = (currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes);

    const statusBox = document.getElementById('statusBox');
    const statusText = document.getElementById('statusText');
    const hoursSummary = document.getElementById('hoursSummary');
    const headerLiveStatus = document.getElementById('headerLiveStatus');
    const locationLiveBadge = document.getElementById('locationLiveBadge');

    const openTimeStr = day === 0 ? "11:30 AM" : "10:00 AM";

    if (isOpen) {
      if (statusBox) {
        statusBox.className = 'status-indicator-box open';
        statusText.textContent = 'Open Now';
      }
      if (hoursSummary) {
        hoursSummary.textContent = `Closes at 10:30 PM • Open today from ${openTimeStr}`;
      }
      if (headerLiveStatus) {
        headerLiveStatus.className = 'live-status-pill open';
        headerLiveStatus.innerHTML = '<i class="fa-solid fa-circle"></i> Open Now (till 10:30 PM)';
      }
      if (locationLiveBadge) {
        locationLiveBadge.className = 'open-badge-live';
        locationLiveBadge.innerHTML = '<i class="fa-solid fa-circle"></i> Open Now';
      }
    } else {
      if (statusBox) {
        statusBox.className = 'status-indicator-box closed';
        statusText.textContent = 'Closed Now';
      }
      if (hoursSummary) {
        hoursSummary.textContent = `Opens at ${openTimeStr} • Closes 10:30 PM`;
      }
      if (headerLiveStatus) {
        headerLiveStatus.className = 'live-status-pill closed';
        headerLiveStatus.innerHTML = `<i class="fa-solid fa-circle"></i> Closed • Opens at ${openTimeStr}`;
      }
      if (locationLiveBadge) {
        locationLiveBadge.className = 'open-badge-live';
        locationLiveBadge.style.color = 'var(--gm-red)';
        locationLiveBadge.style.background = 'var(--gm-red-light)';
        locationLiveBadge.innerHTML = `<i class="fa-solid fa-circle"></i> Closed • Opens ${openTimeStr}`;
      }
    }

    // Highlight current day in hours table
    const rows = document.querySelectorAll('.hours-row');
    rows.forEach(r => {
      if (parseInt(r.getAttribute('data-day'), 10) === day) {
        r.classList.add('active-day');
      } else {
        r.classList.remove('active-day');
      }
    });
  }

  updateStoreStatus();
  setInterval(updateStoreStatus, 60000); // Re-check every minute

  // ==========================================
  // 2. TOGGLE HOURS DROPDOWN
  // ==========================================
  const toggleHoursBtn = document.getElementById('toggleHoursBtn');
  const hoursDropdown = document.getElementById('hoursDropdown');

  if (toggleHoursBtn && hoursDropdown) {
    toggleHoursBtn.addEventListener('click', () => {
      const isExpanded = hoursDropdown.classList.toggle('show');
      toggleHoursBtn.innerHTML = isExpanded 
        ? 'Hide hours <i class="fa-solid fa-chevron-up"></i>'
        : 'See all hours <i class="fa-solid fa-chevron-down"></i>';
    });
  }

  // ==========================================
  // 3. MEDIA SHOWCASE TABS
  // ==========================================
  const mediaTabBtns = document.querySelectorAll('.media-tab-btn');
  const tabPanes = {
    photo: document.getElementById('tab-photo'),
    streetview: document.getElementById('tab-streetview'),
    mapview: document.getElementById('tab-mapview')
  };

  mediaTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      mediaTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      Object.keys(tabPanes).forEach(k => {
        if (tabPanes[k]) {
          tabPanes[k].classList.remove('active');
        }
      });
      if (tabPanes[targetTab]) {
        tabPanes[targetTab].classList.add('active');
      }
    });
  });

  // ==========================================
  // 4. COPY ADDRESS & SHARE
  // ==========================================
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  const shareBtn = document.getElementById('shareBtn');
  const fullAddressText = "Purandar Medical (पुरंदर मेडिकल), Shop Number 2, Arjun Building, Saswad Kondhwa Road, Kondhwa Budruk, near Angraj Hotel, Pune, Maharashtra 411048. Ph: +91 97669 87073";

  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(fullAddressText).then(() => {
        showToast("Address copied to clipboard!");
      }).catch(() => {
        showToast("Address copied!");
      });
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: "Purandar Medical (पुरंदर मेडिकल) - Kondhwa, Pune",
          text: "Purandar Medical - Pharmacy, Human Medicines & Pet Vaccines in Kondhwa Budruk, Pune.",
          url: "https://maps.app.goo.gl/FESLDRx5v4U1YFBQ8"
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText("https://maps.app.goo.gl/FESLDRx5v4U1YFBQ8").then(() => {
          showToast("Google Maps link copied to clipboard!");
        });
      }
    });
  }

  // ==========================================
  // 5. FAQ ACCORDION
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
  }

  // ==========================================
  // 6. MOBILE NAVIGATION TOGGLE
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (mainNav.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  // ==========================================
  // 7. TOAST NOTIFICATION HELPER
  // ==========================================
  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (toast && toastMsg) {
      toastMsg.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3200);
    }
  }

});
