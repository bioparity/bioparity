export function SignatureDot({ className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={'inline-block align-baseline bg-accent-verified ' + className}
      style={{ width: '0.35em', height: '0.35em' }}
    />
  );
}

export function SectionRule({ className = '' }) {
  return (
    <div aria-hidden="true" className={'w-[2px] h-6 bg-accent-verified ' + className} />
  );
}
