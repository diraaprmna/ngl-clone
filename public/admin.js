async function loadMessages() {
  const tableBody = document.querySelector('#messagesTable tbody');
  tableBody.innerHTML = '';

  try {
    const res = await fetch('/messages');
    if (!res.ok) {
      tableBody.innerHTML = '<tr><td colspan="4">Gagal memuat pesan.</td></tr>';
      return;
    }
    const messages = await res.json();
    if (messages.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4">Belum ada pesan.</td></tr>';
      return;
    }
    messages.forEach(msg => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${msg.sender}</td>
        <td>${msg.message}</td>
        <td>${new Date(msg.timestamp).toLocaleString('id-ID')}</td>
        <td><button class="delete-btn" data-id="${msg.id}">Hapus</button></td>
      `;
      tableBody.appendChild(tr);
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', async () => {
        const messageId = button.getAttribute('data-id');
        if (!confirm('Apakah Anda yakin ingin menghapus pesan ini?')) return;

        try {
          const res = await fetch(`/messages/${messageId}`, { method: 'DELETE' });
          console.log('Response status:', res.status);
          const data = await res.json();
          console.log('Response data:', data);
          if (res.ok) {
            button.closest('tr').remove();
            alert('pesan anda berhasil di hapus');
          } else {
            alert('Gagal menghapus pesan.');
          }
        } catch (error) {
          console.error('Error saat menghapus pesan:', error);
          alert('Terjadi kesalahan saat menghapus pesan.');
        }
      });
    });
  } catch (error) {
    tableBody.innerHTML = '<tr><td colspan="4">Terjadi kesalahan saat memuat pesan.</td></tr>';
  }
}

window.addEventListener('DOMContentLoaded', loadMessages);
