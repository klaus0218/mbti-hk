# Language Utils

This directory contains utility functions for handling language detection and content extraction in the MBTI application.

## Overview

The language utilities automatically detect the user's preferred language and extract the appropriate content from bilingual AI-generated responses. This ensures that users always see content in their preferred language without manual switching.

## Files

### `languageUtils.js`

Main utility functions for language detection and content extraction.

#### Functions

- **`extractLanguageContent(content, userLanguage)`**
  - Extracts content in the user's preferred language from bilingual AI results
  - Supports 'en' (English) and 'zh' (Traditional Chinese)
  - Automatically detects language markers in the content
  - Falls back to original content if no language markers are found

- **`formatAnalysisForLanguage(analysis, userLanguage)`**
  - Formats the entire analysis object for the user's preferred language
  - Processes all content fields (analysis, preview, fullReport, researchInsights)
  - Preserves metadata like timestamp and model information

- **`getLanguageLabel(userLanguage)`**
  - Returns the language label in the user's preferred language
  - Useful for displaying current language to users

## How It Works

1. **Backend AI Generation**: The AI service generates content in both English and Traditional Chinese with clear markers:
   ```
   === ENGLISH VERSION ===
   English content here...
   
   === TRADITIONAL CHINESE VERSION (繁體中文) ===
   繁體中文內容在這裡...
   ```

2. **Frontend Language Detection**: The frontend detects the user's language preference from the LanguageContext

3. **Content Extraction**: The utility functions extract only the content in the user's preferred language

4. **Automatic Display**: Users automatically see content in their preferred language without any manual intervention

## Usage

```javascript
import { formatAnalysisForLanguage } from '../../utils/languageUtils';

// In a component with language context
const { language } = useLanguage();

// Format AI analysis for current user language
const formattedAnalysis = formatAnalysisForLanguage(aiAnalysis, language);

// Display the language-specific content
<Typography>
  {formattedAnalysis.analysis}
</Typography>
```

## Language Support

- **English (en)**: Extracts content marked with `=== ENGLISH VERSION ===`
- **Traditional Chinese (zh)**: Extracts content marked with `=== TRADITIONAL CHINESE VERSION (繁體中文) ===`

## Benefits

1. **Automatic Language Detection**: No manual language switching required
2. **Consistent User Experience**: Users always see content in their preferred language
3. **Bilingual Content**: AI generates comprehensive content in both languages
4. **Fallback Support**: Gracefully handles content without language markers
5. **Performance**: Lightweight content extraction without additional API calls

## Testing

Run the test suite to verify language detection functionality:

```bash
npm test -- languageUtils.test.js
```

## Future Enhancements

- Support for additional languages
- Language preference persistence
- Automatic language detection based on browser settings
- Content caching for better performance
