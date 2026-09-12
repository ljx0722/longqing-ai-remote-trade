import { writeFile } from 'node:fs/promises';
import * as THREE from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { buildHarbor } from '../src/scene/harbor.ts';
// GLTFExporter uses the browser FileReader API for a Blob; no DOM assets or textures here.
globalThis.FileReader = class {
 result = null;
 onloadend = null;
 readAsArrayBuffer(blob) { blob.arrayBuffer().then(result=>{this.result=result;this.onloadend?.();}); }
 readAsDataURL(blob) { blob.arrayBuffer().then(result=>{this.result='data:'+blob.type+';base64,'+Buffer.from(result).toString('base64');this.onloadend?.();}); }
};
const harbor=buildHarbor('memphis',0);
const sea=new THREE.Mesh(new THREE.PlaneGeometry(320,260),new THREE.MeshStandardMaterial({color:0x6e9b8d,roughness:.42}));sea.rotation.x=-Math.PI/2;sea.position.set(0,-.12,5);sea.name='Harbor water';harbor.group.add(sea);harbor.group.traverse(o=>{if(o.isLine)o.visible=false;});
const data=await new GLTFExporter().parseAsync(harbor.group,{binary:true,onlyVisible:true});
await writeFile('outputs/远海商途-尼罗河港湾.glb',Buffer.from(data));
let meshes=0,vertices=0;harbor.group.traverse(o=>{if(o.isMesh){meshes++;vertices+=o.geometry.attributes.position.count;}});
console.log(JSON.stringify({bytes:data.byteLength,meshes,vertices}));
harbor.dispose();
