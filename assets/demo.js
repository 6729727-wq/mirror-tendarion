/* Tendarion shared runtime: top bar, EN/RU, theme. Usage in a demo page:
   <body data-demo-en="CivicOne — national e-services portal" data-demo-ru="CivicOne — единый портал госуслуг">
   Text: <span data-en="Hello" data-ru="Привет"></span>  Placeholder: data-en-ph / data-ru-ph
   JS: PT.lang ('en'|'ru'), PT.t(en, ru), PT.onLang(fn) — fn called after every language switch. */
(function(){
  const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
  const PT=window.PT={
    lang:(store.get('pt-lang')||((navigator.language||'en').startsWith('ru')?'ru':'en')),
    subs:[], t(en,ru){return PT.lang==='ru'?ru:en},
    onLang(fn){PT.subs.push(fn)},
    apply(root){
      (root||document).querySelectorAll('[data-en]').forEach(el=>{const v=el.getAttribute('data-'+PT.lang);if(v!=null)el.innerHTML=v});
      (root||document).querySelectorAll('[data-en-ph]').forEach(el=>{el.placeholder=el.getAttribute('data-'+PT.lang+'-ph')||''});
      document.documentElement.lang=PT.lang;
    },
    setLang(l){PT.lang=l;store.set('pt-lang',l);PT.apply();PT.subs.forEach(f=>{try{f(l)}catch(e){console.error(e)}});const b=document.querySelector('.ptbar .lang');if(b)b.textContent=l==='ru'?'EN':'RU';const n=document.querySelector('.ptbar .name');if(n)n.textContent=PT.demoName()},
    demoName(){const b=document.body;return b.getAttribute('data-demo-'+PT.lang)||b.getAttribute('data-demo-en')||''},
    theme(t){if(t)document.documentElement.setAttribute('data-theme',t);else document.documentElement.removeAttribute('data-theme');store.set('pt-theme',t||'')}
  };
  const th=store.get('pt-theme'); if(th) document.documentElement.setAttribute('data-theme',th);
  function bar(){
    if(!document.body.hasAttribute('data-demo-en')) return;
    const root=document.body.getAttribute('data-root')||'../../';
    const el=document.createElement('div'); el.className='ptbar';
    el.innerHTML='<a class="logo" href="'+root+'"><i></i>Tendarion</a><span class="sep">/</span><span class="name"></span><span class="sp"></span>'+
      '<span class="badge hidem" data-en="Working prototype" data-ru="Рабочий прототип"></span>'+
      '<button class="tg theme" title="Theme">◐</button><button class="tg lang"></button>'+
      '<a class="tg" href="'+root+'#catalog" style="color:inherit;text-decoration:none" data-en="All projects" data-ru="Все проекты"></a>';
    document.body.prepend(el);
    el.querySelector('.lang').onclick=()=>PT.setLang(PT.lang==='ru'?'en':'ru');
    el.querySelector('.theme').onclick=()=>{const cur=document.documentElement.getAttribute('data-theme');const dark=cur?cur==='dark':!matchMedia('(prefers-color-scheme: light)').matches;PT.theme(dark?'light':'dark');PT.subs.forEach(f=>{try{f(PT.lang)}catch(e){}})};
  }
  document.addEventListener('DOMContentLoaded',()=>{bar();PT.setLang(PT.lang)});
})();
