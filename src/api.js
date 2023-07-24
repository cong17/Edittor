import localforage from 'localforage';

const API = 'https://polotno-studio-api.vercel.app/api';

export async function getDesignById({ id, authToken }) {
  // if (id === 'local') {
  if (true) {
    const json = await localforage.getItem('polotno-state');
    return {
      store: json,
      name: '',
    };
  }
  const req = await fetch(`${API}/designs/get?id=${id}`, {
    headers: {
      Authorization: authToken,
      'Content-Type': 'application/json',
    },
  });
  if (!req.ok) {
    throw new Error('Design not found');
  }
  const json = await req.json();
  return {
    store: json.data.store,
    name: json.data.name,
  };
}

export async function listDesigns({ accessToken }) {
  const req = await fetch(API + '/designs/list', {
    method: 'GET',
    headers: {
      Authorization: accessToken,
    },
  });
  return req.json();
}

export async function getUserSubscription({ accessToken }) {
  const req = await fetch(API + '/user/subscription', {
    method: 'GET',
    headers: {
      Authorization: accessToken,
    },
  });
  return req.json();
}

export async function cancelUserSubscription({ accessToken, id }) {
  const req = await fetch(API + '/user/cancel-subscription', {
    method: 'POST',
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });
  return req.json();
}

export async function saveDesign({
  store,
  preview,
  id,
  authToken,
  name,
  isPrivate,
}) {
  // if (id === 'local' || !authToken) {
  localforage.setItem('polotno-state', store);
  return {
    id: 'local',
    status: 'saved',
  };
  // }
  const req = await fetch(`${API}/designs/save`, {
    method: 'POST',
    headers: {
      Authorization: authToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ store, preview, id, name, private: isPrivate }),
  });
  return await req.json();
}

export async function deleteDesign({ id, authToken }) {
  const req = await fetch(`${API}/designs/delete`, {
    method: 'POST',
    headers: {
      Authorization: authToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });
  return await req.json();
}


// here should be implementation for your own backend API
// but for demo we will just use local storage

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export async function localFileToURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export async function getImages() {
  
// Gọi API để lấy dữ liệu ảnh 
  const ItemID=localStorage.getItem("_ItemIDSoBao")
  if(ItemID){
    const response = await fetch(`${process.env.REACT_APP_API_URL}?do=LoadImages&ItemID=${ItemID}`);
  
    // Kiểm tra mã trạng thái của phản hồi
    if (!response.ok) {
      throw new Error('Lỗi khi gọi API');
    }
    // Chuyển đổi dữ liệu phản hồi sang định dạng JSON
    return [...await response.json(),...JSON.parse(localStorage.getItem('images') || '[]')];
  }
  
  
  else{
    return JSON.parse(localStorage.getItem('images') || '[]');
  }

}

export async function saveImage(file) {
  // delay to emulate network request
  await delay();
  const url = await localFileToURL(file);
  const images = JSON.parse(localStorage.getItem('images') || '[]');
  images.push({
    id: Date.now().toString(),
    url,
  });
  localStorage.setItem('images', JSON.stringify(images));
}

export async function deleteImage(id) {
  // delay to emulate network request
  await delay();
  const images = JSON.parse(localStorage.getItem('images') || '[]');
  
  const newImages = images.filter((image) => image.id !== id);
  localStorage.setItem('images', JSON.stringify(newImages));
}


//dữ lieu
