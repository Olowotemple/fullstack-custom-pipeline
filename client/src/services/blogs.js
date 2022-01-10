import axios from 'axios';
const baseUrl = '/api/blogs';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (blogObject, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(baseUrl, blogObject, config);
  return response.data;
};

const update = async (id, blogObject) => {
  const blogToUpdate = { ...blogObject, user: blogObject.user.id };
  const response = await axios.put(`${baseUrl}/${id}`, blogToUpdate);
  return response.data;
};

const deleteBlog = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  await axios.delete(`${baseUrl}/${id}`, config);
};

const addComment = async (id, comment, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const res = await axios.post(
    `${baseUrl}/${id}/comments`,
    { comment },
    config
  );
  return res.data;
};

const blogService = { getAll, create, update, deleteBlog, addComment };

export default blogService;
