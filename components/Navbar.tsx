"use client";

import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
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
          <div className="flex items-center gap-8">
            <Link href="/" className="no-underline flex items-center gap-4 hover:scale-105 transition-transform duration-200">
              <img 
                src="/poyo-logo.png" 
                alt="Logo" 
                className="h-[45px] w-[45px] drop-shadow-lg hover:rotate-3 transition-all duration-300"
              />
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

            <nav className="flex gap-6">
              {[
                { href: "/", label: "Home" },
                { href: "/course", label: "Course" },
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
          </div>

          <div className="scale-110 hover:scale-125 transition-transform duration-200">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
}