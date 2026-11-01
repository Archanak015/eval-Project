const mongoose = require('mongoose');
const Subject = require('./models/Subject');
const LMSModule = require('./models/LMSModule');
const ResearchProject = require('./models/ResearchProject');
const Alumni = require('./models/Alumni');
const AdmissionApplication = require('./models/AdmissionApplication');

async function seedAdvanced() {
    await mongoose.connect('mongodb://localhost:27017/uniconnect');
    console.log('Connected to MongoDB');

    let subject = await Subject.findOne({ code: 'CS501' });
    if (!subject) {
        subject = await Subject.findOne();
    }

    if (subject) {
        await LMSModule.deleteMany({});
        await LMSModule.create({
            subject: subject._id,
            title: 'Module 1: Advanced Graph Theory & Network Flows',
            description: 'In-depth exploration of Ford-Fulkerson, Edmonds-Karp, and Min-Cut Max-Flow theorems.',
            moduleOrder: 1,
            materials: [
                { title: 'Lecture 1: Max-Flow Formulation', type: 'video', url: 'https://cdn.uniconnect.edu/lectures/cs501_mod1.mp4', durationMinutes: 48 },
                { title: 'Lecture Notes & Proofs PDF', type: 'pdf', url: 'https://cdn.uniconnect.edu/notes/cs501_graphs.pdf' }
            ],
            assignments: [
                {
                    title: 'Assignment 1: Residual Graph Analysis',
                    description: 'Implement augmenting path detection using BFS in Python or C++.',
                    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                    maxMarks: 25
                }
            ],
            quizzes: [
                {
                    title: 'Quick Check: Flow Networks',
                    timeLimitMinutes: 10,
                    totalMarks: 5,
                    questions: [
                        {
                            questionText: 'What is the maximum flow value equal to in any flow network according to the max-flow min-cut theorem?',
                            options: ['Capacity of minimum cut', 'Number of vertices', 'Capacity of source', 'Zero'],
                            correctOptionIndex: 0
                        }
                    ]
                }
            ]
        });
        console.log('Seeded LMS Module');
    }

    await ResearchProject.deleteMany({});
    await ResearchProject.create([
        {
            title: 'Edge AI Computing for Low-Latency Autonomous Drone Navigation',
            abstract: 'Investigating real-time visual odometry using quantized neural architectures on embedded edge accelerators.',
            type: 'Funded Grant',
            principalInvestigator: 'Dr. Aris Thorne',
            department: 'Computer Science',
            fundingAgency: 'DST-SERB & National AI Mission',
            grantAmount: 4800000,
            status: 'Approved / In Progress',
            year: 2026
        },
        {
            title: 'Fault-Tolerant Distributed Consensus in Partitioned Networks',
            abstract: 'Published in IEEE Transactions on Parallel and Distributed Systems (TPDS).',
            type: 'Journal Publication',
            principalInvestigator: 'Prof. Ramesh Rao',
            department: 'Computer Science',
            doi: '10.1109/TPDS.2026.1049281',
            citationsCount: 42,
            status: 'Published',
            year: 2026
        }
    ]);
    console.log('Seeded Research Projects');

    await Alumni.deleteMany({});
    await Alumni.create([
        {
            fullName: 'Ananya Sharma',
            graduationYear: 2021,
            degree: 'B.E Computer Science',
            currentCompany: 'Google India',
            currentDesignation: 'Senior Software Engineer',
            location: 'Bengaluru, India',
            email: 'ananya.s@alumni.uniconnect.edu',
            mentorshipAvailable: true,
            donationContributed: 150000,
            successStory: 'UniConnect placement cell helped me secure my initial internship, paving my career path to Mountain View & Bengaluru core systems.'
        },
        {
            fullName: 'Rahul K. Verma',
            graduationYear: 2019,
            degree: 'B.E Information Science',
            currentCompany: 'Microsoft Cloud & AI',
            currentDesignation: 'Principal Architect',
            location: 'Seattle, USA',
            email: 'rahul.verma@alumni.uniconnect.edu',
            mentorshipAvailable: true,
            donationContributed: 500000,
            successStory: 'Founded two university research labs funded through our alumni grant network.'
        }
    ]);
    console.log('Seeded Alumni Network');

    await AdmissionApplication.deleteMany({});
    await AdmissionApplication.create([
        {
            applicationNumber: 'ADM-2026-1049',
            applicantName: 'Vikramaditya Hegde',
            email: 'vikram.h@gmail.com',
            phone: '+91 98450 11223',
            desiredCourse: 'B.E Computer Science & Engineering',
            previousScorePercentage: 96.8,
            entranceRank: 342,
            meritScore: 97.4,
            status: 'Seat Allocated',
            allocatedSeatCategory: 'General Merit'
        },
        {
            applicationNumber: 'ADM-2026-1050',
            applicantName: 'Pooja Sundaram',
            email: 'pooja.s@gmail.com',
            phone: '+91 97410 44556',
            desiredCourse: 'B.E Artificial Intelligence & Data Science',
            previousScorePercentage: 94.2,
            entranceRank: 812,
            meritScore: 94.8,
            status: 'Merit Shortlisted',
            allocatedSeatCategory: 'OBC Category'
        }
    ]);
    console.log('Seeded Admission Applications');

    await mongoose.disconnect();
    console.log('Finished seeding advanced phases 26-35!');
}

seedAdvanced().catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
});
