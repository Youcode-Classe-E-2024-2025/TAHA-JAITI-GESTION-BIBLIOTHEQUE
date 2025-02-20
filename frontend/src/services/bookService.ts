import api from '../api/apiClient';
import Book from '../types/Book';
import Response from '../types/Response';


const getAll = () => api.get<Response<Book[]>>('/books');
const get = (id: number) => api.get<Response<Book>>(`/books/${id}`);
const create = (data: FormData) => api.post<Response<Book>>('/books', data);
const update = (id: number, data: Partial<Book>) => api.put<Response<Book>>(`/books/${id}`, data);
const remove = (id: number) => api.delete<Response<null>>(`/books/${id}`);

const bookService = {
    getAll,
    get,
    create,
    update,
    remove
}

export default bookService;