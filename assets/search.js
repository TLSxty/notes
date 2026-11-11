
(function(){
  var box=document.getElementById('q'),out=document.getElementById('hits'),cnt=document.getElementById('cnt');
  var list=window.NOTES_INDEX||[];
  function esc(s){return s.replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});}
  function mark(s,q){
    var i=s.toLowerCase().indexOf(q.toLowerCase());
    if(i<0)return esc(s);
    return esc(s.slice(0,i))+'<em>'+esc(s.slice(i,i+q.length))+'</em>'+esc(s.slice(i+q.length));
  }
  function run(){
    var q=box.value.trim();
    if(!q){out.innerHTML='';cnt.textContent='';return;}
    var terms=q.toLowerCase().split(/\s+/).filter(Boolean);
    var scored=[];
    for(var n=0;n<list.length;n++){
      var it=list[n],hay=(it.t+' '+it.s+' '+it.h).toLowerCase(),score=0,ok=true;
      for(var k=0;k<terms.length;k++){
        var p=hay.indexOf(terms[k]);
        if(p<0){ok=false;break;}
        score+=(it.t.toLowerCase().indexOf(terms[k])>=0?40:0)+Math.max(0,14-Math.floor(p/300));
      }
      if(ok)scored.push({it:it,score:score});
    }
    scored.sort(function(a,b){return b.score-a.score;});
    if(!scored.length){cnt.textContent='没有匹配的条目';out.innerHTML='';return;}
    cnt.textContent='命中 '+scored.length+' 条';
    var buf='';
    for(var m=0;m<scored.length;m++){
      var it2=scored[m].it,pos=(it2.h.toLowerCase().indexOf(terms[0]));
      var snip=pos>=0?it2.h.slice(Math.max(0,pos-40),pos+150):it2.s;
      buf+='<a class="hit" href="'+it2.u+'"><div class="t">'+it2.t+'</div><div class="s">'+mark(snip,terms[0])+'…</div></a>';
    }
    out.innerHTML=buf;
  }
  if(box){box.addEventListener('input',run);}
})();
