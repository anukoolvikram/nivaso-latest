import FederationProfile from '../components/Federation/Profile'
import FederationNoticeboard from '../components/Federation/Noticeboard'
import FederationSocietySetup from '../components/Federation/SocietySetup';


export const federationConfig = {
    'Profile': {
        title: 'Profile',
        subtitle: 'Manage your personal information',
        Component: FederationProfile,
    },
    'Notices': {
        title: 'Notice Board',
        subtitle: 'View society and federation notices',
        Component: FederationNoticeboard,
    },
    'Society Setup':{
        title: 'Society Setup',
        subtitle: 'Manage and view society details',
        Component: FederationSocietySetup,
    }
};