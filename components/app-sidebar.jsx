"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  CalendarDays,
  ClipboardList,
  Command,
  FileText,
  GalleryVerticalEnd,
  Layers,
  ListChecks,
  Medal,
  MessageSquare,
  PieChart,
  Settings2,
  SquareTerminal,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Updated navigation data for the student app.
const data = {
  user: {
    name: "Student Name",
    email: "student@example.com",
    avatar: "/avatars/student.jpg",
  },
  teams: [
    {
      name: "Study Group A",
      logo: Users,
      plan: "Collaborative",
    },
    {
      name: "Solo Study",
      logo: FileText,
      plan: "Personal",
    },
    {
      name: "Exam Prep Team",
      logo: Layers,
      plan: "Group",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: PieChart,
      isActive: true,
      items: [
        {
          title: "Study Stats",
          url: "#",
        },
        {
          title: "Progress",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Notes",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "My Notes",
          url: "#",
        },
        {
          title: "Shared Notes",
          url: "#",
        },
        {
          title: "Categories",
          url: "#",
        },
      ],
    },
    {
      title: "Active Recall",
      url: "#",
      icon: ClipboardList,
      items: [
        {
          title: "Flashcards",
          url: "#",
        },
        {
          title: "Quizzes",
          url: "#",
        },
        {
          title: "Mock Tests",
          url: "#",
        },
      ],
    },
    {
      title: "Task & Schedule",
      url: "#",
      icon: CalendarDays,
      items: [
        {
          title: "To-Do List",
          url: "#",
        },
        {
          title: "Timetable",
          url: "#",
        },
        {
          title: "Reminders",
          url: "#",
        },
      ],
    },
    {
      title: "Collaboration Hub",
      url: "#",
      icon: MessageSquare,
      items: [
        {
          title: "Study Groups",
          url: "#",
        },
        {
          title: "Discussions",
          url: "#",
        },
        {
          title: "Shared Docs",
          url: "#",
        },
      ],
    },
    {
      title: "Gamification",
      url: "#",
      icon: Medal,
      items: [
        {
          title: "Achievements",
          url: "#",
        },
        {
          title: "Leaderboard",
          url: "#",
        },
        {
          title: "Daily Challenges",
          url: "#",
        },
      ],
    },
    {
      title: "AI Study Assistant",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Q&A",
          url: "#",
        },
        {
          title: "Summarization",
          url: "#",
        },
        {
          title: "Smart Recommendations",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Notifications",
          url: "#",
        },
        {
          title: "Privacy",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Exam Prep",
      url: "#",
      icon: SquareTerminal,
    },
    {
      name: "Research Paper",
      url: "#",
      icon: FileText,
    },
    {
      name: "Group Study",
      url: "#",
      icon: Layers,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
