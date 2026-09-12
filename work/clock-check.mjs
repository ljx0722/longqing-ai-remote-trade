import assert from 'node:assert/strict';
import { GameClock } from './clock-bundle.mjs';
for (const rate of [1,2,4]) {
  const c=new GameClock();let days=0;c.tick(0,true,rate);
  for(let t=1000;t<=20000;t+=1000) days+=c.tick(t,true,rate);
  assert.equal(days,rate);
  const fraction=c.fraction;c.tick(25000,false,rate);assert.equal(c.fraction,fraction);
  c.tick(26000,true,rate);assert(c.fraction<.3);
}
const c=new GameClock();c.tick(0,true,1);c.tick(100000000,true,1);assert(c.fraction<=.1);
c.reset();assert.equal(c.fraction,0);
console.log('Automatic clock: 1x/2x/4x, pause, resume, reset and background gaps passed');
