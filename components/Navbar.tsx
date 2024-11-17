"use client";

import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import { Logout } from '@mui/icons-material';
import Link from 'next/link'; 

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#3E53A0' }}>
      <Toolbar>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-white"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
              PoyoVision
            </Typography>
          </div>
          <nav>
            <Link href="/dashboard" passHref>
              <Button color="inherit">Dashboard</Button>
            </Link>
            <Link href="/courses" passHref>
              <Button color="inherit">My Courses</Button>
            </Link>
            <Link href="/course" passHref>
              <Button color="inherit">Study Dashboard</Button>
            </Link>
            <Link href="/new-session" passHref>
              <Button color="inherit">Video Dashboard</Button>
            </Link>
          </nav>
        </div>
        <IconButton color="inherit" sx={{ marginLeft: 'auto' }}>
          <Logout />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}