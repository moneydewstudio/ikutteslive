import React from 'react';
import { FOCUS } from './Card';

type Variant = 'primary' | 'secondary' | 'accent';
type Size = 'sm' | 'md' | 'lg';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
};

const VARIANT: Record<Variant, string> = {
  primary: 'bg-brand-black text-white border border-black',
  secondary: 'bg-white text-black border border-black hover:bg-gray-50',
  accent: 'bg-brand-lime text-black border border-black',
};

const SIZE: Record<Size, string> = {
  sm: 'px-md py-sm text-sm',
  md: 'px-lg py-md text-base',
  lg: 'px-xl py-lg text-lg',
};

export const CTA: React.FC<Props> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => (
  <button
    type="button"
    {...props}
    className={[
      'rounded-xl font-black transition-colors',
      VARIANT[variant],
      SIZE[size],
      fullWidth ? 'w-full' : '',
      'disabled:bg-brand-gray disabled:text-gray-600 disabled:border-black/20 disabled:cursor-not-allowed',
      FOCUS,
      className,
    ].join(' ')}
  >
    {children}
  </button>
);

export default CTA;
