'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <footer className="border-t border-border bg-card px-6 py-12 lg:px-12 text-muted-foreground select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Brand & Newsletter */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-black font-heading text-lg shadow-sm">
              EV
            </div>
            <span className="text-sm font-bold font-heading text-foreground tracking-wide">
              EduVerse Platform
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            A premium modern educational catalog and unified workspace designed for courses discovery, teacher application, and student academic success.
          </p>

          <form onSubmit={handleSubscribe} className="space-y-2 max-w-xs pt-1">
            <label htmlFor="footer-newsletter" className="text-[10px] font-bold text-foreground uppercase tracking-wider block font-heading">
              Subscribe to newsletter
            </label>
            <div className="flex gap-2">
              <input
                id="footer-newsletter"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="flex-1 px-3 py-1.5 bg-background border border-input rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0"
              >
                Join
              </button>
            </div>
            {submitted && (
              <span className="text-[10px] text-teal font-medium block">
                Subscription successful! Thank you.
              </span>
            )}
          </form>
        </div>

        {/* Column 2: Discover */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest font-heading">
            Discover
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/courses" className="hover:text-foreground transition-colors">
                Browse Courses
              </Link>
            </li>
            <li>
              <Link href="/teachers" className="hover:text-foreground transition-colors">
                Instructors Directory
              </Link>
            </li>
            <li>
              <Link href="/subjects" className="hover:text-foreground transition-colors">
                Learning Subjects
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-foreground transition-colors">
                Pricing & Subscriptions
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Portals */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest font-heading">
            Platform Portals
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/student/login" className="hover:text-foreground transition-colors">
                Student Portal
              </Link>
            </li>
            <li>
              <Link href="/teacher/login" className="hover:text-foreground transition-colors">
                Faculty Workspace
              </Link>
            </li>
            <li>
              <Link href="/parent/login" className="hover:text-foreground transition-colors">
                Parent Dashboard
              </Link>
            </li>
            <li>
              <a href="http://localhost:3001" className="hover:text-foreground transition-colors">
                Admin Console
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Trust & Legal */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest font-heading">
            Legal & Support
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/about" className="hover:text-foreground transition-colors">
                About Our Vision
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact Support
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-foreground transition-colors">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/accessibility" className="hover:text-foreground transition-colors">
                Accessibility Statement
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Underbar */}
      <div className="max-w-7xl mx-auto border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-muted-foreground">
        <span>
          &copy; {new Date().getFullYear()} EduVerse Platforms Inc. All rights reserved.
        </span>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <Link href="/accessibility" className="hover:underline">
            WCAG 2.1 AA Compliant
          </Link>
          <span>•</span>
          <Link href="/privacy" className="hover:underline">
            SSL Secure
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
