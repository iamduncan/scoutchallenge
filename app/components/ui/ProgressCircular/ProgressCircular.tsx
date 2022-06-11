type ProgressCircularProps = {
  progress: number;
  size: number;
  className?: string;
  width?: number;
};

const ProgressCircular = ({
  progress,
  size,
  className,
  width,
}: ProgressCircularProps) => {
  const circumference = Math.PI * (size / 2);
  return (
    <svg
      className={`-rotate-90 transform`}
      style={{ height: `${size}px`, width: `${size}px` }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 4}
        stroke="currentColor"
        strokeWidth={width || 2}
        fill="transparent"
        className="text-transparent"
      />

      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 4}
        stroke="currentColor"
        strokeWidth={width || 2}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress * circumference}
        className={className || "text-blue-500"}
      />
    </svg>
  );
};

export default ProgressCircular;
