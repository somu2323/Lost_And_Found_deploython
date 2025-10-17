import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import LostItem from '@/models/LostItem';
import User from '@/models/User';
import { sendItemFoundNotification } from '@/lib/email';

// GET single item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const item = await LostItem.findById(id)
      .populate('reportedBy', 'name email')
      .populate('claimedBy', 'name email');
    
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}

// PUT update item (for claiming)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { action } = body;
    
    const { id } = await params;
    const item = await LostItem.findById(id);
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }
    
    if (action === 'claim') {
      // Allow claiming both lost and found items
      if (item.status !== 'lost' && item.status !== 'found') {
        return NextResponse.json(
          { error: 'Item is not available for claiming' },
          { status: 400 }
        );
      }
      
      // Don't allow users to claim their own posts
      if (item.reportedBy.toString() === user._id.toString()) {
        return NextResponse.json(
          { error: 'You cannot claim your own item' },
          { status: 400 }
        );
      }
      
      // Get the original poster's details before updating
      await item.populate('reportedBy', 'name email');
      const originalPoster = item.reportedBy as any;
      
      item.status = 'claimed';
      item.claimedBy = user._id;
      await item.save();
      
      await item.populate('claimedBy', 'name email');
      
      // Send email notification if someone found a lost item
      if (item.status === 'claimed') {
        try {
          // Format the date for display
          const formattedDate = new Date(item.dateLost).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          await sendItemFoundNotification(
            originalPoster.email,           // Owner's email
            originalPoster.name,            // Owner's name
            user.name || 'KLH Student',     // Finder's name
            user.email,                     // Finder's email
            item.contactInfo,               // Contact info from the item
            item.title,                     // Item title
            item.description,               // Item description
            item.location,                  // Location where found/lost
            formattedDate                   // Formatted date
          );
          
          console.log(`Email notification sent to ${originalPoster.email} about found item: ${item.title}`);
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError);
          // Don't fail the claim if email fails - just log it
        }
      }
      
      return NextResponse.json(item);
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

// DELETE item (only by owner)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    
    const { id } = await params;
    const item = await LostItem.findById(id);
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }
    
    if (item.reportedBy.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Not authorized to delete this item' },
        { status: 403 }
      );
    }
    
    await LostItem.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}