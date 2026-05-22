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

  if (heroVideo) {
    // Attempt unmuted playback initially
    heroVideo.muted = false;
    
    heroVideo.play()
      .then(() => {
        // Unmuted autoplay succeeded (rare but possible under some user profiles)
        dismissAudioPrompt();
      })
      .catch(error => {
        console.warn("Unmuted autoplay blocked. Running muted first, unmuting on first user interaction.");
        
        // Fallback: Autoplay muted
        heroVideo.muted = true;
        heroVideo.play().catch(err => {
          console.error("Muted playback also blocked.", err);
        });
        
        // Unmute on first user touch/click anywhere on the viewport
        const unmuteOnInteraction = () => {
          heroVideo.muted = false;
          heroVideo.play()
            .then(() => {
              dismissAudioPrompt();
            })
            .catch(err => {
              console.warn("Failed to play unmuted after interaction:", err);
            });
          
          document.removeEventListener('click', unmuteOnInteraction);
          document.removeEventListener('touchstart', unmuteOnInteraction);
        };
        
        document.addEventListener('click', unmuteOnInteraction);
        document.addEventListener('touchstart', unmuteOnInteraction);
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

});
