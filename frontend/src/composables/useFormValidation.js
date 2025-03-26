import * as yup from "yup";
import { ref } from "vue";

export function useFormValidation() {
  const errors = ref({});

  const validateField = async (schema, form, field = null) => {
    if (field) {
      try {
        errors.value[field] = null;
        const fieldValue = { [field]: form[field] };
        await schema.validateAt(field, fieldValue);

        return true;
      } catch (validationError) {
        errors.value[field] = validationError.message;
        return false;
      }
    } else {
      try {
        await schema.validate(form, { abortEarly: false });
        errors.value = {};
        return true;
      } catch (validationError) {
        const errorObj = {};
        validationError.inner.forEach((err) => {
          errorObj[err.path] = err.message;
        });
        errors.value = errorObj;
        return false;
      }
    }
  };

  return {
    errors,
    validateField,
  };
}
