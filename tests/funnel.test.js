// Pruebas sin dependencias: `npm test` (Node 18+).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';

import { normalizePhone, evaluateQualification, isValidEmail, isValidName, splitName } from '../src/qualify.js';
import { NO_CAPITAL, RESIDENCE_GOAL, FORM_OPTIONS } from '../src/content.js';
import leadHandler, { buildGhlPayload, validate } from '../api/lead.js';
import eventHandler from '../api/event.js';

test('normaliza teléfonos de México', () => {
  assert.equal(normalizePhone('MX', '999 123 4567'), '+529991234567');
  assert.equal(normalizePhone('MX', '+52 1 999 123 4567'), '+529991234567');
  assert.equal(normalizePhone('MX', '52 999 123 4567'), '+529991234567');
  assert.equal(normalizePhone('MX', '123'), '');
});

test('normaliza teléfonos de EE. UU. y otros países', () => {
  assert.equal(normalizePhone('US', '(512) 555-0100'), '+15125550100');
  assert.equal(normalizePhone('US', '1 512 555 0100'), '+15125550100');
  assert.equal(normalizePhone('OTRO', '+34 612 345 678'), '+34612345678');
  assert.equal(normalizePhone('OTRO', '1234'), '');
});

test('valida nombre y correo', () => {
  assert.ok(isValidName('Ana López'));
  assert.ok(!isValidName('  '));
  assert.ok(!isValidName('123'));
  assert.ok(isValidEmail('ana@correo.com'));
  assert.ok(!isValidEmail('ana@correo'));
  assert.deepEqual(splitName('  Ana  María López '), { first_name: 'Ana', last_name: 'María López' });
});

test('regla de calificación', () => {
  assert.deepEqual(evaluateQualification({ capital: NO_CAPITAL }), { qualified: false, reason: 'sin_capital' });
  const ok = evaluateQualification({ capital: FORM_OPTIONS.capital[1], objetivo: RESIDENCE_GOAL });
  assert.equal(ok.qualified, true);
  assert.equal(ok.needsClarification, true);
  assert.equal(evaluateQualification({ capital: FORM_OPTIONS.capital[2], objetivo: 'Para que me genere dinero' }).needsClarification, false);
});

const validBody = {
  lead_id: 'abc',
  stage: 'completo',
  nombre: 'Ana López',
  first_name: 'Ana',
  last_name: 'López',
  email: 'ANA@correo.com',
  phone: '+529991234567',
  phone_country: 'MX',
  consent: true,
  consent_text: 'Acepto',
  consent_at: '2026-10-24T18:00:00.000Z',
  estado: 'Nuevo León',
  experiencia: 'No, sería mi primera inversión',
  plazo: 'Ahora mismo',
  objetivo: 'Para que me genere dinero',
  capital: 'Más de $300,000 MXN',
  qualified: true,
  event_id: 'evt-1',
  elapsed_ms: 30000,
  attribution: { utm_source: 'facebook', utm_campaign: 'bosco' },
};

test('arma el payload para GHL', () => {
  const p = buildGhlPayload(validBody);
  assert.equal(p.email, 'ana@correo.com');
  assert.equal(p.califica, 'si');
  assert.equal(p.etapa_registro, 'completo');
  assert.ok(p.tags.includes('califica'));
  assert.equal(p.utm_source, 'facebook');
  const partial = buildGhlPayload({ ...validBody, stage: 'parcial', qualified: undefined });
  assert.equal(partial.califica, '');
  assert.ok(partial.tags.includes('registro-incompleto'));
});

test('valida campos obligatorios', () => {
  assert.deepEqual(validate(validBody), []);
  assert.deepEqual(validate({ ...validBody, consent: false, phone: '999' }).sort(), ['consent', 'phone']);
});

function mockReq(method, body, headers = {}) {
  const req = Readable.from(body === undefined ? [] : [Buffer.from(JSON.stringify(body))]);
  req.method = method;
  req.headers = { 'user-agent': 'test', 'x-forwarded-for': '203.0.113.5', ...headers };
  return req;
}

function mockRes() {
  return {
    statusCode: 0,
    headers: {},
    body: '',
    setHeader(k, v) {
      this.headers[k.toLowerCase()] = v;
    },
    end(chunk = '') {
      this.body = chunk;
    },
    json() {
      return JSON.parse(this.body);
    },
  };
}

