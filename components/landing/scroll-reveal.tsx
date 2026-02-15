'use client';

import { useInView } from '@/lib/use-in-view';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  as: Component = 'div',
}: ScrollRevealProps) {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <Component
      ref={ref}
      className={cn(
        'reveal-in',
        isInView && 'is-visible',
        className
      )}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Component>
  );
}
