"use client";

import { Shield, Lock, Users, Star } from "lucide-react";

const trustBadges = [
  { icon: Shield, label: "HIPAA Compliant" },
  { icon: Lock, label: "Secure & Private" },
  { icon: Users, label: "Licensed Providers" },
  { icon: Star, label: "4.8/5 Member Rating" },
];

export function TrustBadges() {
  return (
    <section 
      className="py-8 bg-primary-50/50 border-y border-primary-100"
      aria-label="Trust badges"
    >
      <div className="container-main">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {trustBadges.map((badge) => (
            <div 
              key={badge.label} 
              className="flex items-center gap-3 text-gray-600"
            >
              <badge.icon className="w-6 h-6 text-primary flex-shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}