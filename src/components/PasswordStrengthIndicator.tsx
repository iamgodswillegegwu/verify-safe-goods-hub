
import { validatePasswordStrength, getPasswordStrengthLabel, getPasswordStrengthColor } from '@/utils/passwordValidation';

interface PasswordStrengthIndicatorProps {
  password: string;
  onValidityChange?: (isValid: boolean) => void;
}

const PasswordStrengthIndicator = ({ password, onValidityChange }: PasswordStrengthIndicatorProps) => {
  const strength = validatePasswordStrength(password);
  
  // Notify parent component of validity change
  if (onValidityChange) {
    onValidityChange(strength.isValid);
  }

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-600">Password strength:</span>
        <span className={`text-sm font-medium ${getPasswordStrengthColor(strength.score)}`}>
          {getPasswordStrengthLabel(strength.score)}
        </span>
      </div>
      
      {/* Strength bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            strength.score === 0 ? 'bg-red-500 w-1/5' :
            strength.score === 1 ? 'bg-red-500 w-2/5' :
            strength.score === 2 ? 'bg-orange-500 w-3/5' :
            strength.score === 3 ? 'bg-yellow-500 w-4/5' :
            'bg-green-500 w-full'
          }`}
        />
      </div>

      {/* Feedback */}
      {strength.feedback.length > 0 && (
        <ul className="text-xs text-slate-500 space-y-1">
          {strength.feedback.map((feedback, index) => (
            <li key={index} className="flex items-center gap-1">
              <span className="text-red-400">•</span>
              {feedback}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
