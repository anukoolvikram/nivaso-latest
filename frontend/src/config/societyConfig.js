import SocietyCommunityBlogs from '../components/Society/CommunityBlogs';
import SocietyComplaints from '../components/Society/Complaints';
import SocietyFlatSetup from '../components/Society/FlatSetup';
import SocietyNoticeboard from '../components/Society/Noticeboard';
import SocietyProfile from '../components/Society/Profile';

export const societyConfig = {
    'Notices': {
        title: 'Notice Board',
        subtitle: 'Manage and publish society notices',
        Component: SocietyNoticeboard,
    },
    'Complaints':{
        title: 'Complaint Mangement',
        subtitle: 'Manage and resolve resident complaints',
        Component: SocietyComplaints,
    },
    'Community Blogs': {
        title: 'Community Blogs',
        subtitle: 'Manage and publish society notices',
        Component: SocietyCommunityBlogs,
    },
    'Flat Database':{
        title: 'Flat Database',
        subtitle: 'Manage resident and flat information',
        Component: SocietyFlatSetup,
    },
    'Profile': {
        title: 'Profile',
        subtitle: 'Manage your personal information',
        Component: SocietyProfile,
    }
};