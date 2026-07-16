/* AIAP Boss Quiz + Final Battle engine. Native JS, no external runtime. */
(function(){
  const root=document.getElementById('aiap-battle-rose-edition');
  if(!root){return;}
  const panel=root.querySelector('.abr-panel')||root;
  const bossBank=window.AIAP_BOSS_QUIZ_BANK||[];
  const finalBank=window.AIAP_FINAL_EXAM_BANK||[];
  const bridge=window.AIAPBattleRoseAPI||{};
  const KEYS={
    bossAttempts:'bossAttempts',
    finalBattleSession:'finalBattleSession',
    wrongDungeon:'wrongDungeon',
    unlockedBadges:'unlockedBadges',
    defeatedBosses:'defeatedBosses',
    quizPassedChapters:'quizPassedChapters'
  };
  const MASTER_KEY='aiapBattleRoseEdition_v3';
  const DEFAULT_DEFEATED=['ch09-rag'];
  const DEFAULT_UNLOCKED_BADGES=['RAG 封印章'];
  const CHAPTER_LABELS={
    'ch03':'Ch03 任務判斷',
    'ch05':'Ch05 資料前處理',
    'ch07':'Ch07 評估指標',
    'ch06':'Ch06 模型選擇',
    'ch08':'Ch08 深度學習 / Transformer',
    'ch09-rag':'Ch09 RAG',
    'ch09-agent':'Ch09 Agent / Fine-tuning / LoRA',
    'ch12':'Ch12 MLOps',
    'ch13':'Ch13 治理安全',
    'ch10':'Ch10 統計基礎',
    'ch11':'Ch11 大數據工程',
    'review':'高頻混淆表 + 小測總複習'
  };
  let bossRun=null;
  let finalSession=load(KEYS.finalBattleSession,null);
  let currentQuestionStartedAt=Date.now();
  let lastReport=null;

  const shell=document.createElement('section');
  shell.className='abr-section abrq-shell';
  shell.innerHTML=[
    '<div class="abr-section-head"><h3>Boss Quiz + Final Battle</h3><button class="abr-btn" type="button" data-abrq-action="toggle">展開</button></div>',
    '<div class="abrq-body" data-abrq-body hidden>',
    '  <div class="abrq-tabs" role="tablist">',
    '    <button class="abrq-tab active" type="button" data-abrq-tab="boss">Chapter Boss</button>',
    '    <button class="abrq-tab" type="button" data-abrq-tab="final">最終戰：114-2 考古題</button>',
    '  </div>',
    '  <div data-abrq-panel="boss"></div>',
    '  <div data-abrq-panel="final" hidden></div>',
    '</div>'
  ].join('');
  panel.appendChild(shell);
  const body=shell.querySelector('[data-abrq-body]');
  const bossPanel=shell.querySelector('[data-abrq-panel="boss"]');
  const finalPanel=shell.querySelector('[data-abrq-panel="final"]');

  function readMaster(){
    try{return JSON.parse(localStorage.getItem(MASTER_KEY)||'{}')||{};}catch(error){return {};}
  }
  function writeMaster(data){
    try{localStorage.setItem(MASTER_KEY,JSON.stringify(data));}catch(error){}
  }
  function load(key,fallback){
    const data=readMaster();
    return data.quiz&&Object.prototype.hasOwnProperty.call(data.quiz,key)?data.quiz[key]:fallback;
  }
  function save(key,value){
    const data=readMaster();
    data.quiz=Object.assign({},data.quiz||{});
    data.quiz[key]=value;
    writeMaster(data);
  }
  function remove(key){
    const data=readMaster();
    if(data.quiz){delete data.quiz[key];writeMaster(data);}
  }
  function ensureDefaultQuizState(){
    const master=readMaster();
    if(master.zeroReset){return;}
    const defeated=load(KEYS.defeatedBosses,[]);
    let changed=false;
    DEFAULT_DEFEATED.forEach(function(chapterId){if(!defeated.includes(chapterId)){defeated.push(chapterId);changed=true;}});
    if(changed){save(KEYS.defeatedBosses,defeated);}
    const badges=load(KEYS.unlockedBadges,[]);
    changed=false;
    DEFAULT_UNLOCKED_BADGES.forEach(function(badge){if(!badges.includes(badge)){badges.push(badge);changed=true;}});
    if(changed){save(KEYS.unlockedBadges,badges);}
    const passed=load(KEYS.quizPassedChapters,[]);
    changed=false;
    DEFAULT_DEFEATED.forEach(function(chapterId){if(!passed.includes(chapterId)){passed.push(chapterId);changed=true;}});
    if(changed){save(KEYS.quizPassedChapters,passed);}
  }
  function escapeHtml(value){return String(value==null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function isExamPressureMode(){
    try{
      const state=bridge.getState?bridge.getState():{};
      const examAt=state.examAt||'2026-05-23T13:30:00+08:00';
      const diff=new Date(examAt)-new Date();
      return diff>0&&diff<48*60*60*1000;
    }catch(error){return false;}
  }
  function pressureNotice(report){
    if(!isExamPressureMode()||!report){return '';}
    if(report.overview.accuracy>=85){
      return '<div class="abrq-pressure gold"><b>考前模式</b>｜進入維持模式：錯題重打 + 高危標籤重打。</div>';
    }
    if(report.overview.accuracy<70){
      return '<div class="abrq-pressure"><b>考前模式</b>｜Final Battle 總正確率低於 70%，先回去打章節 Boss，不要硬刷整卷。</div>';
    }
    return '<div class="abrq-pressure"><b>考前模式</b>｜維持 6/6 Boss 規則；優先處理紅色高危標籤與必補章節。</div>';
  }
  function shuffle(items){
    const arr=items.slice();
    for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}
    return arr;
  }
  function sameSet(a,b){return Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((item,i)=>item===b[i]);}
  function choiceHtml(choices,selected,locked,answer,scope){
    return ['A','B','C','D'].map(label=>{
      const cls=['abrq-choice'];
      if(selected===label){cls.push('selected');}
      if(locked&&answer===label){cls.push('correct');}
      if(locked&&selected===label&&answer!==label){cls.push('wrong');}
      return '<button type="button" class="'+cls.join(' ')+'" data-abrq-action="'+scope+'-answer" data-choice="'+label+'" '+(locked?'disabled':'')+'><b>'+label+'</b><span>'+escapeHtml(choices[label]||'')+'</span></button>';
    }).join('');
  }
  function addWrongFromQuestion(question,source,selected){
    const wrongId='wrong-'+question.id;
    const dungeon=load(KEYS.wrongDungeon,[]);
    const found=dungeon.find(item=>item.id===wrongId||item.questionId===question.id);
    const entry={
      id:wrongId,
      source:source,
      title:(question.prompt||question.id).slice(0,42),
      questionId:question.id,
      subjectId:question.subjectId||null,
      chapterLinks:question.chapterLinks||[],
      weaknessTags:question.weaknessTags||[],
      correctCount:0,
      status:'active',
      wrongCount:1,
      lastWrongAt:new Date().toISOString(),
      selected:selected||null,
      answer:question.answer
    };
    if(found){
      found.status='active';
      found.lastWrongAt=entry.lastWrongAt;
      found.wrongCount=(found.wrongCount||1)+1;
      found.selected=selected||found.selected||null;
    }else{dungeon.push(entry);}
    save(KEYS.wrongDungeon,dungeon);
    if(bridge.addWrong){bridge.addWrong(entry);}
  }
  function markQuizPassed(chapterId){
    const passed=load(KEYS.quizPassedChapters,[]);
    if(!passed.includes(chapterId)){passed.push(chapterId);save(KEYS.quizPassedChapters,passed);}
    if(bridge.markQuizPassed){bridge.markQuizPassed(chapterId);}
  }
  function defeatBoss(chapterId){
    const defeated=load(KEYS.defeatedBosses,[]);
    if(!defeated.includes(chapterId)){defeated.push(chapterId);save(KEYS.defeatedBosses,defeated);}
  }
  function unlockBadge(chapterId){
    const bank=bossBank.find(item=>item.chapterId===chapterId);
    const badges=load(KEYS.unlockedBadges,[]);
    const badge=bank?bank.badge:chapterId;
    if(!badges.includes(badge)){badges.push(badge);save(KEYS.unlockedBadges,badges);}
  }

  function renderBossHome(){
    const attempts=load(KEYS.bossAttempts,{});
    const defeated=load(KEYS.defeatedBosses,[]);
    const counts=chapterWrongCounts(finalSession);
    const pressure=isExamPressureMode();
    const options=bossBank.map(ch=>'<option value="'+escapeHtml(ch.chapterId)+'">'+escapeHtml(ch.chapterTitle)+'｜'+escapeHtml(ch.bossName)+'</option>').join('');
    const stats=bossBank.map(ch=>{
      const last=attempts[ch.chapterId];
      const done=defeated.includes(ch.chapterId);
      const mustFix=pressure&&!done&&(counts[ch.chapterId]||0)>=2;
      return '<button type="button" class="abrq-boss-mini '+(done?'done':'')+(mustFix?' must-fix':'')+'" data-abrq-action="boss-pick" data-chapter="'+escapeHtml(ch.chapterId)+'"><b>'+escapeHtml(ch.bossName)+'</b><span>'+escapeHtml(ch.chapterTitle)+'｜'+(done?'已擊敗':mustFix?'必補':last?('上次 '+last.correct+'/6'):'待挑戰')+'</span></button>';
    }).join('');
    bossPanel.innerHTML=[
      '<div class="abrq-card">',
      '<div class="abrq-row"><select class="abrq-select" data-abrq-boss-select>'+options+'</select><button class="abr-btn primary" type="button" data-abrq-action="boss-start">挑戰 Boss</button></div>',
      '<p class="abr-soft">每章題庫 20 題，每次抽 6 題。必須 6/6 全對才通過；答錯會立即解析並加入錯題地牢。</p>',
      pressure?'<div class="abrq-pressure"><b>考前模式</b>｜Boss 戰通過條件維持 6/6；若 Final Battle 中某章相關錯題 >= 2 且 Boss 未擊敗，該章會標成「必補」。</div>':'',
      '<div class="abrq-boss-grid">'+stats+'</div>',
      '</div>',
      '<div data-abrq-boss-stage></div>'
    ].join('');
  }
  function drawBossQuestions(chapterId){
    const bank=bossBank.find(item=>item.chapterId===chapterId);
    if(!bank){return [];}
    const attempts=load(KEYS.bossAttempts,{});
    const previous=attempts[chapterId]&&attempts[chapterId].lastDraw;
    let draw=shuffle(bank.questions).slice(0,bank.drawCount);
    for(let i=0;i<6&&sameSet(draw.map(q=>q.id),previous);i++){draw=shuffle(bank.questions).slice(0,bank.drawCount);}
    return draw;
  }
  function startBossBattle(chapterId){
    const bank=bossBank.find(item=>item.chapterId===chapterId);
    if(!bank){return;}
    bossRun={chapterId,startedAt:new Date().toISOString(),questions:drawBossQuestions(chapterId),currentIndex:0,answers:{},finished:false};
    if(bridge.setMode){bridge.setMode('study');}
    renderBossBattle();
  }
  function renderBossBattle(){
    const stage=bossPanel.querySelector('[data-abrq-boss-stage]');
    if(!stage||!bossRun){return;}
    const bank=bossBank.find(item=>item.chapterId===bossRun.chapterId);
    const q=bossRun.questions[bossRun.currentIndex];
    const ans=bossRun.answers[q.id];
    const correctCount=Object.values(bossRun.answers).filter(a=>a.correct).length;
    stage.innerHTML=[
      '<div class="abrq-card abrq-question-card">',
      '<div class="abrq-meta"><span>'+escapeHtml(bank.bossName)+'</span><span>第 '+(bossRun.currentIndex+1)+' / 6 題</span><span>本輪 '+correctCount+' / '+Object.keys(bossRun.answers).length+'</span></div>',
      '<h4>'+escapeHtml(q.prompt)+'</h4>',
      '<div class="abrq-choices">'+choiceHtml(q.choices,ans&&ans.selected,Boolean(ans),q.answer,'boss')+'</div>',
      renderFeedback(q,ans,'boss'),
      '<div class="abrq-footer">',
      '<button class="abr-btn" type="button" data-abrq-action="boss-restart">重抽 6 題</button>',
      '<button class="abr-btn primary abrq-next" type="button" data-abrq-action="boss-next" '+(!ans?'disabled':'')+'>'+(bossRun.currentIndex===5?'看結算':'下一題')+'</button>',
      '<p class="abr-soft abrq-next-hint">'+(ans?'本題已鎖定，按下一題繼續。':'先選一個答案，下一題按鈕會解鎖。')+'</p>',
      '</div>',
      '</div>'
    ].join('');
  }
  function answerBoss(choice){
    if(!bossRun){return;}
    const q=bossRun.questions[bossRun.currentIndex];
    if(bossRun.answers[q.id]){return;}
    const correct=choice===q.answer;
    bossRun.answers[q.id]={selected:choice,correct,answeredAt:new Date().toISOString()};
    if(!correct){addWrongFromQuestion(q,'boss-battle',choice);}
    if(bridge.bounce){bridge.bounce();}
    renderBossBattle();
  }
  function finishBoss(){
    const bank=bossBank.find(item=>item.chapterId===bossRun.chapterId);
    const answers=Object.values(bossRun.answers);
    const correct=answers.filter(a=>a.correct).length;
    const passed=correct===6;
    const attempts=load(KEYS.bossAttempts,{});
    attempts[bossRun.chapterId]={lastAt:new Date().toISOString(),correct,total:6,passed,lastDraw:bossRun.questions.map(q=>q.id)};
    save(KEYS.bossAttempts,attempts);
    if(passed){
      if(bridge.sealChapter){bridge.sealChapter(bossRun.chapterId);}
      else{
        markQuizPassed(bossRun.chapterId);
        defeatBoss(bossRun.chapterId);
        unlockBadge(bossRun.chapterId);
        if(bridge.roseBurst){bridge.roseBurst('complete');}
        if(bridge.refresh){bridge.refresh();}
      }
    }
    const weak=collectWrongTags(bossRun.questions,bossRun.answers);
    bossPanel.querySelector('[data-abrq-boss-stage]').innerHTML=[
      '<div class="abrq-card abrq-result '+(passed?'passed':'failed')+'">',
      '<h4>'+escapeHtml(bank.bossName)+'｜'+(passed?'已擊敗':'未通過')+'</h4>',
      '<p class="abr-soft">'+correct+' / 6。Boss Battle 必須 6/6 全對才通過。</p>',
      weak.length?'<div class="abrq-tags">'+weak.map(tag=>'<span>'+escapeHtml(tag)+'</span>').join('')+'</div>':'<p class="abr-soft">沒有弱點標籤，這章已歸檔。</p>',
      '<div class="abrq-footer"><button class="abr-btn primary" type="button" data-abrq-action="boss-restart">重打 Boss</button></div>',
      '</div>'
    ].join('');
  }

  function renderFeedback(q,ans,source){
    if(!ans){return '<div class="abrq-feedback muted">選一個答案後會鎖定本題，不會自動跳題。</div>';}
    const ok=ans.correct;
    return [
      '<div class="abrq-feedback '+(ok?'ok':'bad')+'">',
      '<b>'+(ok?'答對':'答錯')+'</b>',
      '<p>正確答案：'+escapeHtml(q.answer)+'。'+escapeHtml(q.explanation||'')+'</p>',
      q.trap?'<p>陷阱：'+escapeHtml(q.trap)+'</p>':'',
      '<div class="abrq-tags">'+(q.weaknessTags||[]).map(tag=>'<span>'+escapeHtml(tag)+'</span>').join('')+'</div>',
      !ok?'<p>已加入錯題地牢。</p>':'',
      '</div>'
    ].join('');
  }
  function collectWrongTags(questions,answers){
    const counts={};
    questions.forEach(q=>{
      const ans=answers[q.id];
      if(ans&&!ans.correct){(q.weaknessTags||[]).forEach(tag=>counts[tag]=(counts[tag]||0)+1);}
    });
    return Object.keys(counts).sort((a,b)=>counts[b]-counts[a]);
  }

  function renderFinalHome(){
    const active=finalSession&&!finalSession.isCompleted;
    finalPanel.innerHTML=[
      '<div class="abrq-card">',
      '<div class="abrq-row">',
      '<select class="abrq-select" data-abrq-final-mode>',
      '<option value="all">全卷模式：第一科 + 第二科</option>',
      '<option value="subject1">第一科 50 題</option>',
      '<option value="subject2">第二科 50 題</option>',
      '<option value="wrongs">錯題重打模式</option>',
      '<option value="high">High risk tag 重打</option>',
      '</select>',
      '<label class="abrq-check"><input type="checkbox" data-abrq-random> 隨機順序</label>',
      '</div>',
      '<div class="abrq-row">',
      '<button class="abr-btn primary" type="button" data-abrq-action="final-start">開始 Final Battle</button>',
      '<button class="abr-btn" type="button" data-abrq-action="final-resume" '+(!active?'disabled':'')+'>恢復進度</button>',
      '<button class="abr-btn" type="button" data-abrq-action="final-abandon" '+(!active?'disabled':'')+'>放棄本次</button>',
      '</div>',
      '<p class="abr-soft">已載入官方考古題 '+finalBank.length+' 題：第一科 '+finalBank.filter(q=>q.subjectId==='subject1').length+' 題，第二科 '+finalBank.filter(q=>q.subjectId==='subject2').length+' 題。答錯會立即顯示解析並進錯題地牢。</p>',
      '</div>',
      '<div data-abrq-final-stage></div>'
    ].join('');
    if(active){renderFinalQuestion();}
    else if(finalSession&&finalSession.isCompleted){lastReport=buildReport(finalSession);renderFinalReport(lastReport);}
  }
  function questionPoolForMode(mode){
    if(mode==='subject1'){return finalBank.filter(q=>q.subjectId==='subject1');}
    if(mode==='subject2'){return finalBank.filter(q=>q.subjectId==='subject2');}
    if(mode==='wrongs'){
      const ids=new Set(load(KEYS.wrongDungeon,[]).filter(w=>w.questionId).map(w=>w.questionId));
      return finalBank.filter(q=>ids.has(q.id));
    }
    if(mode==='high'){
      const tags=highRiskTags(lastReport||buildReport(finalSession));
      return finalBank.filter(q=>(q.weaknessTags||[]).some(tag=>tags.includes(tag)));
    }
    return finalBank.slice();
  }
  function startFinalBattle(mode,randomize){
    const pool=questionPoolForMode(mode);
    if(!pool.length){finalStage('<div class="abrq-card"><p class="abr-soft">這個模式目前沒有可重打的題目。</p></div>');return;}
    const order=(randomize?shuffle(pool):pool).map(q=>q.id);
    finalSession={sessionId:'final-'+Date.now(),mode,startedAt:new Date().toISOString(),endedAt:null,currentIndex:0,questionOrder:order,answers:{},isCompleted:false};
    currentQuestionStartedAt=Date.now();
    save(KEYS.finalBattleSession,finalSession);
    renderFinalHome();
  }
  function currentFinalQuestion(){
    if(!finalSession){return null;}
    const id=finalSession.questionOrder[finalSession.currentIndex];
    return finalBank.find(q=>q.id===id)||null;
  }
  function finalStage(html){
    const stage=finalPanel.querySelector('[data-abrq-final-stage]');
    if(stage){stage.innerHTML=html;}
  }
  function renderFinalQuestion(){
    const q=currentFinalQuestion();
    if(!q){return;}
    const ans=finalSession.answers[q.id];
    const progress=Object.keys(finalSession.answers).length;
    finalStage([
      '<div class="abrq-card abrq-question-card">',
      '<div class="abrq-progress"><i style="width:'+(progress/finalSession.questionOrder.length*100)+'%"></i></div>',
      '<div class="abrq-meta"><span>第 '+(finalSession.currentIndex+1)+' / '+finalSession.questionOrder.length+' 題</span><span>'+escapeHtml(q.subjectName)+'</span><span>官方第 '+q.questionNo+' 題</span></div>',
      '<h4>'+escapeHtml(q.prompt)+'</h4>',
      q.imageRef?'<p class="abrq-image-ref">圖表題參考：'+escapeHtml(q.imageRef)+'</p>':'',
      '<div class="abrq-choices">'+choiceHtml(q.choices,ans&&ans.selected,Boolean(ans),q.answer,'final')+'</div>',
      ans?renderFeedback(q,ans,'final'):'<details class="abrq-tags-box"><summary>弱點標籤</summary><div class="abrq-tags">'+(q.weaknessTags||[]).map(tag=>'<span>'+escapeHtml(tag)+'</span>').join('')+'</div></details>',
      '<div class="abrq-footer">',
      '<button class="abr-btn" type="button" data-abrq-action="final-pause">暫停保存</button>',
      '<button class="abr-btn primary abrq-next" type="button" data-abrq-action="final-next" '+(!ans?'disabled':'')+'>'+(finalSession.currentIndex===finalSession.questionOrder.length-1?'完成結算':'下一題')+'</button>',
      '<p class="abr-soft abrq-next-hint">'+(ans?'本題已鎖定，按下一題繼續。':'先選一個答案，下一題按鈕會解鎖。')+'</p>',
      '</div>',
      '</div>'
    ].join(''));
  }
  function answerFinal(choice){
    const q=currentFinalQuestion();
    if(!q||finalSession.answers[q.id]){return;}
    const now=Date.now();
    const correct=choice===q.answer;
    finalSession.answers[q.id]={selected:choice,correct,answeredAt:new Date().toISOString(),timeSpentSec:Math.max(1,Math.round((now-currentQuestionStartedAt)/1000))};
    if(!correct){addWrongFromQuestion(q,'final-battle',choice);}
    save(KEYS.finalBattleSession,finalSession);
    if(bridge.bounce){bridge.bounce();}
    renderFinalQuestion();
  }
  function nextFinal(){
    if(finalSession.currentIndex<finalSession.questionOrder.length-1){
      finalSession.currentIndex++;
      currentQuestionStartedAt=Date.now();
      save(KEYS.finalBattleSession,finalSession);
      renderFinalQuestion();
    }else{
      finalSession.isCompleted=true;
      finalSession.endedAt=new Date().toISOString();
      save(KEYS.finalBattleSession,finalSession);
      const report=buildReport(finalSession);
      lastReport=report;
      renderFinalReport(report);
      if(report.overview.accuracy>=85&&bridge.roseBurst){bridge.roseBurst('complete');}
    }
  }
  function buildReport(session){
    if(!session){return null;}
    const questions=session.questionOrder.map(id=>finalBank.find(q=>q.id===id)).filter(Boolean);
    const answered=questions.filter(q=>session.answers[q.id]);
    const wrong=answered.filter(q=>!session.answers[q.id].correct);
    const correct=answered.length-wrong.length;
    const bySubject={subject1:{total:0,correct:0,wrong:0},subject2:{total:0,correct:0,wrong:0}};
    const tagStats={};
    answered.forEach(q=>{
      const ans=session.answers[q.id];
      const subj=bySubject[q.subjectId]||(bySubject[q.subjectId]={total:0,correct:0,wrong:0});
      subj.total++; if(ans.correct){subj.correct++;}else{subj.wrong++;}
      (q.weaknessTags||[]).forEach(tag=>{
        tagStats[tag]=tagStats[tag]||{tag,total:0,wrong:0,correct:0,questions:[]};
        tagStats[tag].total++;
        if(ans.correct){tagStats[tag].correct++;}else{tagStats[tag].wrong++;tagStats[tag].questions.push(q);}
      });
    });
    const tagRows=Object.values(tagStats).map(row=>{
      row.accuracy=row.total?Math.round(row.correct/row.total*100):0;
      row.risk=row.wrong>=3||row.accuracy<60?'high':(row.wrong>=2||row.accuracy<80?'medium':(row.wrong>=1?'low':'clear'));
      return row;
    }).sort((a,b)=>b.wrong-a.wrong||a.accuracy-b.accuracy);
    const started=new Date(session.startedAt).getTime();
    const ended=session.endedAt?new Date(session.endedAt).getTime():Date.now();
    const totalSec=Math.max(1,Math.round((ended-started)/1000));
    return {
      sessionId:session.sessionId,
      overview:{total:answered.length,correct,wrong:wrong.length,accuracy:answered.length?Math.round(correct/answered.length*100):0,finishedAt:session.endedAt,totalSec,avgSec:answered.length?Math.round(totalSec/answered.length):0},
      bySubject,
      tagRows,
      topWeaknessTags:tagRows.filter(t=>t.wrong>0).slice(0,5),
      wrongQuestions:wrong.map(q=>({question:q,answer:session.answers[q.id]}))
    };
  }
  function highRiskTags(report){
    if(!report){return [];}
    return report.tagRows.filter(t=>t.risk==='high'||t.wrong>=3).map(t=>t.tag);
  }
  function chapterWrongCounts(session){
    const counts={};
    if(!session||!session.answers){return counts;}
    Object.keys(session.answers).forEach(qid=>{
      const ans=session.answers[qid];
      if(!ans||ans.correct){return;}
      const q=finalBank.find(item=>item.id===qid);
      if(!q||!Array.isArray(q.chapterLinks)){return;}
      q.chapterLinks.forEach(chapterId=>counts[chapterId]=(counts[chapterId]||0)+1);
    });
    return counts;
  }
  function generateStudyAdvice(report){
    if(!report){return {riskLevel:'medium',summary:'尚未完成 Final Battle。',topWeaknessTags:[],recommendedChapters:[],nextActions:['先完成一輪 Final Battle']};}
    const pressure=isExamPressureMode();
    const riskLevel=report.overview.accuracy<(pressure?70:60)?'high':(report.overview.accuracy<85?'medium':'low');
    const chapterCounts={};
    report.wrongQuestions.forEach(item=>(item.question.chapterLinks||[]).forEach(ch=>chapterCounts[ch]=(chapterCounts[ch]||0)+1));
    const recommendedChapters=Object.keys(chapterCounts).sort((a,b)=>chapterCounts[b]-chapterCounts[a]).slice(0,5).map(ch=>({
      chapterId:ch,
      reason:(CHAPTER_LABELS[ch]||ch)+' 相關錯題 '+chapterCounts[ch]+' 題。',
      action:'重打 '+(CHAPTER_LABELS[ch]||ch)+' Boss，並複習 '+report.topWeaknessTags.map(t=>t.tag).slice(0,2).join(' / ')+'。'
    }));
    const nextActions=report.overview.accuracy>=85?['進入維持模式：錯題重打 + 高危標籤重打','重打錯題保持手感','睡前只看 high risk tag']:report.overview.accuracy<(pressure?70:60)?['先回去打章節 Boss','再重打錯題','最後重打完整 Final Battle']:['先重打錯題','再打 high risk tag 題','最後重打完整 Final Battle'];
    const pressureText=pressure&&report.overview.accuracy<70?'考前模式：低於 70%，先回章節 Boss。':pressure&&report.overview.accuracy>=85?'考前模式：進入維持模式。':'';
    return {riskLevel,summary:'總正確率 '+report.overview.accuracy+'%，錯題 '+report.overview.wrong+' 題。'+pressureText,topWeaknessTags:report.topWeaknessTags.map(t=>t.tag),recommendedChapters,nextActions};
  }
  function renderFinalReport(report){
    if(!report){return;}
    const advice=generateStudyAdvice(report);
    const mustFix=pressureMustFixChapters(report);
    const subjectLine=id=>{
      const s=report.bySubject[id]||{total:0,correct:0,wrong:0};
      return s.total?Math.round(s.correct/s.total*100):0;
    };
    finalStage([
      '<div class="abrq-card abrq-report">',
      '<h4>Final Battle Report</h4>',
      pressureNotice(report),
      '<div class="abrq-report-grid"><div><b>'+report.overview.accuracy+'%</b><span>總正確率</span></div><div><b>'+report.overview.correct+'</b><span>答對</span></div><div><b>'+report.overview.wrong+'</b><span>答錯</span></div><div><b>'+report.overview.avgSec+'s</b><span>平均每題</span></div></div>',
      '<p class="abr-soft">第一科 '+subjectLine('subject1')+'%｜第二科 '+subjectLine('subject2')+'%｜完成時間：'+escapeHtml(report.overview.finishedAt||'進行中')+'</p>',
      '<h5>Top 5 弱點</h5><div class="abrq-tags">'+report.topWeaknessTags.map(t=>'<span class="'+t.risk+'">'+escapeHtml(t.tag)+'：錯 '+t.wrong+'</span>').join('')+'</div>',
      mustFix.length?'<h5>考前必補章節</h5><div class="abrq-tags">'+mustFix.map(item=>'<span class="high">'+escapeHtml(CHAPTER_LABELS[item.chapterId]||item.chapterId)+'：錯 '+item.wrong+'</span>').join('')+'</div>':'',
      '<h5>建議補強</h5>'+advice.recommendedChapters.map(ch=>'<p class="abr-soft"><b>'+escapeHtml(CHAPTER_LABELS[ch.chapterId]||ch.chapterId)+'</b>｜'+escapeHtml(ch.reason)+' '+escapeHtml(ch.action)+'</p>').join(''),
      '<h5>錯題清單</h5><div class="abrq-wrong-list">'+report.wrongQuestions.map(item=>'<div class="abrq-wrong"><b>'+escapeHtml(item.question.subjectName)+' 第 '+item.question.questionNo+' 題</b><span>妳選 '+escapeHtml(item.answer.selected)+'｜正解 '+escapeHtml(item.question.answer)+'｜'+escapeHtml((item.question.weaknessTags||[]).join('、'))+'</span><button class="abr-btn" type="button" data-abrq-action="final-single" data-qid="'+escapeHtml(item.question.id)+'">重打一題</button></div>').join('')+'</div>',
      '<div class="abrq-footer"><button class="abr-btn" type="button" data-abrq-action="final-add-wrongs">錯題加入地牢</button><button class="abr-btn" type="button" data-abrq-action="final-retake-wrongs">只重打錯題</button><button class="abr-btn" type="button" data-abrq-action="final-retake-high">重打 high risk</button><button class="abr-btn" type="button" data-abrq-action="final-export">匯出錯題 JSON</button><button class="abr-btn danger" type="button" data-abrq-action="final-clear">清空本次紀錄</button></div>',
      '</div>'
    ].join(''));
    renderBossHome();
    if(bridge.refresh){bridge.refresh();}
  }
  function pressureMustFixChapters(report){
    if(!isExamPressureMode()||!report){return [];}
    const defeated=load(KEYS.defeatedBosses,[]);
    const counts={};
    report.wrongQuestions.forEach(item=>(item.question.chapterLinks||[]).forEach(chapterId=>counts[chapterId]=(counts[chapterId]||0)+1));
    return Object.keys(counts).filter(chapterId=>counts[chapterId]>=2&&!defeated.includes(chapterId)).sort((a,b)=>counts[b]-counts[a]).map(chapterId=>({chapterId,wrong:counts[chapterId]}));
  }

  function bind(){
    shell.addEventListener('click',event=>{
      const actionEl=event.target.closest('[data-abrq-action]');
      const tabEl=event.target.closest('[data-abrq-tab]');
      if(tabEl){switchTab(tabEl.getAttribute('data-abrq-tab'));return;}
      if(!actionEl){return;}
      const action=actionEl.getAttribute('data-abrq-action');
      if(action==='toggle'){body.hidden=!body.hidden;actionEl.textContent=body.hidden?'展開':'收合';return;}
      if(action==='boss-pick'){bossPanel.querySelector('[data-abrq-boss-select]').value=actionEl.getAttribute('data-chapter');return;}
      if(action==='boss-start'){startBossBattle(bossPanel.querySelector('[data-abrq-boss-select]').value);return;}
      if(action==='boss-restart'){startBossBattle(bossRun?bossRun.chapterId:bossPanel.querySelector('[data-abrq-boss-select]').value);return;}
      if(action==='boss-answer'){answerBoss(actionEl.getAttribute('data-choice'));return;}
      if(action==='boss-next'){if(bossRun.currentIndex<5){bossRun.currentIndex++;renderBossBattle();}else{finishBoss();}return;}
      if(action==='final-start'){startFinalBattle(finalPanel.querySelector('[data-abrq-final-mode]').value,finalPanel.querySelector('[data-abrq-random]').checked);return;}
      if(action==='final-resume'){renderFinalQuestion();return;}
      if(action==='final-abandon'){if(confirm('確定放棄本次 Final Battle？再按一次確定會清掉本次作答進度。')){finalSession=null;remove(KEYS.finalBattleSession);renderFinalHome();}return;}
      if(action==='final-answer'){answerFinal(actionEl.getAttribute('data-choice'));return;}
      if(action==='final-pause'){save(KEYS.finalBattleSession,finalSession);renderFinalHome();return;}
      if(action==='final-next'){nextFinal();return;}
      if(action==='final-retake-wrongs'){startFinalBattle('wrongs',false);return;}
      if(action==='final-retake-high'){startFinalBattle('high',false);return;}
      if(action==='final-add-wrongs'&&lastReport){lastReport.wrongQuestions.forEach(item=>addWrongFromQuestion(item.question,'final-battle',item.answer.selected));return;}
      if(action==='final-export'){exportWrongJson();return;}
      if(action==='final-clear'){remove(KEYS.finalBattleSession);finalSession=null;renderFinalHome();return;}
      if(action==='final-single'){startSingleQuestion(actionEl.getAttribute('data-qid'));return;}
    });
  }
  function switchTab(tab){
    shell.querySelectorAll('[data-abrq-tab]').forEach(btn=>btn.classList.toggle('active',btn.getAttribute('data-abrq-tab')===tab));
    shell.querySelectorAll('[data-abrq-panel]').forEach(panel=>panel.hidden=panel.getAttribute('data-abrq-panel')!==tab);
  }
  function exportWrongJson(){
    const data=load(KEYS.wrongDungeon,[]);
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download='aiap-final-battle-wrongs.json'; a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function startSingleQuestion(qid){
    const q=finalBank.find(item=>item.id===qid);
    if(!q){return;}
    finalSession={sessionId:'single-'+Date.now(),mode:'single',startedAt:new Date().toISOString(),endedAt:null,currentIndex:0,questionOrder:[qid],answers:{},isCompleted:false};
    currentQuestionStartedAt=Date.now();
    save(KEYS.finalBattleSession,finalSession);
    renderFinalQuestion();
  }

  window.startBossBattle=startBossBattle;
  window.markQuizPassed=markQuizPassed;
  window.defeatBoss=defeatBoss;
  window.unlockBadge=unlockBadge;
  window.generateStudyAdvice=generateStudyAdvice;
  window.AIAPQuizEngine={startBossBattle,startFinalBattle,generateStudyAdvice,buildReport};
  ensureDefaultQuizState();
  renderBossHome();
  renderFinalHome();
  bind();
  window.addEventListener('aiap-battle-rose-reset',function(){
    bossRun=null;
    finalSession=null;
    lastReport=null;
    renderBossHome();
    renderFinalHome();
  });
  if(bridge.refresh){bridge.refresh();}
})();
