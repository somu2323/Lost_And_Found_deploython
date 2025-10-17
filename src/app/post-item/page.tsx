'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';

export default function PostItemPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    dateLost: '',
    contactInfo: '',
    status: 'lost', // Default to lost
  });
  const [images, setImages] = useState<string[]>([]);

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Accessories',
    'Documents',
    'Sports',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const uploadedImages: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          uploadedImages.push(result.url);
        }
      }

      setImages([...images, ...uploadedImages]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || 
        !formData.location || !formData.dateLost || !formData.contactInfo) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          images,
        }),
      });

      if (response.ok) {
        alert('Item posted successfully!');
        router.push('/dashboard');
      } else {
        alert('Failed to post item');
      }
    } catch (error) {
      console.error('Error posting item:', error);
      alert('Error posting item');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              {formData.status === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              {/* Item Status */}
              <div>
                <label htmlFor="status" className="block text-base font-semibold text-gray-800">
                  Item Status *
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border-2 border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="lost" className="text-base font-medium text-gray-900 py-2">
                    Lost - I lost something and need help finding it
                  </option>
                  <option value="found" className="text-base font-medium text-gray-900 py-2">
                    Found - I found something and want to return it
                  </option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-base font-semibold text-gray-800">
                  Item Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border-2 border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., iPhone 12, Blue Backpack, etc."
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-base font-semibold text-gray-800">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border-2 border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Provide a detailed description of the item..."
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-base font-semibold text-gray-800">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border-2 border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="" className="text-base font-medium text-gray-600">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category} className="text-base font-medium text-gray-900 py-2">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-base font-semibold text-gray-800">
                  {formData.status === 'lost' ? 'Location Where Lost *' : 'Location Where Found *'}
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border-2 border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={formData.status === 'lost' ? "e.g., Library, Cafeteria, Computer Lab, etc." : "e.g., Library, Parking Lot, Classroom 101, etc."}
                />
              </div>

              {/* Date Lost/Found */}
              <div>
                <label htmlFor="dateLost" className="block text-base font-semibold text-gray-800">
                  {formData.status === 'lost' ? 'Date Lost *' : 'Date Found *'}
                </label>
                <input
                  type="date"
                  id="dateLost"
                  name="dateLost"
                  required
                  value={formData.dateLost}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border-2 border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Contact Info */}
              <div>
                <label htmlFor="contactInfo" className="block text-base font-semibold text-gray-800">
                  Contact Information *
                </label>
                <input
                  type="text"
                  id="contactInfo"
                  name="contactInfo"
                  required
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border-2 border-gray-300 rounded-lg shadow-sm py-3 px-4 text-base font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Phone number, email, or room number"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-base font-semibold text-gray-800 mb-3">
                  Item Images (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload files</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    {uploading && (
                      <p className="text-sm text-indigo-600">Uploading...</p>
                    )}
                  </div>
                </div>

                {/* Display uploaded images */}
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                    loading || uploading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {loading ? 'Posting...' : 'Post Lost Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}