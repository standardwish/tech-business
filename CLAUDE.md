# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GAPPI is an AI-powered accounting standard conversion platform that helps businesses convert financial statements between K-GAAP, IFRS, and US-GAAP standards. The application uses OpenAI for intelligent account mapping and PDF parsing.

## Development Commands

### Essential Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production (runs TypeScript compiler then Vite build)
- `pnpm lint` - Run ESLint and TypeScript type checking
- `pnpm preview` - Preview production build locally

### Type Checking
- `npx tsc -b` - Run TypeScript compiler without emitting files
- `npx tsc --noEmit` - Type check without output (used in lint script)

### Code Quality
**IMPORTANT**: After completing any code changes, ALWAYS run `pnpm lint` to verify:
- ESLint rules compliance
- TypeScript type checking
- No compilation errors

This ensures code quality and prevents runtime issues before committing.

## Architecture Overview

### Presenter-Container Pattern

All major pages follow the Presenter-Container pattern for separation of concerns:

```
src/pages/[PageName]/
├── index.tsx                    # Exports Container as default
├── [PageName]Container.tsx      # Business logic, state, data fetching
└── [PageName]Presenter.tsx      # Pure UI rendering, receives props
```

**Container responsibilities:**
- State management with React hooks
- Event handlers and business logic
- Data fetching and transformation
- Navigation logic with `useNavigate()`

**Presenter responsibilities:**
- Pure presentational components
- Receives all data and callbacks via props
- No direct state management or side effects
- Material-UI component composition

**Pages using this pattern:**
- Dashboard
- PricingPage
- ResultsPage
- ConversionPage
- conversion/Step5Complete

**Pages NOT using this pattern:**
- LandingPage (stateless, no logic needed)
- conversion/Step1FileUpload, Step2SelectItems, Step3Details, Step4Execute (already well-structured with props)

### Core Data Flow

The application follows a multi-step conversion wizard:

1. **Step 1 (File Upload)**: User uploads Excel/PDF and inputs basic information
2. **Step 1.5 (File Analysis)**: Parse file and run AI analysis to detect conversion items
3. **Step 2 (Select Items)**: User selects which accounting items to convert (auto-detected items are pre-selected)
4. **Step 3 (Details)**: User provides detailed information for each selected item
5. **Step 4 (Execute)**: AI performs the actual conversion
6. **Step 5 (Complete)**: Display results and allow PDF export

Data flows through:
```
ConversionInput → File Analysis → detectedItems + extractedAccounts → selectedItems → ConversionDetails → ConversionResult
```

### Key Type Definitions

All accounting-related types are centralized in `src/types/accounting.ts`:

- `AccountingStandard`: 'K-GAAP' | 'IFRS' | 'US-GAAP'
- `ConversionInput`: Source/target standards, file, base date
- `ConversionDetails`: Detailed information for each conversion category
- `ConversionResult`: Converted accounts, adjustments, summary

### AI Integration

The application uses OpenAI API for:

1. **PDF Parsing** (`src/utils/pdfParser.ts`): Extract account information from PDF financial statements
2. **Account Extraction** (`src/utils/aiConverter.ts`): AI-powered extraction of accounts from text
3. **File Analysis** (`src/utils/fileAnalyzer.ts`): Detect conversion items and suggest additional items
4. **Conversion Execution** (`src/utils/aiConverter.ts` → `executeAIConversion`): Perform actual standard conversion

### Important Utilities

- `src/utils/accountMapping.ts`: Static mapping tables between K-GAAP, IFRS, US-GAAP
- `src/utils/itemDetector.ts`: Rule-based detection of conversion items from accounts
- `src/utils/pdfExporter.ts`: Generate formatted PDF financial statements using jsPDF
- `src/utils/conversionEngine.ts`: Core conversion logic (fallback if AI unavailable)

## Theming and Styling

- Uses Material-UI v7 with custom theme in `src/theme/shared-theme/`
- Theme is wrapped via `<AppTheme>` component
- Brand constants centralized in `src/constants/brand.ts`
- Path alias `@/` maps to `src/` directory (configured in vite.config.ts)

## Important Configuration

### Build System
- Uses `rolldown-vite@7.2.5` instead of standard Vite for better performance
- React Compiler enabled via babel-plugin-react-compiler
- Path alias `@/` configured in vite.config.ts

### OpenAI Integration
- API key should be stored in environment variable `VITE_OPENAI_API_KEY`
- AI features are critical for PDF parsing and conversion accuracy

## Routing Structure

```
/                    → LandingPage
/dashboard           → Dashboard
/conversion          → ConversionPage (new conversion)
/conversion/:id      → ConversionPage (resume conversion)
/pricing             → PricingPage
/results/:id         → ResultsPage
```

Navigation is handled via react-router v7 with `useNavigate()` hook.

## Adding New Conversion Items

To add a new conversion item category:

1. Add to `CONVERSION_ITEMS` array in `src/pages/conversion/Step2SelectItems.tsx`
2. Add detection rules in `src/utils/itemDetector.ts` → `detectItemsByRules()`
3. Add detail form in `src/pages/conversion/Step3Details.tsx`
4. Add type definition in `src/types/accounting.ts` → `ConversionDetails` interface
5. Update AI conversion logic in `src/utils/aiConverter.ts` → `executeAIConversion()`

## Chart.js Setup

Chart.js requires manual registration of components:
```typescript
import { ArcElement, CategoryScale, Chart as ChartJS, ... } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, ...);
```

This is already set up in Dashboard and other pages using charts.
