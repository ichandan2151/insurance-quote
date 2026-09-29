interface StateInfo {
  abbr: string;
  name: string;
}

const ZIP_TO_STATE: [number, number, string, string][] = [
  [1, 2, 'NY', 'New York'],
  [3, 4, 'PR', 'Puerto Rico'],
  [5, 5, 'PR', 'Puerto Rico'],
  [6, 9, 'PR', 'Puerto Rico'],
  [10, 14, 'MA', 'Massachusetts'],
  [15, 16, 'VT', 'Vermont'],
  [17, 18, 'MA', 'Massachusetts'],
  [19, 19, 'MA', 'Massachusetts'],
  [20, 20, 'MA', 'Massachusetts'],
  [21, 21, 'MA', 'Massachusetts'],
  [22, 22, 'MA', 'Massachusetts'],
  [23, 23, 'MA', 'Massachusetts'],
  [24, 24, 'MA', 'Massachusetts'],
  [25, 25, 'MA', 'Massachusetts'],
  [26, 26, 'MA', 'Massachusetts'],
  [27, 27, 'MA', 'Massachusetts'],
  [28, 29, 'RI', 'Rhode Island'],
  [30, 38, 'NH', 'New Hampshire'],
  [39, 49, 'ME', 'Maine'],
  [50, 54, 'VT', 'Vermont'],
  [55, 59, 'MA', 'Massachusetts'],
  [60, 69, 'CT', 'Connecticut'],
  [70, 89, 'NJ', 'New Jersey'],
  [90, 99, 'AE', 'Military (Europe)'],
  [100, 149, 'NY', 'New York'],
  [150, 196, 'PA', 'Pennsylvania'],
  [197, 199, 'DE', 'Delaware'],
  [200, 205, 'DC', 'District of Columbia'],
  [206, 219, 'MD', 'Maryland'],
  [220, 246, 'VA', 'Virginia'],
  [247, 268, 'WV', 'West Virginia'],
  [270, 289, 'NC', 'North Carolina'],
  [290, 299, 'SC', 'South Carolina'],
  [300, 319, 'GA', 'Georgia'],
  [320, 339, 'FL', 'Florida'],
  [340, 349, 'AA', 'Military (Americas)'],
  [350, 369, 'AL', 'Alabama'],
  [370, 385, 'TN', 'Tennessee'],
  [386, 397, 'MS', 'Mississippi'],
  [398, 399, 'GA', 'Georgia'],
  [400, 427, 'KY', 'Kentucky'],
  [430, 459, 'OH', 'Ohio'],
  [460, 479, 'IN', 'Indiana'],
  [480, 499, 'MI', 'Michigan'],
  [500, 528, 'IA', 'Iowa'],
  [530, 549, 'WI', 'Wisconsin'],
  [550, 567, 'MN', 'Minnesota'],
  [570, 577, 'SD', 'South Dakota'],
  [580, 588, 'ND', 'North Dakota'],
  [590, 599, 'MT', 'Montana'],
  [600, 629, 'IL', 'Illinois'],
  [630, 658, 'MO', 'Missouri'],
  [660, 679, 'KS', 'Kansas'],
  [680, 693, 'NE', 'Nebraska'],
  [700, 714, 'LA', 'Louisiana'],
  [716, 729, 'AR', 'Arkansas'],
  [730, 749, 'OK', 'Oklahoma'],
  [750, 799, 'TX', 'Texas'],
  [800, 816, 'CO', 'Colorado'],
  [820, 831, 'WY', 'Wyoming'],
  [832, 838, 'ID', 'Idaho'],
  [840, 847, 'UT', 'Utah'],
  [850, 865, 'AZ', 'Arizona'],
  [870, 884, 'NM', 'New Mexico'],
  [889, 898, 'NV', 'Nevada'],
  [900, 908, 'CA', 'California'],
  [910, 928, 'CA', 'California'],
  [930, 961, 'CA', 'California'],
  [962, 966, 'AP', 'Military (Pacific)'],
  [967, 968, 'HI', 'Hawaii'],
  [970, 979, 'OR', 'Oregon'],
  [980, 994, 'WA', 'Washington'],
  [995, 999, 'AK', 'Alaska'],
];

export function getStateFromZip(zip: string): StateInfo | null {
  if (!/^\d{5}$/.test(zip)) return null;

  const prefix = parseInt(zip.substring(0, 3), 10);

  for (const [min, max, abbr, name] of ZIP_TO_STATE) {
    if (prefix >= min && prefix <= max) {
      return { abbr, name };
    }
  }

  return null;
}
