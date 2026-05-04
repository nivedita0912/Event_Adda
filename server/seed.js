import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/user.js';
import Events from './models/events.js';
import Booking from './models/booking.js';

configDotenv();

const users = [
    { username: 'Admin User', email: 'admin@eventadda.com', password: 'password123', role: 'admin' },
    { username: 'Demo User', email: 'user@eventadda.com', password: 'password123', role: 'user' },
    { username: 'Alice Smith', email: 'alice@eventadda.com', password: 'password123', role: 'user' },
    { username: 'Bob Johnson', email: 'bob@eventadda.com', password: 'password123', role: 'user' },
    { username: 'Charlie Dave', email: 'charlie@eventadda.com', password: 'password123', role: 'user' },
    { username: 'Diana Prince', email: 'diana@eventadda.com', password: 'password123', role: 'user' },
    { username: 'Ethan Hunt', email: 'ethan@eventadda.com', password: 'password123', role: 'user' },
    { username: 'Fiona Gallagher', email: 'fiona@eventadda.com', password: 'password123', role: 'user' },
    { username: 'George Miller', email: 'george@eventadda.com', password: 'password123', role: 'user' },
    { username: 'Hannah Montana', email: 'hannah@eventadda.com', password: 'password123', role: 'user' }
];

const events = [
    {
        title: 'React & Node.js Developer Retreat',
        description: 'Join us for a 3-day deep dive into modern full-stack web development. Perfect for developers looking to level up their skills.',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        location: 'Silicon Valley Innovation Center, CA',
        category: 'Technology',
        totalSeats: 200,
        ticketPrice: 0,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Neon Nights EDM Festival',
        description: 'Experience an unforgettable night of EDM, techno, and dazzling light shows with top DJs from around the globe.',
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        location: 'Grand Arena, New York',
        category: 'Music',
        totalSeats: 500,
        ticketPrice: 1500,
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Global Leaders Business Summit',
        description: 'A premium gathering of CEOs, founders, and investors discussing the future of global commerce and AI integration.',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        location: 'The Taj Hotel, Mumbai',
        category: 'Business',
        totalSeats: 150,
        ticketPrice: 5000,
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Modern Art Expo 2025',
        description: 'Discover breathtaking contemporary and modern art from underground and trending artists this season.',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        location: 'National Gallery of Modern Art, Delhi',
        category: 'Art',
        totalSeats: 300,
        ticketPrice: 200,
        image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Startup Pitch Competition',
        description: 'Watch 25 startups pitch for seed funding. Great networking for entrepreneurs and angel investors.',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        location: 'IIT Delhi Convention Center',
        category: 'Business',
        totalSeats: 250,
        ticketPrice: 100,
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Cloud Computing Architecture Seminar',
        description: 'A technical breakdown of scalable cloud solutions, multi-region routing, and serverless compute processing.',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        location: 'Cyber Hub, Gurugram',
        category: 'Technology',
        totalSeats: 100,
        ticketPrice: 600,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Bollywood Music Night',
        description: 'A spectacular evening of live Bollywood music performances featuring top artists from the Indian music industry.',
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        location: 'Jawaharlal Nehru Stadium, Delhi',
        category: 'Music',
        totalSeats: 1000,
        ticketPrice: 999,
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Yoga & Wellness Retreat',
        description: 'A peaceful weekend retreat focusing on mindfulness, yoga, and holistic wellness practices.',
        date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        location: 'Rishikesh Yoga Ashram, Uttarakhand',
        category: 'Health',
        totalSeats: 50,
        ticketPrice: 2500,
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800'
    }
];

export async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('\n✅ MongoDB connected...');

        await User.deleteMany();
        await Events.deleteMany();
        await Booking.deleteMany();
        console.log('🗑️  Cleared existing data.');

        const salt = await bcrypt.genSalt(10);
        const hashedUsers = users.map(u => ({
            ...u,
            password: bcrypt.hashSync(u.password, salt),
            isVerified: true
        }));

        const createdUsers = await User.insertMany(hashedUsers);
        const adminUser = createdUsers.find(u => u.role === 'admin');
        const normalUsers = createdUsers.filter(u => u.role === 'user');
        console.log(`👤 Created ${createdUsers.length} users.`);

        const eventsWithAdmin = events.map(e => ({
            ...e,
            availableSeats: e.totalSeats,
            createdBy: adminUser._id
        }));

        const createdEvents = await Events.insertMany(eventsWithAdmin);
        console.log(`🎉 Created ${createdEvents.length} events.`);

        const bookingsData = [];

        for (const event of createdEvents) {
            const randomCount = Math.floor(Math.random() * 4) + 3;
            const shuffledUsers = [...normalUsers].sort(() => 0.5 - Math.random());
            const selectedUsers = shuffledUsers.slice(0, randomCount);

            for (const user of selectedUsers) {
                const statuses = ['pending', 'confirmed', 'cancelled'];
                const status = statuses[Math.floor(Math.random() * statuses.length)];

                let paymentStatus = 'not_paid';
                if (status === 'confirmed' && event.ticketPrice > 0) {
                    paymentStatus = Math.random() > 0.1 ? 'paid' : 'not_paid';
                } else if (event.ticketPrice === 0) {
                    paymentStatus = 'paid';
                }

                bookingsData.push({
                    userId: user._id,
                    eventId: event._id,
                    status,
                    paymentStatus,
                    amount: event.ticketPrice
                });

                if (status === 'confirmed') {
                    event.availableSeats -= 1;
                    await event.save();
                }
            }
        }

        await Booking.insertMany(bookingsData);
        console.log(`🎫 Inserted ${bookingsData.length} bookings.`);

        console.log('\n🚀 Event Adda database seeded successfully!');
        console.log('-------------------------------------------');
        console.log('Admin Email : admin@eventadda.com');
        console.log('User Email  : user@eventadda.com');
        console.log('Password    : password123');
        console.log('-------------------------------------------\n');

        process.exit();
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

seedDatabase();