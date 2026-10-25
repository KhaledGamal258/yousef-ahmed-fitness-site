// A complete outside press dismisses a modal; dragging from its content does not.
document.querySelectorAll('dialog').forEach(dialog=>{
  let startedOutside=false;
  const outside=e=>{const r=dialog.getBoundingClientRect();return e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom);};
  dialog.addEventListener('pointerdown',e=>{startedOutside=outside(e);});
  dialog.addEventListener('click',e=>{if(startedOutside&&outside(e))dialog.close();startedOutside=false;});
});
