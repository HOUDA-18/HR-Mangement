const Status = Object.freeze({
    Active: "Active",
    Inactive: "Inactive",
    Suspended: "Suspended"
  });

const Roles = Object.freeze({
    SUPER_ADMIN: "SUPER_ADMIN",
    EMPLOYEE: "EMPLOYEE",
    ADMIN_HR: "ADMIN_HR",
    MEMBRE_HR: "MEMBRE_HR",
    HEAD_DEPARTEMENT: "HEAD_DEPARTEMENT",
  });

  const employmentType = Object.freeze({
    FULL_TIME: "FULL_TIME",
    PART_TIME: "PART_TIME",
    CONTRACT: "CONTRACT"
  });

    const offreStatus = Object.freeze({
    PENDING: "PENDING",
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED"
  });

  const candidatureStatus = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
  };
module.exports= {Status, Roles, employmentType, offreStatus, candidatureStatus}