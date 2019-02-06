module.exports = function(plop) {
  // create your generators here
  plop.setGenerator('Component', {
    description: 'Create a stencil JS component',
    // array of inquirer prompts
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component Name',
      },
    ],
    // array of actions
    actions: [
      // Add all the template files to the dest folder
      {
        type: 'add',
        path: 'src/components/\{{kebabCase name}}/\{{kebabCase name}}.tsx',
        templateFile: 'plop/templates/component/component.tsx',
      },
      {
        type: 'add',
        path: 'src/components/\{{kebabCase name}}/\{{kebabCase name}}.css',
        templateFile: 'plop/templates/component/component.css',
      },
      {
        type: 'add',
        path: 'src/components/\{{kebabCase name}}/\{{kebabCase name}}.e2e.ts',
        templateFile: 'plop/templates/component/component.e2e.ts',
      },
      {
        type: 'add',
        path: 'src/components/\{{kebabCase name}}/\{{kebabCase name}}.stories.js',
        templateFile: 'plop/templates/component/component.stories.js',
      },
      //   Update all the tempates files with the data
      {
        type: 'modify',
        path: 'src/components/\{{kebabCase name}}/\{{kebabCase name}}.tsx',
        pattern: /template-component/g,
        template: '\{{kebabCase name}}',
      },
      {
        type: 'modify',
        path: 'src/components/\{{kebabCase name}}/\{{kebabCase name}}.tsx',
        pattern: /TemplateComponent/g,
        template: '\{{pascalCase name}}',
      },
      {
        type: 'modify',
        path: 'src/components/\{{kebabCase name}}/\{{kebabCase name}}.e2e.ts',
        pattern: /template-component/g,
        template: '\{{kebabCase name}}',
      },
      {
        type: 'modify',
        path: 'src/components/\{{kebabCase name}}/\{{kebabCase name}}.css',
        pattern: /template-component/g,
        template: '\{{kebabCase name}}',
      },
      {
        type: 'modify',
        path: 'src/components/\{{kebabCase name}}/\{{kebabCase name}}.stories.js',
        pattern: /TemplateComponent/g,
        template: '\{{pascalCase name}}',
      },
      {
        type: 'modify',
        path: 'src/components/\{{kebabCase name}}/\{{kebabCase name}}.stories.js',
        pattern: /template-component/g,
        template: '\{{kebabCase name}}',
      },
    ],
  });
};
