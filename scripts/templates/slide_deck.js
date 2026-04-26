    const slides = Array.from(document.querySelectorAll('.slide'));
    const track = document.getElementById('slides');
    const slideIndex = document.getElementById('slide-index');
    const slideCount = document.getElementById('slide-count');
    const progressBar = document.getElementById('progress-bar');
    const prevButtons = document.querySelectorAll('[data-nav="prev"]');
    const nextButtons = document.querySelectorAll('[data-nav="next"]');
    let current = 0;

    const slideshows = Array.from(document.querySelectorAll('.auto-slideshow'));
    slideshows.forEach((slideshow) => {
      const frames = Array.from(slideshow.querySelectorAll('.frame'));
      if (frames.length <= 1) return;
      let frameIndex = 0;
      setInterval(() => {
        frames[frameIndex].classList.remove('active');
        frameIndex = (frameIndex + 1) % frames.length;
        frames[frameIndex].classList.add('active');
      }, 4200);
    });

    slides.forEach((slide, index) => {
      const pageNumber = document.createElement('div');
      pageNumber.className = 'page-number';
      pageNumber.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      slide.appendChild(pageNumber);
    });

    function render() {
      const max = Math.max(slides.length - 1, 1);
      slideIndex.textContent = String(current + 1);
      slideCount.textContent = String(slides.length);
      progressBar.style.width = `${(current / max) * 100}%`;
      track.style.transform = `translateX(${-current * 100}vw)`;
    }

    function go(delta) {
      current = Math.min(slides.length - 1, Math.max(0, current + delta));
      render();
    }

    prevButtons.forEach((button) => button.addEventListener('click', () => go(-1)));
    nextButtons.forEach((button) => button.addEventListener('click', () => go(1)));
    window.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        go(1);
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        go(-1);
      } else if (event.key === 'Home') {
        current = 0;
        render();
      } else if (event.key === 'End') {
        current = slides.length - 1;
        render();
      }
    });

    render();
