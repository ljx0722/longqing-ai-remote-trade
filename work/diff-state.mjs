import {TradeSim,origins} from './sim-bundle.mjs';
const s=new TradeSim();s.start(origins[0]);s.sail('byblos');while(s.state.voyage)s.nextDay();const c=new TradeSim();c.import(s.export());for(const k of Object.keys(s.state))if(JSON.stringify(s.state[k])!==JSON.stringify(c.state[k]))console.log(k,JSON.stringify(s.state[k]).slice(0,100),JSON.stringify(c.state[k]).slice(0,100));
