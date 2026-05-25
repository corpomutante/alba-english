(function () {
  'use strict';

  function initMobileMenu() {
    var hamburger  = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobileMenu');
    var menuClose  = document.getElementById('menuClose');
    if (!hamburger || !mobileMenu) return;
    hamburger.addEventListener('click', function () {
      mobileMenu.style.display = 'flex';
      requestAnimationFrame(function () { mobileMenu.classList.add('open'); });
    });
    function closeMobileMenu() {
      mobileMenu.classList.remove('open');
      setTimeout(function () { mobileMenu.style.display = 'none'; }, 420);
    }
    if (menuClose) menuClose.addEventListener('click', closeMobileMenu);
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMobileMenu);
    });
  }

  function initStickyNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;
    var body = document.body;
    var isAuthPage = body && body.classList.contains('page-auth');
    if (isAuthPage) return;
    var hero = document.querySelector('.hero');
    function updateNav() {
      var heroH = hero ? hero.offsetHeight : 600;
      var threshold = hero ? heroH * 0.10 : 80;
      navbar.classList.toggle('scrolled', window.scrollY > threshold);
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  function initFadeUp() {
    var fadeEls = document.querySelectorAll('.fade-up');
    if (!fadeEls.length) return;
    if (!('IntersectionObserver' in window)) {
      fadeEls.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
    fadeEls.forEach(function (el) { io.observe(el); });
  }

  function initScheduleAccordion() {
    var accItems = document.querySelectorAll('.acc-item');
    if (!accItems.length) return;
    accItems.forEach(function (item) {
      var header = item.querySelector('.acc-header');
      if (!header) return;
      header.addEventListener('click', function () {
        var isActive = item.classList.contains('active');
        accItems.forEach(function (i) { i.classList.remove('active'); });
        if (!isActive) item.classList.add('active');
      });
    });
  }

  function initTestimonialCarousel() {
    var slides  = document.querySelectorAll('.testi-slide');
    var dots    = document.querySelectorAll('.testi-dot');
    var prevBtn = document.getElementById('testiPrev');
    var nextBtn = document.getElementById('testiNext');
    if (!slides.length) return;
    var current = 0, timer;
    function goTo(n) {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = ((n % slides.length) + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }
    function startAuto() { timer = setInterval(function () { goTo(current + 1); }, 7000); }
    function resetAuto() { clearInterval(timer); startAuto(); }
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetAuto(); });
    dots.forEach(function (d) {
      d.addEventListener('click', function () { goTo(+d.dataset.i); resetAuto(); });
    });
    startAuto();
  }

  var teacherAvailability = {
    1: {
      Mon: ['09:00','10:00','11:00','15:00','16:00'],
      Tue: ['09:00','10:00','14:00','17:00'],
      Wed: ['11:00','12:00','16:00','17:00'],
      Thu: ['09:00','10:00','11:00','15:00'],
      Fri: ['10:00','11:00','14:00','15:00','16:00']
    },
    2: {
      Mon: ['08:00','09:00','13:00','14:00'],
      Tue: ['10:00','11:00','15:00','16:00','17:00'],
      Wed: ['09:00','10:00','11:00'],
      Thu: ['14:00','15:00','16:00','17:00'],
      Fri: ['09:00','10:00','11:00','12:00']
    },
    3: {
      Mon: ['10:00','11:00','16:00','17:00'],
      Tue: ['09:00','14:00','15:00'],
      Wed: ['10:00','11:00','12:00','16:00','17:00'],
      Thu: [],
      Fri: ['09:00','10:00','11:00','15:00','16:00']
    }
  };

  var activeTeacherId = 1;
  var selectedSlot    = null;
  var weekOffset      = 0;

  function getWeekDates(offset) {
    var today = new Date();
    var day = today.getDay();
    var monday = new Date(today);
    monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1) + offset * 7);
    var dayNames = ['Mon','Tue','Wed','Thu','Fri'];
    return dayNames.map(function (name, i) {
      var d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return { name: name, date: d };
    });
  }

  function formatDate(d) {
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  function isToday(d) {
    var t = new Date();
    return d.getDate() === t.getDate() &&
           d.getMonth() === t.getMonth() &&
           d.getFullYear() === t.getFullYear();
  }

  function renderTeachers() {
    if (!document.getElementById('teachersContainer')) return;
    var isMobile = window.innerWidth <= 640;
    document.querySelectorAll('.teacher-card[data-id]').forEach(function (card) {
      card.classList.toggle('active', +card.dataset.id === activeTeacherId);
    });
    var container = document.getElementById('teachersContainer');
    if (!isMobile) return;
    var templates = document.querySelectorAll('.teacher-card-template');
    var html = '';
    templates.forEach(function (tmpl) {
      var id = +tmpl.dataset.id;
      var isActive = id === activeTeacherId;
      var inner = tmpl.querySelector('.teacher-card');
      if (!inner) return;
      var cardHTML = inner.outerHTML.replace('class="teacher-card', 'class="teacher-card' + (isActive ? ' active' : ''));
      html += '<div class="teachers-grid">' + cardHTML + '</div>';
      if (isActive) {
        html += '<div style="margin-bottom:10px;">' + mobileBookingHTML(id) + '</div>';
      }
    });
    html += '<div class="mobile-map-block">' +
      '<div class="map-block-label">In Person</div>' +
      '<div class="map-block-title">Want to come meet the team?</div>' +
      '<p class="map-block-sub">You\u2019re absolutely welcome, rain or shine.</p>' +
      '<div class="map-card">' +
        '<div class="map-card-header">' +
          '<div class="map-card-address">' +
            '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
            'R\u00faa Manuel Pereira, 22 \u00b7 32003 Ourense' +
          '</div>' +
          '<a href="https://maps.app.goo.gl/6X5hXNj7RwzTH2te9" target="_blank" rel="noopener noreferrer" class="map-directions-btn">' +
            '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>' +
            'Directions' +
          '</a>' +
        '</div>' +
        '<div class="map-embed-wrap">' +
          '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2963.3!2d-7.866!3d42.336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd2f7389c2a8f2d1%3A0x0!2sCentro+de+Estudios+Cubick!5e0!3m2!1sen!2ses!4v1716000000000!5m2!1sen!2ses&q=R\u00faa+Manuel+Pereira+22+Ourense" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Centro de Estudios Cubick location"></iframe>' +
        '</div>' +
      '</div>' +
    '</div>';
    container.innerHTML = html;
    attachMobileFormEvents();
  }

  function calendarHTML(teacherId) {
    var id = teacherId || activeTeacherId;
    var avail = teacherAvailability[id] || {};
    var days = getWeekDates(weekOffset);
    var first = days[0].date, last = days[4].date;
    var weekLbl = formatDate(first) + ' \u2013 ' + formatDate(last);
    var cols = days.map(function (d) {
      var name = d.name, date = d.date;
      var slots = avail[name] || [];
      var slotsHtml = slots.length
        ? slots.map(function (time) {
            var isSel = selectedSlot && selectedSlot.day === name && selectedSlot.time === time;
            return '<button class="time-slot' + (isSel ? ' selected' : '') + '" onclick="selectSlot(\'' + name + '\',\'' + time + '\',\'' + formatDate(date) + '\')">' + time + '</button>';
          }).join('')
        : '<div class="cal-no-slots">\u2014</div>';
      return '<div class="cal-day-col">' +
        '<div class="cal-day-header">' +
          '<div class="cal-day-name">' + name + '</div>' +
          '<div class="cal-day-num' + (isToday(date) ? ' today' : '') + '">' + date.getDate() + '</div>' +
        '</div>' +
        '<div class="cal-slots">' + slotsHtml + '</div>' +
      '</div>';
    }).join('');
    return '<div class="calendar-wrap">' +
      '<div class="calendar-header">' +
        '<div class="calendar-week-nav">' +
          '<button class="cal-nav-btn" onclick="changeWeek(-1)">' +
            '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>' +
          '</button>' +
          '<span class="cal-week-label">' + weekLbl + '</span>' +
          '<button class="cal-nav-btn" onclick="changeWeek(1)">' +
            '<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>' +
          '</button>' +
        '</div>' +
        '<select class="timezone-select">' +
          '<option value="GMT+1" selected>Madrid GMT +1</option>' +
          '<option value="GMT+0">London GMT +0</option>' +
          '<option value="GMT+2">Paris GMT +2</option>' +
          '<option value="GMT-5">New York GMT -5</option>' +
          '<option value="GMT-8">Los Angeles GMT -8</option>' +
        '</select>' +
      '</div>' +
      '<div class="calendar-grid">' + cols + '</div>' +
    '</div>';
  }

  function mobileBookingHTML(teacherId) {
    var id = teacherId || activeTeacherId;
    var tmpl = document.querySelector('.teacher-card-template[data-id="' + id + '"]');
    var name  = tmpl ? tmpl.dataset.name  : '';
    var photo = tmpl ? tmpl.dataset.photo : '';
    var slotDisplay = selectedSlot
      ? '<div class="selected-slot-display">' +
          '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' +
          '<span class="selected-slot-text">' + selectedSlot.day + ' ' + selectedSlot.date + ' at ' + selectedSlot.time + '</span>' +
        '</div>'
      : '<div class="selected-slot-display empty">' +
          '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' +
          '<span class="selected-slot-text">No time selected yet</span>' +
        '</div>';
    return '<div class="mobile-inline-booking">' +
      calendarHTML(id) +
      '<div class="booking-form-wrap" id="bookingFormWrap">' +
        '<div id="bookingFormInner">' +
          '<h3 class="booking-form-title">Your Lesson Details</h3>' +
          '<div class="selected-teacher-mini">' +
            '<img src="' + photo + '" alt="' + name + '" class="selected-teacher-avatar">' +
            '<div class="selected-teacher-info">' +
              '<div class="selected-teacher-name">' + name + '</div>' +
              '<div class="selected-teacher-role">Certified Teacher</div>' +
            '</div>' +
          '</div>' +
          '<div class="slots-indicator">' +
            '<span class="slots-indicator-label">Slots selected</span>' +
            '<div class="slots-dots">' +
              '<div class="slot-dot' + (selectedSlot ? ' filled' : '') + '"></div>' +
              '<div class="slot-dot"></div>' +
              '<div class="slot-dot"></div>' +
            '</div>' +
            '<span class="slots-max-label">max 3 per week</span>' +
          '</div>' +
          slotDisplay +
          '<div class="validation-msg" id="slotValidation">Please select a time slot from the calendar.</div>' +
          '<form id="bookingForm" novalidate>' +
            '<div class="form-group">' +
              '<label class="form-label">Your English level</label>' +
              '<select class="form-select" id="levelSelect">' +
                '<option value="" disabled selected>Choose your level\u2026</option>' +
                '<option>Beginner</option><option>Elementary</option><option>Intermediate</option>' +
                '<option>Upper Intermediate</option><option>Advanced</option><option>Exam Preparation</option>' +
              '</select>' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label">Focus areas <span style="color:var(--gray-400);font-weight:400;">(select all that apply)</span></label>' +
              '<div class="focus-chips">' +
                '<button type="button" class="focus-chip" onclick="this.classList.toggle(\'selected\')">Speaking</button>' +
                '<button type="button" class="focus-chip" onclick="this.classList.toggle(\'selected\')">Grammar</button>' +
                '<button type="button" class="focus-chip" onclick="this.classList.toggle(\'selected\')">Pronunciation</button>' +
                '<button type="button" class="focus-chip" onclick="this.classList.toggle(\'selected\')">Writing</button>' +
                '<button type="button" class="focus-chip" onclick="this.classList.toggle(\'selected\')">Listening</button>' +
                '<button type="button" class="focus-chip" onclick="this.classList.toggle(\'selected\')">Exam Prep</button>' +
                '<button type="button" class="focus-chip" onclick="this.classList.toggle(\'selected\')">Business</button>' +
                '<button type="button" class="focus-chip" onclick="this.classList.toggle(\'selected\')">Vocabulary</button>' +
              '</div>' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label">What would you like to practise?</label>' +
              '<textarea class="form-textarea" id="commentArea" placeholder="Tell your tutor what you\u2019d like to work on\u2026"></textarea>' +
            '</div>' +
            '<button type="submit" class="btn-submit-lesson">' +
              'Request Lesson' +
              '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>' +
            '</button>' +
          '</form>' +
        '</div>' +
        '<div class="confirmation-msg" id="confirmationMsg">' +
          '<div class="confirmation-icon">' +
            '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
          '</div>' +
          '<div class="confirmation-title">Lesson Requested!</div>' +
          '<p class="confirmation-sub">Your lesson request has been sent. Your tutor will confirm the booking soon.</p>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function attachMobileFormEvents() {
    var form = document.getElementById('bookingForm');
    if (form) form.addEventListener('submit', handleFormSubmit);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!selectedSlot) {
      var v = document.getElementById('slotValidation');
      if (v) v.classList.add('show');
      return;
    }
    var tmpl = document.querySelector('.teacher-card-template[data-id="' + activeTeacherId + '"]');
    var teacherName = tmpl ? tmpl.dataset.name : 'Alba English';
    var levelEl   = document.getElementById('levelSelect');
    var commentEl = document.getElementById('commentArea');
    var level     = levelEl   ? levelEl.value   : '';
    var comment   = commentEl ? commentEl.value : '';
    var focusChips = Array.prototype.slice.call(document.querySelectorAll('.focus-chip.selected'))
      .map(function (c) { return c.textContent; }).join(', ');
    var data = new FormData();
    data.append('teacher',     teacherName);
    data.append('slot',        selectedSlot.day + ' ' + selectedSlot.date + ' at ' + selectedSlot.time);
    data.append('level',       level);
    data.append('focus_areas', focusChips || 'None selected');
    data.append('message',     comment);
    data.append('_subject',    'Lesson Request \u2014 ' + teacherName);
    data.append('_captcha',    'false');
    data.append('_template',   'table');
    fetch('https://formsubmit.co/info@albaenglish.academy', { method: 'POST', body: data }).catch(function () {});
    var inner = document.getElementById('bookingFormInner');
    var conf  = document.getElementById('confirmationMsg');
    if (inner) inner.style.display = 'none';
    if (conf)  conf.classList.add('show');
  }

  window.selectTeacher = function (id) {
    activeTeacherId = id;
    selectedSlot = null;
    if (window.innerWidth <= 640) {
      renderTeachers();
      setTimeout(function () {
        var el = document.querySelector('.mobile-inline-booking');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      renderTeachers();
      renderCalendar();
      updateSlotDisplay();
      updateFormTeacher();
    }
  };

  function renderCalendar() {
    var grid = document.getElementById('calendarGrid');
    if (!grid) return;
    var avail = teacherAvailability[activeTeacherId] || {};
    var days  = getWeekDates(weekOffset);
    var first = days[0].date, last = days[4].date;
    var weekLabel = document.getElementById('weekLabel');
    if (weekLabel) weekLabel.textContent = formatDate(first) + ' \u2013 ' + formatDate(last);
    grid.innerHTML = days.map(function (d) {
      var name = d.name, date = d.date;
      var slots = avail[name] || [];
      var slotsHtml = slots.length
        ? slots.map(function (time) {
            var isSelected = selectedSlot && selectedSlot.day === name && selectedSlot.time === time;
            return '<button class="time-slot' + (isSelected ? ' selected' : '') + '" onclick="selectSlot(\'' + name + '\',\'' + time + '\',\'' + formatDate(date) + '\')">' + time + '</button>';
          }).join('')
        : '<div class="cal-no-slots">\u2014</div>';
      return '<div class="cal-day-col">' +
        '<div class="cal-day-header">' +
          '<div class="cal-day-name">' + name + '</div>' +
          '<div class="cal-day-num' + (isToday(date) ? ' today' : '') + '">' + date.getDate() + '</div>' +
        '</div>' +
        '<div class="cal-slots">' + slotsHtml + '</div>' +
      '</div>';
    }).join('');
  }

  window.selectSlot = function (day, time, dateStr) {
    selectedSlot = { day: day, time: time, date: dateStr };
    updateSlotDisplay();
    renderCalendar();
    var v = document.getElementById('slotValidation');
    if (v) v.classList.remove('show');
  };

  function updateSlotDisplay() {
    var el  = document.getElementById('selectedSlotDisplay');
    var txt = document.getElementById('selectedSlotText');
    if (!el || !txt) return;
    if (selectedSlot) {
      el.classList.remove('empty');
      txt.textContent = selectedSlot.day + ' ' + selectedSlot.date + ' at ' + selectedSlot.time;
    } else {
      el.classList.add('empty');
      txt.textContent = 'No time selected yet';
    }
  }

  function updateFormTeacher() {
    var tmpl = document.querySelector('.teacher-card-template[data-id="' + activeTeacherId + '"]');
    var nameEl   = document.getElementById('selectedTeacherName');
    var avatarEl = document.getElementById('selectedTeacherAvatar');
    var confEl   = document.getElementById('confirmationMsg');
    var innerEl  = document.getElementById('bookingFormInner');
    if (tmpl) {
      if (nameEl)   nameEl.textContent = tmpl.dataset.name;
      if (avatarEl) { avatarEl.src = tmpl.dataset.photo; avatarEl.alt = tmpl.dataset.name; }
    }
    if (confEl)  confEl.classList.remove('show');
    if (innerEl) innerEl.style.display = 'block';
  }

  window.changeWeek = function (dir) {
    weekOffset += dir;
    selectedSlot = null;
    if (window.innerWidth <= 640) {
      renderTeachers();
    } else {
      renderCalendar();
      updateSlotDisplay();
    }
  };

  function initBookLesson() {
    if (!document.getElementById('teachersContainer') &&
        !document.getElementById('calendarGrid')) return;

    var prevBtn = document.getElementById('prevWeek');
    var nextBtn = document.getElementById('nextWeek');
    if (prevBtn) prevBtn.addEventListener('click', function () { window.changeWeek(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { window.changeWeek(1); });

    var staticForm = document.getElementById('bookingForm');
    if (staticForm) staticForm.addEventListener('submit', handleFormSubmit);

    window.addEventListener('resize', function () {
      clearTimeout(window._resizeTimer);
      window._resizeTimer = setTimeout(function () {
        if (window.innerWidth > 640) {
          renderCalendar();
          updateSlotDisplay();
          updateFormTeacher();
        } else {
          renderTeachers();
        }
      }, 200);
    });

    renderTeachers();
    renderCalendar();
    updateSlotDisplay();
    updateFormTeacher();
  }

  function initPasswordToggle() {
    var toggle = document.getElementById('togglePw');
    var pw     = document.getElementById('password');
    if (!toggle || !pw) return;
    toggle.addEventListener('click', function () {
      pw.type = pw.type === 'password' ? 'text' : 'password';
    });
  }

  function initLoginForm() {
    var form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = document.getElementById('loginBtn');
      var msg = document.getElementById('loginMsg');
      var emailEl = document.getElementById('email');
      if (!btn || !msg || !emailEl) return;
      btn.disabled = true;
      btn.textContent = 'Sending\u2026';
      var data = new FormData();
      data.append('email', emailEl.value);
      data.append('_subject', 'Log In Request \u2014 Alba English');
      data.append('_captcha', 'false');
      data.append('_template', 'table');
      fetch('https://formsubmit.co/info@albaenglish.academy', { method: 'POST', body: data })
        .then(function (res) {
          if (res.ok) {
            msg.style.display = 'block';
            msg.textContent = '\u2713 Message sent! We\u2019ll be in touch shortly.';
            form.reset();
          } else { throw new Error(); }
        })
        .catch(function () {
          msg.style.display = 'block';
          msg.style.color = '#e63946';
          msg.textContent = 'Something went wrong. Please email us directly at info@albaenglish.academy';
        })
        .then(function () {
          btn.disabled = false;
          btn.innerHTML = 'Log In <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
        });
    });
  }

  function initPasswordStrength() {
    var pw = document.getElementById('password');
    var s1 = document.getElementById('s1');
    var s2 = document.getElementById('s2');
    var s3 = document.getElementById('s3');
    var s4 = document.getElementById('s4');
    var lbl = document.getElementById('strengthLabel');
    if (!pw || !s1 || !s2 || !s3 || !s4 || !lbl) return;
    var segs = [s1, s2, s3, s4];
    var colors = ['#e63946','#f4a261','#2a9d8f','#2E7D5E'];
    var labels = ['Weak','Fair','Good','Strong'];
    pw.addEventListener('input', function () {
      var v = pw.value;
      var score = 0;
      if (v.length >= 8) score++;
      if (/[A-Z]/.test(v)) score++;
      if (/[0-9]/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;
      segs.forEach(function (s, i) {
        s.style.background = i < score ? colors[score - 1] : '#e5e9db';
      });
      lbl.textContent = v.length ? (labels[score - 1] || '') : '';
      lbl.style.color = v.length ? colors[score - 1] : '#8a9a80';
    });
  }

  function initSignupForm() {
    var form = document.getElementById('signupForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = document.getElementById('signupBtn');
      var msg = document.getElementById('signupMsg');
      var terms = document.getElementById('terms');
      if (!btn || !msg) return;
      if (terms && !terms.checked) {
        msg.style.display = 'block';
        msg.style.color = '#e63946';
        msg.textContent = 'Please agree to the Terms of Service to continue.';
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Sending\u2026';
      var data = new FormData();
      var fn = document.getElementById('firstname');
      var ln = document.getElementById('lastname');
      var em = document.getElementById('email');
      var lv = document.getElementById('level');
      if (fn) data.append('firstname', fn.value);
      if (ln) data.append('lastname',  ln.value);
      if (em) data.append('email',     em.value);
      if (lv) data.append('level',     lv.value);
      data.append('_subject', 'New Sign Up \u2014 Alba English');
      data.append('_captcha', 'false');
      data.append('_template', 'table');
      fetch('https://formsubmit.co/info@albaenglish.academy', { method: 'POST', body: data })
        .then(function (res) {
          if (res.ok) {
            msg.style.display = 'block';
            msg.style.color = 'var(--emerald)';
            msg.textContent = '\u2713 Account request sent! We\u2019ll be in touch shortly.';
            form.reset();
            ['s1','s2','s3','s4'].forEach(function (sid) {
              var el = document.getElementById(sid);
              if (el) el.style.background = '#e5e9db';
            });
            var lbl = document.getElementById('strengthLabel');
            if (lbl) lbl.textContent = '';
          } else { throw new Error(); }
        })
        .catch(function () {
          msg.style.display = 'block';
          msg.style.color = '#e63946';
          msg.textContent = 'Something went wrong. Please email us at info@albaenglish.academy';
        })
        .then(function () {
          btn.disabled = false;
          btn.innerHTML = 'Create Account <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
        });
    });
  }

  function initAuthSlideshow() {
    var slides = document.querySelectorAll('.image-panel .slide');
    var dots   = document.querySelectorAll('.image-panel .slide-dot');
    if (!slides.length) return;
    var cur = 0, timer;
    function goTo(n) {
      slides[cur].classList.remove('active', 'first-load');
      if (dots[cur]) dots[cur].classList.remove('active');
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add('active');
      if (dots[cur]) dots[cur].classList.add('active');
    }
    function start() { timer = setInterval(function () { goTo(cur + 1); }, 5000); }
    requestAnimationFrame(function () {
      setTimeout(function () {
        if (slides[0]) slides[0].classList.remove('first-load');
      }, 100);
    });
    dots.forEach(function (d) {
      d.addEventListener('click', function () {
        clearInterval(timer);
        goTo(+d.dataset.i);
        start();
      });
    });
    start();
  }

  function init() {
    initMobileMenu();
    initStickyNavbar();
    initFadeUp();
    initScheduleAccordion();
    initTestimonialCarousel();
    initBookLesson();
    initPasswordToggle();
    initPasswordStrength();
    initLoginForm();
    initSignupForm();
    initAuthSlideshow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
