"use client";

import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#3E53A0' }}>
      <Toolbar>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <img 
              src="/poyo-logo.svg" 
              alt="Logo" 
              className="h-8 w-8"
            />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
              PoyoVision
            </Typography>
          </div>
          <nav className="flex gap-2">
            <Link href="/courses" className="no-underline">
              <Button color="inherit" sx={{ color: 'white' }}>My Dashboard</Button>
            </Link>
            <Link href="/course" className="no-underline">
              <Button color="inherit" sx={{ color: 'white' }}>Course</Button>
            </Link>
            <Link href="/new-session" className="no-underline">
              <Button color="inherit" sx={{ color: 'white' }}>Video Dashboard</Button>
            </Link>
          </nav>
        </div>
        <div className="ml-auto">
          <UserButton />
        </div>
      </Toolbar>
    </AppBar>
  );
}