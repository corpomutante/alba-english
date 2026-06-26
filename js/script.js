(function(){
  var head=document.querySelector('.site-head');
  var burger=document.querySelector('.burger');
  var nav=document.querySelector('.nav');
  if(head){
    var stick=function(){head.classList.toggle('is-stuck',window.scrollY>6);};
    stick();
    window.addEventListener('scroll',stick,{passive:true});
  }
  if(burger&&nav){
    var setOpen=function(open){
      nav.classList.toggle('open',open);
      burger.setAttribute('aria-expanded',String(open));
      document.body.style.overflow=open?'hidden':'';
    };
    burger.addEventListener('click',function(){setOpen(!nav.classList.contains('open'));});
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setOpen(false);});});
    window.addEventListener('resize',function(){if(window.innerWidth>980)setOpen(false);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')setOpen(false);});
  }
})();

(function(){
  var els=Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if(!els.length)return;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var check=function(){
    var h=window.innerHeight||document.documentElement.clientHeight;
    for(var i=els.length-1;i>=0;i--){
      var r=els[i].getBoundingClientRect();
      if(r.top<h-30&&r.bottom>0){els[i].classList.add('in');els.splice(i,1);}
    }
  };
  requestAnimationFrame(function(){
    document.documentElement.classList.add('anim');
    check();
    window.addEventListener('scroll',check,{passive:true});
    window.addEventListener('resize',check,{passive:true});
    window.addEventListener('load',check);
    setTimeout(function(){document.querySelectorAll('.reveal').forEach(function(e){e.classList.add('in');});},2500);
  });
})();

(function(){
  var items=document.querySelectorAll('.faq-item');
  items.forEach(function(item){
    var q=item.querySelector('.faq-q');
    var a=item.querySelector('.faq-a');
    if(!q||!a)return;
    q.setAttribute('aria-expanded','false');
    q.addEventListener('click',function(){
      var open=q.getAttribute('aria-expanded')==='true';
      items.forEach(function(o){
        var oq=o.querySelector('.faq-q');var oa=o.querySelector('.faq-a');
        if(oq)oq.setAttribute('aria-expanded','false');
        if(oa)oa.style.maxHeight=null;
      });
      if(!open){q.setAttribute('aria-expanded','true');a.style.maxHeight=a.scrollHeight+'px';}
    });
  });
})();

(function(){
  var forms=document.querySelectorAll('form[data-validate]');
  forms.forEach(function(form){
    var success=form.dataset.success?document.querySelector(form.dataset.success):null;
    var validateField=function(field){
      var radios=field.querySelectorAll('input[type="radio"]');
      if(radios.length){
        var ok=Array.prototype.some.call(radios,function(r){return r.checked;});
        field.classList.toggle('invalid',!ok);return ok;
      }
      var c=field.querySelector('.input, .select, .textarea');
      if(!c)return true;
      var ok2=true;var v=(c.value||'').trim();
      if(c.required&&!v)ok2=false;
      if(ok2&&c.type==='email'&&v)ok2=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      field.classList.toggle('invalid',!ok2);return ok2;
    };
    form.querySelectorAll('.field').forEach(function(field){
      var c=field.querySelector('.input, .select, .textarea');
      if(c){
        c.addEventListener('blur',function(){if(field.classList.contains('invalid'))validateField(field);});
        c.addEventListener('input',function(){if(field.classList.contains('invalid'))validateField(field);});
      }
      field.querySelectorAll('input[type="radio"]').forEach(function(r){
        r.addEventListener('change',function(){if(field.classList.contains('invalid'))validateField(field);});
      });
    });
    form.querySelectorAll('input[type="checkbox"][required]').forEach(function(cb){
      cb.addEventListener('change',function(){
        var row=cb.closest('.checkbox-row')||cb.parentElement;
        if(row)row.classList.toggle('invalid',!cb.checked);
      });
    });
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var allOk=true;var firstBad=null;
      form.querySelectorAll('.field').forEach(function(field){
        var ok=validateField(field);
        if(!ok&&!firstBad)firstBad=field;
        if(!ok)allOk=false;
      });
      form.querySelectorAll('input[type="checkbox"][required]').forEach(function(cb){
        var row=cb.closest('.checkbox-row')||cb.parentElement;
        if(row)row.classList.toggle('invalid',!cb.checked);
        if(!cb.checked){allOk=false;if(!firstBad)firstBad=cb;}
      });
      if(!allOk){
        if(firstBad){var c=firstBad.querySelector?firstBad.querySelector('.input, .select, .textarea, input'):firstBad;if(c&&c.focus)c.focus();}
        return;
      }
      if(form.id==='contactForm'){
        var gv=function(n){var el=form.querySelector('[name="'+n+'"]');return el?(el.value||'').trim():'';};
        var subj='Website enquiry: '+(gv('topic')||'General');
        var bodyTxt='Name: '+gv('name')+'\nEmail: '+gv('email')+'\nTopic: '+gv('topic')+'\n\n'+gv('message');
        window.location.href='mailto:info@albaenglish.academy?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(bodyTxt);
      }
      if(success){
        form.style.display='none';
        success.classList.add('show');
        success.setAttribute('tabindex','-1');
        success.focus();
      }else{
        var btn=form.querySelector('button[type="submit"]');
        if(btn){btn.textContent='Done';btn.disabled=true;}
      }
    });
  });
})();

