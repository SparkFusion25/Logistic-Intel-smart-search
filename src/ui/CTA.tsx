import { ButtonHTMLAttributes } from 'react';

export function CTAPrimary(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`btn btn-primary ${props.className || ''}`} />;
}

export function CTAGhost(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`btn btn-ghost ${props.className || ''}`} />;
}