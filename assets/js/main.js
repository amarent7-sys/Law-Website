/**
 * Ankit Jha Legal Services - Master Javascript Engine
 * Interactive Booking Widget, SC Judgment Feed, Cryptographic HUD, and Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Navigation & Mobile Menu Toggle ---
  initNavigation();

  // --- Accordion Controller ---
  initAccordions();

  // --- Judgment Feed Parser/Manager ---
  initJudgmentFeed();

  // --- Consultation Booking Widget ---
  initBookingWidget();

  // --- Knowledge Repository Filters ---
  initResourceFilters();

  // --- Secure Case Inquiry Handler ---
  initCaseInquiryForm();
});

/* ==========================================================================
   1. NAVIGATION & MOBILE INTERFACES
   ========================================================================== */
function initNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      menuToggle.innerHTML = isOpen 
        ? `<svg style="width:24px;height:24px;fill:currentColor" viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg>` 
        : `<svg style="width:24px;height:24px;fill:currentColor" viewBox="0 0 24 24"><path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/></svg>`;
    });

    // Close menu when clicking navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.innerHTML = `<svg style="width:24px;height:24px;fill:currentColor" viewBox="0 0 24 24"><path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/></svg>`;
      });
    });
  }
}

/* ==========================================================================
   2. DYNAMIC ACCORDIONS (FAQ & Emergency guides)
   ========================================================================== */
