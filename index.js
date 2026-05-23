// --- CDJ STUDIO Branded Core JS Interactions --- //

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. SMPTE Camcorder Timecode Running Simulator ---
  let tcFrame = 0;
  let tcSec = 0;
  let tcMin = 23; // Start from an artistic offset
  let tcHour = 0;
  
  const camTimecodeEl = document.getElementById('cam-timecode');
  
  function updateCamTimecode() {
    if (!camTimecodeEl) return;
    
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
    
    camTimecodeEl.innerText = `${hh}:${mm}:${ss}:${ff}`;
  }
  
  // Runs approximately at 30fps (33.3ms interval)
  setInterval(updateCamTimecode, 33.3);

  // --- 2. Hero Video Autoplay & Dynamic Audio Warning Prompt ---
  const heroVideo = document.getElementById('hero-video');
  const audioPrompt = document.getElementById('audio-prompt-el');
  
  function dismissAudioPrompt() {
    if (audioPrompt) {
      audioPrompt.classList.add('fade-out');
    }
  }

  function showAudioMutedPrompt() {
    if (audioPrompt) {
      audioPrompt.classList.remove('fade-out');
      const textSpan = audioPrompt.querySelector('span:not(.audio-prompt-dot)');
      if (textSpan) {
        textSpan.innerText = "AUDIO SYSTEM: MUTED // CLICK HERO VIDEO TO UNMUTE";
      }
    }
  }

  if (heroVideo) {
    // Start muted as requested by the user
    heroVideo.muted = true;
    
    heroVideo.play().catch(error => {
      console.warn("Muted playback blocked.", error);
    });

    // Ensure initial state shows muted warning prompt
    showAudioMutedPrompt();

    // Toggle mute state on clicking the hero video
    heroVideo.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent document-level click listener conflicts
      
      heroVideo.muted = !heroVideo.muted;
      if (heroVideo.muted) {
        showAudioMutedPrompt();
      } else {
        dismissAudioPrompt();
      }
    });
  }

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
  categoryItems.forEach(item => {
    const nameEl = item.querySelector('.category-name-simple');
    const originalText = item.getAttribute('data-target');
    
    if (nameEl && originalText) {
      item.addEventListener('mouseenter', () => {
        triggerScramble(nameEl, originalText, 15);
      });
    }
  });

});
