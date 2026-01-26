import { useState } from "react";
import { motion } from "framer-motion";
import { User, Phone, Mail, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { z } from "zod";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
  email: z.string().email("Invalid email address"),
});

interface PaymentFormProps {
  onSubmit: (data: { fullName: string; phone: string; email: string }) => void;
  defaultEmail?: string;
  defaultName?: string;
}

export const PaymentForm = ({ onSubmit, defaultEmail = "", defaultName = "" }: PaymentFormProps) => {
  const [formData, setFormData] = useState({
    fullName: defaultName,
    phone: "",
    email: defaultEmail,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    onSubmit(formData);
  };

  const inputClasses = (hasError: boolean) =>
    `w-full h-12 bg-secondary/30 border ${
      hasError ? "border-red-500" : "border-border/40"
    } rounded-xl px-4 pl-12 text-foreground placeholder:text-muted-foreground focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all`;

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Full Name */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className={inputClasses(!!errors.fullName)}
          />
        </div>
        {errors.fullName && (
          <p className="text-xs text-red-400">{errors.fullName}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={inputClasses(!!errors.phone)}
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-red-400">{errors.phone}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={inputClasses(!!errors.email)}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-400">{errors.email}</p>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3.5 px-4 mt-6 bg-gradient-to-r from-violet to-magenta text-white font-semibold rounded-xl shadow-lg shadow-violet/25 hover:shadow-xl hover:shadow-violet/30 transition-all flex items-center justify-center gap-2"
      >
        Proceed
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </motion.form>
  );
};
