# Predefined Reports - New File Structure

## Overview

This directory contains predefined MBTI personality analysis reports organized in a modular file structure. Each field of content is stored in a separate file, allowing for easy maintenance and expansion of content.

## Directory Structure

```
predefined-reports/
├── EN/                          # English language content
│   ├── INTJ/                    # INTJ personality type
│   │   ├── coverPage.js         # Cover page content
│   │   ├── executiveSummary.js  # Executive summary content
│   │   ├── detailedAnalysis.js  # Detailed analysis content
│   │   ├── careerPath.js        # Career path content
│   │   ├── friendshipCompatibility.js
│   │   ├── romanticCompatibility.js
│   │   ├── mentalHealthInsights.js
│   │   ├── selfImprovement.js
│   │   ├── dailyLifeApplications.js
│   │   └── actionPlan.js
│   ├── INTP/                    # INTP personality type
│   │   └── ... (same field structure)
│   └── ... (other MBTI types)
├── ZH/                          # Chinese language content
│   ├── INTJ/                    # INTJ personality type in Chinese
│   │   └── ... (same field structure)
│   └── ... (other MBTI types)
└── index.js                     # Main access module
```

## File Naming Convention

- **Language folders**: `EN` (English), `ZH` (Chinese)
- **MBTI type folders**: `INTJ`, `INTP`, `ENTJ`, `ENTP`, `INFJ`, `INFP`, `ENFJ`, `ENFP`, `ISTJ`, `ISFJ`, `ESTJ`, `ESFJ`, `ISTP`, `ISFP`, `ESTP`, `ESFP`
- **Field files**: Each field has its own `.js` file containing the content

## Field Structure

Each field file follows this structure:

```javascript
/**
 * [MBTI Type] - [Type Title]: [Field Title]
 * Language: [Language Name]
 */

module.exports = {
  content: "[Field content here - can be very long, up to 6000+ words]"
};
```

## Available Fields

1. **coverPage** - Report title and cover information
2. **executiveSummary** - High-level overview of the personality type
3. **detailedAnalysis** - Comprehensive personality analysis
4. **careerPath** - Career guidance and recommendations
5. **friendshipCompatibility** - Friendship dynamics and compatibility
6. **romanticCompatibility** - Romantic relationship insights
7. **mentalHealthInsights** - Mental health considerations
8. **selfImprovement** - Personal development strategies
9. **dailyLifeApplications** - Practical daily life applications
10. **actionPlan** - 12-week action plan for personal growth

## Usage

### Basic Usage

```javascript
const predefinedReports = require('./data/predefined-reports');

// Get a specific field content
const coverPage = predefinedReports.getFieldContent('en', 'INTJ', 'coverPage');

// Get all content for a specific MBTI type and language
const intjContent = predefinedReports.getMBTIContent('en', 'INTJ');

// Get all content for a specific language
const allEnglishContent = predefinedReports.getAllLanguageContent('en');
```

### Available Functions

- `getFieldContent(language, mbtiType, field)` - Get content for a specific field
- `getMBTIContent(language, mbtiType)` - Get all fields for a specific MBTI type
- `getAllLanguageContent(language)` - Get all content for a specific language
- `fieldExists(language, mbtiType, field)` - Check if a field exists
- `getAvailableLanguages()` - Get list of available languages
- `getAvailableMBTITypes(language)` - Get list of available MBTI types for a language
- `getAvailableFields(language, mbtiType)` - Get list of available fields for a type

## Benefits of New Structure

1. **Modularity**: Each field is in a separate file, making content easier to manage
2. **Scalability**: Can easily add new fields or modify existing ones without affecting others
3. **Language Support**: Clear separation between languages makes localization easier
4. **Maintenance**: Individual files are easier to edit and maintain
5. **Performance**: Only loads the specific content needed, not entire reports
6. **Version Control**: Better tracking of changes to specific fields
7. **Content Length**: Each field can contain extensive content (6000+ words) without file size concerns

## Adding New Content

### Adding a New Field

1. Create a new `.js` file in the appropriate language/MBTI type directory
2. Follow the file structure template
3. Update the `index.js` file to include the new field in the fields array

### Adding a New MBTI Type

1. Create a new directory for the MBTI type in both language folders
2. Create all required field files
3. Update the `index.js` file to include the new MBTI type

### Adding a New Language

1. Create a new language folder (e.g., `FR` for French)
2. Create MBTI type subdirectories
3. Create field files with translated content
4. Update the `index.js` file to recognize the new language

## Content Guidelines

- Each field should contain comprehensive, well-written content
- Content should be consistent in tone and style across all MBTI types
- Field content can be very long (6000+ words) to provide detailed analysis
- Maintain professional, helpful, and positive tone
- Ensure content is culturally appropriate for the target language

## Migration from Old Structure

The old structure used a single `predefinedReports.js` file containing all content. The new structure:

- Separates content by language, MBTI type, and field
- Makes content more manageable and maintainable
- Allows for easier content updates and additions
- Provides better performance through selective loading
- Supports longer content per field without file size limitations

## File Size Considerations

With the new structure, each field file can contain extensive content (6000+ words) without affecting the overall system performance. The modular approach ensures that only the required content is loaded when needed.
