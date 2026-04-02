type ProfileCompletionRecord = {
  name: string | null;
  dateOfBirth: Date | null;
  gender: string | null;
  phone: string | null;
  profession: string | null;
  wilaya: string | null;
  region: string | null;
  address: string | null;
  licenseNumber: string | null;
  licenseType: string | null;
  licenseIssueDate: Date | null;
  secondaryDrivers?: string[] | null;
};

const REQUIRED_PROFILE_FIELDS: Array<keyof Omit<ProfileCompletionRecord, "secondaryDrivers">> = [
  "name",
  "dateOfBirth",
  "gender",
  "phone",
  "profession",
  "wilaya",
  "region",
  "address",
  "licenseNumber",
  "licenseType",
  "licenseIssueDate",
];

export function calculateProfileCompletion(profile: ProfileCompletionRecord) {
  const filledRequiredFields = REQUIRED_PROFILE_FIELDS.reduce((count, field) => {
    const value = profile[field];

    if (value instanceof Date) {
      return count + 1;
    }

    if (typeof value === "string" && value.trim().length > 0) {
      return count + 1;
    }

    return count;
  }, 0);

  const hasSecondaryDrivers = Array.isArray(profile.secondaryDrivers) && profile.secondaryDrivers.length > 0;
  const totalFields = REQUIRED_PROFILE_FIELDS.length + 1;
  const completion = ((filledRequiredFields + (hasSecondaryDrivers ? 1 : 0)) / totalFields) * 100;

  return Math.min(100, Math.round(completion));
}

export function isProfileComplete(profile: ProfileCompletionRecord) {
  return REQUIRED_PROFILE_FIELDS.every((field) => {
    const value = profile[field];

    if (value instanceof Date) {
      return true;
    }

    return typeof value === "string" && value.trim().length > 0;
  });
}
