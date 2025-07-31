import ResidentNoticeboard from '../components/Resident/Noticeboard';
import ResidentCommunity from '../components/Resident/CommunityBlogs';
import ResidentComplaints from '../components/Resident/Complaints';
import ResidentProfile from '../components/Resident/Profile';

export const residentConfig = {
    'Notices': {
        title: 'Notice Board',
        subtitle: 'View society and resident notices',
        Component: ResidentNoticeboard,
    },
    'Complaints': {
        title: 'Complaint Management',
        subtitle: 'Raise and track your complaints',
        Component: ResidentComplaints,
    },
    'Community Blogs': {
        title: 'Community Blogs',
        subtitle: 'View society and resident notices',
        Component: ResidentCommunity,
    },
    'Profile': {
        title: 'Profile',
        subtitle: 'Manage your personal information',
        Component: ResidentProfile,
    }
};