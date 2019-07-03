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
            {
                type: 'confirm',
                name: 'wantSass',
                message: 'Do you want to use Sass instead of CSS?'
            }
        ],
        // array of actions
        actions: function(data) {
            let actions = [
                {
                    type: 'add',
                    path: 'src/components/\{{kebabCase name}}/\{{kebabCase name}}.tsx',
                    templateFile: 'plop/templates/component/component.tsx',
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
                }
            ];

            // modifers

            let modifierActions = [
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
                    path: 'src/components/\{{kebabCase name}}/\{{kebabCase name}}.stories.js',
                    pattern: /TemplateComponent/g,
                    template: '\{{pascalCase name}}',
                },
                {
                    type: 'modify',
                    path: 'src/components/\{{kebabCase name}}/\{{kebabCase name}}.stories.js',
                    pattern: /template-component/g,
                    template: '\{{kebabCase name}}',
                }
            ];

            if (data.wantSass) {
                actions.push(
                    {
                        type: 'add',
                        path: 'src/components/\{{kebabCase name}}/\{{kebabCase name}}.scss',
                        templateFile: 'plop/templates/component/component.scss',
                    },
                    {
                        type: 'modify',
                        path: 'src/components/\{{kebabCase name}}/\{{kebabCase name}}.scss',
                        pattern: /template-component/g,
                        template: '\{{kebabCase name}}',
                    },
                    {
                        type: 'modify',
                        path: 'src/components/\{{kebabCase name}}/\{{kebabCase name}}.scss',
                        pattern: /TemplateComponent/g,
                        template: '\{{pascalCase name}}',
                    },
                    {
                        type: 'modify',
                        path: 'src/components/\{{kebabCase name}}/\{{kebabCase name}}.tsx',
                        pattern: /template-component.css/g,
                        template: '\{{kebabCase name}}.scss',
                    },
                );
            } else {
                actions.push(
                    {
                        type: 'add',
                        path: 'src/components/\{{kebabCase name}}/\{{kebabCase name}}.css',
                        templateFile: 'plop/templates/component/component.css',
                    },
                    {
                        type: 'modify',
                        path: 'src/components/\{{kebabCase name}}/\{{kebabCase name}}.css',
                        pattern: /template-component/g,
                        template: '\{{kebabCase name}}',
                    }
                );
            }

            actions = actions.concat(modifierActions);

            return actions;
        }
    });
};