function withEnv(vars, fn) {
  const before = {};
  for (const k of Object.keys(vars)) {
    before[k] = process.env[k];
    if (vars[k] === undefined) delete process.env[k];
    else process.env[k] = vars[k];
  }
  return fn().finally(() => {
    for (const k of Object.keys(vars)) {
      if (before[k] === undefined) delete process.env[k];
      else process.env[k] = before[k];
    }
  });
}

test('API: sin configuración responde not_configured (503)', () =>
  withEnv({ GHL_WEBHOOK_URL: undefined, META_PIXEL_ID: undefined, META_CAPI_TOKEN: undefined }, async () => {
    const res = mockRes();
    await leadHandler(mockReq('POST', validBody), res);
    assert.equal(res.statusCode, 503);
    assert.equal(res.json().error, 'not_configured');
  }));

test('API: rechaza método GET y datos inválidos', async () => {
  const r1 = mockRes();
  await leadHandler(mockReq('GET'), r1);
  assert.equal(r1.statusCode, 405);
  const r2 = mockRes();
  await leadHandler(mockReq('POST', { ...validBody, email: 'x' }), r2);
  assert.equal(r2.statusCode, 422);
});

test('API: la trampa anti-bots no reenvía nada', async () => {
  const res = mockRes();
  await leadHandler(mockReq('POST', { ...validBody, website: 'spam' }), res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.json().forwarded, { ghl: false, capi: false });
});

test('API: reenvía a GHL y a Meta CAPI con datos cifrados y event_id', () =>
  withEnv(
    { GHL_WEBHOOK_URL: 'https://ghl.example/hook', META_PIXEL_ID: '123', META_CAPI_TOKEN: 'secreto', META_TEST_EVENT_CODE: 'TEST1' },
    async () => {
      const calls = [];
      const realFetch = globalThis.fetch;
      globalThis.fetch = async (url, opts) => {
        calls.push({ url: String(url), body: JSON.parse(opts.body) });
        return { ok: true, status: 200 };
      };
      try {
        const res = mockRes();
        await leadHandler(mockReq('POST', validBody), res);
        assert.equal(res.statusCode, 200);
        assert.deepEqual(res.json(), { ok: true, forwarded: { ghl: true, capi: true } });

        const ghl = calls.find((c) => c.url === 'https://ghl.example/hook');
        assert.equal(ghl.body.phone, '+529991234567');
        assert.equal(ghl.body.capital, 'Más de $300,000 MXN');

        const capi = calls.find((c) => c.url.startsWith('https://graph.facebook.com/'));
        const event = capi.body.data[0];
        assert.equal(event.event_name, 'Lead');
        assert.equal(event.event_id, 'evt-1');
        assert.equal(capi.body.test_event_code, 'TEST1');
        assert.match(event.user_data.em[0], /^[a-f0-9]{64}$/);
        assert.ok(!JSON.stringify(capi.body).includes('ana@correo.com'), 'el correo no viaja en claro');
        assert.equal(event.user_data.client_ip_address, '203.0.113.5');
      } finally {
        globalThis.fetch = realFetch;
      }
    }
  ));

test('API: un registro no calificado no dispara Lead en Meta', () =>
  withEnv({ GHL_WEBHOOK_URL: 'https://ghl.example/hook', META_PIXEL_ID: '123', META_CAPI_TOKEN: 'secreto' }, async () => {
    const calls = [];
    const realFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
      calls.push(String(url));
      return { ok: true, status: 200 };
    };
    try {
      const res = mockRes();
      await leadHandler(mockReq('POST', { ...validBody, qualified: false, capital: NO_CAPITAL }), res);
      assert.equal(res.statusCode, 200);
      assert.equal(calls.length, 1);
      assert.equal(calls[0], 'https://ghl.example/hook');
    } finally {
      globalThis.fetch = realFetch;
    }
  }));

test('API de eventos: solo acepta Schedule', () =>
  withEnv({ META_PIXEL_ID: '123', META_CAPI_TOKEN: 'secreto' }, async () => {
    const realFetch = globalThis.fetch;
    globalThis.fetch = async () => ({ ok: true, status: 200 });
    try {
      const bad = mockRes();
      await eventHandler(mockReq('POST', { event_name: 'Purchase', event_id: 'x' }), bad);
      assert.equal(bad.statusCode, 422);
      const good = mockRes();
      await eventHandler(mockReq('POST', { event_name: 'Schedule', event_id: 'x', email: 'a@b.co' }), good);
      assert.equal(good.statusCode, 200);
    } finally {
      globalThis.fetch = realFetch;
    }
  }));
