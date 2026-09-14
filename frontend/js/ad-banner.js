(function(){
  function imageCandidates(url){
    if(!url) return [];
    let u=String(url).trim().replace(/\\/g,'/');
    const list=[];

    // External URLs (Google Drive / Dropbox supported as fallback only).
    try{
      const parsed=new URL(u);
      if(parsed.protocol==='http:' || parsed.protocol==='https:'){
        if(parsed.hostname.includes('drive.google.com')){
          const m=parsed.pathname.match(/\/file\/d\/([^/]+)/);
          const id=m&&m[1] ? m[1] : parsed.searchParams.get('id');
          if(id) list.push(`https://drive.google.com/uc?export=view&id=${encodeURIComponent(id)}`);
        }else if(parsed.hostname.includes('dropbox.com')){
          parsed.searchParams.set('raw','1');
          parsed.searchParams.delete('dl');
          list.push(parsed.toString());
        }
        list.push(u);
        return [...new Set(list)];
      }
    }catch(_e){}

    // Local project paths. Dashboard is inside /frontend/ on GitHub Pages.
    // Accept all of these values in Ad Manager:
    // assets/ads/banner.jpg
    // frontend/assets/ads/banner.jpg
    // /frontend/assets/ads/banner.jpg
    u=u.replace(/^\.\//,'');
    const noLeading=u.replace(/^\//,'');
    const withoutFrontend=noLeading.replace(/^frontend\//i,'');

    // Preferred: relative to frontend/dashboard.html.
    list.push(new URL(withoutFrontend, document.baseURI).href);

    // Fallback: file may have been uploaded at repository root /assets/...
    if(/^assets\//i.test(withoutFrontend)){
      list.push(new URL('../'+withoutFrontend, document.baseURI).href);
    }

    // If user pasted an explicit frontend/... path, resolve from repo root too.
    if(/^frontend\//i.test(noLeading)){
      list.push(new URL('../'+noLeading, document.baseURI).href);
    }

    return [...new Set(list)];
  }

  function loadWithFallback(img,candidates,onSuccess,onFailure){
    let i=0;
    const tryNext=()=>{
      if(i>=candidates.length){
        onFailure();
        return;
      }
      const src=candidates[i++];
      img.onload=()=>onSuccess(src);
      img.onerror=tryNext;
      img.src=src;
    };
    tryNext();
  }

  document.addEventListener('DOMContentLoaded',async()=>{
    const slot=document.getElementById('recountixAdSlot');
    if(!slot||typeof sbGetActiveAds!=='function') return;
    try{
      const ads=await sbGetActiveAds(currentShopId());
      if(!ads.length) return;
      const ad=ads[Math.floor(Math.random()*ads.length)];
      const card=document.createElement(ad.link_url?'a':'div');
      card.className='rx-ad-card';
      if(ad.link_url){
        card.href=ad.link_url;
        card.target='_blank';
        card.rel='noopener sponsored';
        card.addEventListener('click',()=>sbTrackAdClick(ad.id));
      }

      const copy=document.createElement('div');
      copy.className='rx-ad-copy';
      const label=document.createElement('span');
      label.className='rx-ad-label';
      label.textContent='Sponsored';
      const title=document.createElement('div');
      title.className='rx-ad-title';
      title.textContent=ad.title||'';
      const text=document.createElement('p');
      text.className='rx-ad-text';
      text.textContent=ad.description||'';
      copy.append(label,title,text);
      card.append(copy);

      if(ad.image_url){
        const media=document.createElement('div');
        media.className='rx-ad-media';
        const img=document.createElement('img');
        img.className='rx-ad-image';
        img.alt=ad.title||'Sponsored campaign';
        img.decoding='async';
        img.loading='eager';

        const sponsored=document.createElement('span');
        sponsored.className='rx-ad-overlay-label';
        sponsored.textContent='Sponsored';
        media.append(img,sponsored);
        card.append(media);

        const candidates=imageCandidates(ad.image_url);
        // Permanent local fallback for the standard Recountix dashboard campaign.
        // This keeps the banner visible even when a saved external/old URL is broken.
        const localFallback = new URL('assets/ads/recovery-banner.png', document.baseURI).href;
        if(!candidates.includes(localFallback)) candidates.push(localFallback);
        loadWithFallback(
          img,
          candidates,
          (loadedSrc)=>{
            card.classList.add('has-image','image-ready');
            console.info('Ad image loaded:',loadedSrc);
          },
          ()=>{
            card.classList.remove('image-ready');
            media.remove();
            console.warn('Ad image failed to load. Tried:',candidates);
          }
        );
      }

      if(ad.link_url){
        const cta=document.createElement('span');
        cta.className='rx-ad-cta';
        cta.textContent=ad.cta_text||'Learn More';
        card.append(cta);
      }

      slot.append(card);
      slot.hidden=false;
    }catch(e){console.warn('Ad banner',e);}
  });
})();
