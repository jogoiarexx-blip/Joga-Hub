import test from 'node:test';
import assert from 'node:assert/strict';
import { readDrivePayload, missingFileIds } from './drive-snapshot-policy.mjs';

const file = (id) => ({ id, name: id + '.mp4' });

test('aceita listagem íntegra e crescimento do Drive', () => {
  const files = readDrivePayload({ ok: true, files: [file('a'), file('b')], total: 2, errors: [] });
  assert.equal(files.length, 2);
  assert.deepEqual(missingFileIds([file('a')], files), []);
});

test('aceita formato anterior do Apps Script', () => {
  assert.equal(readDrivePayload({ sucesso: true, itens: [file('a')], total: 1 }).length, 1);
});

test('bloqueia varreduras incompletas e respostas vazias', () => {
  assert.throws(() => readDrivePayload({ files: [file('a')], errors: [{ error: 'subpasta inacessível' }] }), /incompleta/);
  assert.throws(() => readDrivePayload({ files: [] }), /vazio/);
  assert.throws(() => readDrivePayload({ ok: false, error: 'permissão negada' }), /negada/);
  assert.throws(() => readDrivePayload({ files: [file('a')], total: 3 }), /Total informado/);
  assert.throws(() => readDrivePayload({ files: [{ name: 'sem id' }] }), /identificador/);
});

test('identifica exclusões sem confundir novos arquivos com remoções', () => {
  assert.deepEqual(missingFileIds([file('a'), file('b')], [file('b'), file('c')]), ['a']);
  assert.deepEqual(missingFileIds([file('a'), file('b')], [file('a'), file('b'), file('c')]), []);
});
