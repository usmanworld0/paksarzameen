# Admin Stats Excel Export Implementation

## Overview
Added an admin-facing Excel export option in the main control center so operational statistics can be downloaded for reporting.

## Scope
The export covers these modules:
- Dog adoption requests statistics
- Doctor appointment statistics
- Blood donation request statistics

## Admin UI
- Added `Export Stats (Excel)` action in the Admin Control Center header.
- Location: `src/features/admin/components/AdminControlCenter.tsx`
- Behavior:
  - Disabled while analytics are loading.
  - Generates and downloads a `.xlsx` file.

## Export Contents
Workbook includes multi-sheet breakdown:
- `Summary`
- `Blood Daily`
- `Blood Monthly`
- `Blood Yearly`
- `Adoption Daily`
- `Adoption Monthly`
- `Adoption Yearly`
- `Appointments Daily`
- `Appointments Monthly`
- `Appointments Yearly`
- `Appointments Status`
- `Appointments Doctor`

## Data Grouping Rules
- Day key: `YYYY-MM-DD`
- Month key: `YYYY-MM`
- Year key: `YYYY`
- Adoption and blood stats include per-period totals and status counters.
- Doctor appointment stats include per-period totals, status distribution, and doctor-wise totals.

## Backend/Service Changes
- Extended healthcare analytics payload to return:
  - `appointmentCountsByDay`
  - `appointmentCountsByMonth`
  - `appointmentCountsByYear`
  - `appointmentsByDoctor`
- File: `src/services/healthcare/core-service.ts`

## Dependencies
- Added `xlsx` package for workbook generation.
- File: `package.json`

## Notes
- Export is generated client-side using fetched admin analytics payloads.
- Existing admin auth/session checks are reused via current API routes.
