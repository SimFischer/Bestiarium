// Resize geometry only: never rebuild views, forms, progress or stored works.
export function initLayout() {
  const dialog = document.querySelector('#view-dialog'), content = document.querySelector('#view-content');
  let frame;
  function measure() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      if (!dialog.open) return;
      const bounds = content.getBoundingClientRect();
      for (const node of content.querySelectorAll('.book-stage, :scope > .bestiary-index, .observation-scene, .generator-machine, .builder-stage')) {
        if (node.matches('.builder-stage')) {
          const bounds = node.parentElement.getBoundingClientRect();
          const available = node.parentElement.clientWidth - node.parentElement.querySelector('.builder-controls').getBoundingClientRect().width - 40;
          const width = Math.min(available, (bounds.height - 16) * 4 / 3);
          node.style.width = `${Math.max(100, width)}px`; node.style.height = `${Math.max(100, width) * 3 / 4}px`; continue;
        }
        let holder = node;
        while (holder.parentElement !== content && holder.parentElement) holder = holder.parentElement;
        let after = 0;
        for (let sibling = holder.nextElementSibling; sibling; sibling = sibling.nextElementSibling) {
          if (getComputedStyle(sibling).display !== 'none') after += sibling.getBoundingClientRect().height + 8;
        }
        const top = node.getBoundingClientRect().top;
        const ratio = node.matches('.book-stage, .bestiary-index') ? 1.5 : 16 / 9;
        const height = Math.max(100, bounds.bottom - top - after - 4);
        const width = Math.min(bounds.width - (node.matches('.book-stage') ? 128 : 0), height * ratio);
        if (Math.abs(node.getBoundingClientRect().width - width) > .6) node.style.width = `${width}px`;
        node.style.height = `${width / ratio}px`;
      }
      content.dispatchEvent(new Event('surface-resize'));
    });
  }
  new ResizeObserver(measure).observe(content);
  new MutationObserver(records => {
    if (records.some(r => r.type === 'attributes' || [...r.addedNodes, ...r.removedNodes].some(n => n.nodeType === 1))) measure();
  }).observe(content, { childList: true, subtree: true, attributes: true, attributeFilter: ['open', 'hidden'] });
  for (const event of ['resize', 'presentation-change']) window.addEventListener(event, measure);
  document.addEventListener('fullscreenchange', measure);
  new MutationObserver(measure).observe(dialog, { attributes: true, attributeFilter: ['open', 'class'] });
  document.fonts.ready.then(measure);
}
