/* One source of copy per text node. Form values and calculation state stay intact. */
(() => {
  const pairs=window.copyPairs.trim().split('\n').map(line=>line.split('|'));
  pairs.push(...window.headingPairs);
  const arToEn=new Map(pairs), enToAr=new Map(pairs.map(([a,e])=>[e,a]));
  const textState=new WeakMap(), attributeState=new WeakMap();
  const root=document.documentElement;
  const media=matchMedia('(prefers-color-scheme: dark)');
  function saved(key,fallback){try{return localStorage.getItem(key)||fallback;}catch{return fallback;}}
  function save(key,value){try{localStorage.setItem(key,value);}catch{/* Private mode: preferences still work for this visit. */}}
  let language=saved('yousef-language','ar'); if(!['ar','en'].includes(language))language='ar';
  let theme=saved('yousef-theme','system'); if(!['system','light','dark'].includes(theme))theme='system';
  const days={'السبت':'Saturday','الأحد':'Sunday','الإثنين':'Monday','الثلاثاء':'Tuesday','الأربعاء':'Wednesday','الخميس':'Thursday','الجمعة':'Friday'};
  function translateDynamic(s){
    let m;
    if((m=s.match(/^احتياج الراحة التقديري (.+) سعر\. بعد إضافة نشاطك، ده تقدير الحفاظ على وزنك، مش هدف تخسيس أو تضخيم\.$/)))return `Estimated resting energy: ${m[1]} kcal. Including activity, this estimates maintenance, not a fat-loss or muscle-gain target.`;
    if((m=s.match(/^(\d+) جلسات × (\d+) دقيقة\. أيامك: (.+)\.$/)))return `${m[1]} sessions × ${m[2]} minutes. Your days: ${m[3].split('، ').map(d=>days[d]||d).join(', ')}.`;
    if((m=s.match(/^(\d+) أفكار معروضة$/)))return `${m[1]} ${m[1]==='1'?'idea':'ideas'} shown`;
    if((m=s.match(/^(\d+) جم فول مطهو$/)))return `${m[1]} g cooked fava beans`;
    if((m=s.match(/^(\d+) جم طماطم$/)))return `${m[1]} g tomato`;
    if(s.startsWith('ملخص بدايتي مع يوسف أحمد'))return s
      .replace('ملخص بدايتي مع يوسف أحمد','My starting summary with Yousef Ahmed')
      .replace('هدفي:','My goal:').replace('خسارة الدهون','Fat loss').replace('بناء العضلات','Muscle gain').replace('العودة للتمرين','Return to training')
      .replace('أيامي المناسبة:','Available days:').replace('لسه هحددها مع الكوتش','To discuss with my coach')
      .replace('الوقت المتاح للجلسة:','Time per session:').replace('دقيقة','minutes')
      .replace('تقدير الحفاظ على الوزن:','Estimated maintenance energy:').replace('سعر حراري / يوم','kcal / day')
      .replace('(تقدير أولي وليس خطة غذائية)','(Initial estimate, not a nutrition plan)')
      .replace('حابب أعرف تفاصيل التدريب والأسعار وشكل المتابعة المناسب ليا.','I would like to discuss coaching, pricing and suitable check-ins.')
      .replace(/السبت|الأحد|الإثنين|الثلاثاء|الأربعاء|الخميس|الجمعة/g,d=>days[d]).replaceAll('،',',');
    return s;
  }
  function translated(source){
    const s=source.trim();
    const result=language==='en'?(arToEn.get(s)||translateDynamic(s)):(enToAr.get(s)||s);
    return source.replace(s,result);
  }
  function updateText(node){
    if(!node.textContent.trim()||node.parentElement?.closest('script,style,.brand,.photo-caption>span'))return;
    let state=textState.get(node);
    if(!state||node.textContent!==state.rendered)state={source:node.textContent};
    state.rendered=translated(state.source);textState.set(node,state);
    if(node.textContent!==state.rendered)node.textContent=state.rendered;
  }
  function localize(scope){
    if(scope.nodeType===Node.TEXT_NODE){updateText(scope);return;}
    if(scope.nodeType!==Node.ELEMENT_NODE&&scope.nodeType!==Node.DOCUMENT_NODE)return;
    const walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);
    let node;while(node=walker.nextNode())updateText(node);
    const elements=[...(scope.querySelectorAll?.('[aria-label],[alt],[title]')||[])];
    if(scope.nodeType===Node.ELEMENT_NODE)elements.push(scope);
    elements.forEach(el=>['aria-label','alt','title'].forEach(attr=>{
      if(!el.hasAttribute(attr))return;
      let states=attributeState.get(el)||{};let state=states[attr];const value=el.getAttribute(attr);
      if(!state||value!==state.rendered)state={source:value};state.rendered=translated(state.source);states[attr]=state;attributeState.set(el,states);
      if(value!==state.rendered)el.setAttribute(attr,state.rendered);
    }));
  }
  function applyTheme(){document.querySelectorAll('[data-theme-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeChoice===theme)));root.dataset.theme=theme==='system'?(media.matches?'dark':'light'):theme;root.style.colorScheme=root.dataset.theme;document.querySelector('meta[name="theme-color"]').content=root.dataset.theme==='dark'?'#171514':'#f4efe6';}
  function applyLanguage(){
    root.lang=language;root.dir=language==='ar'?'rtl':'ltr';localize(document);
    document.querySelectorAll('[data-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===language)));
    document.querySelectorAll('.ticker [lang]').forEach(el=>el.lang=language);
    document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a=>{
      const url=new URL(a.href);if(!a.dataset.arHref)a.dataset.arHref=a.href;
      if(language==='ar'){a.href=a.dataset.arHref;return;}
      if(url.searchParams.has('text')){url.searchParams.set('text',a.closest('#members')?'Hi Yousef, I need the app link and help activating my account.':'Hi Yousef, I found your website and would like to learn about coaching and check-ins.');a.href=url.href;}
    });
  }
  document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>{language=b.dataset.language;save('yousef-language',language);applyLanguage();}));
  document.querySelectorAll('[data-theme-choice]').forEach(b=>b.addEventListener('click',()=>{theme=b.dataset.themeChoice;save('yousef-theme',theme);applyTheme();}));
  
  media.addEventListener('change',()=>{if(theme==='system')applyTheme();});
  applyTheme();applyLanguage();
  const observer=new MutationObserver(records=>{
    observer.disconnect();
    for(const record of records){if(record.type==='characterData')updateText(record.target);else if(record.type==='attributes')localize(record.target);else record.addedNodes.forEach(localize);}
    observe();
  });
  function observe(){observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','alt','title']});}
  observe();
})();
