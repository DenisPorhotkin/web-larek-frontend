import { IValidationRules, ValidationFormErrors, ValidatableFields } from '../types';

export class FormValidator {
    constructor(private rules: IValidationRules) {}

    validateField(fieldName: ValidatableFields, value: string): string {
        const rule = this.rules[fieldName];
        if (!rule) return '';
        
        if (rule.required && !value.trim()) {
            return rule.message;
        }

        if (rule.pattern && value && !rule.pattern.test(value)) {
            return rule.message;
        }

        return '';
    }

    validateForm(data: Partial<Record<ValidatableFields, string>>): ValidationFormErrors {
        const errors: ValidationFormErrors = {};

        for (const [field, value] of Object.entries(data)) {
            if (this.rules[field as ValidatableFields]) {
                const error = this.validateField(field as ValidatableFields, value || '');
                if (error) {
                    errors[field as ValidatableFields] = error;
                }
            }
        }

        return errors;
    }
}