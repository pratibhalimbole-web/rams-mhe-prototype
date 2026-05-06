/**
 * Text Block Usage Example
 * This file demonstrates how to use the text block content controls
 * DO NOT import this file - it's for documentation purposes only
 */

import React from 'react';
import { ModuleBuilderCard } from '@/app/pages/report/ModulePreviews';

// Example 1: Module without content blocks (default state)
const ExampleModuleBasic = () => {
  const module = {
    id: 'mod-1',
    instanceId: 'inst-1',
    name: 'Depreciation Analysis',
    type: 'Chart',
    tag: 'Financial',
    config: {
      isSaved: true,
      // No contentBlocks yet
    },
    representationType: 'chart',
  };

  return (
    <ModuleBuilderCard
      module={module}
      isSelected={false}
      onClick={() => console.log('Module clicked')}
      onDelete={() => console.log('Module deleted')}
      onUpdateConfig={(updates) => {
        console.log('Config updated:', updates);
        // In real usage, this would update the module's config in state
      }}
    />
  );
};

// Example 2: Module with static text block
const ExampleModuleWithStaticText = () => {
  const module = {
    id: 'mod-2',
    instanceId: 'inst-2',
    name: 'Key Risks',
    type: 'List',
    tag: 'Risks',
    config: {
      isSaved: true,
      contentBlocks: [
        {
          id: 'block-1',
          type: 'text',
          mode: 'static',
          content: '<p>This analysis identifies <strong>critical risks</strong> that require immediate attention:</p><ul><li>Structural integrity concerns in Zone B</li><li>Electrical safety violations</li><li>Fire suppression system failures</li></ul>',
        },
      ],
    },
    representationType: 'table',
  };

  return (
    <ModuleBuilderCard
      module={module}
      isSelected={false}
      onClick={() => console.log('Module clicked')}
      onDelete={() => console.log('Module deleted')}
      onUpdateConfig={(updates) => {
        console.log('Config updated:', updates);
      }}
    />
  );
};

// Example 3: Module with dynamic insights
const ExampleModuleWithDynamicInsights = () => {
  const module = {
    id: 'mod-3',
    instanceId: 'inst-3',
    name: 'Compliance Trends',
    type: 'Chart',
    tag: 'Compliance',
    config: {
      isSaved: true,
      contentBlocks: [
        {
          id: 'block-2',
          type: 'text',
          mode: 'dynamic',
          dynamicConfig: {
            insightSource: 'module-data',
            insightType: 'trends',
            maxInsights: 5,
          },
        },
      ],
    },
    representationType: 'chart',
  };

  return (
    <ModuleBuilderCard
      module={module}
      isSelected={false}
      onClick={() => console.log('Module clicked')}
      onDelete={() => console.log('Module deleted')}
      onUpdateConfig={(updates) => {
        console.log('Config updated:', updates);
      }}
    />
  );
};

// Example 4: Module with multiple content blocks and dividers
const ExampleModuleWithMultipleBlocks = () => {
  const module = {
    id: 'mod-4',
    instanceId: 'inst-4',
    name: 'Executive Summary',
    type: 'Summary',
    tag: 'Overview',
    config: {
      isSaved: true,
      contentBlocks: [
        {
          id: 'block-3',
          type: 'text',
          mode: 'static',
          content: '<p><strong>Overview:</strong> This report summarizes the quarterly inspection results.</p>',
        },
        {
          id: 'block-4',
          type: 'divider',
        },
        {
          id: 'block-5',
          type: 'text',
          mode: 'dynamic',
          dynamicConfig: {
            insightSource: 'report-wide',
            insightType: 'key-findings',
            maxInsights: 3,
          },
        },
        {
          id: 'block-6',
          type: 'divider',
        },
        {
          id: 'block-7',
          type: 'text',
          mode: 'static',
          content: '<p><strong>Next Steps:</strong></p><ol><li>Review critical findings</li><li>Schedule follow-up inspections</li><li>Update safety protocols</li></ol>',
        },
      ],
    },
    representationType: 'insights',
  };

  return (
    <ModuleBuilderCard
      module={module}
      isSelected={false}
      onClick={() => console.log('Module clicked')}
      onDelete={() => console.log('Module deleted')}
      onUpdateConfig={(updates) => {
        console.log('Config updated:', updates);
      }}
    />
  );
};

