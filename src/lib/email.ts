import nodemailer from 'nodemailer';

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

// Create transporter for Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password
    },
  });
};

export const sendEmail = async (emailData: EmailData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"KLH Lost & Found" <${process.env.EMAIL_USER}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error };
  }
};

export const sendItemFoundNotification = async (
  ownerEmail: string,
  ownerName: string,
  finderName: string,
  finderEmail: string,
  finderContact: string,
  itemTitle: string,
  itemDescription: string,
  itemLocation: string,
  itemDate: string
) => {
  const subject = `🎉 Great News! Your Lost Item "${itemTitle}" Has Been Found!`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Item Found Notification</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .container {
                background-color: white;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #4F46E5;
                margin: 0;
                font-size: 28px;
            }
            .item-card {
                background-color: #f8fafc;
                border-left: 4px solid #10B981;
                padding: 20px;
                margin: 20px 0;
                border-radius: 5px;
            }
            .item-title {
                font-size: 20px;
                font-weight: bold;
                color: #1f2937;
                margin-bottom: 10px;
            }
            .item-details {
                color: #6b7280;
                margin-bottom: 5px;
            }
            .finder-info {
                background-color: #eff6ff;
                border: 1px solid #3b82f6;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .finder-info h3 {
                color: #1e40af;
                margin-top: 0;
                margin-bottom: 15px;
            }
            .contact-info {
                background-color: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
            }
            .btn {
                display: inline-block;
                padding: 12px 24px;
                background-color: #4F46E5;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                margin: 10px 0;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                color: #6b7280;
                font-size: 14px;
            }
            .celebration {
                font-size: 48px;
                text-align: center;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 KLH Lost & Found</h1>
                <p style="font-size: 18px; color: #10B981; margin: 0;">Great News! Your item has been found!</p>
            </div>
            
            <div class="celebration">🎊 🎉 ✨ 🎊</div>
            
            <p>Dear ${ownerName},</p>
            
            <p>Excellent news! A fellow KLH student has found your lost item and reported it through our Lost & Found platform.</p>
            
            <div class="item-card">
                <div class="item-title">📦 ${itemTitle}</div>
                <div class="item-details"><strong>Description:</strong> ${itemDescription}</div>
                <div class="item-details"><strong>Location Found:</strong> ${itemLocation}</div>
                <div class="item-details"><strong>Date:</strong> ${itemDate}</div>
            </div>
            
            <div class="finder-info">
                <h3>👤 Found By:</h3>
                <p><strong>Name:</strong> ${finderName}</p>
                <p><strong>Email:</strong> ${finderEmail}</p>
                <p><strong>Contact:</strong> ${finderContact}</p>
            </div>
            
            <div class="contact-info">
                <p><strong>⚡ Next Steps:</strong></p>
                <p>Please contact ${finderName} using the information above to arrange the collection of your item. We recommend meeting in a safe, public location on campus.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://lost-and-found-deploython-17-10-2025.onrender.com/dashboard" class="btn">
                    View on Lost & Found Platform
                </a>
            </div>
            
            <p><strong>Tips for Safe Collection:</strong></p>
            <ul>
                <li>Meet in a public area on campus (library, cafeteria, main hall)</li>
                <li>Verify the item details to ensure it's yours</li>
                <li>Be prepared to describe unique features of your item</li>
                <li>Consider meeting during daylight hours</li>
            </ul>
            
            <div class="footer">
                <p>This email was sent from the KLH University Lost & Found platform.</p>
                <p>This is an automated notification - please do not reply to this email.</p>
                <p>© 2025 KLH University Lost & Found System</p>
            </div>
        </div>
    </body>
    </html>
  `;
  
  return await sendEmail({
    to: ownerEmail,
    subject,
    html,
  });
};