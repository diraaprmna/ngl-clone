document.getElementById('messageForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const sender = document.getElementById('sender').value.trim();
  const message = document.getElementById('message').value.trim();
  const responseDiv = document.getElementById('response');

  function animateAlert() {
    responseDiv.classList.remove('alert-animate');
    void responseDiv.offsetWidth; // trigger reflow
    responseDiv.classList.add('alert-animate');
  }

  if (!sender || !message) {
    responseDiv.textContent = 'Nama dan pesan harus diisi.';
    responseDiv.style.color = 'red';
    animateAlert();
    return;
  }

  try {
    const res = await fetch('/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sender, message }),
    });

    if (res.ok) {
      responseDiv.textContent = 'Pesan berhasil dikirim!';
      responseDiv.style.color = 'white';
      animateAlert();
      this.reset();
    } else {
      const data = await res.json();
      responseDiv.textContent = 'Gagal mengirim pesan: ' + (data.error || 'Error tidak diketahui');
      responseDiv.style.color = 'red';
      animateAlert();
    }
  } catch (error) {
    responseDiv.textContent = 'Terjadi kesalahan saat mengirim pesan.';
    responseDiv.style.color = 'red';
    animateAlert();
  }
});
