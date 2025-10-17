'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, LogOut, User } from 'lucide-react';
import Link from 'next/link';

interface LostItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  dateLost: string;
  images: string[];
  status: 'lost' | 'found' | 'claimed';
  reportedBy: {
    name: string;
    email: string;
  };
  claimedBy?: {
    name: string;
    email: string;
  };
  contactInfo: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('lost');

  const categories = [
    'all',
    'Electronics',
    'Clothing',
    'Books',
    'Accessories',
    'Documents',
    'Sports',
    'Other'
  ];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      // Ensure user exists in database
      fetch('/api/user', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          console.log('User check/creation result:', data);
        })
        .catch(error => {
          console.error('Error ensuring user exists:', error);
        });
      
      fetchItems();
    }
  }, [session, selectedCategory, selectedStatus, searchTerm]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        status: selectedStatus,
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/items?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (itemId: string) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'claim' }),
      });

      if (response.ok) {
        fetchItems(); // Refresh the list
        alert('Item claimed successfully!');
      } else {
        alert('Failed to claim item');
      }
    } catch (error) {
      console.error('Error claiming item:', error);
      alert('Error claiming item');
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
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">KLH Lost & Found</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-base font-medium text-gray-800">{session.user?.name}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex space-x-4">
                <Link
                  href="/post-item"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Post Item
                </Link>
              </div>
              
              {/* Status Filter */}
              <div className="flex space-x-3">
                {[
                  { key: 'lost', label: 'Lost Items', icon: '🔍' },
                  { key: 'found', label: 'Found Items', icon: '📦' },
                  { key: 'claimed', label: 'Returned', icon: '✅' }
                ].map((status) => (
                  <button
                    key={status.key}
                    onClick={() => setSelectedStatus(status.key)}
                    className={`px-4 py-2 text-base font-semibold rounded-lg border-2 transition-all ${
                      selectedStatus === status.key
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{status.icon}</span>
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search and Category Filter */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg text-base font-medium text-gray-900 bg-white placeholder-gray-600 focus:outline-none focus:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block px-4 py-3 text-base font-medium text-gray-900 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="text-base font-medium text-gray-900 py-2">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Items Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No items found</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item._id} className="bg-white overflow-hidden shadow rounded-lg">
                    {item.images.length > 0 && (
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'lost' ? 'bg-red-100 text-red-800' :
                          item.status === 'found' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">{item.category}</span>
                      </div>
                      
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                      <p className="text-sm text-gray-500 mb-2">📍 {item.location}</p>
                      <p className="text-sm text-gray-500 mb-2">
                        📅 {new Date(item.dateLost).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Posted by: {item.reportedBy.name}
                      </p>
                      
                      {item.status === 'lost' && item.reportedBy.email !== session.user?.email && (
                        <button
                          onClick={() => handleClaim(item._id)}
                          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                        >
                          I Found This Item
                        </button>
                      )}
                      
                      {item.status === 'found' && item.reportedBy.email !== session.user?.email && (
                        <button
                          onClick={() => handleClaim(item._id)}
                          className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                        >
                          This Is My Item
                        </button>
                      )}
                      
                      {item.status === 'claimed' && item.claimedBy && (
                        <p className="text-sm text-green-600 font-medium">
                          ✅ Returned to: {item.claimedBy.name}
                        </p>
                      )}
                      
                      {item.reportedBy.email === session.user?.email && (
                        <div className="text-sm text-blue-600 font-medium">
                          📝 Your {item.status === 'lost' ? 'Lost' : 'Found'} Item Post
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}