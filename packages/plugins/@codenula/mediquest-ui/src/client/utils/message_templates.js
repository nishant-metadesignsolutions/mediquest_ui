import { COLLECTION_AUTH_TOKEN } from '../../myvars';
export async function getAllMessages() {
  const messagesURL = `https://mediquest.codenula.com/api/thankyou_template:list?pageSize=1000`;
  const messagesData = await fetch(messagesURL, {
    method: 'GET',
    headers: {
      Authorization: COLLECTION_AUTH_TOKEN,
    },
  });
  const data = await messagesData.json();
  return data.data;
}
