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
              src="/poyo-logo.png" 
              alt="Logo" 
              className="h-[50px] w-[50px]"
            />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
              poyo.ed
            </Typography>
          </div>
          <nav className="flex gap-2">
            <Link href="/" className="no-underline">
              <Button color="inherit" sx={{ color: 'white' }}>Home</Button>
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