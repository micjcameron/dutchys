'use client';

import React from 'react';
import StepHeader from '@/components/configurator/components/StepHeader';

interface SectionWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const SectionWrapper = ({ title, description, children }: SectionWrapperProps) => (
  <div className="space-y-6">
    <StepHeader title={title} subtitle={description ?? ''} />
    {children}
  </div>
);

export default SectionWrapper;
