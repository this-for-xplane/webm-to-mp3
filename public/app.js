const uploader = document.getElementById('uploader');
const convertBtn = document.getElementById('convertBtn');
const statusText = document.getElementById('statusText');
const statusContainer = document.getElementById('statusContainer');
const progressBar = document.getElementById('progressBar');

convertBtn.addEventListener('click', async () => {
  if (!uploader.files.length) {
    alert('Please select a WebM file.');
    return;
  }

  const file = uploader.files[0];
  convertBtn.disabled = true;
  statusContainer.classList.remove('hidden');
  statusText.textContent = 'Uploading file...';
  progressBar.value = 10;

  try {
    const response = await fetch('/api/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream'
      },
      body: file
    });

    if (!response.ok) {
      throw new Error('Conversion failed');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.webm$/i, '.mp3');
    a.click();

    statusText.textContent = 'Conversion complete!';
    progressBar.value = 100;
  } catch (err) {
    statusText.textContent = 'Error: ' + err.message;
    progressBar.value = 0;
  }

  convertBtn.disabled = false;
});
