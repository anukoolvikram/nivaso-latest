export const formatAttachmentsForCreation = (attachmentUrls = [], ownerType) => {
  return {
    create: attachmentUrls.map(url => ({
      file_path: url,
      original_name: 'image.jpg', 
      mime_type: 'image/jpeg',   
      owner_type: ownerType,
    }))
  };
};

export const flattenComplaintWithResident = (complaint) => {
  const { resident, ...complaintDetails } = complaint;
  return {
    ...complaintDetails,
    residentName: resident?.name || 'N/A', 
    residentFlat: resident?.flat_id || 'N/A',
    residentPhone: resident?.phone || 'N/A',
    residentEmail: resident?.email || 'N/A'
  };
};