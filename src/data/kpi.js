/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const KPI_DATA = {
  output: {
    Day: [
      { name: 'Day 1', value: 8 },
      { name: 'Day 2', value: 12 },
      { name: 'Day 3', value: 6 },
      { name: 'Day 4', value: 14 },
      { name: 'Day 5', value: 9 }
    ],
    Month: [
      { name: 'Jan', value: 240 },
      { name: 'Feb', value: 310 },
      { name: 'Mar', value: 280 },
      { name: 'Apr', value: 350 },
      { name: 'May', value: 290 }
    ],
    target: { Day: 10, Month: 300 }
  },
  efficiency: {
    Day: [
      { name: 'Mon', p1: 82, p2: 70, p3: 88 },
      { name: 'Tue', p1: 75, p2: 85, p3: 80 },
      { name: 'Wed', p1: 90, p2: 72, p3: 82 },
      { name: 'Thu', p1: 85, p2: 80, p3: 75 },
      { name: 'Fri', p1: 78, p2: 88, p3: 90 }
    ],
    Month: [
      { name: 'Jan', p1: 85, p2: 72, p3: 90 },
      { name: 'Feb', p1: 78, p2: 88, p3: 82 },
      { name: 'Mar', p1: 92, p2: 75, p3: 85 },
      { name: 'Apr', p1: 88, p2: 82, p3: 78 },
      { name: 'May', p1: 80, p2: 90, p3: 92 },
      { name: 'Jun', p1: 85, p2: 85, p3: 88 },
      { name: 'Jul', p1: 90, p2: 80, p3: 85 }
    ],
    threshold: 75
  },
  effectif: {
    Day: [
      { name: 'Direct Hourly', value: 78, color: '#1B4299', detail: 'Operators on assembly boards' },
      { name: 'Indirect Hourly', value: 14, color: '#E8B200', detail: 'Logistics, QC, Maintenance' },
      { name: 'Salary / Admin', value: 8, color: '#22c55e', detail: 'Management, HR, Engineering' }
    ],
    Month: [
      { name: 'Direct Hourly', value: 77, color: '#1B4299', detail: 'Operators on assembly boards' },
      { name: 'Indirect Hourly', value: 15, color: '#E8B200', detail: 'Logistics, QC, Maintenance' },
      { name: 'Salary / Admin', value: 8, color: '#22c55e', detail: 'Management, HR, Engineering' }
    ],
    absenteeism: { Day: 4.2, Month: 3.8 }
  },
  lpa: {
    Day: [
      { name: 'Area A', score: 750 },
      { name: 'Area B', score: 620 },
      { name: 'Area C', score: 480 },
      { name: 'Area D', score: 390 },
      { name: 'Area E', score: 280 }
    ],
    Month: [
      { name: 'Area A', score: 780 },
      { name: 'Area B', score: 650 },
      { name: 'Area C', score: 510 },
      { name: 'Area D', score: 420 },
      { name: 'Area E', score: 310 }
    ],
    maxScore: 1000
  },
  score5s: {
    Day: 85,
    Month: 92,
    trend: { Day: 3, Month: 7 }
  },
  ncr: {
    Day: [
      { name: 'Mon', ncr: 3, threshold: 5 },
      { name: 'Tue', ncr: 7, threshold: 5 },
      { name: 'Wed', ncr: 2, threshold: 5 },
      { name: 'Thu', ncr: 5, threshold: 5 },
      { name: 'Fri', ncr: 4, threshold: 5 }
    ],
    Month: [
      { name: 'Jan', ncr: 42, threshold: 50 },
      { name: 'Feb', ncr: 38, threshold: 50 },
      { name: 'Mar', ncr: 61, threshold: 50 },
      { name: 'Apr', ncr: 29, threshold: 50 },
      { name: 'May', ncr: 55, threshold: 50 },
      { name: 'Jun', ncr: 33, threshold: 50 }
    ],
    threshold: { Day: 5, Month: 50 }
  },
  kaizen: {
    Day: [
      { name: 'Mon', count: 2 },
      { name: 'Tue', count: 4 },
      { name: 'Wed', count: 3 },
      { name: 'Thu', count: 5 },
      { name: 'Fri', count: 6 }
    ],
    Month: [
      { name: 'Jan', count: 12 },
      { name: 'Feb', count: 18 },
      { name: 'Mar', count: 15 },
      { name: 'Apr', count: 22 },
      { name: 'May', count: 30 },
      { name: 'Jun', count: 25 },
      { name: 'Jul', count: 35 }
    ],
    status: { open: 12, inProgress: 8, closed: 15 }
  },
  satisfaction: {
    Day: [
      { name: 'Very Happy', value: 45, color: '#22c55e' },
      { name: 'Happy', value: 30, color: '#84cc16' },
      { name: 'Neutral', value: 15, color: '#eab308' },
      { name: 'Unhappy', value: 7, color: '#f97316' },
      { name: 'Very Unhappy', value: 3, color: '#ef4444' }
    ],
    Month: [
      { name: 'Very Happy', value: 42, color: '#22c55e' },
      { name: 'Happy', value: 32, color: '#84cc16' },
      { name: 'Neutral', value: 18, color: '#eab308' },
      { name: 'Unhappy', value: 5, color: '#f97316' },
      { name: 'Very Unhappy', value: 3, color: '#ef4444' }
    ]
  }
};
