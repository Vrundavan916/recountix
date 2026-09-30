/* Recountix app-wide lightweight i18n: English, Hindi, Gujarati. */
(function(){
'use strict';
const STORE='rx_lang';
const dict={
hi:{
'Dashboard':'डैशबोर्ड','Customers':'ग्राहक','Recovery':'रिकवरी','Reports':'रिपोर्ट्स','Settings':'सेटिंग्स','Offline Backup':'ऑफलाइन बैकअप','Logout':'लॉगआउट','Super Dashboard':'सुपर डैशबोर्ड','Company Management':'कंपनी मैनेजमेंट','Subscription':'सब्सक्रिप्शन','Ad Manager':'ऐड मैनेजर','Activity Log':'एक्टिविटी लॉग','Field Tracking':'फील्ड ट्रैकिंग','Promise to Pay':'पेमेंट वादा','Escalations':'एस्केलेशन',
'Welcome back':'वापसी पर स्वागत है','Sign in to continue to your recovery workspace.':'अपने रिकवरी वर्कस्पेस में जारी रखने के लिए साइन इन करें.','Username':'यूज़रनेम','Password':'पासवर्ड','Remember me':'मुझे याद रखें','Forgot password?':'पासवर्ड भूल गए?','Sign In':'साइन इन','Secure encrypted access':'सुरक्षित एन्क्रिप्टेड एक्सेस','Customer Portal':'ग्राहक पोर्टल','Staff login':'स्टाफ लॉगिन',
'Add Customer':'ग्राहक जोड़ें','New account':'नया खाता','Customer records & aging':'ग्राहक रिकॉर्ड और एजिंग','Record Recovery':'रिकवरी दर्ज करें','Record Customer Payment':'ग्राहक पेमेंट दर्ज करें','Recovery History':'रिकवरी हिस्ट्री','All Customer Recovery Entries':'सभी ग्राहक रिकवरी एंट्री','Recovery Summary':'रिकवरी सारांश','Collection Overview':'कलेक्शन ओवरव्यू',
'TOTAL BUSINESSES':'कुल बिज़नेस','ACTIVE BUSINESSES':'एक्टिव बिज़नेस','INACTIVE BUSINESSES':'इनएक्टिव बिज़नेस','TOTAL CUSTOMERS':'कुल ग्राहक','TOTAL OUTSTANDING':'कुल बकाया','TODAY’S RECOVERY':'आज की रिकवरी',"TODAY'S RECOVERY":'आज की रिकवरी','TOTAL RECOVERY':'कुल रिकवरी','PENDING AMOUNT':'बकाया राशि','TOTAL TRANSACTIONS':'कुल ट्रांज़ैक्शन',
'Business Code':'बिज़नेस कोड','Registered Mobile Number':'रजिस्टर्ड मोबाइल नंबर','Portal PIN':'पोर्टल पिन','Check Status':'स्टेटस देखें','Bill Amount':'बिल राशि','Paid Amount':'भुगतान राशि','Pending Amount':'बकाया राशि','Last Payment':'अंतिम भुगतान','Recent Payments':'हाल के भुगतान','Status':'स्टेटस',
'User Management':'यूज़र मैनेजमेंट','Add, remove or reset staff login passwords':'स्टाफ लॉगिन पासवर्ड जोड़ें, हटाएँ या रीसेट करें','New Username':'नया यूज़रनेम','New Password':'नया पासवर्ड','Role':'भूमिका','Business':'बिज़नेस','Add User':'यूज़र जोड़ें','Reset Password':'पासवर्ड रीसेट','Delete':'डिलीट','Remove':'हटाएँ','Modify / Rights':'बदलें / अधिकार',
'Save Settings':'सेटिंग्स सेव करें','Save':'सेव','Cancel':'कैंसल','Back to sign in':'साइन इन पर वापस','Reset password':'पासवर्ड रीसेट','Recovery Email':'रिकवरी ईमेल','Confirm Password':'पासवर्ड पुष्टि','Reset Password':'पासवर्ड रीसेट','Search':'खोजें','View':'देखें','Edit':'एडिट','Action':'एक्शन','Name':'नाम','Mobile':'मोबाइल','Village':'गाँव','Outstanding':'बकाया','Aging':'एजिंग','Due / Follow-up':'ड्यू / फॉलोअप','Action / WhatsApp':'एक्शन / व्हाट्सऐप'
},
gu:{
'Dashboard':'ડેશબોર્ડ','Customers':'ગ્રાહકો','Recovery':'રિકવરી','Reports':'રિપોર્ટ્સ','Settings':'સેટિંગ્સ','Offline Backup':'ઓફલાઇન બેકઅપ','Logout':'લૉગઆઉટ','Super Dashboard':'સુપર ડેશબોર્ડ','Company Management':'કંપની મેનેજમેન્ટ','Subscription':'સબ્સ્ક્રિપ્શન','Ad Manager':'એડ મેનેજર','Activity Log':'એક્ટિવિટી લોગ','Field Tracking':'ફીલ્ડ ટ્રેકિંગ','Promise to Pay':'પેમેન્ટ વચન','Escalations':'એસ્કલેશન',
'Welcome back':'ફરી સ્વાગત છે','Sign in to continue to your recovery workspace.':'તમારા રિકવરી વર્કસ્પેસમાં આગળ વધવા સાઇન ઇન કરો.','Username':'યૂઝરનામ','Password':'પાસવર્ડ','Remember me':'મને યાદ રાખો','Forgot password?':'પાસવર્ડ ભૂલી ગયા?','Sign In':'સાઇન ઇન','Secure encrypted access':'સુરક્ષિત એન્ક્રિપ્ટેડ ઍક્સેસ','Customer Portal':'ગ્રાહક પોર્ટલ','Staff login':'સ્ટાફ લૉગિન',
'Add Customer':'ગ્રાહક ઉમેરો','New account':'નવું ખાતું','Customer records & aging':'ગ્રાહક રેકોર્ડ અને એજિંગ','Record Recovery':'રિકવરી નોંધો','Record Customer Payment':'ગ્રાહક પેમેન્ટ નોંધો','Recovery History':'રિકવરી હિસ્ટરી','All Customer Recovery Entries':'બધી ગ્રાહક રિકવરી એન્ટ્રી','Recovery Summary':'રિકવરી સારાંશ','Collection Overview':'કલેક્શન ઓવરવ્યૂ',
'TOTAL BUSINESSES':'કુલ બિઝનેસ','ACTIVE BUSINESSES':'એક્ટિવ બિઝનેસ','INACTIVE BUSINESSES':'ઇનએક્ટિવ બિઝનેસ','TOTAL CUSTOMERS':'કુલ ગ્રાહકો','TOTAL OUTSTANDING':'કુલ બાકી','TODAY’S RECOVERY':'આજની રિકવરી',"TODAY'S RECOVERY":'આજની રિકવરી','TOTAL RECOVERY':'કુલ રિકવરી','PENDING AMOUNT':'બાકી રકમ','TOTAL TRANSACTIONS':'કુલ ટ્રાન્ઝેક્શન',
'Business Code':'બિઝનેસ કોડ','Registered Mobile Number':'રજિસ્ટર્ડ મોબાઇલ નંબર','Portal PIN':'પોર્ટલ પિન','Check Status':'સ્ટેટસ જુઓ','Bill Amount':'બિલ રકમ','Paid Amount':'ચૂકવેલ રકમ','Pending Amount':'બાકી રકમ','Last Payment':'છેલ્લું પેમેન્ટ','Recent Payments':'તાજેતરના પેમેન્ટ','Status':'સ્ટેટસ',
'User Management':'યૂઝર મેનેજમેન્ટ','Add, remove or reset staff login passwords':'સ્ટાફ લૉગિન પાસવર્ડ ઉમેરો, દૂર કરો અથવા રીસેટ કરો','New Username':'નવું યૂઝરનામ','New Password':'નવો પાસવર્ડ','Role':'રોલ','Business':'બિઝનેસ','Add User':'યૂઝર ઉમેરો','Reset Password':'પાસવર્ડ રીસેટ','Delete':'ડિલીટ','Remove':'દૂર કરો','Modify / Rights':'બદલો / હક',
'Save Settings':'સેટિંગ્સ સેવ કરો','Save':'સેવ','Cancel':'કેન્સલ','Back to sign in':'સાઇન ઇન પર પાછા','Reset password':'પાસવર્ડ રીસેટ','Recovery Email':'રિકવરી ઈમેલ','Confirm Password':'પાસવર્ડ પુષ્ટિ','Search':'શોધો','View':'જુઓ','Edit':'એડિટ','Action':'એક્શન','Name':'નામ','Mobile':'મોબાઇલ','Village':'ગામ','Outstanding':'બાકી','Aging':'એજિંગ','Due / Follow-up':'ડ્યૂ / ફોલોઅપ','Action / WhatsApp':'એક્શન / વોટ્સએપ'
}
};
let lang=localStorage.getItem(STORE)||'en';
const originalText=new WeakMap();
const originalAttr=new WeakMap();
function tr(s){return (dict[lang]&&dict[lang][s])||s}
function translateTextNode(node){
 const raw=node.nodeValue;if(!raw||!raw.trim())return;
 if(!originalText.has(node))originalText.set(node,raw);
 const base=originalText.get(node);
 const trimmed=base.trim();
 const translated=tr(trimmed);
 if(translated===trimmed){node.nodeValue=base;return}
 node.nodeValue=base.replace(trimmed,translated);
}
function translateAttrs(el){
 ['placeholder','title','aria-label','value'].forEach(attr=>{
  if(!el.hasAttribute||!el.hasAttribute(attr))return;
  if(attr==='value'&&!['INPUT','BUTTON'].includes(el.tagName))return;
  const key=attr+':'+(el.getAttribute(attr)||'');
  if(!originalAttr.has(el))originalAttr.set(el,{});
  const bag=originalAttr.get(el);
  if(!bag[attr])bag[attr]=el.getAttribute(attr)||'';
  const base=bag[attr]; const next=tr(base.trim());
  if(next!==base.trim())el.setAttribute(attr,base.replace(base.trim(),next)); else el.setAttribute(attr,base);
 });
}
function walk(root){
 const skip={SCRIPT:1,STYLE:1,NOSCRIPT:1,IFRAME:1,CODE:1};
 const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){const p=n.parentElement;if(!p||skip[p.tagName]||p.closest('.rx-lang-switch'))return NodeFilter.FILTER_REJECT;return n.nodeValue&&n.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
 const nodes=[];while(tw.nextNode())nodes.push(tw.currentNode);nodes.forEach(translateTextNode);
 root.querySelectorAll&&root.querySelectorAll('input,button,a,textarea,select,[title],[aria-label]').forEach(translateAttrs);
}
function addSwitch(){
 if(document.querySelector('.rx-lang-switch'))return;
 const box=document.createElement('div');box.className='rx-lang-switch';box.innerHTML='<button data-rx-lang="en">EN</button><button data-rx-lang="hi">हिं</button><button data-rx-lang="gu">ગુજ</button>';
 document.body.appendChild(box);
 const style=document.createElement('style');style.textContent='.rx-lang-switch{position:fixed;right:14px;bottom:14px;z-index:100000;display:flex;gap:6px;background:rgba(255,255,255,.88);border:1px solid #d8e8e3;border-radius:999px;padding:6px;box-shadow:0 12px 34px rgba(7,63,54,.16);backdrop-filter:blur(14px)}.rx-lang-switch button{border:0;border-radius:999px;padding:7px 10px;background:transparent;color:#0B5D4F;font-weight:900;cursor:pointer}.rx-lang-switch button.active{background:#0B5D4F;color:#fff}@media(max-width:640px){.rx-lang-switch{right:10px;bottom:10px}.rx-lang-switch button{padding:6px 8px;font-size:12px}}';
 document.head.appendChild(style);
 box.addEventListener('click',e=>{const b=e.target.closest('[data-rx-lang]');if(!b)return;setLang(b.dataset.rxLang)});
}
function setLang(next){lang=dict[next]||next==='en'?next:'en';localStorage.setItem(STORE,lang);document.documentElement.lang=lang;document.querySelectorAll('.rx-lang-switch button').forEach(b=>b.classList.toggle('active',b.dataset.rxLang===lang));walk(document.body)}
function boot(){addSwitch();setLang(lang);let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;walk(document.body);document.querySelectorAll('.rx-lang-switch button').forEach(b=>b.classList.toggle('active',b.dataset.rxLang===lang));});}).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();