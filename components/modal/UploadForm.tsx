'use client';

export default function UploadForm() {
  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = (e.currentTarget.file as HTMLInputElement).files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append('file', file);

    await fetch('/api/upload', {
      method: 'POST',
      body: fd,
    });

    location.reload();
  }

  return (
    <form onSubmit={upload} className="flex gap-2">
      <input
        type="file"
        name="file"
        className="border rounded px-2 py-1 text-sm"
      />
      <button
        type="submit"
        className="px-3 py-1 bg-black text-white rounded"
      >
        Upload
      </button>
    </form>
  );
}