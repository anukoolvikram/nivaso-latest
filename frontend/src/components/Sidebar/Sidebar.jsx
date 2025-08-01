/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../assets/icons/Logo';
import {
  HomeLight, HomeDark,
  NoticeLight, NoticeDark,
  ComplainLight, ComplainDark,
  CommunityLight, CommunityDark,
  DatabaseLight, DatabaseDark,
  ProfileLight, ProfileDark,
  LogoutLight, LogoutDark
} from '../../assets/icons/SidebarIcons';

const Sidebar = ({ currentPage, onPageChange, role, onLogoutClick }) => {
  const navigate = useNavigate();
  const [hoveredPage, setHoveredPage] = useState(null);
  const [isHomeHovered, setIsHomeHovered] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  const federationPages = ["Profile", "Notices", "Society Setup"];
  const societyPages = ["Profile", "Notices", "Community Blogs", "Complaints", "Flat Database"];
  const residentPages = ["Profile", "Notices", "Community Blogs", "Complaints"];
  const pagesToShow = role === 'resident' ? residentPages : role === 'federation' ? federationPages : societyPages;

  const iconMap = {
    "Notices": { active: NoticeDark, inactive: NoticeLight },
    "Complaints": { active: ComplainDark, inactive: ComplainLight },
    "Community Blogs": { active: CommunityDark, inactive: CommunityLight },
    "Flat Database": { active: DatabaseDark, inactive: DatabaseLight },
    "Society Setup": { active: DatabaseDark, inactive: DatabaseLight },
    "Profile": { active: ProfileDark, inactive: ProfileLight },
  };
  const handleLogoClick = () => navigate('/');
  const HomeIcon = isHomeHovered ? HomeDark : HomeLight;
  const LogoutIcon = isLogoutHovered ? LogoutDark : LogoutLight;

  return (
    <div className="w-[230px] min-h-screen bg-navy text-white flex flex-col justify-between">
      {/* Top section: Logo and main navigation links */}
      <div>
        <div onClick={handleLogoClick} className="flex justify-center items-center p-4 cursor-pointer">
          <Logo size="small" />
        </div>

        <div className='flex flex-col gap-4 p-4'>
          {pagesToShow.map(page => {
            const isActive = currentPage === page;
            const isHovered = hoveredPage === page;
            const IconComponent = iconMap[page]
              ? (isActive || isHovered
                ? iconMap[page].active
                : iconMap[page].inactive)
              : null;

            return (
              <div
                key={page}
                onClick={() => onPageChange(page)}
                onMouseEnter={() => setHoveredPage(page)}
                onMouseLeave={() => setHoveredPage(null)}
                className={`
                  group flex items-center p-2 rounded hover:cursor-pointer transition-colors duration-200
                  ${isActive
                    ? 'bg-my-gray font-semibold text-navy'
                    : 'text-white hover:bg-my-gray hover:text-navy'}
                `}
              >
                {IconComponent && <IconComponent className="w-6 h-6 flex-shrink-0" />}
                <span className="ml-3 font-semibold font-montserrat">{page}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom section: Home and Logout buttons */}
      <div className='p-4 space-y-4 border-t border-gray-700'>
        {/* Home Button */}
        <div
          onClick={handleLogoClick}
          onMouseEnter={() => setIsHomeHovered(true)}
          onMouseLeave={() => setIsHomeHovered(false)}
          className={`
            flex items-center p-2 rounded hover:cursor-pointer transition-colors duration-200
            ${currentPage === 'Home'
              ? 'bg-my-gray font-semibold text-navy'
              : 'text-white hover:bg-my-gray hover:text-navy'}
          `}
        >
          <HomeIcon className="w-6 h-6 flex-shrink-0" />
          <span className="ml-3 font-semibold font-montserrat">Home</span>
        </div>

        {/* Logout Button */}
        <div
          onClick={onLogoutClick}
          onMouseEnter={() => setIsLogoutHovered(true)}
          onMouseLeave={() => setIsLogoutHovered(false)}
          className="flex items-center p-2 rounded hover:cursor-pointer text-white hover:bg-red-600 transition-colors duration-200"
        >
          <LogoutIcon className="w-6 h-6 flex-shrink-0" />
          <span className="ml-3 font-semibold font-montserrat">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;