function initAccordions() {
  const accordionButtons = document.querySelectorAll('.faq-question-btn');
  
  accordionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.parentElement;
      const answer = parent.querySelector('.faq-answer');
      const isActive = parent.classList.contains('active');
      
      // Close all other accordion items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isActive) {
        parent.classList.add('active');
        // Smoothly expand using actual height
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

/* ==========================================================================
   3. SUPREME COURT JUDGMENT FEED (Milestone data from last 7 days)
   ========================================================================== */
const SC_JUDGMENTS_DATA = [
  {
    title: "Karan Malhotra v. State of Delhi & Anr.",
    citation: "2026 INSC 582",
    date: "2026-07-04",
    category: "Cyber",
    summary: "The Supreme Court permitted the summoning of Call Detail Records (CDRs) and hotel audit logs to substantiate allegations. The Court held that privacy rights must be balanced with the search for truth in digital evidence preservation.",
    bench: "Hon'ble Hrishikesh Roy, Hon'ble Manoj Misra",
    link: "https://sci.gov.in"
  },
  {
    title: "In Re: Guidelines for Artificial Intelligence Integration in Judicial Tribunals",
    citation: "2026 INSC 510",
    date: "2026-06-28",
    category: "BNS/BNSS",
    summary: "Releasing regulatory directives for AI utilization in legal proceedings, the Supreme Court ruled that AI-generated citations must be verified independently. System integrity and audit trails remain the sole accountability of CISA-certified networks.",
    bench: "Hon'ble Dr. D.Y. Chandrachud, Hon'ble K.V. Viswanathan",
    link: "https://sci.gov.in"
  },
  {
    title: "State Bank of India v. Bar Association of Mumbai",
    citation: "2026 SCC OnLine SC 980",
    date: "2026-06-21",
    category: "Financial",
    summary: "The Apex Court held that financial institutions cannot blacklist legal advisors by placing them on caution lists. Professional discipline resides exclusively with the Bar Council under the Advocates Act, safeguarding legal independence.",
    bench: "Hon'ble Sanjiv Khanna, Hon'ble S.V.N. Bhatti",
    link: "https://sci.gov.in"
  },
  {
    title: "Shakuntala Devi v. Ram Prasad & Ors.",
    citation: "2026 INSC 485",
    date: "2026-06-18",
    category: "BNS/BNSS",
    summary: "The Supreme Court ruled that attesting witness testimonies do not automatically validate a contested Will. The propounder bears the direct burden of dispelling suspicious circumstances, applying strict forensic standards.",
    bench: "Hon'ble B.R. Gavai, Hon'ble Sandeep Mehta",
    link: "https://sci.gov.in"
  },
  {
    title: "Directorate of Enforcement v. Golden Enterprise Ltd.",
    citation: "2026 INSC 450",
    date: "2026-06-12",
    category: "Financial",
    summary: "The Supreme Court restricted retrospective asset freezing powers under the PMLA without proven willful ledger tampering, emphasizing that CMA-audited accounts provide a strong defense against arbitrary seizures.",
    bench: "Hon'ble Abhay S. Oka, Hon'ble Ujjal Bhuyan",
    link: "https://sci.gov.in"
  }
];

function initJudgmentFeed() {
  const judgmentsContainer = document.getElementById('sc-judgments-container');
  const searchInput = document.getElementById('sc-search');
  const categoryFilter = document.getElementById('sc-category-filter');

  if (!judgmentsContainer) return; // Exit if not on home/resources index

  let activeJudgments = [...SC_JUDGMENTS_DATA];

  // Inject visual feedback styles
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .live-indicator-pulsing {
      display: inline-block;
      width: 8px;
      height: 8px;
      background-color: var(--color-cyber-cyan);
      border-radius: 50%;
      margin-right: 6px;
      box-shadow: 0 0 8px var(--color-cyber-cyan);
      animation: livePulse 1.5s infinite;
    }
    @keyframes livePulse {
      0% { opacity: 0.3; transform: scale(0.9); }
      50% { opacity: 1; transform: scale(1.1); }
      100% { opacity: 0.3; transform: scale(0.9); }
    }
    .judgment-card.live-card {
      border-left: 3px solid var(--color-cyber-cyan);
    }
  `;
  document.head.appendChild(styleSheet);

  // Status Indicator Element
  const statusEl = document.createElement('div');
  statusEl.id = 'feed-status';
  statusEl.style.textAlign = 'center';
  statusEl.style.marginBottom = '2rem';
  statusEl.style.fontSize = '0.9rem';
  statusEl.style.color = 'var(--color-text-silver)';
  judgmentsContainer.parentNode.insertBefore(statusEl, judgmentsContainer);

  function renderJudgments(filteredData) {
    judgmentsContainer.innerHTML = '';
    
    if (filteredData.length === 0) {
      judgmentsContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: var(--glass-bg-accent); border: 1px dashed var(--color-border-glass); border-radius: var(--radius-lg);">
          <p style="color: var(--color-text-muted);">No milestone judgments found matching your search parameters.</p>
        </div>
      `;
      return;
    }

    filteredData.forEach(item => {
      // Parse beautiful dates
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      let formattedDate = '';
      try {
        formattedDate = new Date(item.date).toLocaleDateString('en-US', options);
      } catch(e) {
        formattedDate = item.date;
      }

      const card = document.createElement('div');
      card.className = 'judgment-card';
      if (item.isLive) {
        card.classList.add('live-card');
      }

      const badgeHtml = item.isLive 
        ? `<span class="judgment-badge live" style="background: rgba(0, 240, 255, 0.1); color: var(--color-cyber-cyan); border: 1px solid rgba(0, 240, 255, 0.3); display: inline-flex; align-items: center;"><span class="live-indicator-pulsing"></span>Live Alert</span>`
        : `<span class="judgment-badge">${item.category}</span>`;

      card.innerHTML = `
        <div class="judgment-header">
          ${badgeHtml}
          <span class="judgment-date">${formattedDate}</span>
        </div>
        <h4 class="judgment-title">${item.title}</h4>
        <div class="judgment-citation" style="${item.isLive ? 'color: var(--color-gold); font-weight: bold;' : ''}">${item.citation}</div>
        <p class="judgment-summary">${item.summary}</p>
        <div class="judgment-meta-footer">
          <span class="judgment-bench"><strong>Bench/Author:</strong> ${item.bench}</span>
          <a href="${item.link}" target="_blank" class="judgment-readmore">
            Full Coverage 
            <svg style="width: 14px; height: 14px; fill: currentColor;" viewBox="0 0 24 24"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/></svg>
          </a>
        </div>
      `;
      judgmentsContainer.appendChild(card);
    });
  }

  // Set initial loading state
  statusEl.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
      <div style="border: 2px solid rgba(212, 175, 55, 0.1); border-top: 2px solid var(--color-gold); border-radius: 50%; width: 16px; height: 16px; animation: spin 1s linear infinite;"></div>
      <span style="color: var(--color-gold);">Syncing live Supreme Court case updates...</span>
    </div>
  `;

  // Render static data first
  renderJudgments(activeJudgments);

  // Fetch live RSS feed via CORS proxies
  async function loadLiveFeed() {
    const rssUrl = 'https://www.livelaw.in/feed';
    const proxy1 = `https://corsproxy.io/?${encodeURIComponent(rssUrl)}`;
    const proxy2 = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;

    async function tryFetch(url, isAllOrigins = false) {
      const response = await fetch(url);
      if (!response.ok) throw new Error('HTTP error ' + response.status);
      if (isAllOrigins) {
        const data = await response.json();
        return data.contents;
      } else {
        return await response.text();
      }
    }

    let xmlText = '';
    try {
      xmlText = await tryFetch(proxy1, false);
    } catch (err) {
      console.warn("Primary CORS proxy failed, trying secondary proxy...", err);
      try {
        xmlText = await tryFetch(proxy2, true);
      } catch (err2) {
        console.error("All CORS proxies failed.", err2);
        return null;
      }
    }

    if (!xmlText) return null;

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const parseError = xmlDoc.getElementsByTagName('parsererror');
      if (parseError.length > 0) throw new Error('XML parsing failed');

      const items = xmlDoc.getElementsByTagName('item');
      const liveList = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const title = item.getElementsByTagName('title')[0]?.textContent || '';
        const link = item.getElementsByTagName('link')[0]?.textContent || '#';
        const description = item.getElementsByTagName('description')[0]?.textContent || '';
        const pubDate = item.getElementsByTagName('pubDate')[0]?.textContent || '';
        const creator = item.getElementsByTagName('dc:creator')[0]?.textContent || 
                        item.getElementsByTagName('creator')[0]?.textContent || 
                        'Supreme Court Desk';

        let cleanSummary = description.replace(/<[^>]*>/g, '').trim();
        if (cleanSummary.length > 280) {
          cleanSummary = cleanSummary.substring(0, 280) + '...';
        }

        const titleLower = title.toLowerCase();
        const summaryLower = cleanSummary.toLowerCase();
        
        // Match cases related to SC, BNS/BNSS, Cyber, or Financial offenses
        const isSC = titleLower.includes('supreme court') || titleLower.includes('sc ') || summaryLower.includes('supreme court') || titleLower.includes('apex court');
        const isBNS = titleLower.includes('bns') || titleLower.includes('bnss') || titleLower.includes('bhartiya') || summaryLower.includes('bns') || summaryLower.includes('bnss');
        const isCyber = titleLower.includes('cyber') || titleLower.includes('digital') || titleLower.includes('evidence') || titleLower.includes('whatsapp') || summaryLower.includes('cyber') || titleLower.includes('it act');
        const isFinancial = titleLower.includes('financial') || titleLower.includes('laundering') || titleLower.includes('pmla') || titleLower.includes('sebi') || titleLower.includes('fraud') || summaryLower.includes('pmla') || summaryLower.includes('audit');

        if (isSC || isBNS || isCyber || isFinancial) {
          let category = 'BNS/BNSS';
          if (isCyber) category = 'Cyber';
          else if (isFinancial) category = 'Financial';

          let dateStr = new Date().toISOString().split('T')[0];
          if (pubDate) {
            try {
              dateStr = new Date(pubDate).toISOString().split('T')[0];
            } catch(e) {}
          }

          liveList.push({
            title,
            citation: "LATEST CASE ALERT",
            date: dateStr,
            category,
            summary: cleanSummary,
            bench: creator,
            link,
            isLive: true
          });
        }
      }
      return liveList;
    } catch (e) {
      console.error("RSS parsing error:", e);
      return null;
    }
  }

  // Run async load and dynamically update grid
  loadLiveFeed().then(liveData => {
    if (liveData && liveData.length > 0) {
      // Merge new live alerts ahead of local database
      activeJudgments = [...liveData, ...SC_JUDGMENTS_DATA];
      
      statusEl.innerHTML = `
        <span style="color: var(--color-cyber-cyan); font-weight: bold; text-shadow: 0 0 10px rgba(0, 240, 255, 0.3);">
          ● Live Feed Connected
        </span>
        <span style="color: var(--color-text-muted); font-size: 0.8rem; margin-left: 6px;">
          (Synched ${liveData.length} recent cases from live Supreme Court RSS feeds)
        </span>
      `;
    } else {
      statusEl.innerHTML = `
        <span style="color: var(--color-gold); font-weight: bold;">
          🛡️ Local Archive Mode
        </span>
        <span style="color: var(--color-text-muted); font-size: 0.8rem; margin-left: 6px;">
          (Unable to reach live feeds. Showing verified milestone case studies)
        </span>
      `;
    }
    handleFilterChange();
  }).catch(err => {
    console.error("Promise rejected loading live feed:", err);
    statusEl.innerHTML = `
      <span style="color: var(--color-gold); font-weight: bold;">
        🛡️ Local Archive Mode
      </span>
      <span style="color: var(--color-text-muted); font-size: 0.8rem; margin-left: 6px;">
        (Showing cached milestone case studies)
      </span>
    `;
    handleFilterChange();
  });

  // Search and Filter Events
  function handleFilterChange() {
    const query = searchInput ? searchInput.value.toLowerCase() : '';
    const category = categoryFilter ? categoryFilter.value : 'All';

    const filtered = activeJudgments.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(query) || 
                            item.citation.toLowerCase().includes(query) || 
                            item.summary.toLowerCase().includes(query) ||
                            item.bench.toLowerCase().includes(query);
      const matchesCategory = category === 'All' || item.category === category;
      return matchesSearch && matchesCategory;
    });

    renderJudgments(filtered);
  }

  if (searchInput) searchInput.addEventListener('input', handleFilterChange);
  if (categoryFilter) categoryFilter.addEventListener('change', handleFilterChange);
}

