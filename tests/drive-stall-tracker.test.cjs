const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const root={};
vm.runInNewContext(fs.readFileSync('js/player-drive-core.js','utf8'),{window:root});
const {makeStallTracker}=root.JOGAHUB_PLAYER_DRIVE_CORE;
test('waiting e stalled repetidos contam um travamento',()=>{
  const t=makeStallTracker();
  assert.equal(t.mark(10000).count,1);
  assert.equal(t.mark(10500).accepted,false);
  assert.equal(t.mark(11000).count,1);
});
test('travamentos separados ultrapassam limite de contagem',()=>{
  const t=makeStallTracker();
  for(let i=0;i<5;i++)assert.equal(t.mark(10000+i*3000).count,i+1);
});
test('janela móvel remove travamentos antigos',()=>{
  const t=makeStallTracker();
  t.mark(10000);t.mark(13000);
  assert.equal(t.mark(41000).count,1);
});
test('reprodução saudável reinicia contagem',()=>{
  const t=makeStallTracker();
  t.mark(10000);t.mark(14000);t.reset();
  assert.equal(t.mark(14500).count,1);
});
