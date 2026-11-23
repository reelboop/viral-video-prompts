window.copyPreviewText = async function (text, status, success) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);
    status.textContent = success;
  } catch {
    const field = document.createElement('textarea');
    field.value = text;
    field.style.cssText = 'position:fixed;left:-1000px;top:0';
    const trigger = document.activeElement;
    document.body.append(field);
    field.select();
    const copied = document.execCommand?.('copy');
    field.remove();
    trigger?.focus();
    status.textContent = copied ? success : 'Select the text to copy it manually.';
  }
};
