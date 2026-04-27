    const slides = Array.from(document.querySelectorAll('.slide'));
    const track = document.getElementById('slides');
    const slideIndex = document.getElementById('slide-index');
    const slideCount = document.getElementById('slide-count');
    const progressBar = document.getElementById('progress-bar');
    const prevButtons = document.querySelectorAll('[data-nav="prev"]');
    const nextButtons = document.querySelectorAll('[data-nav="next"]');
    const entryCards = document.querySelectorAll('.entry-card-clickable[data-entry]');
    const entryModal = document.getElementById('entry-modal');
    const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
    const modalTitle = document.getElementById('entry-modal-title');
    const modalDate = document.getElementById('entry-modal-date');
    const modalShort = document.getElementById('entry-modal-short');
    const modalText = document.getElementById('entry-modal-text');
    const modalMedia = document.getElementById('entry-modal-media');
    const modalImage = document.getElementById('entry-modal-image');
    let current = 0;

    if (entryModal) {
      // Keep modal outside the translated slide track so it always opens centered.
      document.body.appendChild(entryModal);
    }

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

    function decodeEntryPayload(encoded) {
      try {
        const binary = atob(encoded);
        const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
        const json = new TextDecoder('utf-8').decode(bytes);
        return JSON.parse(json);
      } catch {
        return null;
      }
    }

    function openEntryModal(payload) {
      if (!entryModal || !payload) return;

      modalTitle.textContent = payload.title || 'Beitrag';
      modalDate.textContent = payload.date || '';
      modalShort.textContent = payload.short || '';
      modalText.textContent = payload.text || payload.short || '';

      if (payload.image) {
        modalImage.src = payload.image;
        modalImage.alt = payload.title || 'Beitragsbild';
        modalMedia.hidden = false;
      } else {
        modalImage.src = '';
        modalImage.alt = '';
        modalMedia.hidden = true;
      }

      entryModal.hidden = false;
      entryModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeEntryModal() {
      if (!entryModal) return;
      entryModal.hidden = true;
      entryModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    entryCards.forEach((card) => {
      card.addEventListener('click', () => {
        const payload = decodeEntryPayload(card.getAttribute('data-entry') || '');
        if (payload) openEntryModal(payload);
      });
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          const payload = decodeEntryPayload(card.getAttribute('data-entry') || '');
          if (payload) openEntryModal(payload);
        }
      });
    });

    modalCloseButtons.forEach((button) => {
      button.addEventListener('click', closeEntryModal);
    });

    prevButtons.forEach((button) => button.addEventListener('click', () => go(-1)));
    nextButtons.forEach((button) => button.addEventListener('click', () => go(1)));
    window.addEventListener('keydown', (event) => {
      if (entryModal && !entryModal.hidden && event.key === 'Escape') {
        event.preventDefault();
        closeEntryModal();
        return;
      }
      if (entryModal && !entryModal.hidden) {
        return;
      }

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