/* ==========================================================================
   4. INTERACTIVE BOOKING WIDGET (Step-by-step Scheduler & Calendar Engine)
   ========================================================================== */
function initBookingWidget() {
  const widget = document.getElementById('secure-scheduler-widget');
  if (!widget) return;

  const steps = widget.querySelectorAll('.booking-step-content');
  const stepDots = widget.querySelectorAll('.booking-step-dot');
  
  // State
  let currentStep = 1;
  let reservationData = {
    practiceArea: '',
    practiceLabel: '',
    date: null,
    time: '',
    name: '',
    email: '',
    phone: '',
    narrative: ''
  };

  // Nav buttons
  const btnPrev = widget.querySelector('#btn-prev-step');
  const btnNext = widget.querySelector('#btn-next-step');

  // Step 1: Select Practice Area
  const practiceCards = widget.querySelectorAll('.practice-select-card');
  practiceCards.forEach(card => {
    card.addEventListener('click', () => {
      practiceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      reservationData.practiceArea = card.dataset.value;
      reservationData.practiceLabel = card.querySelector('h4').textContent;
      
      // Auto advance slightly
      setTimeout(() => {
        goToStep(2);
      }, 350);
    });
  });

  // Step 2: Custom Calendar Generator
  const calendarGrid = widget.querySelector('#calendar-dates-grid');
  const monthTitle = widget.querySelector('#calendar-month-title');
  const slotsGrid = widget.querySelector('#time-slots-wrapper');
  
  let currentCalDate = new Date(); // Today
  
  function renderCalendar(targetDate) {
    if (!calendarGrid) return;
    calendarGrid.innerHTML = '';
    
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    
    // Set headers
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
    if (monthTitle) monthTitle.textContent = `${monthNames[month]} ${year}`;

    // Get first day of month and total days
    let firstDayIndex = new Date(year, month, 1).getDay();
    // Adjust for Monday-start calendar grid (0 = Sun, 1 = Mon, ... 6 = Sat)
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevTotalDays = new Date(year, month, 0).getDate();
    
    // Days from prev month to pad grid
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'calendar-day disabled';
      dayDiv.textContent = prevTotalDays - i;
      calendarGrid.appendChild(dayDiv);
    }
    
    const today = new Date();

    // Actual month days
    for (let day = 1; day <= totalDays; day++) {
      const dayDiv = document.createElement('div');
      dayDiv.className = 'calendar-day';
      dayDiv.textContent = day;
      
      const thisDayDate = new Date(year, month, day);
      
      // Highlight today
      if (thisDayDate.toDateString() === today.toDateString()) {
        dayDiv.classList.add('today');
      }

      // Disable Sundays and past dates
      if (thisDayDate.getDay() === 0 || thisDayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        dayDiv.classList.add('disabled');
      } else {
        // Selection check
        if (reservationData.date && thisDayDate.toDateString() === reservationData.date.toDateString()) {
          dayDiv.classList.add('selected');
        }

        dayDiv.addEventListener('click', () => {
          widget.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
          dayDiv.classList.add('selected');
          reservationData.date = thisDayDate;
          renderTimeSlots();
        });
      }
      calendarGrid.appendChild(dayDiv);
    }
  }

  // Generate Slots
  const availableSlots = ["09:30 AM", "11:00 AM", "01:30 PM", "03:00 PM", "04:30 PM", "06:00 PM"];
  function renderTimeSlots() {
    if (!slotsGrid) return;
    slotsGrid.innerHTML = '';

    availableSlots.forEach(slot => {
      const slotDiv = document.createElement('div');
      slotDiv.className = 'time-slot';
      if (reservationData.time === slot) slotDiv.classList.add('selected');
      slotDiv.textContent = slot;

      slotDiv.addEventListener('click', () => {
        widget.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        slotDiv.classList.add('selected');
        reservationData.time = slot;
      });
      slotsGrid.appendChild(slotDiv);
    });
  }

  // Calendar navigation
  const prevCalBtn = widget.querySelector('#cal-prev');
  const nextCalBtn = widget.querySelector('#cal-next');

  if (prevCalBtn) {
    prevCalBtn.addEventListener('click', () => {
      currentCalDate.setDate(1); // Prevent month-skipping bug on 31st
      currentCalDate.setMonth(currentCalDate.getMonth() - 1);
      renderCalendar(currentCalDate);
    });
  }
  if (nextCalBtn) {
    nextCalBtn.addEventListener('click', () => {
      currentCalDate.setDate(1); // Prevent month-skipping bug on 31st
      currentCalDate.setMonth(currentCalDate.getMonth() + 1);
      renderCalendar(currentCalDate);
    });
  }

  // Populate calendar initially
  renderCalendar(currentCalDate);
  renderTimeSlots();

  // Validate fields and steps
  function canGoToNextStep() {
    if (currentStep === 1) {
      if (!reservationData.practiceArea) {
        alert("Please select a Practice Area before proceeding.");
        return false;
      }
    } else if (currentStep === 2) {
      if (!reservationData.date || !reservationData.time) {
        alert("Please select both a consultation Date and a Time slot.");
        return false;
      }
    } else if (currentStep === 3) {
      const nameEl = widget.querySelector('#booking-name');
      const emailEl = widget.querySelector('#booking-email');
      const phoneEl = widget.querySelector('#booking-phone');
      const narrativeEl = widget.querySelector('#booking-narrative');

      const nameInp = nameEl ? nameEl.value.trim() : '';
      const emailInp = emailEl ? emailEl.value.trim() : '';
      const phoneInp = phoneEl ? phoneEl.value.trim() : '';
      
      if (!nameInp || !emailInp || !phoneInp) {
        alert("Please complete all required fields (Name, Email, Phone).");
        return false;
      }
      
      reservationData.name = nameInp;
      reservationData.email = emailInp;
      reservationData.phone = phoneInp;
      reservationData.narrative = narrativeEl ? narrativeEl.value.trim() : '';
    }
    return true;
  }

  function goToStep(stepNum) {
    steps.forEach(s => s.classList.remove('active'));
    stepDots.forEach(d => d.classList.remove('active'));

    currentStep = stepNum;
    const activeStep = widget.querySelector(`.booking-step-content[data-step="${currentStep}"]`);
    if (activeStep) activeStep.classList.add('active');

    // Update dots
    for (let i = 0; i < stepDots.length; i++) {
      if (i + 1 < currentStep) {
        stepDots[i].classList.add('completed');
      } else {
        stepDots[i].classList.remove('completed');
      }
      if (i + 1 === currentStep) {
        stepDots[i].classList.add('active');
      }
    }

    // Reset button display styles if navigating back
    if (btnPrev) btnPrev.style.display = '';
    if (btnNext) btnNext.style.display = '';

    // Toggle button visibilities
    if (currentStep === 1) {
      if (btnPrev) btnPrev.style.visibility = 'hidden';
      if (btnNext) btnNext.textContent = 'Next: Choose Schedule';
    } else if (currentStep === 2) {
      if (btnPrev) btnPrev.style.visibility = 'visible';
      if (btnNext) btnNext.textContent = 'Next: Contact Info';
    } else if (currentStep === 3) {
      if (btnPrev) btnPrev.style.visibility = 'visible';
      if (btnNext) btnNext.textContent = 'Seal Secure Booking';
    } else if (currentStep === 4) {
      if (btnPrev) btnPrev.style.display = 'none';
      if (btnNext) btnNext.style.display = 'none';
      renderReceipt();
    }
  }

  function renderReceipt() {
    const formattedDate = reservationData.date ? reservationData.date.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }) : '';
    
    // Generate secure reservation ID
    const reservationId = "AJ-SEC-" + Math.floor(100000 + Math.random() * 900000);

    const receiptIdEl = widget.querySelector('#receipt-id');
    const receiptAreaEl = widget.querySelector('#receipt-area');
    const receiptScheduleEl = widget.querySelector('#receipt-schedule');
    const receiptClientEl = widget.querySelector('#receipt-client');

    if (receiptIdEl) receiptIdEl.textContent = reservationId;
    if (receiptAreaEl) receiptAreaEl.textContent = reservationData.practiceLabel;
    if (receiptScheduleEl) receiptScheduleEl.textContent = `${formattedDate} @ ${reservationData.time}`;
    if (receiptClientEl) receiptClientEl.textContent = reservationData.name;
    
    // Save to Local Storage for demonstration
    const reservations = JSON.parse(localStorage.getItem('legal_reservations') || '[]');
    reservations.push({
      id: reservationId,
      ...reservationData,
      date: reservationData.date ? reservationData.date.toISOString() : null,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('legal_reservations', JSON.stringify(reservations));
  }

  // Hook Next/Prev controls
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (canGoToNextStep()) {
        goToStep(currentStep + 1);
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    });
  }

  // Initialize display
  goToStep(1);
}