(function(){
  var path=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav a').forEach(function(a){
    var href=a.getAttribute('href');
    if(href===path||(path==='index.html'&&href==='index.html'))a.classList.add('active');
  });
})();

(function(){
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var id=a.getAttribute('href');
      if(id==='#'||id.length<2)return;
      var t=document.querySelector(id);
      if(!t)return;
      e.preventDefault();
      var y=t.getBoundingClientRect().top+window.scrollY-92;
      window.scrollTo({top:y,behavior:'smooth'});
    });
  });
})();

/* Password show / hide toggle */
(function(){
  document.querySelectorAll('[data-pw]').forEach(function(btn){
    var input=btn.parentElement.querySelector('input');
    if(!input)return;
    btn.addEventListener('click',function(){
      var show=input.type==='password';
      input.type=show?'text':'password';
      btn.classList.toggle('on',show);
      btn.setAttribute('aria-label',show?'Hide password':'Show password');
      input.focus();
    });
  });
})();

/* =========================================================
   Tutor booking calendar
   ========================================================= */
(function(){
  var root=document.getElementById('booking');
  if(!root)return;

  var TUTORS={
    vivien:{name:'Vivien',fullName:'Vivien May',role:'Certified Teacher',spec:'Cambridge & IELTS',initials:'V',tag:'Super Tutor',rate:30,seed:3,busy:2,
      avail:{1:[10,19],2:[10,19],3:[10,19],4:[10,15]},
      availText:'<b>Tue–Fri</b> · 10:00–19:00 (Fri until 15:00)'},
    tamara:{name:'Tamara',fullName:'Tamara Jane',role:'Certified Teacher',spec:'Conversation & Business',initials:'T',tag:'Top Conversation',rate:28,seed:7,busy:2,
      avail:{0:[16,21],1:[16,21],2:[16,21],3:[16,21]},
      availText:'<b>Mon–Thu</b> · 16:00–21:00'},
    kayleigh:{name:'Kayleigh',fullName:'Kayleigh María',role:'Certified Teacher',spec:'Trinity & Pronunciation',initials:'K',tag:'Exam Ready',rate:26,seed:5,busy:2,
      avail:{0:[10,19],1:[10,19],2:[10,19],3:[10,19],4:[10,19]},
      availText:'<b>Mon–Fri</b> · 10:00–19:00'},
    lucia:{name:'Lucía',fullName:'Lucía Romero',role:'Certified Teacher',spec:'Conversation & Grammar',initials:'L',tag:'Business Ready',rate:27,seed:4,busy:2,
      avail:{0:[12,20],1:[12,20],2:[12,20],3:[12,20],4:[12,18]},
      availText:'<b>Mon–Fri</b> · 12:00–20:00 (Fri until 18:00)'},
    mateus:{name:'Mateus',fullName:'Mateus Silva',role:'Certified Teacher',spec:'Business & Pronunciation',initials:'M',tag:'Business Ready',rate:27,seed:8,busy:2,
      avail:{0:[10,16],1:[10,18],2:[10,18],3:[10,16],4:[10,16]},
      availText:'<b>Mon–Fri</b> · 10:00–18:00'},
    daniel:{name:'Daniel',fullName:'Daniel Brooks',role:'Certified Teacher',spec:'Conversation & Fluency',initials:'D',tag:'Top Conversation',rate:28,seed:6,busy:2,
      avail:{0:[14,20],1:[14,20],2:[14,20],3:[14,20],4:[14,18]},
      availText:'<b>Mon–Fri</b> · 14:00–20:00 (Fri until 18:00)'},
    noor:{name:'Noor',fullName:'Noor Hadid',role:'Certified Teacher',spec:'IELTS & Academic',initials:'N',tag:'Exam Ready',rate:29,seed:9,busy:2,
      avail:{0:[10,17],1:[10,17],2:[10,17],3:[10,17]},
      availText:'<b>Mon–Thu</b> · 10:00–17:00'}
  };
  var LEVELS=['Beginner (A1)','Elementary (A2)','Intermediate (B1)','Upper-Intermediate (B2)','Advanced (C1)','Proficient (C2)','Not sure — help me find out'];
  var FOCUS=['Speaking','Grammar','Pronunciation','Writing','Listening','Exam Prep','Business','Vocabulary'];
  var MAXWK_SLOTS=3;
  var DAYS=5;                 // Mon–Fri
  var HOURS=[10,11,12,13,14,15,16,17,18,19,20];
  var MAXWK=3;               // current + 3 weeks ahead

  var grid=document.getElementById('calGrid');
  var weekLabel=document.getElementById('calWeek');
  var prevBtn=document.getElementById('calPrev');
  var nextBtn=document.getElementById('calNext');
  var summary=document.getElementById('bookingSummary');
  var tabs=Array.prototype.slice.call(root.querySelectorAll('[data-tutor]'));

  var current='vivien';
  var _dow=new Date().getDay();var _mi=(_dow===0?6:_dow-1);
  var week=_mi>=3?1:0;   // if it's Thu or later, open next week by default
  var selected={};   // tutorId -> { "wk-day-hour": true }
  var confirmedExtra={}; // tutorId -> { key:true } locally booked
  var done=false;
  var form={level:'',focus:[],practise:'',email:''}; // lesson detail inputs

  try{
    var saved=JSON.parse(localStorage.getItem('alba-booking')||'{}');
    if(saved.selected)selected=saved.selected;
    if(saved.current&&TUTORS[saved.current])current=saved.current;
    if(saved.confirmedExtra)confirmedExtra=saved.confirmedExtra;
    if(saved.form)form=Object.assign(form,saved.form);
  }catch(e){}
  // Arriving from another page (e.g. a home-page tutor card) with ?tutor=…
  // preselects that tutor and scrolls the booking section into view.
  var _qTutor=null;
  try{
    var _p=new URLSearchParams(location.search);
    var _t=_p.get('tutor');
    if(_t&&TUTORS[_t]){current=_t;_qTutor=_t;}
  }catch(e){}
  Object.keys(TUTORS).forEach(function(t){if(!selected[t])selected[t]={};if(!confirmedExtra[t])confirmedExtra[t]={};});

  var persist=function(){
    try{localStorage.setItem('alba-booking',JSON.stringify({selected:selected,current:current,confirmedExtra:confirmedExtra,form:form}));}catch(e){}
  };

  var pad=function(n){return(n<10?'0':'')+n;};
  var esc=function(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');};
  var mondayOf=function(off){
    var d=new Date();d.setHours(0,0,0,0);
    var day=d.getDay();var diff=(day===0?-6:1-day);
    d.setDate(d.getDate()+diff+off*7);return d;
  };
  var slotDate=function(wk,day){var m=mondayOf(wk);var d=new Date(m);d.setDate(m.getDate()+day);return d;};
  var now=new Date();
  var isPast=function(wk,day,hour){
    var d=slotDate(wk,day);d.setHours(hour,0,0,0);return d.getTime()<now.getTime();
  };
  var isToday=function(wk,day){
    var d=slotDate(wk,day);var t=new Date();
    return d.getFullYear()===t.getFullYear()&&d.getMonth()===t.getMonth()&&d.getDate()===t.getDate();
  };
  var inWindow=function(t,day,hour){
    var w=t.avail&&t.avail[day];
    return !!w&&hour>=w[0]&&hour<w[1];
  };
  var isBooked=function(t,wk,day,hour){
    if(!inWindow(t,day,hour))return true;            // outside the tutor's working hours
    var h=(t.seed*31+(wk+1)*17+day*7+hour*13)%10;return h<t.busy;  // a few already booked
  };
  var key=function(wk,day,hour){return wk+'-'+day+'-'+hour;};

  var renderWeekLabel=function(){
    var m=mondayOf(week);var e=slotDate(week,DAYS-1);
    var opt={day:'numeric',month:'short'};
    var txt=m.toLocaleDateString('en-GB',opt)+' – '+e.toLocaleDateString('en-GB',opt);
    weekLabel.innerHTML=(week===0?'This week':'In '+week+' week'+(week>1?'s':''))+'<span>'+txt+'</span>';
    prevBtn.disabled=week<=0;nextBtn.disabled=week>=MAXWK;
  };

  var renderGrid=function(){
    var t=TUTORS[current];
    var html='<div class="cal-cell cal-timehead"></div>';
    for(var d=0;d<DAYS;d++){
      var date=slotDate(week,d);
      html+='<div class="cal-cell cal-colhead'+(isToday(week,d)?' is-today':'')+'">'+
        '<div class="dow">'+date.toLocaleDateString('en-GB',{weekday:'short'})+'</div>'+
        '<div class="dnum">'+date.getDate()+'</div></div>';
    }
    HOURS.forEach(function(hour){
      html+='<div class="cal-cell cal-time">'+pad(hour)+':00</div>';
      for(var d=0;d<DAYS;d++){
        var k=key(week,d,hour);
        var taken=isPast(week,d,hour)||isBooked(t,week,d,hour)||confirmedExtra[current][k];
        var sel=!taken&&selected[current][k];
        var cls=taken?'taken':(sel?'selected':'free');
        var lbl=pad(hour)+':00–'+pad(hour+1)+':00';
        if(taken){
          html+='<div class="cal-cell"><div class="slot taken" aria-disabled="true" title="Unavailable"></div></div>';
        }else{
          html+='<div class="cal-cell"><button type="button" class="slot '+cls+'" data-k="'+k+'" '+
            'aria-pressed="'+(sel?'true':'false')+'" aria-label="'+lbl+', '+
            slotDate(week,d).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})+'">'+lbl+'</button></div>';
        }
      }
    });
    grid.innerHTML=html;
  };

  var collectAll=function(){
    var arr=[];
    Object.keys(selected[current]).forEach(function(k){
      if(!selected[current][k])return;
      var p=k.split('-');var wk=+p[0],day=+p[1],hour=+p[2];
      arr.push({k:k,wk:wk,day:day,hour:hour,date:slotDate(wk,day)});
    });
    arr.sort(function(a,b){return a.date-b.date||a.hour-b.hour;});
    return arr;
  };

  var renderSummary=function(){
    var t=TUTORS[current];
    if(done){
      summary.innerHTML='<div class="booking-success">'+
        '<div class="fic"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6 9 17l-5-5"/></svg></div>'+
        '<h3 class="h3">Lesson requested!</h3>'+
        '<p>We\u2019ve sent your request to '+t.fullName+'. A confirmation will arrive at '+(form.email?'<b>'+esc(form.email)+'</b>':'your inbox')+' within one working day.</p>'+
        '<button type="button" class="btn btn-line btn--block" id="bookMore">Request another lesson</button></div>';
      document.getElementById('bookMore').addEventListener('click',function(){done=false;render();});
      return;
    }
    var list=collectAll();
    var hours=list.length;
    var dots='';
    for(var i=0;i<MAXWK_SLOTS;i++){dots+='<i'+(i<hours?' class="on"':'')+'></i>';}

    var html='<div class="ld">';
    html+='<h3 class="ld-title">Your Lesson Details</h3>';

    // Tutor card
    html+='<div class="ld-tutor"><span class="ld-ava" data-tutor="'+current+'">'+t.initials+'</span>'+
      '<div class="ld-tutor-meta"><b>'+t.fullName+'</b><span>'+t.tag+'</span></div></div>';

    // Slots counter
    html+='<div class="ld-slots"><span class="ld-slots-lbl">Slots selected</span>'+
      '<span class="ld-dots" aria-hidden="true">'+dots+'</span>'+
      '<span class="ld-slots-hint">max 3 per week</span></div>';

    // Selected times
    if(!hours){
      html+='<div class="ld-time empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg><span>No time selected yet</span></div>';
    }else{
      html+='<div class="ld-time-list">';
      list.forEach(function(s){
        var dl=s.date.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});
        html+='<div class="ld-time filled"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>'+
          '<span class="d">'+dl+'</span><span class="t">'+pad(s.hour)+':00\u2013'+pad(s.hour+1)+':00</span>'+
          '<button type="button" class="rm" data-rm="'+s.k+'" aria-label="Remove this slot">'+
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>';
      });
      html+='</div>';
    }

    // English level
    html+='<div class="ld-field"><label for="ldLevel">Your English level</label>'+
      '<div class="ld-select"><select id="ldLevel"><option value="">Choose your level\u2026</option>';
    LEVELS.forEach(function(lv){html+='<option'+(form.level===lv?' selected':'')+'>'+lv+'</option>';});
    html+='</select><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></div></div>';

    // Focus areas
    html+='<div class="ld-field"><label>Focus areas <span class="opt">(select all that apply)</span></label>'+
      '<div class="ld-chips">';
    FOCUS.forEach(function(f){
      var on=form.focus.indexOf(f)>-1;
      html+='<button type="button" class="ld-chip'+(on?' on':'')+'" data-focus="'+f+'" aria-pressed="'+(on?'true':'false')+'">'+f+'</button>';
    });
    html+='</div></div>';

    // Practise
    html+='<div class="ld-field"><label for="ldPractise">What would you like to practise?</label>'+
      '<textarea id="ldPractise" rows="3" placeholder="Tell your tutor what you\u2019d like to work on\u2026">'+esc(form.practise)+'</textarea></div>';

    // Email
    html+='<div class="ld-field"><label for="ldEmail">Your email</label>'+
      '<input type="email" id="ldEmail" placeholder="you@example.com" value="'+esc(form.email)+'" autocomplete="email" /></div>';

    // Submit
    html+='<button type="button" class="btn btn-primary btn--lg btn--block" id="bookConfirm"'+(hours?'':' disabled')+'>'+
      (hours?'Request Lesson':'Select a time to request')+' <span class="ar" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></button>';
    html+='<p class="bs-note">Free trial first \u00b7 no payment taken now. We\u2019ll confirm by email within one working day.</p>';
    html+='</div>';

    summary.innerHTML=html;

    summary.querySelectorAll('[data-rm]').forEach(function(b){
      b.addEventListener('click',function(){delete selected[current][b.getAttribute('data-rm')];persist();render();});
    });
    summary.querySelectorAll('[data-focus]').forEach(function(b){
      b.addEventListener('click',function(){
        var f=b.getAttribute('data-focus');var idx=form.focus.indexOf(f);
        if(idx>-1)form.focus.splice(idx,1);else form.focus.push(f);
        var on=form.focus.indexOf(f)>-1;
        b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false');
        persist();
      });
    });
    var lvl=document.getElementById('ldLevel');
    if(lvl)lvl.addEventListener('change',function(){form.level=lvl.value;persist();});
    var pr=document.getElementById('ldPractise');
    if(pr)pr.addEventListener('input',function(){form.practise=pr.value;persist();});
    var em=document.getElementById('ldEmail');
    if(em)em.addEventListener('input',function(){form.email=em.value;persist();});
    var cf=document.getElementById('bookConfirm');
    if(cf&&hours)cf.addEventListener('click',function(){
      list.forEach(function(s){confirmedExtra[current][s.k]=true;});
      selected[current]={};done=true;persist();render();
    });
  };

  var render=function(){renderWeekLabel();renderGrid();renderSummary();};

  grid.addEventListener('click',function(e){
    var btn=e.target.closest('.slot.free, .slot.selected');
    if(!btn||!btn.dataset.k)return;
    var k=btn.dataset.k;
    if(selected[current][k])delete selected[current][k];else selected[current][k]=true;
    done=false;persist();render();
  });
  prevBtn.addEventListener('click',function(){if(week>0){week--;render();}});
  nextBtn.addEventListener('click',function(){if(week<MAXWK){week++;render();}});
  tabs.forEach(function(tab){
    tab.addEventListener('click',function(){
      current=tab.getAttribute('data-tutor');done=false;
      tabs.forEach(function(o){var on=o===tab;o.setAttribute('aria-selected',String(on));o.classList.toggle('tab-on',on);});
      persist();render();
    });
  });
  tabs.forEach(function(tab){var on=tab.getAttribute('data-tutor')===current;tab.setAttribute('aria-selected',String(on));tab.classList.toggle('tab-on',on);});
  render();

  // If we arrived with ?tutor=…, bring the booking calendar into view. Use an
  // INSTANT scroll (not smooth) and re-run it as fonts/images settle, so the
  // landing position is reliable on a fresh cross-page load — the native
  // smooth-scroll to #bookingSection can stall mid-load on a long page.
  if(_qTutor){
    var goToBooking=function(){
      var sec=document.getElementById('bookingSection');
      if(!sec)return;
      var y=sec.getBoundingClientRect().top+window.scrollY-100;
      if(y<0)y=0;
      window.scrollTo(0,y);
    };
    requestAnimationFrame(goToBooking);
    window.addEventListener('load',function(){goToBooking();setTimeout(goToBooking,120);});
    setTimeout(goToBooking,250);
    setTimeout(goToBooking,600);
  }
})();


