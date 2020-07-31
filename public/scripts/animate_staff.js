    // convert to async
    let t;
    let start_beat = 4;
    let wait_beat = 1;
    let bpm = 120;
    let beat_dur = 60/bpm;
    let c = start_beat + wait_beat;
    let timer_is_on = 0;

    const currentSvg = document.querySelector('#current');
    const prevSvg = document.querySelector('#prev');
    const txt = document.querySelector('#txt');

    function changeBackground(color, svgId) {
      const svg = document.querySelector(svgId);
      svg.style.background = color;
    }
    
    changeBackground('GhostWhite', '#prev')
    
    function timedCount() {
      
      txt.innerHTML = c;
      c = c - 1;
      t = setTimeout(timedCount, 1000 * beat_dur);
    
      if (c < start_beat){
        if (c % 2) {
          changeBackground('#f0f0f0', '#current');
        } else {
          changeBackground('#161616', '#current');
        }
    
      if (c < 0) {
        stopCount()
        }
      }
    }
    
    function startCount() {
      //const currentSvg = document.querySelector('#current');
      //const prevSvg = document.querySelector('#prev');
      if (!timer_is_on) {
          timer_is_on = start_beat + wait_beat;
          changeBackground('#dddddd', '#current');
          currentSvg.classList.remove('hidden');
          currentSvg.classList.add('visible');
          timedCount();
      }
    }
    
    
    function stopCount() {
      // const currentSvg = document.querySelector('#current');
      // const prevSvg = document.querySelector('#prev');
     
      clearTimeout(t);
      changeBackground('white', '#current');

      prevSvg.classList.add('slide-bottom');
      prevSvg.classList.remove('visible');
      prevSvg.classList.add('hidden');
    
      currentSvg.classList.add('slide-bottom');
      currentSvg.classList.add('active');
    
      timer_is_on = 0;
      c = start_beat + wait_beat;
    }
    
    startCount();