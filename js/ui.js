export function element(tag, text = '', className = '') {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  return node;
}
export function button(text, action, className = '') {
  const node = element('button', text, className);
  node.type = 'button';
  node.addEventListener('click', action);
  return node;
}
export function position(node, area) {
  Object.assign(node.style, { left: `${area.x}%`, top: `${area.y}%`, width: `${area.width}%`, height: `${area.height}%` });
}
export function asset(parent, path, alt, className = '') {
  const image = element('img', '', className);
  const fallback = element('span', 'Abbildung folgt', 'asset-fallback');
  image.alt = alt;
  image.hidden = true;
  image.draggable = false;
  parent.classList.add('asset-missing');
  image.addEventListener('load', () => { image.hidden = false; fallback.hidden = true; parent.classList.remove('asset-missing'); });
  image.addEventListener('error', () => { image.hidden = true; fallback.hidden = false; parent.classList.add('asset-missing'); });
  parent.append(image, fallback);
  image.src = path;
  return image;
}
