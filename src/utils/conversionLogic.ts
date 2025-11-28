export interface ConversionOptions {
  assetModel: 'cost' | 'revaluation';
  leaseType: 'finance' | 'operating';
  developmentCost: boolean;
}

export interface ConversionResult {
  summary: {
    totalAssetsChange: number;
    totalLiabilitiesChange: number;
    netIncomeChange: number;
    debtRatioChange: number;
  };
  details: Array<{
    category: string;
    kgaap: string;
    ifrs: string;
    impact: string;
  }>;
  checklist: string[];
}

export const simulateConversion = async (_file: File, options: ConversionOptions): Promise<ConversionResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const isRevaluation = options.assetModel === 'revaluation';
      
      resolve({
        summary: {
          totalAssetsChange: isRevaluation ? 150000000 : 0, // Increase if revaluation
          totalLiabilitiesChange: 50000000, // Lease liability increase
          netIncomeChange: -12000000, // Depreciation + Interest
          debtRatioChange: 2.5, // % increase
        },
        details: [
          {
            category: 'Asset Evaluation',
            kgaap: 'Cost Model',
            ifrs: isRevaluation ? 'Revaluation Model' : 'Cost Model',
            impact: isRevaluation 
              ? 'Assets increased by revaluation surplus (OCI)' 
              : 'No significant change in measurement',
          },
          {
            category: 'Lease Assets',
            kgaap: 'Operating Lease (Expense)',
            ifrs: 'Right-of-Use Asset / Lease Liability',
            impact: 'Recognized 50M KRW liability and asset',
          },
          {
            category: 'Employee Benefits',
            kgaap: 'Provision for Severance',
            ifrs: 'Defined Benefit Liability (Actuarial)',
            impact: 'Actuarial loss recognized in OCI',
          },
        ],
        checklist: [
          'Revaluation surplus recognized in OCI',
          'Lease interest expense separated from depreciation',
          'Development costs capitalized where criteria met',
          'Actuarial assumptions updated for severance',
        ],
      });
    }, 3000); // 3 second delay
  });
};
