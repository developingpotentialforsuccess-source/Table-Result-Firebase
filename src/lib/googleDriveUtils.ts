
/**
 * Utility for interacting with Google Drive API.
 * Uses the access token provided by the AI Studio environment.
 */

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files';
const UPLOAD_API_URL = 'https://www.googleapis.com/upload/drive/v3/files';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

/**
 * Gets the current access token from the AI Studio proxy.
 */
async function getAccessToken(): Promise<string> {
  const response = await fetch('/.aistudio/proxy/auth/token?scope=https://www.googleapis.com/auth/drive.file');
  if (!response.ok) {
    throw new Error('Failed to retrieve Google Drive access token. Please ensure you have authorized the app.');
  }
  const data = await response.json();
  return data.access_token;
}

/**
 * Searches for a file by name.
 */
export async function findFileByName(name: string): Promise<DriveFile | null> {
  const token = await getAccessToken();
  const query = encodeURIComponent(`name = '${name}' and trashed = false`);
  const response = await fetch(`${DRIVE_API_URL}?q=${query}&fields=files(id, name, mimeType)`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const err = await response.json();
    console.error('Drive API Error (find):', err);
    return null;
  }

  const data = await response.json();
  return data.files && data.files.length > 0 ? data.files[0] : null;
}

/**
 * Creates or updates a JSON file on Google Drive.
 */
export async function saveToDrive(fileName: string, data: any): Promise<string> {
  const token = await getAccessToken();
  const existingFile = await findFileByName(fileName);
  
  const metadata = {
    name: fileName,
    mimeType: 'application/json',
  };

  const fileContent = JSON.stringify(data, null, 2);
  const blob = new Blob([fileContent], { type: 'application/json' });

  let url = UPLOAD_API_URL;
  let method = 'POST';

  if (existingFile) {
    url = `${UPLOAD_API_URL}/${existingFile.id}?uploadType=media`;
    method = 'PATCH';
  } else {
    // For new files, we use a multipart upload to include metadata
    url = `${UPLOAD_API_URL}?uploadType=multipart`;
  }

  if (method === 'POST') {
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', blob);

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Drive Upload Failed: ${err.error?.message || response.statusText}`);
    }

    const result = await response.json();
    return result.id;
  } else {
    // PATCH only updates content if uploadType=media
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: blob,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Drive Update Failed: ${err.error?.message || response.statusText}`);
    }

    return existingFile!.id;
  }
}
