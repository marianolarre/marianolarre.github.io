pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';

const fileInput = document.getElementById('fileInput');
const startPageInput = document.getElementById('startPage');
const endPageInput = document.getElementById('endPage');
const extractBtn = document.getElementById('extractBtn');
const thumbnails = document.getElementById('thumbnails');
const downloadAllBtn = document.getElementById('downloadAll');
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');

const padTop = document.getElementById('padTop');
const padLeft = document.getElementById('padLeft');
const padRight = document.getElementById('padRight');
const padBottom = document.getElementById('padBottom');

const pageCols = document.getElementById('pageCols');
const pageRows = document.getElementById('pageRows');
const sheetCols = document.getElementById('sheetCols');
const sheetRows = document.getElementById('sheetRows');
const fillLastBlack = document.getElementById('fillLastBlack');

const toggleAdvanced = document.getElementById('toggleAdvanced');
const advancedPanel = document.getElementById('advancedPanel');

const topDownScan = document.getElementById('topDownScan');

let lastSheets = [];

toggleAdvanced.addEventListener('click', () => {
  advancedPanel.classList.toggle('hidden');
  toggleAdvanced.textContent = advancedPanel.classList.contains('hidden')
    ? 'Show Advanced Options ▾'
    : 'Hide Advanced Options ▴';
});

function setProgress(text, percent = null, err = false) {
  progressText.innerHTML = err ? `<span class="error">${text}</span>` : text;
  if (percent !== null) progressBar.style.width = percent + '%';
}

function clearOutput() {
  thumbnails.innerHTML = '';
  lastSheets = [];
  downloadAllBtn.disabled = true;
  setProgress('', 0);
}

function readFileAsArrayBuffer(file) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onerror = () => rej(new Error('Failed to read file'));
    fr.onload = () => res(fr.result);
    fr.readAsArrayBuffer(file);
  });
}

async function renderPage(pdf, pageNum, scale = 2) {
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas;
}

function cropCanvas(canvas, left, top, right, bottom) {
  const w = canvas.width - left - right;
  const h = canvas.height - top - bottom;
  const cropped = document.createElement('canvas');
  cropped.width = w;
  cropped.height = h;
  const ctx = cropped.getContext('2d');
  ctx.drawImage(canvas, left, top, w, h, 0, 0, w, h);
  return cropped;
}

function splitCanvas(canvas, cols, rows, topDown = true) {
  const w = canvas.width / cols;
  const h = canvas.height / rows;
  const cards = [];
  if (topDown) {
    // top→bottom first, then left→right
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        c.getContext('2d').drawImage(canvas, x * w, y * h, w, h, 0, 0, w, h);
        cards.push(c);
      }
    }
  } else {
    // left→right first, then top→bottom
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        c.getContext('2d').drawImage(canvas, x * w, y * h, w, h, 0, 0, w, h);
        cards.push(c);
      }
    }
  }
  return cards;
}


function makeSheet(cards, cols, rows, fillBlack = true) {
  const cardW = cards[0].width;
  const cardH = cards[0].height;
  const sheet = document.createElement('canvas');
  sheet.width = cardW * cols;
  sheet.height = cardH * rows;
  const ctx = sheet.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, sheet.width, sheet.height);

  let i = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (i >= cards.length) return sheet;
      if (fillBlack && y === rows - 1 && x === cols - 1) return sheet;
      ctx.drawImage(cards[i], x * cardW, y * cardH);
      i++;
    }
  }
  return sheet;
}

extractBtn.addEventListener('click', async () => {
  clearOutput();
  const file = fileInput.files && fileInput.files[0];
  if (!file) return setProgress('Please choose a PDF.', null, true);

  const pad = {
    top: +padTop.value, left: +padLeft.value, right: +padRight.value, bottom: +padBottom.value
  };
  const pCols = +pageCols.value, pRows = +pageRows.value;
  const sCols = +sheetCols.value, sRows = +sheetRows.value;
  const fillLast = fillLastBlack.checked;

  try {
    setProgress('Loading PDF...', 5);
    const data = await readFileAsArrayBuffer(file);
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    const start = +startPageInput.value;
    const end = +endPageInput.value;
    let allCards = [];

    for (let p = start; p <= end; p++) {
      const pct = ((p - start) / (end - start + 1)) * 60 + 10;
      setProgress(`Rendering page ${p}...`, pct);
      const pageCanvas = await renderPage(pdf, p, 2);
      const cropped = cropCanvas(pageCanvas, pad.left, pad.top, pad.right, pad.bottom);
      const cards = splitCanvas(cropped, pCols, pRows, topDownScan.checked);
      allCards.push(...cards);
    }

    let sheetIndex = 1;
    for (let i = 0; i < allCards.length; i += sCols * sRows - (fillLast ? 1 : 0)) {
      const slice = allCards.slice(i, i + sCols * sRows - (fillLast ? 1 : 0));
      const sheetCanvas = makeSheet(slice, sCols, sRows, fillLast);
      const blob = await new Promise(r => sheetCanvas.toBlob(r, 'image/png'));
      lastSheets.push({ name: `Sheet ${sheetIndex}`, blob });
      const thumb = document.createElement('div');
      thumb.className = 'thumb';
      const label = document.createElement('div');
      label.textContent = `Sheet ${sheetIndex}`;
      thumb.appendChild(label);
      const cv = document.createElement('canvas');
      cv.width = 200;
      cv.height = 140;
      const ctx = cv.getContext('2d');
      const scale = Math.min(cv.width / sheetCanvas.width, cv.height / sheetCanvas.height);
      ctx.scale(scale, scale);
      ctx.drawImage(sheetCanvas, 0, 0);
      thumb.appendChild(cv);
      thumbnails.appendChild(thumb);
      sheetIndex++;
    }

    setProgress(`Done: ${lastSheets.length} sheet(s) generated.`, 100);
    downloadAllBtn.disabled = false;
  } catch (e) {
    console.error(e);
    setProgress('Error: ' + e.message, null, true);
  }
});

downloadAllBtn.addEventListener('click', async () => {
  if (!lastSheets.length) return;
  setProgress('Creating ZIP...', 0);
  const zip = new JSZip();
  for (const s of lastSheets) zip.file(`${s.name}.png`, s.blob);
  const blob = await zip.generateAsync({ type: 'blob' }, meta => {
    setProgress(`Zipping... ${Math.round(meta.percent)}%`, Math.round(meta.percent));
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'Sheets.zip';
  a.click();
  setProgress('ZIP ready.', 100);
});
