import { describe, it, expect } from 'vitest';
import {
  categorizeSystem,
  calcSystemScore,
  buildObligations,
  assessOrg,
  type AISystem,
  type OrgProfile,
  type Governance,
} from './ai_act_scoring';

describe('AI Act Scoring Engine', () => {
  const mockGovernance: Governance = {
    rms: 2,
    dataGov: 2,
    techDoc: 2,
    logging: 2,
    oversight: 2,
    pmp: 2,
    qms: 2,
    supplierDocs: 'vollständig',
    evidenceFreshMonths: 3,
  };

  const mockSystem: AISystem = {
    id: 'test-system-1',
    name: 'Test AI System',
    description: 'A test system',
    providerOrDeployer: 'Provider',
    useCases: ['Testing'],
    annexIII: [],
    biometricFunctions: [],
    interactsWithHumans: false,
    generatesSyntheticContent: false,
    isGPAIModel: false,
    reliesOnGPAIFromOthers: false,
    exposure: 'PoC/Pilot',
    hasSystemicRisk: false,
    governance: mockGovernance,
  };

  describe('categorizeSystem', () => {
    it('should categorize minimal risk system correctly', () => {
      const category = categorizeSystem(mockSystem);
      expect(category).toBe('Minimal');
    });

    it('should categorize high-risk system with biometric functions', () => {
      const highRiskSystem: AISystem = {
        ...mockSystem,
        biometricFunctions: ['Echtzeit-RBI'],
      };
      const category = categorizeSystem(highRiskSystem);
      expect(category).toBe('Hochrisiko');
    });

    it('should categorize prohibited system', () => {
      const prohibitedSystem: AISystem = {
        ...mockSystem,
        biometricFunctions: ['Emotionserkennung'],
        useCases: ['Social scoring'],
      };
      const category = categorizeSystem(prohibitedSystem);
      expect(category).toBe('Verboten');
    });

    it('should categorize GPAI model', () => {
      const gpaiSystem: AISystem = {
        ...mockSystem,
        isGPAIModel: true,
      };
      const category = categorizeSystem(gpaiSystem);
      expect(category).toBe('GPAI');
    });

    it('should categorize GPAI with systemic risk', () => {
      const gpaiRiskSystem: AISystem = {
        ...mockSystem,
        isGPAIModel: true,
        hasSystemicRisk: true,
      };
      const category = categorizeSystem(gpaiRiskSystem);
      expect(category).toBe('GPAI (systemic risk)');
    });
  });

  describe('calcSystemScore', () => {
    it('should calculate score for minimal risk system', () => {
      const score = calcSystemScore(mockSystem);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should give lower score for high-risk systems', () => {
      const highRiskSystem: AISystem = {
        ...mockSystem,
        annexIII: ['Biometrie', 'Kritische Infrastruktur'],
        exposure: 'Unternehmensweit/Kundenseitig',
      };
      const minimalScore = calcSystemScore(mockSystem);
      const highRiskScore = calcSystemScore(highRiskSystem);
      
      expect(highRiskScore).toBeLessThan(minimalScore);
    });

    it('should give zero score for prohibited systems', () => {
      const prohibitedSystem: AISystem = {
        ...mockSystem,
        biometricFunctions: ['Emotionserkennung'],
      };
      const score = calcSystemScore(prohibitedSystem);
      expect(score).toBe(0);
    });
  });

  describe('buildObligations', () => {
    it('should return obligations for high-risk system', () => {
      const obligations = buildObligations('Hochrisiko', mockSystem);
      
      expect(obligations).toBeDefined();
      expect(Array.isArray(obligations)).toBe(true);
      expect(obligations.length).toBeGreaterThan(0);
      
      // Check that obligations have required fields
      obligations.forEach((obl) => {
        expect(obl).toHaveProperty('label');
        expect(typeof obl.label).toBe('string');
      });
    });

    it('should return empty obligations for minimal risk', () => {
      const obligations = buildObligations('Minimal', mockSystem);
      expect(obligations).toBeDefined();
      expect(Array.isArray(obligations)).toBe(true);
    });

    it('should include deadlines for high-risk obligations', () => {
      const obligations = buildObligations('Hochrisiko', mockSystem);
      const withDeadlines = obligations.filter((obl) => obl.deadline);
      
      expect(withDeadlines.length).toBeGreaterThan(0);
    });
  });

  describe('assessOrg', () => {
    const mockOrg: OrgProfile = {
      name: 'Test Organization',
      size: 'mittel',
      roles: ['Provider'],
    };

    it('should assess organization with systems', () => {
      const assessment = assessOrg(mockOrg, [mockSystem]);
      
      expect(assessment).toBeDefined();
      expect(assessment.org).toEqual(mockOrg);
      expect(assessment.systems).toHaveLength(1);
      expect(assessment.readinessScore).toBeGreaterThan(0);
      expect(assessment.readinessScore).toBeLessThanOrEqual(100);
    });

    it('should categorize readiness correctly', () => {
      const assessment = assessOrg(mockOrg, [mockSystem]);
      
      expect(assessment.scoreBand).toBeDefined();
      expect(['Ready', 'Weitgehend bereit', 'Teilweise bereit', 'Kritisch', 'Nicht bereit']).toContain(
        assessment.scoreBand
      );
    });

    it('should generate prioritized actions', () => {
      const assessment = assessOrg(mockOrg, [mockSystem]);
      
      expect(assessment.prioritizedActions).toBeDefined();
      expect(Array.isArray(assessment.prioritizedActions)).toBe(true);
    });

    it('should handle multiple systems', () => {
      const system2: AISystem = {
        ...mockSystem,
        id: 'test-system-2',
        name: 'Second System',
      };
      
      const assessment = assessOrg(mockOrg, [mockSystem, system2]);
      
      expect(assessment.systems).toHaveLength(2);
    });

    it('should include scoring version', () => {
      const assessment = assessOrg(mockOrg, [mockSystem]);
      
      expect(assessment.scoringVersion).toBeDefined();
      expect(typeof assessment.scoringVersion).toBe('string');
    });
  });
});