// Example 5: Programmatically adding content blocks
const ExampleProgrammaticAdd = () => {
  const [module, setModule] = React.useState({
    id: 'mod-5',
    instanceId: 'inst-5',
    name: 'Safety Violations',
    type: 'Table',
    tag: 'Safety',
    config: {
      isSaved: true,
      contentBlocks: [],
    },
    representationType: 'table',
  });

  const addTextBlock = () => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type: 'text' as const,
      mode: 'static' as const,
      content: '',
    };

    setModule({
      ...module,
      config: {
        ...module.config,
        contentBlocks: [...module.config.contentBlocks, newBlock],
      },
    });
  };

  const addDivider = () => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type: 'divider' as const,
    };

    setModule({
      ...module,
      config: {
        ...module.config,
        contentBlocks: [...module.config.contentBlocks, newBlock],
      },
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <button onClick={addTextBlock}>Add Text Block</button>
        <button onClick={addDivider}>Add Divider</button>
      </div>

      <ModuleBuilderCard
        module={module}
        isSelected={false}
        onClick={() => console.log('Module clicked')}
        onDelete={() => console.log('Module deleted')}
        onUpdateConfig={(updates) => {
          setModule({
            ...module,
            config: {
              ...module.config,
              ...updates,
            },
          });
        }}
      />
    </div>
  );
};

// Example 6: Updating content block configuration
const ExampleUpdateConfig = () => {
  const [module, setModule] = React.useState({
    id: 'mod-6',
    instanceId: 'inst-6',
    name: 'Performance Metrics',
    type: 'Chart',
    config: {
      isSaved: true,
      contentBlocks: [
        {
          id: 'block-8',
          type: 'text' as const,
          mode: 'static' as const,
          content: '<p>Initial content</p>',
        },
      ],
    },
  });

  const updateBlockMode = (blockId: string, newMode: 'static' | 'dynamic') => {
    setModule({
      ...module,
      config: {
        ...module.config,
        contentBlocks: module.config.contentBlocks.map((block: any) =>
          block.id === blockId
            ? {
                ...block,
                mode: newMode,
                dynamicConfig:
                  newMode === 'dynamic'
                    ? {
                        insightSource: 'module-data',
                        insightType: 'key-findings',
                        maxInsights: 3,
                      }
                    : undefined,
              }
            : block
        ),
      },
    });
  };

  const deleteBlock = (blockId: string) => {
    setModule({
      ...module,
      config: {
        ...module.config,
        contentBlocks: module.config.contentBlocks.filter(
          (block: any) => block.id !== blockId
        ),
      },
    });
  };

  return (
    <ModuleBuilderCard
      module={module}
      isSelected={false}
      onClick={() => console.log('Module clicked')}
      onDelete={() => console.log('Module deleted')}
      onUpdateConfig={(updates) => {
        setModule({
          ...module,
          config: {
            ...module.config,
            ...updates,
          },
        });
      }}
    />
  );
};

/**
 * INTEGRATION NOTES
 * 
 * 1. The ModuleBuilderCard component now automatically handles content blocks
 * 2. Content blocks are stored in module.config.contentBlocks array
 * 3. The "+" button in the module header triggers the add content menu
 * 4. Content blocks support both static (manual) and dynamic (AI-generated) modes
 * 5. Each block can be edited, configured, or deleted independently
 * 6. Changes are persisted through the onUpdateConfig callback
 * 
 * DATA STRUCTURE
 * 
 * module.config.contentBlocks = [
 *   {
 *     id: 'unique-id',
 *     type: 'text' | 'divider',
 *     mode?: 'static' | 'dynamic',
 *     content?: 'HTML string for static mode',
 *     dynamicConfig?: {
 *       insightSource: 'module-data' | 'report-wide' | 'historical',
 *       insightType: 'key-findings' | 'trends' | 'anomalies' | 'recommendations',
 *       maxInsights: number
 *     }
 *   }
 * ]
 */

export {
  ExampleModuleBasic,
  ExampleModuleWithStaticText,
  ExampleModuleWithDynamicInsights,
  ExampleModuleWithMultipleBlocks,
  ExampleProgrammaticAdd,
  ExampleUpdateConfig,
};
