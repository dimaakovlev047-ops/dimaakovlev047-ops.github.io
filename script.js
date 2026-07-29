const burger = document.getElementById('burger');
const mainNav = document.getElementById('mainNav');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mainNav.classList.toggle('open');
  burger.setAttribute('aria-expanded', mainNav.classList.contains('open'));
});
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
  burger.classList.remove('open');
  mainNav.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}));

const sections = ['about','directions','schedule','reviews','contacts'].map(id => document.getElementById(id));
const navLinks = document.querySelectorAll('.nav-link');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(s => s && io.observe(s));

const hero = document.querySelector('.hero');
if (window.innerWidth > 820) {
  hero.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5);
    const y = (e.clientY / innerHeight - 0.5);
    document.querySelectorAll('.cloud').forEach(c => {
      const depth = parseFloat(c.dataset.depth);
      c.style.transform = `translate(${x*depth}px, ${y*depth}px)`;
    });
  });
}

const mascot = document.getElementById('mascot');
mascot.addEventListener('mouseenter', () => {
  mascot.querySelectorAll('.eye')[1].style.transform = 'scaleY(0.1)';
});
mascot.addEventListener('mouseleave', () => {
  mascot.querySelectorAll('.eye')[1].style.transform = '';
});

const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('#cardsGrid .card');
filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filterBtns.forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');
  const age = btn.dataset.age;
  cards.forEach(card => {
    if (age === 'all') { card.classList.remove('hidden'); return; }
    const min = parseInt(card.dataset.min), max = parseInt(card.dataset.max);
    const ageNum = parseInt(age);
    const rangeMax = age === '10' ? 12 : (ageNum + 3);
    const overlaps = min <= rangeMax && max >= ageNum;
    card.classList.toggle('hidden', !overlaps);
  });
}));

const scheduleData = [
  [ ['10:00','Лепка'], ['15:00','Рисование'], ['16:30','Шахматы'], ['18:00','Английский'] ],
  [ ['10:00','Подготовка к школе'], ['15:00','Танцы'], ['16:30','Рисование'], [null,null] ],
  [ ['10:00','Лепка'], ['15:00','Английский'], ['16:30','Шахматы'], ['18:00','Танцы'] ],
  [ ['10:00','Подготовка к школе'], ['15:00','Рисование'], ['16:30','Английский'], [null,null] ],
  [ ['10:00','Шахматы'], ['15:00','Танцы'], ['16:30','Лепка'], ['18:00','Подготовка к школе'] ],
  [ ['10:00','Английский'], ['15:00','Танцы'], [null,null], [null,null] ],
];
const dayTabs = document.querySelectorAll('.day-tab');
const schedulePanel = document.getElementById('schedulePanel');
function renderSchedule(dayIdx){
  const slots = scheduleData[dayIdx];
  schedulePanel.innerHTML = slots.map(([time, activity]) => {
    if (!time) return `<div class="slot empty"><span class="time">—</span><span class="activity">Свободно</span></div>`;
    return `<div class="slot"><span class="time">${time}</span><span class="activity">${activity}</span></div>`;
  }).join('');
}
dayTabs.forEach(tab => tab.addEventListener('click', () => {
  dayTabs.forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  renderSchedule(parseInt(tab.dataset.day));
}));
renderSchedule(0);

const slidesWrap = document.getElementById('reviewSlides');
const slideCount = slidesWrap.children.length;
const dotsWrap = document.getElementById('reviewDots');
const prevBtn = document.getElementById('reviewPrev');
const nextBtn = document.getElementById('reviewNext');
let current = 0;
let autoSlideInterval;

function goToSlide(i){
  current = (i + slideCount) % slideCount;
  slidesWrap.style.transform = `translateX(-${current*100}%)`;
  dotsWrap.querySelectorAll('.review-dot').forEach((d, idx) => {
    d.classList.toggle('active', idx === current);
    d.setAttribute('aria-selected', idx === current);
  });
}

function resetAutoSlide(){
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(() => goToSlide(current + 1), 5000);
}

for (let i=0;i<slideCount;i++){
  const d = document.createElement('button');
  d.className = 'review-dot' + (i===0 ? ' active' : '');
  d.setAttribute('role', 'tab');
  d.setAttribute('aria-selected', i===0);
  d.addEventListener('click', () => {
    goToSlide(i);
    resetAutoSlide();
  });
  dotsWrap.appendChild(d);
}

prevBtn.addEventListener('click', () => {
  goToSlide(current - 1);
  resetAutoSlide();
});
nextBtn.addEventListener('click', () => {
  goToSlide(current + 1);
  resetAutoSlide();
});

goToSlide(0);
autoSlideInterval = setInterval(() => goToSlide(current + 1), 5000);

const modalOverlay = document.getElementById('modalOverlay');
const modalSub = document.getElementById('modalSub');
const directionSelect = document.getElementById('directionSelect');
let closeTimeout;

function openModal(direction){
  clearTimeout(closeTimeout);
  document.getElementById('formView').style.display = 'block';
  document.getElementById('successView').classList.remove('show');
  document.getElementById('signupForm').reset();
  if (direction){
    modalSub.textContent = `Направление «${direction}» — оставьте контакты, и мы подберём удобное время`;
    directionSelect.value = direction;
  } else {
    modalSub.textContent = 'Заполните форму — мы перезвоним в течение часа';
    directionSelect.value = '';
  }
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(){
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
  clearTimeout(closeTimeout);
}

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

function submitForm(e){
  e.preventDefault();
  document.getElementById('formView').style.display = 'none';
  document.getElementById('successView').classList.add('show');
  closeTimeout = setTimeout(closeModal, 4000);
  return false;
}

const revealEls = document.querySelectorAll('.reveal');
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in');
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealIO.observe(el));

document.getElementById('parentPhone').addEventListener('input', function(e) {
  let value = this.value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  let formatted = '';
  if (value.length > 0) {
    formatted = '+7';
    if (value.length > 1) formatted += ' (' + value.slice(1, 4);
    if (value.length > 4) formatted += ') ' + value.slice(4, 7);
    if (value.length > 7) formatted += '-' + value.slice(7, 9);
    if (value.length > 9) formatted += '-' + value.slice(9, 11);
  }
  this.value = formatted;
});

// ===== TELEGRAM БОТ (РАБОЧАЯ ФОРМА) =====
const BOT_TOKEN = '8966390707:AAFbAfMjBi4s2YYrcYzD2lw0HIusjs626QE';
const CHAT_ID = '8054843106';

const form = document.getElementById('signupForm');

if (!form) {
    console.error('❌ Форма с id="signupForm" не найдена!');
} else {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('parentName').value;
        const phone = document.getElementById('parentPhone').value;
        const direction = document.getElementById('directionSelect').value;

        const message = `📋 *Новая заявка!*\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n🎯 Направление: ${direction}`;

        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert('✅ Спасибо! Мы свяжемся с вами в течение 15 минут.');
                form.reset();
            } else {
                alert('❌ Ошибка отправки. Попробуйте ещё раз.');
                console.error('Ошибка:', data);
            }
        })
        .catch(error => {
            alert('❌ Ошибка сети. Проверьте подключение.');
            console.error('Ошибка:', error);
        });
    });
}