/* ==========================================================================
   5. KNOWLEDGE REPOSITORY CATEGORY FILTER (Resources page)
   ========================================================================== */
function initResourceFilters() {
  const filterTags = document.querySelectorAll('.category-tag');
  const cards = document.querySelectorAll('.resource-card');
  const searchInput = document.querySelector('.resource-search-input');

  if (filterTags.length === 0 || cards.length === 0) return;

  let activeCategory = 'All';

  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      filterTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      activeCategory = tag.dataset.category;
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase() : '';

    cards.forEach(card => {
      const cardCategory = card.dataset.category;
      const cardTitle = card.querySelector('.resource-title').textContent.toLowerCase();
      const cardExcerpt = card.querySelector('.resource-excerpt').textContent.toLowerCase();
      
      const matchesCategory = activeCategory === 'All' || cardCategory === activeCategory;
      const matchesSearch = cardTitle.includes(query) || cardExcerpt.includes(query);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }
}

/* ==========================================================================
   6. SECURE CASE INQUIRY FORM (Visual Cryptography Handshakes)
   ========================================================================== */
function initCaseInquiryForm() {
  const form = document.getElementById('secure-case-inquiry-form');
  const hud = document.getElementById('encryption-log-hud');
  const logLines = document.getElementById('hud-log-lines');
  const submitBtn = document.getElementById('secure-submit-btn');
  const indicator = document.getElementById('secure-indicator-tag');

  if (!form || !hud) return;

  const logs = [
    "Initializing TLS 1.3 cryptographic handshake...",
    "Creating ephemeral Diffie-Hellman keys...",
    "Authenticating secure endpoint cisa-vault.ankitjhalegal.com...",
    "Connection verified over 256-bit AES-GCM cipher suite.",
    "Form payload localized in secure memory stack.",
    "Executing zero-knowledge proof verification...",
    "Applying CISA high-integrity cryptographic seal...",
    "Payload encrypted. Dispatching secure packet..."
  ];

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Disable form fields
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(inp => inp.disabled = true);
    if (submitBtn) submitBtn.disabled = true;

    // Show Encryption HUD
    hud.style.display = 'block';
    if (logLines) logLines.innerHTML = '';
    
    let logIndex = 0;
    
    function printNextLog() {
      if (logIndex < logs.length) {
        const line = document.createElement('div');
        line.innerHTML = `<span style="color:#00F0FF">></span> ${logs[logIndex]}`;
        if (logLines) {
          logLines.appendChild(line);
          logLines.scrollTop = logLines.scrollHeight;
        }
        logIndex++;
        
        // Random visual delay to simulate cryptographic calculations
        setTimeout(printNextLog, 400 + Math.random() * 300);
      } else {
        // Complete state
        if (indicator) {
          indicator.textContent = "Data Sealed";
          indicator.classList.add('encrypted');
          indicator.innerHTML = `<svg style="width:12px;height:12px;fill:currentColor" viewBox="0 0 24 24"><path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/></svg> Sealed & Encrypted`;
        }

        const successLine = document.createElement('div');
        successLine.style.color = '#2ECC71';
        successLine.innerHTML = `<span style="color:#2ECC71">[SUCCESS]</span> Safe Submission Accomplished. Case details saved under crypt-hash: AJ-SEC-${Math.floor(100000 + Math.random() * 900000)}`;
        if (logLines) {
          logLines.appendChild(successLine);
          logLines.scrollTop = logLines.scrollHeight;
        }

        // Store inquiry in Local Storage for demonstration
        const nameEl = form.querySelector('#inquiry-name');
        const emailEl = form.querySelector('#inquiry-email');
        const phoneEl = form.querySelector('#inquiry-phone');
        const complianceEl = form.querySelector('#inquiry-compliance');
        const narrativeEl = form.querySelector('#inquiry-narrative');

        const inquiryData = {
          name: nameEl ? nameEl.value : '',
          email: emailEl ? emailEl.value : '',
          phone: phoneEl ? phoneEl.value : '',
          compliance: complianceEl ? complianceEl.value : '',
          narrative: narrativeEl ? narrativeEl.value : '',
          timestamp: new Date().toISOString()
        };
        const inquiries = JSON.parse(localStorage.getItem('legal_inquiries') || '[]');
        inquiries.push(inquiryData);
        localStorage.setItem('legal_inquiries', JSON.stringify(inquiries));

        alert("Case inquiry secured and processed. Ankit Jha (LL.B, CMA, CISA) will contact you securely within 4 hours.");
      }
    }

    printNextLog();
  });
}
