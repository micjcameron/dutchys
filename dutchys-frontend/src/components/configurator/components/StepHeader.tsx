interface StepHeaderProps {
  title: string;
  subtitle?: string;
}

const StepHeader = ({ title, subtitle }: StepHeaderProps) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>
  );
};

export default StepHeader;
