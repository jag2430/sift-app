const ONBOARDING_KEY = "sift_onboarding_done";

export function hasOnboardingDoneFlag(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(ONBOARDING_KEY) === "1";
}

export function setOnboardingDoneFlag() {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(ONBOARDING_KEY, "1");
}

export function clearOnboardingDoneFlag() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ONBOARDING_KEY);
}