/* ===== Alba: floating WhatsApp button (all pages) ===== */
(function(){
  if(window.__albaWaFab)return; window.__albaWaFab=true;
  function init(){
    if(document.querySelector('.wa-fab'))return;
    var msg="Hi Alba English! I'm interested in your classes and would like more information.";
    var wa=document.createElement('a');
    wa.className='wa-fab';
    wa.href='https://wa.me/34625040861?text='+encodeURIComponent(msg);
    wa.target='_blank'; wa.rel='noopener';
    wa.setAttribute('aria-label','Chat with us on WhatsApp');
    wa.innerHTML='<span class="wa-tip">Chat with us</span>'+
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.892c0 2.096.549 4.142 1.595 5.945L0 24l6.335-1.652a11.93 11.93 0 005.71 1.454h.006c6.585 0 11.946-5.359 11.949-11.945C24 8.495 22.797 5.681 20.52 3.449"/></svg>';
    document.body.appendChild(wa);

    // Occasional "circular movement" to draw the eye — at random intervals,
    // skipped while the user is hovering (or if they prefer reduced motion).
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if(!reduce){
      var hovering=false;
      wa.addEventListener('mouseenter',function(){hovering=true;});
      wa.addEventListener('mouseleave',function(){hovering=false;});
      var dance=function(){
        if(!hovering && !document.hidden){
          wa.classList.add('is-calling');
          setTimeout(function(){wa.classList.remove('is-calling');},2500);
        }
        setTimeout(dance, 6000 + Math.random()*9000); // every ~6–15s
      };
      setTimeout(dance, 3500);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();


/* ===== Alba: paged tutor carousel =====
   Shows a full screen-width page of cards (3 desktop / 1 tablet+mobile via CSS
   --cols), navigated with arrows, dots, and touch-swipe. No DOM cloning —
   each image-slot keeps its unique id + dragged photo. */
(function(){
  function debounce(fn,ms){ var t; return function(){ clearTimeout(t); t=setTimeout(fn,ms); }; }

  function build(carousel){
    if(carousel.__circ) return; carousel.__circ = true;
    var track = carousel.querySelector('.tutor-track');
    if(!track) return;
    var cards = [].slice.call(track.children);
    if(cards.length < 2) return;

    // ----- structure: wrap > carousel, plus prev/next arrows on the wrap -----
    var wrap = document.createElement('div'); wrap.className = 'tutor-carousel-wrap';
    carousel.parentNode.insertBefore(wrap, carousel);
    wrap.appendChild(carousel);

    var prev = document.createElement('button');
    prev.type = 'button'; prev.className = 'tc-nav prev'; prev.setAttribute('aria-label','Previous tutors');
    prev.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>';
    var next = document.createElement('button');
    next.type = 'button'; next.className = 'tc-nav next'; next.setAttribute('aria-label','Next tutors');
    next.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
    wrap.appendChild(prev); wrap.appendChild(next);

    // Let vertical page-scroll through, but claim horizontal drags.
    carousel.style.touchAction = 'pan-y';
    track.style.userSelect = 'none';

    var TRANS    = '.62s cubic-bezier(.45,0,.2,1)'; // slide easing
    var DUR      = 680;                             // ms, ≥ TRANS
    var INTERVAL = 3600;                            // ms a card rests on-screen
    var timer = null, animating = false;

    function gap(){ var s = getComputedStyle(track); return parseFloat(s.columnGap || s.gap) || 0; }
    function step(){
      var f = track.firstElementChild;
      return f ? f.getBoundingClientRect().width + gap() : 0;
    }

    // We always REST at translateX(0) showing full cards, and move the REAL
    // card elements (never clones) so each image-slot keeps its dropped photo.

    // Next: slide left one card, then recycle the first card to the end and
    // snap back to 0 — a seamless circular loop.
    function goNext(){
      if(animating) return;
      var S = step(); if(S <= 0) return;
      animating = true;
      track.style.transition = 'transform ' + TRANS;
      track.style.transform  = 'translateX(' + (-S) + 'px)';
      setTimeout(function(){
        track.style.transition = 'none';
        track.appendChild(track.firstElementChild);
        track.style.transform  = 'translateX(0)';
        void track.offsetWidth;
        animating = false;
      }, DUR);
    }

    // Prev: pull the last card to the front, sit one card to the left with no
    // transition, then animate back to 0 so it slides in from the left.
    function goPrev(){
      if(animating) return;
      track.style.transition = 'none';
      track.insertBefore(track.lastElementChild, track.firstElementChild);
      var S = step(); if(S <= 0) return;
      animating = true;
      track.style.transform = 'translateX(' + (-S) + 'px)';
      void track.offsetWidth;
      track.style.transition = 'transform ' + TRANS;
      track.style.transform  = 'translateX(0)';
      setTimeout(function(){
        track.style.transition = 'none';
        animating = false;
      }, DUR);
    }

    function start(){ stop(); timer = setInterval(goNext, INTERVAL); }
    function stop(){ if(timer){ clearInterval(timer); timer = null; } }
    function restart(){ stop(); start(); }

    prev.addEventListener('click', function(){ goPrev(); restart(); });
    next.addEventListener('click', function(){ goNext(); restart(); });

    // Pause only while hovering the carousel (not when over the arrows alone).
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', function(){ if(!dragging) start(); });

    // ----- drag / swipe — Pointer Events cover mouse + touch -----
    var dragging = false, decided = false, horiz = false, prepended = false,
        moved = false, startX = 0, startY = 0, dx = 0, base = 0, pid = null;

    function onDown(e){
      if(animating || e.button === 1 || e.button === 2) return;
      dragging = true; decided = false; horiz = false; prepended = false; moved = false;
      dx = 0; startX = e.clientX; startY = e.clientY; pid = e.pointerId;
      stop();
      // NOTE: do NOT capture the pointer here. Capturing on every press
      // swallows the card's `click` event, so simple taps wouldn't navigate.
      // We capture lazily in onMove, only once a real horizontal drag starts.
    }
    function onMove(e){
      if(!dragging) return;
      var mx = e.clientX - startX, my = e.clientY - startY;
      if(!decided){
        if(Math.abs(mx) < 6 && Math.abs(my) < 6) return;
        decided = true; horiz = Math.abs(mx) >= Math.abs(my);
        if(!horiz){ dragging = false; start(); return; }   // vertical → let page scroll
        // Confirmed a horizontal drag: now take pointer capture so the swipe
        // tracks even if the pointer leaves the carousel.
        try{ carousel.setPointerCapture(pid); }catch(_){}
        // Lazily pull the last card to the front so a right-drag reveals a
        // real card on the left; the -step offset keeps the view identical.
        track.style.transition = 'none';
        track.insertBefore(track.lastElementChild, track.firstElementChild);
        prepended = true; base = -step();
      }
      if(!horiz) return;
      moved = true;
      if(e.cancelable) e.preventDefault();
      var S = step();
      dx = Math.max(-S * 1.1, Math.min(S * 1.1, mx));
      track.style.transform = 'translateX(' + (base + dx) + 'px)';
    }
    function settleTo(target, after){
      animating = true;
      track.style.transition = 'transform ' + TRANS;
      track.style.transform  = 'translateX(' + target + 'px)';
      setTimeout(function(){
        track.style.transition = 'none';
        if(after) after();
        track.style.transform = 'translateX(0)';
        void track.offsetWidth;
        animating = false;
      }, DUR);
    }
    function onUp(e){
      if(!dragging) return;
      dragging = false;
      try{ carousel.releasePointerCapture(e.pointerId); }catch(_){}
      if(!horiz || !prepended){ start(); return; }   // tap / vertical: nothing to settle
      var S = step(), th = Math.min(80, S * 0.22);
      if(dx <= -th){
        // NEXT: glide one more card left, then drop the two cards now off-screen left.
        settleTo(base - S, function(){
          track.appendChild(track.firstElementChild);
          track.appendChild(track.firstElementChild);
        });
      } else if(dx >= th){
        // PREV: bring the pulled-in card fully on-screen; order already correct.
        settleTo(0, null);
      } else {
        // Not far enough: snap back and undo the pre-pull.
        settleTo(base, function(){ track.appendChild(track.firstElementChild); });
      }
      // A real drag shouldn't fire the card's click/link afterwards.
      if(moved){
        var kill = function(ev){ ev.stopPropagation(); ev.preventDefault(); };
        window.addEventListener('click', kill, true);
        setTimeout(function(){ window.removeEventListener('click', kill, true); }, 60);
      }
      start();
    }
    carousel.addEventListener('pointerdown', onDown);
    carousel.addEventListener('pointermove', onMove);
    carousel.addEventListener('pointerup', onUp);
    carousel.addEventListener('pointercancel', onUp);

    // Reduced-motion: hold still (arrows + drag still work).
    if(!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)){
      start();
    }
  }

  function init(){ document.querySelectorAll('[data-tutor-carousel]').forEach(build); }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();


/* ===== Alba: interactive "Online" presence dot on tutor cards ===== */
(function(){
  function init(){
    document.querySelectorAll('.tc-online').forEach(function(btn){
      if(btn.__wired)return; btn.__wired=true;
      btn.addEventListener('click',function(){
        btn.classList.remove('is-pinged');
        void btn.offsetWidth;
        btn.classList.add('is-pinged');
      });
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
