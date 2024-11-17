"use client";

import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';
import { UserButton } from "@clerk/nextjs";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';

const shakeAnimation = `
  @keyframes shake {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(-5deg); }
    50% { transform: rotate(5deg); }
    75% { transform: rotate(-5deg); }
    100% { transform: rotate(0deg); }
  }
`;

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const courses = [
    { id: 1, name: "Course 1" },
    { id: 2, name: "Course 2" },
    { id: 3, name: "Course 3" },
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'linear-gradient(135deg, rgba(62, 83, 160, 0.95), rgba(91, 110, 178, 0.95))',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
        borderRadius: '32px',
        left: '20px',
        right: '20px',
        top: '20px',
        width: 'auto',
        margin: '0 auto',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 38px rgba(31, 38, 135, 0.25)',
          transform: 'translateY(1px)',
        }
      }}
    >
      <Toolbar sx={{ padding: '0.75rem 2rem' }}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/" className="no-underline flex items-center gap-2 md:gap-4">
              <div className="hover-shake">
                <img 
                  src="/poyo-logo.png" 
                  alt="Logo" 
                  className="h-[35px] w-[35px] md:h-[45px] md:w-[45px] drop-shadow-lg"
                />
              </div>
              <style jsx global>{`
                @keyframes shake {
                  0% { transform: rotate(0deg); }
                  25% { transform: rotate(-10deg); }
                  50% { transform: rotate(10deg); }
                  75% { transform: rotate(-10deg); }
                  100% { transform: rotate(0deg); }
                }

                .hover-shake:hover {
                  animation: shake 0.5s ease-in-out;
                }
              `}</style>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: '800', 
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #E0E7FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.75rem',
                  letterSpacing: '1px',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                poyo.ed
              </Typography>
            </Link>

            {!isMobile && (
              <nav className="flex gap-2 md:gap-4 lg:gap-6">
                {[
                  { href: "/", label: "Home" },
                  { href: "/course", label: "Lecture" },
                  { href: "/new-session", label: "Video Dashboard" }
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="no-underline">
                    <Button 
                      color="inherit" 
                      sx={{ 
                        color: 'white', 
                        textTransform: 'none', 
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '12px',
                        transition: 'all 0.2s ease',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      {link.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-6">
            {!isMobile && (
              <Button
                color="inherit"
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{ 
                  marginRight: '8px',
                  color: 'white', 
                  textTransform: 'none', 
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  background: 'linear-gradient(135deg, rgba(248, 113, 113, 0.9) 0%, rgba(239, 68, 68, 0.8) 100%)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(248, 113, 113, 0.5)',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(248, 113, 113, 1) 0%, rgba(239, 68, 68, 0.9) 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(239, 68, 68, 0.25)'
                  }
                }}
              >
                Record Session
              </Button>
            )}
            
            <div className="scale-110 hover:scale-125 transition-transform duration-200">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: anchorEl?.offsetWidth,
              background: 'linear-gradient(135deg, rgba(248, 113, 113, 0.95) 0%, rgba(239, 68, 68, 0.9) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(248, 113, 113, 0.5)',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
            }
          }}
        >
          {courses.map((course) => (
            <MenuItem 
              key={course.id}
              onClick={handleClose}
              sx={{
                color: 'white',
                width: '100%',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <Link 
                href={`/record/${course.id}`} 
                className="no-underline text-white w-full"
              >
                {course.name}
              </Link>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}