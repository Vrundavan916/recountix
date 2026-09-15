/* Recountix encrypted offline backup engine */
(function(){
"use strict";
const DB_NAME="recountix-offline-v1", DB_VERSION=1, STORE_BACKUPS="backups", STORE_KEYS="keys";
function openDb(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded=()=>{const d=req.result;if(!d.objectStoreNames.contains(STORE_BACKUPS))d.createObjectStore(STORE_BACKUPS,{keyPath:"id"});if(!d.objectStoreNames.contains(STORE_KEYS))d.createObjectStore(STORE_KEYS);};
    req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
  });
}
async function idbGet(store,key){const d=await openDb();return new Promise((res,rej)=>{const q=d.transaction(store,"readonly").objectStore(store).get(key);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error);});}
async function idbPut(store,value,key){const d=await openDb();return new Promise((res,rej)=>{const tx=d.transaction(store,"readwrite"),os=tx.objectStore(store);key===undefined?os.put(value):os.put(value,key);tx.oncomplete=()=>res(value);tx.onerror=()=>rej(tx.error);});}
async function deviceKey(){let k=await idbGet(STORE_KEYS,"device-aes");if(k)return k;k=await crypto.subtle.generateKey({name:"AES-GCM",length:256},false,["encrypt","decrypt"]);await idbPut(STORE_KEYS,k,"device-aes");return k;}
function b64(bytes){let s="",u=new Uint8Array(bytes);for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s);}
function unb64(s){const x=atob(s),u=new Uint8Array(x.length);for(let i=0;i<x.length;i++)u[i]=x.charCodeAt(i);return u;}
async function encryptObject(obj,key){const iv=crypto.getRandomValues(new Uint8Array(12)),plain=new TextEncoder().encode(JSON.stringify(obj)),cipher=await crypto.subtle.encrypt({name:"AES-GCM",iv},key,plain);return{iv:b64(iv),cipher:b64(cipher)};}
async function decryptObject(payload,key){const plain=await crypto.subtle.decrypt({name:"AES-GCM",iv:unb64(payload.iv)},key,unb64(payload.cipher));return JSON.parse(new TextDecoder().decode(plain));}
async function portableKey(pass,salt){const base=await crypto.subtle.importKey("raw",new TextEncoder().encode(pass),"PBKDF2",false,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt,iterations:250000,hash:"SHA-256"},base,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);}
async function capture(shopId){
  if(!navigator.onLine)throw new Error("Internet is required to create a fresh Supabase backup.");
  if(typeof sbExportBusinessBackup!=="function")throw new Error("Backup API is unavailable.");
  const data=await sbExportBusinessBackup(shopId||null);
  if(!data||data.format!=="recountix-offline-backup"||!data.shop_id)throw new Error("Invalid backup response.");
  const key=await deviceKey(),encrypted=await encryptObject(data,key),row={id:"shop:"+data.shop_id,shopId:data.shop_id,shopCode:data.shop_code||"",shopName:data.shop_name||"",createdAt:data.exported_at||new Date().toISOString(),encrypted};
  await idbPut(STORE_BACKUPS,row);localStorage.setItem("rx_last_backup_"+data.shop_id,row.createdAt);return row;
}
async function list(){const d=await openDb();return new Promise((res,rej)=>{const q=d.transaction(STORE_BACKUPS,"readonly").objectStore(STORE_BACKUPS).getAll();q.onsuccess=()=>res((q.result||[]).sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt))));q.onerror=()=>rej(q.error);});}
async function read(shopId){const row=await idbGet(STORE_BACKUPS,"shop:"+shopId);if(!row)return null;return decryptObject(row.encrypted,await deviceKey());}
async function makePortable(shopId,passphrase){
  if(String(passphrase||"").length<8)throw new Error("Backup password must be at least 8 characters.");
  const data=await read(shopId);if(!data)throw new Error("No offline backup found for this business.");
  const salt=crypto.getRandomValues(new Uint8Array(16)),key=await portableKey(passphrase,salt),enc=await encryptObject(data,key);
  return{format:"recountix-encrypted-file",version:1,kdf:"PBKDF2-SHA256",iterations:250000,salt:b64(salt),iv:enc.iv,cipher:enc.cipher,shop_code:data.shop_code||"",created_at:data.exported_at};
}
async function openPortable(fileObject,passphrase){
  if(!fileObject||fileObject.format!=="recountix-encrypted-file"||fileObject.version!==1)throw new Error("Unsupported backup file.");
  const key=await portableKey(passphrase,unb64(fileObject.salt));
  const data=await decryptObject({iv:fileObject.iv,cipher:fileObject.cipher},key);
  if(!data||data.format!=="recountix-offline-backup"||!data.shop_id)throw new Error("Invalid backup contents.");
  return data;
}
async function auto(){
  try{if(!navigator.onLine||typeof getSession!=="function")return;const s=getSession();if(!s.isLoggedIn||!s.sessionToken||!s.shopId)return;const last=Date.parse(localStorage.getItem("rx_last_backup_"+s.shopId)||0);if(Date.now()-last<15*60*1000)return;await capture(s.shopId);}catch(e){console.warn("Offline backup skipped:",e.message||e);}
}
function wrapMutations(){
  ["sbSaveCustomer","sbDeleteCustomer","sbSaveRecovery","sbDeleteRecovery","sbSaveSettings","sbMarkReminder"].forEach(name=>{const fn=window[name];if(typeof fn!=="function"||fn.__rxBackupWrapped)return;const wrapped=async function(){const out=await fn.apply(this,arguments);setTimeout(auto,500);return out;};wrapped.__rxBackupWrapped=true;window[name]=wrapped;});
}
window.RecountixOfflineBackup={capture,list,read,makePortable,openPortable,auto};
window.addEventListener("load",()=>{wrapMutations();setTimeout(auto,1800);},{once:true});
})();