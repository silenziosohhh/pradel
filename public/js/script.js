const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    siteNav.classList.toggle('active');
  });

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('active');
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerHeight = document.querySelector('.site-header').offsetHeight;
      const targetPosition = target.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

const observerOptions = {
  root: null,
  rootMargin: '-20% 0px -80% 0px',
  threshold: 0
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      
      navLinks.forEach(link => link.classList.remove('active'));
      
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  });
}, observerOptions);

sections.forEach(section => observer.observe(section));

let lastScrollTop = 0;
let ticking = false;

function updateHeader() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const header = document.querySelector('.site-header');
  
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }
  
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateHeader);
    ticking = true;
  }
});

(() => {
  const banner = document.querySelector('.cookie-banner');
  if (!banner) return;
  
  const status = localStorage.getItem('pradel-cookie-consent');
  if (!status) {
    banner.hidden = false;
  }
  
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');
  
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('pradel-cookie-consent', 'accepted');
      banner.hidden = true;
    });
  }
  
  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('pradel-cookie-consent', 'declined');
      banner.hidden = true;
    });
  }
})();

(() => {
  const video = document.querySelector('.bg-video');
  const hero = document.querySelector('.hero');
  
  if (!video || !hero) return;
  
  const handleVideoError = () => {
    hero.classList.add('no-video');
    hero.style.background = 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6)), url("img/padel_frame.jpg") center/cover';
  };
  
  video.addEventListener('error', handleVideoError);
  video.addEventListener('loadstart', () => {
    hero.classList.remove('no-video');
  });
  
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(handleVideoError);
  }
})();

(() => {
  const galleryImages = document.querySelectorAll('.gallery-grid img');
  if (!galleryImages.length) return;
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        imageObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });
  
  galleryImages.forEach(img => {
    imageObserver.observe(img);
  });
})();

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    if (!data.name || !data.email || !data.message) {
      alert('Per favore compila tutti i campi obbligatori.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert('Per favore inserisci un indirizzo email valido.');
      return;
    }
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Invio in corso...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      alert('Messaggio inviato con successo! Ti risponderemo presto.');
      this.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 2000);
  });
}

(() => {
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');
  
  if (!hero || !heroContent) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (scrolled < hero.offsetHeight) {
      heroContent.style.transform = `translateY(${rate}px)`;
    }
  });
})();

(() => {
  const animateElements = document.querySelectorAll('.feature-card, .tournament-card, .course-card, .contact-item');
  
  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        animateObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  animateElements.forEach(el => {
    el.style.animationPlayState = 'paused';
    animateObserver.observe(el);
  });
})();

(() => {
  const images = document.querySelectorAll('img[src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => {
    imageObserver.observe(img);
  });
})();

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && siteNav && siteNav.classList.contains('active')) {
    navToggle.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('active');
  }
});

(() => {
  const revealElements = document.querySelectorAll('.section');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1
  });
  
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
})();
