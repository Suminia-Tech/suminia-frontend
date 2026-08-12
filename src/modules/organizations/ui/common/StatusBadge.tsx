'use client';

import { getStatusClassName, getStatusLabel } from '../../lib/organizationStatus';
import type { OrganizationStatus } from '../../model/organization.types';

const StatusBadge = ({ status }: { status: OrganizationStatus }) => (
  <span className={`badge ${getStatusClassName(status)}`}>{getStatusLabel(status)}</span>
);

export default StatusBadge;
