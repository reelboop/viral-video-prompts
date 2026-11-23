const get = (id) => document.getElementById(id);
const list = get('prompt-list');
let active;

function selectPrompt(item) {
  active = item;
  get('prompt-title').textContent = item.title;
  get('description').textContent = item.description;
  get('input').hidden = !item.input;
  get('input').textContent = item.input ? 'Reference: ' + item.input : '';
  get('prompt').textContent = item.prompt;
  get('source').href = item.source;
  get('status').textContent = '';
  for (const button of list.children) button.setAttribute('aria-pressed', String(button.textContent === item.title));
}

function filter() {
  const words = get('query').value.trim().toLowerCase().split(/\s+/);
  const group = get('category').value;
  const visible = window.promptLibrary.filter((item) => {
    const text = [item.title, item.description, item.input, item.group].join(' ').toLowerCase();
    return (!group || item.group === group) && words.every((word) => text.includes(word));
  });
  get('count').textContent = visible.length + (visible.length === 1 ? ' prompt' : ' prompts');
  get('active-prompt').hidden = visible.length === 0;
  get('empty').hidden = visible.length !== 0;
  list.hidden = visible.length === 0;
  list.replaceChildren(...visible.map((item) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = item.title;
    button.addEventListener('click', () => selectPrompt(item));
    return button;
  }));
  if (visible.length) selectPrompt(visible.includes(active) ? active : visible[0]);
}

for (const link of document.querySelectorAll('[data-prompt]')) {
  link.addEventListener('click', () => {
    get('category').value = 'Viral templates';
    get('query').value = link.dataset.prompt;
    filter();
  });
}

get('query').addEventListener('input', filter);
get('category').addEventListener('change', filter);
get('copy').addEventListener('click', () => window.copyPreviewText(active.prompt, get('status'), 'Prompt copied.'));
filter();
