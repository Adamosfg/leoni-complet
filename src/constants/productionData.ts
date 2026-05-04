/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const EFF_TARGET = 100;
export const HRS_TARGET = 160;
export const SCRAP_TARGET = 2.5;

export const PRODUCTION_COLORS = {
  'MEP1': '#185FA5',
  'CMA2': '#3B6D11',
  'CMA3': '#BA7517',
  'SPA3': '#A32D2D',
};

export interface ProductionMonthData {
  weeks: string[];
  segments: {
    [key: string]: number[];
  };
  avg: number;
}

export const SCRAP_DATA: Record<string, ProductionMonthData> = {
  Janvier: { 
    avg: 2.8, 
    weeks: ['S1','S2','S3','S4'],
    segments: {
      'MEP1': [2.5, 3.1, 2.8, 2.7],
      'CMA2': [3.2, 3.5, 3.0, 3.1],
      'CMA3': [2.8, 2.9, 2.7, 2.6],
      'SPA3': [2.6, 2.8, 2.5, 2.4]
    }
  },
  Février: { 
    avg: 2.4, 
    weeks: ['S5','S6','S7','S8'],
    segments: {
      'MEP1': [2.3, 2.1, 2.4, 2.2],
      'CMA2': [2.8, 2.6, 2.9, 2.7],
      'CMA3': [2.4, 2.3, 2.5, 2.4],
      'SPA3': [2.2, 2.0, 2.3, 2.1]
    }
  },
  Mars: { 
    avg: 2.1, 
    weeks: ['S9','S10','S11','S12'],
    segments: {
      'MEP1': [1.9, 1.8, 2.0, 1.9],
      'CMA2': [2.5, 2.4, 2.3, 2.2],
      'CMA3': [2.2, 2.1, 2.0, 2.1],
      'SPA3': [1.8, 1.7, 1.9, 1.8]
    }
  },
  Avril: { 
    avg: 2.6,  
    weeks: ['S13','S14','S15','S16'],
    segments: {
      'MEP1': [2.4, 2.7, 2.5, 2.6],
      'CMA2': [3.0, 3.2, 2.9, 3.1],
      'CMA3': [2.5, 2.8, 2.6, 2.7],
      'SPA3': [2.3, 2.6, 2.4, 2.5]
    }
  },
  Mai: { 
    avg: 3.2,  
    weeks: ['S17','S18','S19','S20'],
    segments: {
      'MEP1': [3.0, 3.5, 3.2, 3.3],
      'CMA2': [3.8, 4.2, 3.5, 3.7],
      'CMA3': [3.2, 3.6, 3.1, 3.4],
      'SPA3': [2.9, 3.3, 2.8, 3.1]
    }
  }
};

export const EFF_DATA: Record<string, ProductionMonthData> = {
  Janvier: { 
    avg: 92, 
    weeks: ['S1','S2','S3','S4'],
    segments: {
      'MEP1': [94, 91, 95, 96],
      'CMA2': [90, 92, 89, 91],
      'CMA3': [93, 95, 92, 94],
      'SPA3': [91, 89, 90, 88]
    }
  },
  Février: { 
    avg: 97, 
    weeks: ['S5','S6','S7','S8'],
    segments: {
      'MEP1': [98, 102, 99, 101],
      'CMA2': [95, 97, 94, 96],
      'CMA3': [97, 99, 96, 98],
      'SPA3': [93, 95, 92, 94]
    }
  },
  Mars: { 
    avg: 103, 
    weeks: ['S9','S10','S11','S12'],
    segments: {
      'MEP1': [105, 108, 106, 110],
      'CMA2': [101, 103, 100, 102],
      'CMA3': [104, 106, 103, 105],
      'SPA3': [100, 102, 99, 101]
    }
  },
  Avril: { 
    avg: 99,  
    weeks: ['S13','S14','S15','S16'],
    segments: {
      'MEP1': [102, 105, 103, 104],
      'CMA2': [97, 99, 96, 98],
      'CMA3': [100, 102, 99, 101],
      'SPA3': [96, 98, 95, 97]
    }
  },
  Mai: { 
    avg: 88,  
    weeks: ['S17','S18','S19','S20'],
    segments: {
      'MEP1': [90, 92, 89, 91],
      'CMA2': [86, 88, 85, 87],
      'CMA3': [89, 91, 88, 90],
      'SPA3': [85, 87, 84, 86]
    }
  }
};

export const HRS_DATA: Record<string, ProductionMonthData> = {
  Janvier: { 
    avg: 148, 
    weeks: ['S1','S2','S3','S4'],
    segments: {
      'MEP1': [155, 152, 158, 160],
      'CMA2': [142, 145, 140, 143],
      'CMA3': [150, 153, 148, 151],
      'SPA3': [145, 148, 143, 146]
    }
  },
  Février: { 
    avg: 155, 
    weeks: ['S5','S6','S7','S8'],
    segments: {
      'MEP1': [160, 165, 162, 168],
      'CMA2': [150, 155, 152, 158],
      'CMA3': [155, 160, 157, 163],
      'SPA3': [152, 157, 154, 160]
    }
  },
  Mars: { 
    avg: 163, 
    weeks: ['S9','S10','S11','S12'],
    segments: {
      'MEP1': [168, 172, 170, 175],
      'CMA2': [158, 162, 160, 165],
      'CMA3': [165, 170, 167, 172],
      'SPA3': [161, 166, 163, 168]
    }
  },
  Avril: { 
    avg: 159, 
    weeks: ['S13','S14','S15','S16'],
    segments: {
      'MEP1': [165, 170, 167, 172],
      'CMA2': [152, 157, 154, 160],
      'CMA3': [160, 165, 162, 168],
      'SPA3': [156, 161, 158, 164]
    }
  },
  Mai: { 
    avg: 141, 
    weeks: ['S17','S18','S19','S20'],
    segments: {
      'MEP1': [145, 148, 143, 146],
      'CMA2': [135, 138, 132, 136],
      'CMA3': [142, 145, 140, 143],
      'SPA3': [138, 141, 136, 139]
    }
  }
};
