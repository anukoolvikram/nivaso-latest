import prisma from '../../models/db.js';
import {
  formatAttachmentsForCreation,
  flattenComplaintWithResident
} from '../../utils/complaintUtils.js';

const createComplaint = async (complaintData, user) => {
  const { title, complaint_type, content, is_anonymous, attachments = [] } = complaintData;
  return prisma.complaint.create({
    data: {
      title,
      complaint_type,
      content,
      is_anonymous: is_anonymous || false,
      status: 'Received',
      society_code: user.society_code,
      resident: {
        connect: { id: user.userId }
      },
      attachments: formatAttachmentsForCreation(attachments, user.role),
    }
  });
};

const getComplaintsBySociety = async (user) => {
  const complaintsWithResident = await prisma.complaint.findMany({
    where: { society_code: user.society_code },
    include: {
      resident: {
        select: {
          id: true,
          name: true,
          flat_id: true,
          phone:true,
          email:true
        }
      },
      attachments: true,
      responses: {
        include: {
          author: {
            select: { name: true }
          }
        },
        orderBy: {
          created_at: 'asc'
        }
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  });
  return complaintsWithResident.map(flattenComplaintWithResident);
};

const getComplaintsByResident = async (residentId) => {
  return prisma.complaint.findMany({
    where: { resident_id: residentId },
    include: {
      attachments: true,
      responses: {
        include: {
          author: {
            select: { name: true }
          }
        },
        orderBy: {
          created_at: 'asc'
        }
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  });
};

const updateComplaintStatus = async (complaintId, data) => {
  console.log(data)
  const { status, comment, attachments } = data;
  return prisma.$transaction(async tx => {
    const updatedComplaint = await tx.complaint.update({
      where: { id: complaintId },
      data: {
        status,
        comment
      }
    })

    if (status === 'Resolved' && attachments?.length > 0) {
      // await tx.attachment.deleteMany({
      //   where: { complaint_id: complaintId }
      // })
      await tx.attachment.createMany({
        data: attachments.map(att => ({
          file_path: att,
          original_name: 'image.jpg',
          mime_type: 'image/jpeg',
          complaint_id: complaintId,
          owner_type: 'complaint'
        }))
      })
    }
    return updatedComplaint
  })
}

const addResidentResponse = async (residentId, data) => {
  const { complaintId, response } = data;
  return prisma.$transaction(async (tx) => {
    const complaint = await tx.complaint.findUnique({
      where: {
        id: complaintId,
        resident_id: residentId,
      },
    });
    if (!complaint) {
      throw new Error('Complaint not found or you do not have permission to respond.');
    }
    await tx.complaintResponse.create({
      data: {
        text: response,
        complaint: {
          connect: { id: complaintId },
        },
        author: {
          connect: { id: residentId },
        },
      },
    });

    return tx.complaint.findUnique({
      where: { id: complaintId },
      include: {
        resident: { select: { id: true, name: true, flat_id: true } },
        attachments: true,
        responses: {
          include: {
            author: { select: { name: true } },
          },
          orderBy: { created_at: 'asc' },
        },
      },
    });
  });
};

export const complaintService = {
  createComplaint,
  getComplaintsBySociety,
  getComplaintsByResident,
  updateComplaintStatus,
  addResidentResponse,
};