import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const root={};
const js=await readFile('js/drive-subtitle-core.js','utf8');
vm.runInNewContext(js,{window:root});
const core=root.JOGAHUB_DRIVE_SUBTITLE_CORE;
const toRows=src=>JSON.parse(src.match(/window\.JOGAHUB_DRIVE_(?:SUBTITLES|SNAPSHOT)\s*=\s*(\[[\s\S]*\]);?\s*$/)[1]);
const videos=toRows(await readFile('js/drive-snapshot.js','utf8'));
const subs=toRows(await readFile('js/drive-subtitles.js','utf8'));

test('associa as 26 legendas aos episódios corretos sem criar filme novo',()=>{
 const matches=core.attach(videos,subs);
 const count=[...matches.values()].reduce((sum,tracks)=>sum+tracks.length,0);
 assert.equal(subs.length,26);
 assert.equal(count,26,'todas as legendas históricas têm vídeo correspondente');
 for(const video of videos){
   for(const track of matches.get(video.id)||[]){
     assert.equal(track.name.replace(/\.(srt|vtt)$/i,''),video.name.replace(/\.(mp4|webm|mkv)$/i,''));
     assert.equal(track.path,video.path);
   }
 }
});

test('não mistura episódios entre temporadas, pastas ou séries',()=>{
 const a={id:'video-A',name:'S02E02 - Teste.mp4',path:'Série A/Temporada 2'};
 const b={id:'sub-B',name:'S02E02 - Teste.srt',path:'Série B/Temporada 2'};
 const c={id:'sub-C',name:'S02E03 - Outro.srt',path:'Série A/Temporada 2'};
 assert.equal(core.attach([a],[b,c]).size,0);
});

test('SRT válido vira WebVTT preservando timestamps e texto',()=>{
 const srt='\uFEFF1\r\n00:00:00,100 --> 00:00:01,250\r\nBom dia!\r\n\r\n2\r\n00:00:01,300 --> 00:00:02,999\r\nTudo bem?\r\n';
 const vtt=core.toVtt(srt);
 assert.ok(vtt.startsWith('WEBVTT\n\n'));
 assert.match(vtt,/00:00:00\.100 --> 00:00:01\.250/);
 assert.match(vtt,/Tudo bem\?/);
 assert.equal(core.toVtt('<!doctype html><html>login</html>'),'');
});

test('links diretos só aceitam IDs Drive válidos e mantêm resourcekey quando informada',()=>{
 assert.equal(core.downloadUrl({id:'../../escape'}),'');
 const link=core.downloadUrl({id:'qa-subtitle-file-1',resourceKey:'abc-123'});
 const url=new URL(link);
 assert.equal(url.hostname,'drive.usercontent.google.com');
 assert.equal(url.searchParams.get('resourcekey'),'abc-123');
 assert.equal(new URL(core.externalUrl({id:'qa-subtitle-file-1'})).hostname,'drive.google.com');
});
