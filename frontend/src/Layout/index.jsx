import React, { useState, useEffect } from 'react'
import { TopBarMenuLinks, SideBarMenuLinks } from './data'
import { Link } from 'react-router-dom'
import './index.scss'

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check if device is mobile
    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setIsSidebarOpen(false);
            }
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);
        
        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    // Handle sidebar toggle
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Close sidebar when clicking on overlay
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    // Close sidebar on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isSidebarOpen) {
                setIsSidebarOpen(false);
            }
        };

        if (isMobile && isSidebarOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when sidebar is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isMobile, isSidebarOpen]);

    return (
        <div className='Layout_container'>
            <div className='Layout_wrapper'>
                <div className='Layout_TopBar'>
                    {isMobile && (
                        <button 
                            className={`Layout_TopBar_MenuToggle ${isSidebarOpen ? 'active' : ''}`}
                            onClick={toggleSidebar}
                            aria-label="Toggle menu"
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    )}
                    
                    <div className='Layout_TopBar_Logo'>NextGenCV</div>
                    
                    <div className='Layout_TopBar_Menu'>
                        <div className={`Layout_TopBar_MenuLinks ${isMobile ? 'mobile-hidden' : ''}`}>
                            {TopBarMenuLinks.map((link) => (
                                <Link
                                    key={link.id}
                                    to={link.path}
                                    className='Menu_link'
                                >
                                    {link.title}
                                </Link>
                            ))}
                        </div>
                        
                        <div className='Layout_TopBar_Profile'>
                            <div className='Layout_TopBar_ProfileImage'>
                                G
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='Layout_Section'>
                    {isMobile && (
                        <div 
                            className={`Layout_Overlay ${isSidebarOpen ? 'active' : ''}`}
                            onClick={closeSidebar}
                        ></div>
                    )}
                    
                    <div className={`Layout_SideBar ${isSidebarOpen ? 'active' : ''}`}>
                        <div className='Layout_SideBar_newButton'>
                            <button className='button' onClick={() => {
                                // Handle new project action
                                console.log('New project clicked');
                                if (isMobile) {
                                    setIsSidebarOpen(false);
                                }
                            }}>
                                New Project
                            </button>
                        </div>
                        
                        <div className='Layout_SideBar_Menu'>
                            {isMobile && (
                                <div className="Layout_SideBar_TopLinks">
                                    {TopBarMenuLinks.map((link) => (
                                        <Link
                                            key={`mobile-${link.id}`}
                                            to={link.path}
                                            className='SideBarMenu_link'
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            {link.title}
                                        </Link>
                                    ))}
                                    <hr style={{ 
                                        margin: '1rem 0', 
                                        border: 'none', 
                                        borderTop: '1px solid var(--text-secondary, #ccc)',
                                        opacity: 0.3 
                                    }} />
                                </div>
                            )}
                            
                            {SideBarMenuLinks.map((link) => (
                                <Link
                                    key={link.id}
                                    to={link.path}
                                    className='SideBarMenu_link'
                                    onClick={() => isMobile && setIsSidebarOpen(false)}
                                >
                                    {link.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                    
                    <div className='Layout_Body'>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout