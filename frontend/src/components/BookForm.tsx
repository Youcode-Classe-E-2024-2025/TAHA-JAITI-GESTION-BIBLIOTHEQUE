import React, { useState } from 'react';
import { Book, User, Hash, Image, XIcon } from 'lucide-react';
import { BookAdd } from '../types/Book';
import { useBookStore } from '../stores/bookStore';

interface Props {
    handle: () => void;
}

const BookForm = ({ handle }: Props) => {
    const { add, getAll, current_page } = useBookStore();
    const [formData, setFormData] = useState<BookAdd>({
        title: '',
        author: '',
        cover: null,
        quantity: 1
    });

    const [preview, setPreview] = useState<string>('');
    const [errors, setErrors] = useState<{ title?: string, author?: string, quantity?: string, cover?: string }>({});

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!formData.title.trim() || formData.title.length < 3) {
            newErrors.title = "Title must be at least 3 characters long.";
        }

        if (!formData.author.trim() || formData.author.length < 3) {
            newErrors.author = "Author name must be at least 3 characters long.";
        }

        if (formData.quantity < 1 || isNaN(formData.quantity)) {
            newErrors.quantity = "Quantity must be a positive number.";
        }

        if (formData.cover) {            
            const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!allowedTypes.includes((formData.cover as File).type) || !formData.cover) {
                newErrors.cover = "Only JPG, PNG, or GIF images are allowed.";
            }
        }

        if (!formData.cover){
            newErrors.cover = "Please upload an image.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const form = new FormData();
        form.append('title', formData.title);
        form.append('author', formData.author);
        form.append('quantity', formData.quantity.toString());
        form.append('cover', formData.cover as File);

        await add(form);
        getAll(current_page);
        setFormData({ title: '', author: '', cover: null, quantity: 1 });
        setPreview('');
        handle();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' ? Math.max(1, parseInt(value)) : value
        }));
        validate();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files;
        if (file && file[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                setFormData(prev => ({
                    ...prev,
                    cover: file[0]
                }));
            };
            reader.readAsDataURL(file[0]);
        }
    };

    return (
        <div className="w-full h-full fixed top-0 z-10 bg-black/30 backdrop-blur-sm p-8 flex justify-center items-center">
            <div className='w-1/2 bg-dun p-4 rounded-md'>
                <div className='flex justify-between items-center'>
                    <h2 className="mb-6 text-2xl font-bold text-night">Add New Book</h2>
                    <XIcon className='text-4xl text-red-600 cursor-pointer' onClick={handle} />
                </div>
                <form onSubmit={handleSubmit} className="space-y-6 text-white" encType='multipart/form-data'>
                    {/* Cover Input */}
                    <div className='flex flex-col justify-center items-center gap-4'>
                        <input
                            onChange={handleImageChange}
                            className="text-white bg-jet p-2 rounded-lg cursor-pointer"
                            id="cover"
                            accept="image/*"
                            name="cover"
                            type="file"
                        />
                        {preview ? (
                            <img src={preview} alt="Book cover preview" className="h-52 w-32 rounded-lg object-cover" />
                        ) : (
                            <div className="flex h-52 w-32 bg-jet rounded-md flex-col items-center justify-center gap-2 text-white">
                                <Image className="h-8 w-8" />
                            </div>
                        )}
                        {errors.cover && <p className="text-red-500">{errors.cover}</p>}
                    </div>

                    {/* Title Input */}
                    <div className="space-y-2">
                        <label htmlFor="title" className="flex text-night items-center gap-2">
                            <Book className="h-4 w-4" />
                            <span>Book Title</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gris bg-smoke p-3 outline-none focus:border-platinum"
                            placeholder="Enter book title"
                            required
                        />
                        {errors.title && <p className="text-red-500">{errors.title}</p>}
                    </div>

                    {/* Author Input */}
                    <div className="space-y-2">
                        <label htmlFor="author" className="flex text-night items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Author</span>
                        </label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gris bg-smoke p-3 outline-none focus:border-platinum"
                            placeholder="Enter author name"
                            required
                        />
                        {errors.author && <p className="text-red-500">{errors.author}</p>}
                    </div>

                    {/* Quantity Input */}
                    <div className="space-y-2">
                        <label htmlFor="quantity" className="flex text-night items-center gap-2">
                            <Hash className="h-4 w-4" />
                            <span>Quantity</span>
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="1"
                            className="w-full rounded-lg border border-gris bg-smoke p-3 outline-none focus:border-platinum"
                            required
                        />
                        {errors.quantity && <p className="text-red-500">{errors.quantity}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="mt-6 w-full rounded-lg bg-night px-6 py-3 text-flash transition-colors hover:bg-jet focus:outline-none focus:ring-2 focus:ring-platinum"
                    >
                        Add Book
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookForm;
