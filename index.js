// --- CDJ STUDIO Branded Core JS Interactions --- //

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. SMPTE Camcorder Timecode Running Simulator ---
  let tcFrame = 0;
  let tcSec = 0;
  let tcMin = 23; // Start from an artistic offset
  let tcHour = 0;
  
  const camTimecodeEl = document.getElementById('cam-timecode');
  const topCamTimecodeEl = document.getElementById('top-cam-timecode');
  
  function updateCamTimecode() {
    tcFrame++;
    if (tcFrame >= 30) {
      tcFrame = 0;
      tcSec++;
      if (tcSec >= 60) {
        tcSec = 0;
        tcMin++;
        if (tcMin >= 60) {
          tcMin = 0;
          tcHour++;
          if (tcHour >= 24) {
            tcHour = 0;
          }
        }
      }
    }
    
    const hh = String(tcHour).padStart(2, '0');
    const mm = String(tcMin).padStart(2, '0');
    const ss = String(tcSec).padStart(2, '0');
    const ff = String(tcFrame).padStart(2, '0');
    
    const timecodeString = `${hh}:${mm}:${ss}:${ff}`;
    if (camTimecodeEl) camTimecodeEl.innerText = timecodeString;
    if (topCamTimecodeEl) topCamTimecodeEl.innerText = timecodeString;
  }
  
  // Runs approximately at 30fps (33.3ms interval)
  setInterval(updateCamTimecode, 33.3);

  // --- 2. Hero Videos Autoplay & Dynamic Audio Warning Prompt ---
  const heroVideo = document.getElementById('hero-video');
  const audioPrompt = document.getElementById('audio-prompt-el');
  const topHeroVideo = document.getElementById('top-hero-video');
  const topAudioPrompt = document.getElementById('top-audio-prompt-el');
  
  function dismissAudioPrompt(promptEl) {
    if (promptEl) {
      promptEl.classList.add('fade-out');
    }
  }

  function showAudioMutedPrompt(promptEl) {
    if (promptEl) {
      promptEl.classList.remove('fade-out');
      const textSpan = promptEl.querySelector('span:not(.audio-prompt-dot)');
      if (textSpan) {
        textSpan.innerText = "AUDIO SYSTEM: MUTED // CLICK HERO VIDEO TO UNMUTE";
      }
    }
  }

  // Setup video audio utility
  function setupVideoAudio(videoEl, promptEl) {
    if (!videoEl) return;
    
    // Start muted on page load
    videoEl.muted = true;
    // Lower volume slightly as requested by the user (30% volume)
    videoEl.volume = 0.3;
    
    videoEl.play().catch(error => {
      console.warn("Muted playback blocked.", error);
    });

    // Initial state shows muted prompt
    showAudioMutedPrompt(promptEl);

    // Toggle mute state on click
    videoEl.addEventListener('click', (e) => {
      e.stopPropagation();
      videoEl.muted = !videoEl.muted;
      if (videoEl.muted) {
        showAudioMutedPrompt(promptEl);
      } else {
        dismissAudioPrompt(promptEl);
      }
    });
  }

  // Initialize both hero videos
  setupVideoAudio(heroVideo, audioPrompt);
  setupVideoAudio(topHeroVideo, topAudioPrompt);

  // --- 3. Dynamic Text Scramble Hover Mechanic ---
  const scrambleGlyphs = "0123456789_#@[]%/\\+=?*$!{}<>";
  
  function triggerScramble(element, targetText, duration = 15) {
    let iteration = 0;
    clearInterval(element.scrambleInterval);
    
    element.scrambleInterval = setInterval(() => {
      element.innerText = targetText
        .split("")
        .map((char, index) => {
          if (index < iteration) {
            return targetText[index];
          }
          // Preserve spaces
          if (char === " ") return " ";
          return scrambleGlyphs[Math.floor(Math.random() * scrambleGlyphs.length)];
        })
        .join("");
      
      if (iteration >= targetText.length) {
        clearInterval(element.scrambleInterval);
      }
      
      iteration += 1 / 2; // Scramble speed factor
    }, duration);
  }

  // Scramble interactions on Header logo
  const logoHeader = document.getElementById('logo-header');
  if (logoHeader) {
    logoHeader.addEventListener('mouseenter', () => {
      triggerScramble(logoHeader, "CDJSTUDIO", 25);
    });
  }

  // --- 4. Scramble interactions on category items (WIP) ---
  const categoryItems = document.querySelectorAll('.category-item-simple');
  
  // 4a. Mouse Hover Scramble (for desktop)
  categoryItems.forEach(item => {
    const nameEl = item.querySelector('.category-name-simple');
    const originalText = item.getAttribute('data-target');
    
    if (nameEl && originalText) {
      item.addEventListener('mouseenter', () => {
        triggerScramble(nameEl, originalText, 15);
      });
    }
  });

  // 4b. Viewport Intersection Scramble (for mobile scroll triggers)
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          const nameEl = item.querySelector('.category-name-simple');
          const originalText = item.getAttribute('data-target');
          
          if (nameEl && originalText) {
            triggerScramble(nameEl, originalText, 15);
          }
        }
      });
    }, observerOptions);

    categoryItems.forEach(item => {
      scrollObserver.observe(item);
    });
  }

});
