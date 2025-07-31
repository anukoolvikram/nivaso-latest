export const COMPLAINT_TYPES = [
  'Plumbing',
  'Electrical',
  'Civil Works',
  'Security',
  'Parking',
  'Common Areas',
  'Noise Complaint',
  'Waste Management',
  'Other'
];

export const getComplaintTypeOptions = () => {
  return COMPLAINT_TYPES.map(type => ({
    value: type,
    label: type
  }));
};