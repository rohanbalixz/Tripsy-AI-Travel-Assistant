import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = { vus: 5, duration: '30s' };

const qs = [
  "Best sector to shop in Chandigarh?",
  "Is October a good time to visit Paris?",
  "I have a budget of 50k INR for 5 days in Goa. Where should I stay?",
  "Hidden gems in Bangkok?",
  "Family 3-day plan for NYC?"
];

export default function () {
  const q = qs[Math.floor(Math.random()*qs.length)];
  const res = http.post('http://127.0.0.1:8012/ask', JSON.stringify({message:q}), {headers:{'Content-Type':'application/json'}});
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(0.5);
}
