import { extractLanguageContent, formatAnalysisForLanguage } from '../languageUtils';

describe('Language Utils', () => {
  const bilingualContent = `=== ENGLISH VERSION ===
This is the English content.
It has multiple lines.

=== TRADITIONAL CHINESE VERSION (繁體中文) ===
這是繁體中文內容。
它有多行。`;

  const englishOnlyContent = `This is English content only.
No language markers.`;

  describe('extractLanguageContent', () => {
    it('should extract English content when user prefers English', () => {
      const result = extractLanguageContent(bilingualContent, 'en');
      expect(result).toContain('This is the English content');
      expect(result).not.toContain('這是繁體中文內容');
      expect(result).not.toContain('=== ENGLISH VERSION ===');
      expect(result).not.toContain('=== TRADITIONAL CHINESE VERSION');
    });

    it('should extract Chinese content when user prefers Chinese', () => {
      const result = extractLanguageContent(bilingualContent, 'zh');
      expect(result).toContain('這是繁體中文內容');
      expect(result).not.toContain('This is the English content');
      expect(result).not.toContain('=== ENGLISH VERSION ===');
      expect(result).not.toContain('=== TRADITIONAL CHINESE VERSION');
    });

    it('should return content as-is when no language markers are found', () => {
      const result = extractLanguageContent(englishOnlyContent, 'en');
      expect(result).toBe(englishOnlyContent);
    });

    it('should handle empty content', () => {
      const result = extractLanguageContent('', 'en');
      expect(result).toBe('');
    });

    it('should handle null content', () => {
      const result = extractLanguageContent(null, 'en');
      expect(result).toBe('');
    });
  });

  describe('formatAnalysisForLanguage', () => {
    const mockAnalysis = {
      analysis: bilingualContent,
      preview: bilingualContent,
      fullReport: bilingualContent,
      researchInsights: bilingualContent,
      timestamp: '2024-01-01T00:00:00Z',
      model: 'gemini-2.5-flash'
    };

    it('should format analysis for English user', () => {
      const result = formatAnalysisForLanguage(mockAnalysis, 'en');
      expect(result.analysis).toContain('This is the English content');
      expect(result.analysis).not.toContain('這是繁體中文內容');
      expect(result.preview).toContain('This is the English content');
      expect(result.fullReport).toContain('This is the English content');
      expect(result.researchInsights).toContain('This is the English content');
      expect(result.timestamp).toBe('2024-01-01T00:00:00Z');
      expect(result.model).toBe('gemini-2.5-flash');
    });

    it('should format analysis for Chinese user', () => {
      const result = formatAnalysisForLanguage(mockAnalysis, 'zh');
      expect(result.analysis).toContain('這是繁體中文內容');
      expect(result.analysis).not.toContain('This is the English content');
      expect(result.preview).toContain('這是繁體中文內容');
      expect(result.fullReport).toContain('這是繁體中文內容');
      expect(result.researchInsights).toContain('這是繁體中文內容');
    });

    it('should handle null analysis', () => {
      const result = formatAnalysisForLanguage(null, 'en');
      expect(result).toBeNull();
    });

    it('should handle analysis with missing fields', () => {
      const partialAnalysis = {
        analysis: bilingualContent,
        timestamp: '2024-01-01T00:00:00Z'
      };
      const result = formatAnalysisForLanguage(partialAnalysis, 'en');
      expect(result.analysis).toContain('This is the English content');
      expect(result.preview).toBeNull();
      expect(result.fullReport).toBeNull();
      expect(result.researchInsights).toBeNull();
    });
  });
});
