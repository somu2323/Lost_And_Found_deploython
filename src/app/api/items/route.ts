import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import LostItem from '@/models/LostItem';
import User from '@/models/User';

// GET all lost items
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'lost';
    const search = searchParams.get('search');
    
    const query: Record<string, any> = { status };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    const items = await LostItem.find(query)
      .populate('reportedBy', 'name email')
      .populate('claimedBy', 'name email')
      .sort({ createdAt: -1 });
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

// POST new lost item
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    const { title, description, category, location, dateLost, images, contactInfo, status } = body;
    
    if (!title || !description || !category || !location || !dateLost || !contactInfo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate status
    const validStatuses = ['lost', 'found'];
    const itemStatus = validStatuses.includes(status) ? status : 'lost';
    
    const newItem = await LostItem.create({
      title,
      description,
      category,
      location,
      dateLost: new Date(dateLost),
      images: images || [],
      reportedBy: user._id,
      contactInfo,
      status: itemStatus
    });
    
    await newItem.populate('reportedBy', 'name email');
    
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}