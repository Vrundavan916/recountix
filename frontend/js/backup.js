/* Recountix offline backup page */
(function(){
"use strict";
const $=id=>document.getElementById(id);
function msg(text,type){const el=$("backupStatus");el.textContent=text;el.className="backup-status "+(type||"");}
function fmt(d){try{return new Date(d).toLocaleString("en-IN")}catch(e){return d||"-"}}
async function shops(){
 const s=getSession(),wrap=$("shopSelectWrap"),sel=$("backupShop");
 if(s.role==="super_admin"){wrap.hidden=false;const rows=await sbGetShops();sel.innerHTML='<option value="">Select business</option>'+rows.map(x=>'<option value="'+escapeHtml(x.id)+'">'+escapeHtml(x.name||x.code)+'</option>').join("");}
 else{wrap.hidden=true;sel.innerHTML='<option value="'+escapeHtml(s.shopId)+'">'+escapeHtml(s.shopName||"My Business")+'</option>';sel.value=s.shopId;}
}
function selectedShop(){const s=getSession();return s.role==="super_admin"?$("backupShop").value:s.shopId;}
async function refresh(){
 const rows=await RecountixOfflineBackup.list(),body=$("backupList");
 body.innerHTML=rows.length?rows.map(r=>'<tr><td>'+escapeHtml(r.shopName||r.shopCode)+'</td><td>'+escapeHtml(r.shopCode)+'</td><td>'+escapeHtml(fmt(r.createdAt))+'</td><td><button type="button" class="add-btn download-local" data-shop="'+escapeHtml(r.shopId)+'">Download</button></td></tr>').join(""):'<tr><td colspan="4">No offline backups yet.</td></tr>';
 body.querySelectorAll(".download-local").forEach(b=>b.addEventListener("click",()=>download(b.dataset.shop)));
}
async function sync(){
 const id=selectedShop();if(!id)return msg("Select a business first.","error");
 msg("Creating encrypted offline backup…");await RecountixOfflineBackup.capture(id);msg("Offline backup saved successfully.","success");await refresh();
}
async function download(id){
 const pass=$("backupPass").value;if(pass.length<8)return msg("Enter a backup password of at least 8 characters.","error");
 msg("Encrypting download…");const pack=await RecountixOfflineBackup.makePortable(id,pass),blob=new Blob([JSON.stringify(pack)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="recountix-"+(pack.shop_code||"business")+"-"+new Date().toISOString().slice(0,10)+".rxbackup";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);msg("Encrypted backup downloaded.","success");
}
async function restore(){
 const file=$("restoreFile").files[0],pass=$("restorePass").value;if(!file)return msg("Choose a .rxbackup file.","error");if(pass.length<8)return msg("Enter the backup file password.","error");if(!navigator.onLine)return msg("Internet is required to restore into Supabase.","error");
 msg("Validating encrypted backup…");const pack=JSON.parse(await file.text()),data=await RecountixOfflineBackup.openPortable(pack,pass),s=getSession();
 if(s.role!=="super_admin"&&String(data.shop_id)!==String(s.shopId))throw new Error("This backup belongs to another business.");
 if(!confirm("Restore missing records for "+(data.shop_name||data.shop_code)+"? Existing records will not be overwritten or deleted."))return msg("Restore cancelled.");
 msg("Restoring missing records…");const result=await sbRestoreBusinessBackup(data);msg("Restore completed for this business.","success");await RecountixOfflineBackup.capture(data.shop_id);await refresh();return result;
}
async function boot(){try{if(!getSession().isLoggedIn)return location.replace("login.html");await shops();await refresh();$("syncBackup").onclick=()=>sync().catch(e=>msg(e.message||String(e),"error"));$("restoreBackup").onclick=()=>restore().catch(e=>msg(e.message==="OperationError"?"Wrong backup password or damaged file.":(e.message||String(e)),"error"));}catch(e){msg(e.message||String(e),"error");}}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",boot,{once:true}):boot();
})();