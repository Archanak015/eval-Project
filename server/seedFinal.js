const mongoose = require('mongoose');
const Workflow = require('./models/Workflow');
const { ApiKey, Webhook } = require('./models/ApiEcosystem');
const User = require('./models/User');

async function seedFinal() {
    await mongoose.connect('mongodb://localhost:27017/uniconnect');
    console.log('Connected to MongoDB');

    const adminUser = await User.findOne({ role: 'admin' }) || await User.findOne();

    await Workflow.deleteMany({});
    if (adminUser) {
        await Workflow.create([
            {
                workflowType: 'Leave Application',
                title: 'On-Duty Leave for IEEE International Conference',
                description: 'Faculty on-duty leave request for presenting paper on distributed AI in Singapore.',
                applicant: {
                    userId: adminUser._id,
                    name: 'Prof. Ramesh Rao',
                    role: 'faculty'
                },
                currentStage: {
                    stageIndex: 2,
                    stageName: 'Dean Academic Approval',
                    assignedRole: 'admin'
                },
                status: 'Pending Review',
                auditTrail: [
                    {
                        action: 'Application Submitted',
                        actionBy: 'Prof. Ramesh Rao',
                        comments: 'Conference paper accepted under Track 4.'
                    },
                    {
                        action: 'HOD Approved',
                        actionBy: 'Dr. Thorne (CSE HOD)',
                        comments: 'Recommended for institutional sponsorship.'
                    }
                ]
            },
            {
                workflowType: 'Equipment Purchase',
                title: 'NVIDIA RTX 4090 GPU Cluster for AI Research Lab',
                description: 'Procurement of 4x dual-fan server workstations for student machine learning projects.',
                applicant: {
                    userId: adminUser._id,
                    name: 'Dr. Aris Thorne',
                    role: 'faculty'
                },
                currentStage: {
                    stageIndex: 3,
                    stageName: 'Finance Disbursement',
                    assignedRole: 'admin'
                },
                status: 'Approved',
                auditTrail: [
                    {
                        action: 'Purchase Order Approved',
                        actionBy: 'Vice Chancellor / CFO',
                        comments: 'Sanctioned under 2026 Academic Research Grant Pool.'
                    }
                ]
            }
        ]);
        console.log('Seeded Workflows');
    }

    await ApiKey.deleteMany({});
    await ApiKey.create({
        clientName: 'UniConnect Mobile App Client (iOS/Android)',
        keyPrefix: 'uni_mobile_',
        hashedKey: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        scopes: ['read:attendance', 'read:marks', 'read:notifications'],
        rateLimitPerMinute: 300
    });

    await Webhook.deleteMany({});
    await Webhook.create({
        url: 'https://api.uniconnect.edu/notifications/dispatch-push',
        event: 'RESULT_PUBLISHED',
        secret: 'whsec_98124018241924'
    });
    console.log('Seeded API Ecosystem');

    await mongoose.disconnect();
    console.log('Finished seeding final phases 36-50!');
}

seedFinal().catch(err => {
    console.error('Error seeding final:', err);
    process.exit(1);
});
