// src/api/getOnboardingForm.js
export async function getOnboardingForm(language = 'ingles') {
    const response = await fetch(`https://olya.club/api/form/onboarding/${language}`);
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const formData = await response.json();
    return formData;
  }
  